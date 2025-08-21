import { transporter } from "../../../../config/nodemailer";
import IEmailServiceContract, { IEmailTo, IMessage } from "../IEmail.service";
import mjml from 'mjml'

export class EmailService implements IEmailServiceContract{
    constructor(){}
    
    public sendEmail = async (from: string, to: IEmailTo, message: IMessage) => {
        await transporter.sendMail({
            from,
            to: to.email,
            subject: message.subject,
            //html: mjml(message.body).html
            html: message.body
        })
    }
}