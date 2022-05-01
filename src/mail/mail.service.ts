import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    transporter
    constructor(){
    this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })
    }


    sendMail(to: string, link: string) {
        
        this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Смена пароля на сайте ' + `${process.env.RESET_PASS_URL}`,
            text: '',
            html:
                `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
            `
        })
    }
}
