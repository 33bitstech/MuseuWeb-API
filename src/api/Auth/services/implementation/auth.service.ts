import { v4 } from "uuid";
import { ErrorsGlobal } from "../../../../errors/errors-global";
import { compareStringToHash, createHash } from "../../../../utils/bcript";
import HttpStatus from "../../../../utils/httpStatus";
import { signToken } from "../../../../utils/jwt";
import { MuseumRepository } from "../../../Museum/repositories/implementation/museum.repository";
import { UserRepository } from "../../../User/repositories/implementation/user.repository";
import IAuthServiceContract  from "../IAuth.service";
import { MuseumRegisterCases } from "../../use-cases/implementation/museum-register";
import MuseumPayloadToken from "../../interfaces/museum-payload-token";
import { DTOMuseumCompleteRegister, MuseumDatasArray, MuseumProfileData, PublicMuseumAuthenticated } from "../../../Museum/DTOs/DTOMuseum";
import pick from "../../../../utils/pick";
import { EntityMuseum } from "../../../Museum/entities/museum";
import { RedisCacheService } from "../../../Cache/services/implementation/cache.service";
import generateOTP, { generateTempToken } from "../../../../utils/generateOtp";
import { EmailService } from "../../../Email/service/implementation/email.service";
import { TOtpAction, TTempTokenAction } from "../../../../interfaces/otp";

export class AuthService implements IAuthServiceContract {
    constructor(
        private readonly museumRepository: MuseumRepository,
        private readonly userRepository: UserRepository,

        private readonly useCaseMuseumRegister: MuseumRegisterCases,

        private readonly cacheService: RedisCacheService,
        private readonly emailService: EmailService
    ){}

    private createMuseumToken = async (museum: EntityMuseum) =>{
        const iat = Math.floor(Date.now() / 1000)

        return await signToken({
            museumId:museum.museumId,
            name:museum.name,
            logoUrl:museum.logoImageUrl,
            coverUrl:museum.coverImageUrl,
            email:museum.email,
            subscription:museum.subscription,
            periodEnd:museum.subscriptionPeriodEnd,
            iat
        } as MuseumPayloadToken, '7d') as string
    }
    private verifyOTP = async (action: TOtpAction, id: string, otp: string)=>{
        const otpKey = `otp:${action}:${id}`
        const storedOtp = await this.cacheService.get(otpKey)

        if ( !storedOtp ) throw new ErrorsGlobal('Codigo inválido', HttpStatus.BAD_REQUEST.code)

        if ( storedOtp === otp ) return await this.cacheService.delete(otpKey)

        const otpObject = await JSON.parse(storedOtp)
        if ( otpObject.otp == otp ) {
            await this.cacheService.delete(otpKey)
            return otpObject.value
        }

        throw new ErrorsGlobal('Codigo inválido', HttpStatus.BAD_REQUEST.code)
    }
    private createOTP = async (action: TOtpAction, id: string, otpValue?: string)=>{
        const generatedOtp = generateOTP()

        const otp = otpValue 
            ? {
                otp:generatedOtp, 
                value: otpValue
            }
            : generatedOtp

        const otpKey = `otp:${action}:${id}`
        const otpExp = 1200 // 20 minutos
        const saveOtp = otpValue ? JSON.stringify(otp) : otp as string
        await this.cacheService.set(otpKey, saveOtp, otpExp)
        return otp
    }
    private createTempToken = async(action: TTempTokenAction, id:string)=>{
        const token = generateTempToken()
        const key = `token:${action}:${token}`
        const expirationInSeconds = 3600 // 1hora

        await this.cacheService.set(key, id, expirationInSeconds)

        return token
    }
    private verifyTempToken = async(action: TTempTokenAction, token:string)=>{
        const key = `token:${action}:${token}`
        const storedId = await this.cacheService.get(key)

        if ( !storedId ) throw new ErrorsGlobal('Token inválido', HttpStatus.BAD_REQUEST.code)

        await this.cacheService.delete(key)

        return storedId
    }



