import { DTOMuseumCompleteRegister, PublicMuseumAuthenticated } from "../../Museum/DTOs/DTOMuseum";
import { EntityMuseum } from "../../Museum/entities/museum";

export default interface IAuthServiceContract {
    museumRegister: ({ cnpj, email, password }: { email: string; password: string; cnpj: string; }) => Promise<string>;
    completeMuseumRegister: (museumdId: string, museumObject: Partial<DTOMuseumCompleteRegister>) => Promise<string>;
    museumLogin: (identifier: string, password: string) => Promise<{ message: string; museumId?: string; token?: string; }>;
    completeMuseumLogin: (museumId: string, otp: string) => Promise<string>;
    museumAuthenticated: (museumId: string) => Promise<PublicMuseumAuthenticated>;

    verifyMuseumEmail: (museum: EntityMuseum) => Promise<{ message: string }>;
    completeVerifyMuseumEmail: (token: string) => Promise<void>;

    updateMuseumEmail: (museumId: string, newEmail: string) => Promise<{ message: string; museumId: string; }>;
    completeUpdateEmailMuseum: (museumId: string, otp: string) => Promise<string>;

    updateMuseumPassword: (museumId: string, newPassword: string) => Promise<{ message: string; museumId: string; }>;
    completeUpdatePasswordMuseum: (museumId: string, otp: string) => Promise<void>;

    userLogin: (email: string, password: string) => Promise<string>;

    recoveryPasswordMuseum: (email:string)=> Promise<void>
    recoveryPasswordChangeMuseum: (token:string, newPassword: string)=> Promise<void>
}