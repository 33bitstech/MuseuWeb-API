import { MuseumRepository } from "../../../Museum/repositories/implementation/museum.repository";
import IMuseumRegisterCaseContract from "../IUCMuseum-register";
import { UserRepository } from "../../../User/repositories/implementation/user.repository";
import { CuratorRepository } from "../../../Curator/repositories/implementation/curator.repository";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import { ErrorsGlobal } from "../../../../errors/errors-global";
import HttpStatus from "../../../../utils/httpStatus";

export class MuseumRegisterCases implements IMuseumRegisterCaseContract{
    constructor(
        private readonly museumRepository: MuseumRepository,
        private readonly userRepository: UserRepository,
    ){}

    public verifyExistCnpj = async (cnpj: string) => {
        const museum = await this.museumRepository.findByCnpj(cnpj)
        if(museum) return true
        return false
    }
    public verifyValidCnpj = async (cnpj: string) => {
        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
        if ( !res.ok ) throw new ErrorsGlobal('CNPJ não cadastrado na receita federal', HttpStatus.NOT_FOUND.code)
        return cnpjValidator.isValid(cnpj)
    }
    public verifyExistEmail = async (email: string) => {
        const [
            museum, user
        ] = await Promise.all([
            this.museumRepository.findByEmail(email),
            this.userRepository.findByEmail(email)
        ])

        if ( museum || user ) return true
        return false
    }
}