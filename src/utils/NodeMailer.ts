import * as nodeMailer from 'nodemailer'
import * as SendGrid from 'nodemailer-sendgrid-transport'
import { getEnvironmentVariables } from '../environments/environment'

export class NodeMailer {

    private static initiateTransport() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
                api_key: getEnvironmentVariables().sendgrid_api_key
            }
        }))
    }

    static SendMail(data:{to: [string],subject: string, html: string}): Promise<any> {
        return NodeMailer.initiateTransport().sendMail({
            from: 'aabhishekvermaa321@gmail.com',
            to: data.to,
            subject: data.subject,
            html: data.html
        })
    }

}