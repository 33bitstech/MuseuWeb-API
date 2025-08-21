export interface IEmailTo {
    name: string,
    email: string,
}
export interface IMessage {
    subject: string,
    body: string,
}
export default interface IEmailServiceContract {
    sendEmail: (from: string, to: IEmailTo, message: IMessage ) => Promise<void>
    //generateRecoveryPasswordMjml(token: string, email: string, name: string):string
}