import {Request, Response} from 'express';
import { seqlz, credential_mail } from '../keys';
import * as nodemailer from 'nodemailer';

const TRANSPORTER = nodemailer.createTransport({
    // service: 'Gmail',
    // auth: {
    //     user: credential_mail.email,
    //     pass: credential_mail.pass
    // },
    
    name: 'hostgator',
    host: "gator4185.hostgator.com",
    port: 465,
    secure: true,
    auth: {
        user: credential_mail.email,
        pass: credential_mail.pass
    },
    tls: {rejectUnauthorized: false},
    debug:true
});

class EmailController {
    public async sendMail(req: Request, res: Response) {
        var params = req.body;

        var mailOptions = {
            from: credential_mail.email,
            cc: params.cc,
            to: params.to,
            subject: params.subject,
            html: params.html
        };

        TRANSPORTER.sendMail(mailOptions, (error, info) => {
            if (error){
                res.status(500).send({ message: 'Error al enviar correo.', error: error });
            } else {
                res.status(200).send({ message: 'Mensaje enviado!' });
            }
        });
    }
}
export const emailController = new EmailController();