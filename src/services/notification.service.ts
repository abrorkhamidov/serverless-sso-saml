import * as AWS from 'aws-sdk';
import util from "util";

import { NotificationCode } from "../enums/notification.enum";
import { NotificationCodeSubject } from "../enums/notification.enum";
import { NotificationCodeContent } from "../enums/notification.enum";


const {
    SES_REG,
    SES_SOURCE
} = process.env;

AWS.config.update({
    region: SES_REG
});

const ses = new AWS.SES();

export default class NotificationService {

    notify = async (code, params) => {
        const startDate = params.startDate;
        const endDate = params.endDate;
        const startDateAndTime = params.startdateAndtime;
        const environmentLink = params.environmentlink;
        const notificationEmail = params.notificationEmail;
        const changer = params.changer;
        const adminEmail = params.adminEmail;
        switch (code) {
            case NotificationCode.N_1:
                this.sendEmail(
                    NotificationCode.N_1,
                    NotificationCodeSubject.N_1_SUBJECT,
                    util.format(NotificationCodeContent.N_1_CONTENT, startDate, endDate),
                    notificationEmail);
                break;
            case NotificationCode.N_2:
                this.sendEmail(
                    NotificationCode.N_2,
                    NotificationCodeSubject.N_2_SUBJECT,
                    NotificationCodeContent.N_2_CONTENT,
                    notificationEmail);
                break;
            case NotificationCode.N_3:
                this.sendEmail(
                    NotificationCode.N_3,
                    NotificationCodeSubject.N_3_SUBJECT,
                    util.format(NotificationCodeContent.N_3_CONTENT, startDateAndTime, environmentLink),
                    notificationEmail);
                break;
            case NotificationCode.N_4:
                this.sendEmail(
                    NotificationCode.N_4,
                    NotificationCodeSubject.N_4_SUBJECT,
                    NotificationCodeContent.N_4_CONTENT,
                    notificationEmail);
                break;
            case NotificationCode.N_5:
                this.sendEmail(
                    NotificationCode.N_5,
                    NotificationCodeSubject.N_5_SUBJECT,
                    util.format(NotificationCodeContent.N_5_CONTENT, endDate, environmentLink),
                    notificationEmail);
                break;
            case NotificationCode.N_6:
                this.sendEmail(
                    NotificationCode.N_6,
                    NotificationCodeSubject.N_6_SUBJECT,
                    util.format(NotificationCodeContent.N_6_CONTENT, endDate, environmentLink),
                    notificationEmail);
                break;
            case NotificationCode.N_7:
                this.sendEmail(
                    NotificationCode.N_7,
                    NotificationCodeSubject.N_7_SUBJECT,
                    util.format(NotificationCodeContent.N_7_CONTENT, changer, environmentLink),
                    notificationEmail);
                break;
            case NotificationCode.N_8:
                this.sendEmail(
                    NotificationCode.N_8,
                    NotificationCodeSubject.N_8_SUBJECT,
                    util.format(NotificationCodeContent.N_8_CONTENT, changer, environmentLink),
                    notificationEmail);
                break;
            case NotificationCode.N_9:
                this.sendEmail(
                    NotificationCode.N_9,
                    NotificationCodeSubject.N_9_SUBJECT,
                    NotificationCodeContent.N_9_CONTENT,
                    notificationEmail);
                break;
            case NotificationCode.N_10:
                this.sendEmail(
                    NotificationCode.N_10,
                    NotificationCodeSubject.N_10_SUBJECT_FOR_ADMIN,
                    util.format(NotificationCodeContent.N_10_CONTENT_FOR_ADMIN, environmentLink, startDate),
                    adminEmail);
                break;
            case NotificationCode.N_11:
                this.sendEmail(
                    NotificationCode.N_11,
                    NotificationCodeSubject.N_11_SUBJECT_FOR_USER,
                    util.format(NotificationCodeContent.N_11_CONTENT_FOR_USER, environmentLink, startDate),
                    notificationEmail);
                break;
            case NotificationCode.N_12:
                this.sendEmail(
                    NotificationCode.N_12,
                    NotificationCodeSubject.N_12_SUBJECT,
                    util.format(NotificationCodeContent.N_12_CONTENT, environmentLink, startDateAndTime),
                    notificationEmail);
                break;
            case NotificationCode.N_13:
                this.sendEmail(
                    NotificationCode.N_13,
                    NotificationCodeSubject.N_13_SUBJECT,
                    util.format(NotificationCodeContent.N_13_CONTENT, environmentLink, startDateAndTime),
                    notificationEmail);
                break;
            case NotificationCode.N_14:
                this.sendEmail(
                    NotificationCode.N_14,
                    NotificationCodeSubject.N_14_SUBJECT,
                    util.format(NotificationCodeContent.N_14_CONTENT, environmentLink),
                    notificationEmail);
                break;
        }
    }

    sendEmail = async (code, subject, content, recipient) => {
        const params = {
            Source: SES_SOURCE,
            Destination: {
                ToAddresses: [
                    recipient
                ]
            },
            Message: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Text: {
                        Data: content
                    },
                    Html: {
                        Data: `<html>
                    <head></head>
                    <body>
                      <h1>${subject}</h1>
                      <br>
                      <p>${content}</p>
                    </body>
                    </html>`
                    }
                }
            }
        }

        ses.sendEmail(params, function (err, data) {
            console.log(`Sending email. Event code: ${code}. Event subject: ${subject}.`);
            if (err) {
                console.log(`Error during request for sending email: ${err}`);
            } else {
                console.log(`Request for sending email was successfully performed. Response: ${JSON.stringify(data)}`);
            }
        })
    }
}