    public updateMuseumEmail = async (museumId:string, newEmail:string)=>{
        const isEmailInDatabase = await this.useCaseMuseumRegister.verifyExistEmail(newEmail)
        if ( isEmailInDatabase ) throw new ErrorsGlobal('Esse email ja foi cadastrado no sistema', HttpStatus.BAD_REQUEST.code)

        const [ otpObject, museumFromDatabase ] = await Promise.all([
            this.createOTP('email-change', museumId, newEmail),
            this.museumRepository.findById(museumId)
        ])

        const { otp } = otpObject as { otp:string, value:string }
        
        await this.emailService.sendEmail(
            'MuseuWeb <museuweb33@gmail.com>', 
            {email: museumFromDatabase!.email, name: museumFromDatabase!.name || ''},
            { subject: 'Codigo para Alterar email', body: `Para trocar seu email atual - ${museumFromDatabase?.email} para este novo email - ${newEmail}. Utilize este código: ${otp}` }
        )
        return {
            message: 'Codigo para alteração do email enviado para o seu email',
            museumId: museumFromDatabase!.museumId
        }
    }
    public completeUpdateEmailMuseum = async (museumId: string, otp: string) =>{
        if ( !museumId ) throw new ErrorsGlobal('Envie o id do museu', HttpStatus.BAD_REQUEST.code)

        const newEmail = await this.verifyOTP('email-change',museumId, otp)
        if ( !newEmail ) throw new ErrorsGlobal('o novo email foi perdido no espaço tempo', HttpStatus.NOT_FOUND.code)

        await this.museumRepository.updateEmail(museumId, newEmail)

        const museumFromDatabase = await this.museumRepository.findById(museumId)
        return this.createMuseumToken(museumFromDatabase as EntityMuseum)
    }
    public updateMuseumPassword = async (museumId:string, newPassword:string)=>{

        const passwordHashed = await createHash(15, newPassword) as string

        const [ otpObject, museumFromDatabase ] = await Promise.all([
            this.createOTP('password-reset', museumId, passwordHashed),
            this.museumRepository.findById(museumId)
        ])

        const { otp } = otpObject as { otp:string, value:string }
        
        await this.emailService.sendEmail(
            'MuseuWeb <museuweb33@gmail.com>', 
            {email: museumFromDatabase!.email, name: museumFromDatabase!.name || ''},
            { subject: 'Codigo para Alterar senha', body: `Foi solicitado a alteração de senha da sua conta do MuseuWeb, se foi você mesmo que solicitou essa alteração, use este codigo para altera-lo: ${otp}` }
        )
        return {
            message: 'Codigo para alteração de senha enviado para o seu email',
            museumId: museumFromDatabase!.museumId
        }
    }
    public completeUpdatePasswordMuseum = async (museumId: string, otp: string) =>{
        if ( !museumId ) throw new ErrorsGlobal('Envie o id do museu', HttpStatus.BAD_REQUEST.code)

        const newPassword = await this.verifyOTP('password-reset',museumId, otp)
        if ( !newPassword ) throw new ErrorsGlobal('a nova senha foi perdida no espaço tempo', HttpStatus.NOT_FOUND.code)

        await this.museumRepository.updatePassword(museumId, newPassword)
    }
    public verifyMuseumEmail = async (museum:EntityMuseum)=>{
        const tempToken = await this.createTempToken('email-verify', museum.museumId)

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${tempToken}`

        await this.emailService.sendEmail(
            'MuseuWeb <museuweb33@gmail.com>',
            { email: museum.email, name: museum.name || '' },
            {
                subject: 'Verifique seu endereço de email',
                body: `Olá! Por favor, clique no link a seguir para verificar seu e-mail: ${verificationLink}`
            }
        );

        return { message: `Um novo email de verificação foi enviado para ${museum.email}.` };

    }
    public completeVerifyMuseumEmail = async (token: string)=>{
        if ( !token ) throw new ErrorsGlobal('Envie um token valido', HttpStatus.BAD_REQUEST.code)

        const museumId = await this.verifyTempToken('email-verify', token)

        await this.museumRepository.updateEmailVerified(museumId, true)

    }
    public recoveryPasswordMuseum = async (email:string)=>{
        const isAlreadyInDatabase = await this.useCaseMuseumRegister.verifyExistEmail(email)
        if ( !isAlreadyInDatabase ) throw new ErrorsGlobal('Email não cadastrado', HttpStatus.BAD_REQUEST.code)

        const [ tempToken, museum ] = await Promise.all([
            this.createTempToken('password-recovery', email),
            this.museumRepository.findByEmail(email)
        ])


        const verificationLink = `${process.env.FRONTEND_URL}/recovery-password/form?token=${tempToken}`

        await this.emailService.sendEmail(
            'MuseuWeb <museuweb33@gmail.com>',
            { email, name: museum?.name || '' },
            {
                subject: 'Recuperar Senha',
                body: `Olá! Por favor, clique no link a seguir para recuperar sua senha: ${verificationLink}`
            }
        );
    }
    public recoveryPasswordChangeMuseum = async (token: string, password: string)=>{
        if ( !token ) throw new ErrorsGlobal('Envie um token valido', HttpStatus.BAD_REQUEST.code)

        const [ museumEmail, passwordHashed ] = await Promise.all([
            this.verifyTempToken('password-recovery', token),
            createHash(15, password)
        ])

        const museum = await this.museumRepository.findByEmail(museumEmail)

        await this.museumRepository.updatePassword(museum?.museumId!, passwordHashed as string)
    }


    public museumAuthenticated = async (museumId: string)=>{
        const museum = await this.museumRepository.findById(museumId) as Partial<EntityMuseum>
        
        delete museum?.stripeInfos
        delete museum?.password

        return museum as PublicMuseumAuthenticated
    }
    public museumRegister = async ({cnpj, email, password}: {email:string, password:string, cnpj:string}) =>{
        const [
            alreadyExistCnpj, validCnpj, isEmailInDatabase
        ] = await Promise.all([
            this.useCaseMuseumRegister.verifyExistCnpj(cnpj),
            this.useCaseMuseumRegister.verifyValidCnpj(cnpj),
            this.useCaseMuseumRegister.verifyExistEmail(email)

        ])
        
        if ( alreadyExistCnpj ) throw new ErrorsGlobal('Um museu com esse cnpj ja está cadastrado', HttpStatus.CONFLICT.code)

        if ( !validCnpj ) throw new ErrorsGlobal('Esse cnpj é invalido', HttpStatus.BAD_REQUEST.code)

        if ( isEmailInDatabase ) throw new ErrorsGlobal('Esse email ja foi cadastrado no sistema', HttpStatus.BAD_REQUEST.code)

        const passwordHashed = await createHash(15, password) as string

        const newMuseum = await this.museumRepository.create({
            cnpj, 
            email, 
            password: passwordHashed, 
            isActive:false,
            museumId: `mid_${v4()}`,
            stripeInfos: {},
            verifiedEmail: false
        })
        
        return this.createMuseumToken(newMuseum as EntityMuseum)
    }
    public completeMuseumRegister = async (museumdId: string, museumObject: Partial<DTOMuseumCompleteRegister>) => {

        const profileKeys: (keyof MuseumProfileData)[] = [
            'name', 'descriptionShort', 'descriptionLong', 'address', 'history', 
            'logoImageUrl', 'coverImageUrl', 'type', 'isOpenToPublic', 
            'specialNotesHours', 'museumSite'
        ]
        const ArraysKeys: (keyof MuseumDatasArray)[] = [
            'accessibilityFeatures', 'affiliated', "externalLinks", "gallery",
            "operatingHours", 'ticketsPrices'
        ]

        const profileData = pick(museumObject, profileKeys)
        const museumArrays = pick(museumObject, ArraysKeys)
    
        await Promise.all([ 
            this.museumRepository.updateProfileInfo(museumdId, profileData),
            this.museumRepository.updateAllArrays(museumdId, museumArrays),
        ])

        const museum = await this.museumRepository.findById(museumdId)

        return this.createMuseumToken(museum as EntityMuseum)
    }
    public museumLogin = async (identifier: string, password: string) => {
        const museumFromDatabase = await this.museumRepository.findByIdentifier(identifier)

        if ( !museumFromDatabase ) throw new ErrorsGlobal('Email/Cnpj ou senha incorretos', HttpStatus.FORBIDDEN.code)

        const isPasswordCorrect = await compareStringToHash(password, museumFromDatabase.password)

        if ( !isPasswordCorrect ) throw new ErrorsGlobal('Email/Cnpj ou senha incorretos', HttpStatus.FORBIDDEN.code)

        if ( museumFromDatabase.verifiedEmail ){
            const otp = await this.createOTP('login', museumFromDatabase.museumId)
    
            await this.emailService.sendEmail(
                'MuseuWeb <museuweb33@gmail.com>', 
                {email: museumFromDatabase.email, name: museumFromDatabase.name || ''},
                { subject: 'Codigo para Login', body: `Use esse codigo para realizar o login: ${otp}` }
            )
            return {
                message: 'Codigo de verificação enviado para o seu email',
                museumId: museumFromDatabase.museumId
            }
        }else{
            return {
                message: 'Login efetuado com sucesso',
                token: await this.createMuseumToken(museumFromDatabase as EntityMuseum)
            }
        }

    }
    public completeMuseumLogin = async (museumId: string, otp: string) => {

        if ( !museumId ) throw new ErrorsGlobal('Envie o id do museu', HttpStatus.BAD_REQUEST.code)

        await this.verifyOTP('login',museumId, otp)

        const museumFromDatabase = await this.museumRepository.findById(museumId)

        return this.createMuseumToken(museumFromDatabase as EntityMuseum)
    }
    public userLogin = async (email: string, password: string) => {
        const userFromDatabase = await this.userRepository.findByEmail(email)

        if ( !userFromDatabase ) throw new ErrorsGlobal('Email não encontrado', HttpStatus.FORBIDDEN.code, 'Esse email não foi cadastrado no nosso sistema')

        if (!userFromDatabase.password){
            return await signToken({
                userId: userFromDatabase.userId,
                email: userFromDatabase.email,
                name: userFromDatabase.name,
                profileImg: userFromDatabase.profileImg,
                favItens: userFromDatabase.favItens,
                favMuseums: userFromDatabase.favMuseums,
            }, '7d') as string
        }

        const isPasswordCorrect = await compareStringToHash(password, userFromDatabase.password)

        if ( !isPasswordCorrect ) throw new ErrorsGlobal('Senha incorreta', HttpStatus.FORBIDDEN.code, 'Esse senha que você inseriu não coincide com a salva no sistema')

        return await signToken({
            userId: userFromDatabase.userId,
            email: userFromDatabase.email,
            name: userFromDatabase.name,
            profileImg: userFromDatabase.profileImg,
            favItens: userFromDatabase.favItens,
            favMuseums: userFromDatabase.favMuseums,
        }, '7d') as string
    }
}