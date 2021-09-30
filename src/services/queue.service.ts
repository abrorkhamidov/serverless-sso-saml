//import { Context } from 'aws-lambda';
import * as AWS from "aws-sdk";
//import { ReceiveMessageResult, Message } from 'aws-sdk/clients/sqs';

const {
    DYNAMODB_ACCESS_KEY_ID,
    DYNAMODB_SECRET_ACCESS_KEY,
} = process.env;

AWS.config.update({
    accessKeyId: DYNAMODB_ACCESS_KEY_ID,
    secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY,
    region: "us-east-1"
});
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
export default class QueueService {

    sendMsg = async (messageBody, messageGroupId) => {
        const queueUrl = await this.getQueueUrl();
        try {
            const data = await sqs.sendMessage({
                QueueUrl: queueUrl,
                MessageBody: messageBody,
                MessageGroupId: messageGroupId
                    }).promise();
            console.log(`Message ${data.MessageId} placed in the Queue!`);
        return data;
        } catch (error) {
            console.log("send message error:");
            console.log(error);
        }  
    }

    deleteMessage = async (receiptHandle) => {
        const queueUrl = await this.getQueueUrl();
        await sqs.deleteMessage({
            ReceiptHandle: receiptHandle,
            QueueUrl: queueUrl
        });
    }

    getQueueUrl = async () => {
        const params = {
            QueueName: 'booking-environment.fifo'
        };
        const data = await sqs.getQueueUrl(params).promise();
        return data.QueueUrl;
    }

}
