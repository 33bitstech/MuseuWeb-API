import {Router} from 'express'
import { validateLoginMuseumFields } from '../../../middlewares/Validators/login.validator'
import { MuseumRepository } from '../../Museum/repositories/implementation/museum.repository'
import { MuseumModel } from '../../Museum/models/museum.schema'
import { AuthMuseumService } from '../services/implementation/auth-museum.service'
import { AuthMuseumController } from '../controllers/implementation/auth-museum.controller'
import { UserRepository } from '../../User/repositories/implementation/user.repository'
import { UserModel } from '../../User/models/user.schema'
import { MuseumRegisterCases } from '../use-cases/implementation/museum-register'
import { CuratorModel } from '../../Curator/models/curator.model'
import { CuratorRepository } from '../../Curator/repositories/implementation/curator.repository'
import { validateCompleteRegisterMuseumFields, validateFieldEmail, validateFieldPassword, validateRegisterMuseumFields } from '../../../middlewares/Validators/museum-register.validator'
import { museumAuth, museumIsActiveAuth, museumIsEmailActiveAuth, museumIsEmailNotActiveAuth } from '../../../middlewares/auth.middleware'
import { handleValidationErrors } from '../../../middlewares/error.middleware'
import { RedisCacheService } from '../../Cache/services/implementation/redis-cache.service'
import { CacheService } from '../../Cache/services/implementation/cache.service'
import { EmailService } from '../../Email/service/implementation/email.service'


const authRoutes = Router()

//repositories
const museumRepository = new MuseumRepository(MuseumModel)
const userRepository = new UserRepository(UserModel)
const curatorRepository = new CuratorRepository(CuratorModel)

//use-cases
const usecaseMuseumRegister = new MuseumRegisterCases(
    museumRepository,
    userRepository,
    curatorRepository
)

//services
const cacheService = new CacheService()
const radisCacheService = new RedisCacheService(
    cacheService
)
const emailService = new EmailService()

const authService = new AuthMuseumService(
    museumRepository,

    usecaseMuseumRegister,
    
    radisCacheService,
    emailService
)

//controllers
const {
    loginMuseum, registerMuseum, completeRegisterMuseum, 
    getLoggedMuseum, completeLoginMuseum, changeEmailMuseum,
    completeChangeEmailMuseum, completeChangePasswordMuseum, completeVerifyEmailMuseum,
    changePasswordMuseum, verifyEmailMuseum, recoveryPasswordMuseum, recoveryPasswordChangeMuseum
} = new AuthMuseumController(authService)

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



/* 
authRoutes.post('/user/login', validateLoginFields, loginUser) 

authRoutes.post('/users')
authRoutes.post('/curators/:museumId') //healer do museu
 */
export {authRoutes}