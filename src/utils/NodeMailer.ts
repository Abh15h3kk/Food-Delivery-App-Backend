import * as nodeMailer from 'nodemailer'
import * as SendGrid from 'nodemailer-sendgrid-transport'

export class NodeMailer {

    private static initiateTransport() {
        return nodeMailer.createTransport(SendGrid({
            auth: {
                api_key: `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`
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