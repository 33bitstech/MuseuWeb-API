import {Router} from 'express'
import { validateLoginMuseumFields } from '../../../middlewares/Validators/login.validator'
import { AuthMuseumService } from '../services/implementation/auth-museum.service'
import { AuthMuseumController } from '../controllers/implementation/auth-museum.controller'
import { UserRepository } from '../../User/repositories/implementation/user.repository'
import { UserModel } from '../../User/models/user.schema'
import { MuseumRegisterCases } from '../use-cases/implementation/uc-museum-register'
import { validateCompleteRegisterMuseumFields, validateRegisterMuseumFields } from '../../../middlewares/Validators/museum-register.validator'
import { curatorAuth, museumAuth, museumIsActiveAuth, museumIsEmailActiveAuth, museumIsEmailNotActiveAuth } from '../../../middlewares/auth.middleware'
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


const authRoutes = Router()

//repositories
const userRepository = new UserRepository(UserModel)

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
/* authRoutes.post('/users/register')
authRoutes.post('/users/login') */

export {authRoutes}