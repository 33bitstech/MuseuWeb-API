import { PublicUserAuthenticated, TCreateUserBody } from "../../User/DTOs/DTOUser";
import { EntityUser } from "../../User/entities/user";

export default interface IAuthUserServiceContract {
    register: (userObject: TCreateUserBody) => Promise<string>
    login: ({email, password}: {email: string, password:string}) => Promise<string>

    authenticated: (user: EntityUser) => Promise<PublicUserAuthenticated>;
}