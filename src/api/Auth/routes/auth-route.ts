import {Router} from 'express'
import { validateLoginMuseumFields } from '../../../middlewares/Validators/login.validator'
import { AuthMuseumService } from '../services/implementation/auth-museum.service'
import { AuthMuseumController } from '../controllers/implementation/auth-museum.controller'
import { UserRepository } from '../../User/repositories/implementation/user.repository'
import { UserModel } from '../../User/models/user.schema'
import { MuseumRegisterCases } from '../use-cases/implementation/uc-museum-register'
import { validateCompleteRegisterMuseumFields, validateRegisterMuseumFields } from '../../../middlewares/Validators/museum-register.validator'
import { curatorAuth, museumAuth, museumIsActiveAuth, museumIsEmailActiveAuth, museumIsEmailNotActiveAuth, userAuth } from '../../../middlewares/auth.middleware'
import { handleValidationErrors } from '../../../middlewares/error.middleware'
import { RedisCacheService } from '../../Cache/services/implementation/redis-cache.service'
import { CacheService } from '../../Cache/services/implementation/cache.service'
import { EmailService } from '../../Email/service/implementation/email.service'
import { AuthCuratorController } from '../controllers/implementation/auth-curator.controller'
import { AuthCuratorService } from '../services/implementation/auth-curator.service'
import { museumRepository } from '../../Museum/routes/museum.route'
import { curatorRepository } from '../../Curator/routes/curator.routes'
import { validateFieldEmail, validateFieldPassword } from '../../../middlewares/Validators/defaultsFields'
import { validateLoginCurator, validateRegisterCurator } from '../../../middlewares/Validators/curator-auth-validator'
import { userRepository } from '../../User/routes/user.routes'
import { AuthUserController } from '../controllers/implementation/auth-user.controller'
import { AuthUserService } from '../services/implementation/auth-user.service'
import { validateLoginUserFields, validateRegisterUserFields } from '../../../middlewares/Validators/user-auth-validate'


const authRoutes = Router()

//use-cases
const usecaseMuseumRegister = new MuseumRegisterCases(
    museumRepository,
    userRepository,
)

//services
const cacheService = new CacheService()
const radisCacheService = new RedisCacheService(
    cacheService
)
const emailService = new EmailService()

const authMuseumService = new AuthMuseumService(
    museumRepository,

    usecaseMuseumRegister,
    
    radisCacheService,
    emailService
)
const authCuratorService = new AuthCuratorService(
    curatorRepository
)
const authUserService = new AuthUserService(
    userRepository,
    usecaseMuseumRegister
)

//controllers
const {
    loginMuseum, registerMuseum, completeRegisterMuseum, 
    getLoggedMuseum, completeLoginMuseum, changeEmailMuseum,
    completeChangeEmailMuseum, completeChangePasswordMuseum, completeVerifyEmailMuseum,
    changePasswordMuseum, verifyEmailMuseum, recoveryPasswordMuseum, recoveryPasswordChangeMuseum
} = new AuthMuseumController(authMuseumService)

const {
    curatorLogin, curatorRegister, getLoggedCurator
} = new AuthCuratorController(authCuratorService)

const {
    getLoggedUser, userLogin, userRegister
} = new AuthUserController(authUserService)

//museums routes
authRoutes.get('/museum', museumAuth, getLoggedMuseum)

authRoutes.post('/museum/login', validateLoginMuseumFields, handleValidationErrors, loginMuseum) 
authRoutes.post('/museum/login/complete', completeLoginMuseum) 

authRoutes.post('/museum/register', validateRegisterMuseumFields, handleValidationErrors, registerMuseum)
authRoutes.put('/museum/register/complete', museumIsActiveAuth, validateCompleteRegisterMuseumFields, handleValidationErrors, completeRegisterMuseum)

authRoutes.put('/museum/change-password', museumIsEmailActiveAuth, validateFieldPassword, handleValidationErrors, changePasswordMuseum)
authRoutes.put('/museum/change-password/complete', museumIsEmailActiveAuth, completeChangePasswordMuseum)

authRoutes.put('/museum/change-email', museumIsEmailActiveAuth, validateFieldEmail, handleValidationErrors, changeEmailMuseum)
authRoutes.put('/museum/change-email/complete', museumIsEmailActiveAuth, completeChangeEmailMuseum)


authRoutes.put('/museum/verify-email', museumIsEmailNotActiveAuth, verifyEmailMuseum)
authRoutes.put('/museum/verify-email/complete', museumIsEmailNotActiveAuth, completeVerifyEmailMuseum)

authRoutes.post('/museum/recovery-password', validateFieldEmail, handleValidationErrors, recoveryPasswordMuseum)
authRoutes.put('/museum/recovery-password/change', validateFieldPassword, handleValidationErrors, recoveryPasswordChangeMuseum)

//curators routes
authRoutes.get('/curator', curatorAuth, getLoggedCurator)
authRoutes.post('/curator/regiter', validateRegisterCurator, handleValidationErrors, curatorRegister)
authRoutes.post('/curator/login', validateLoginCurator, handleValidationErrors, curatorLogin)


//users routes 
authRoutes.get('/user', userAuth, getLoggedUser)
authRoutes.post('/user/regiter', validateRegisterUserFields, handleValidationErrors, userRegister)
authRoutes.post('/user/login', validateLoginUserFields, handleValidationErrors, userLogin)


/* authRoutes.get('/user/oauth/link')

authRoutes.get('/user/oauthcallback') */

export {authRoutes}