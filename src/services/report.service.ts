import * as AWS from 'aws-sdk';
import PDFKit from "pdfkit";
// import fs from "fs";
import { v4 as UUID } from 'uuid';
import { printShortDate } from "../utils/util";
import FileUploadService from "./file-upload.service";
import getStream from 'get-stream';
// import DatabaseService from "../services/database.service";

const {
  DYNAMODB_ACCESS_KEY_ID,
  DYNAMODB_SECRET_ACCESS_KEY,
  DYNAMODB_REG,
//   BILLING_INFO_DYNAMODB_TABLE,
  DOCUMENTS_FOLDER
} = process.env;
AWS.config.update({
  accessKeyId: DYNAMODB_ACCESS_KEY_ID,
  secretAccessKey: DYNAMODB_SECRET_ACCESS_KEY,
  region:DYNAMODB_REG
});
//make sure you pass proper credentials
const fileUploadService = new FileUploadService();
// const databaseService = new DatabaseService();
export default class BillingReportService {
    private totalInfo: {
        cost: number,
        spent_hours: number,
    } = {
        cost: 0,
        spent_hours: 0,
        };
    composeResult = (items) => {
        return new Promise<any>((resolve) => {
            try {
                items.forEach((item) => {
                    this.eachBillingInfo(item);
                });
                this.createBillingReport(items).then(url => {
                    return resolve(url);
                });
            } catch (error) {
                console.log(error);
            }
        })
    }
    eachBillingInfo(item) {
        this.totalInfo.cost += item.total_cost;
        this.totalInfo.spent_hours += item.spent_hours;
    }

    createBillingReport = (items) => {
        return new Promise<any>((resolve) => {
            const doc = new PDFKit({ margin: 50 });
            const path = UUID();
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            this.generateBillingTable(doc, items);
            doc.end();
            // doc.pipe(fs.createWriteStream(path));
            getStream.buffer(doc).then((pdfBuffer) => {
            fileUploadService.uploadSingleFile(pdfBuffer, DOCUMENTS_FOLDER, path).then(() => {
                     fileUploadService.getPresignedURL(DOCUMENTS_FOLDER + '/' + path).then((url) => {
                                return resolve(url);
                            });
                    });
            })
        })
    }
    generateBillingTable = (doc,items) => {
        let i;
        const billingTableTop = 330;
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("Billing", 50, 160);
        this.generateHr(doc, 185);
        doc.font("Helvetica-Bold");
        this.generateTableRow(
            doc,
            billingTableTop,
            "Name",
            "User",
            "Start Date",
            "End Date",
            "Hours",
            "Cost"
        );
        this.generateHr(doc, billingTableTop + 20);
        doc.font("Helvetica");
        for (i = 0; i < items.length; i++) {
            const item = items[i];
            const position = billingTableTop + (i + 1) * 30;
            this.generateTableRow(
                doc,
                position,
                item.environment.name,
                item.user.firstName + " " + item.user.lastName,
                printShortDate(item.booking.startDate),
                printShortDate(item.booking.endDate),
                item.spent_hours,
                item.environment.cost
            );
            this.generateHr(doc, position + 20);
        }
        const totalPosition = billingTableTop + (i + 1) * 30;
        this.generateTableRow(
            doc,
            totalPosition,
            "",
            "",
            "",
            "TOTAL",
            this.totalInfo.spent_hours,
            this.formatCurrency(this.totalInfo.cost)
        );
        
    }

    generateTableRow = (doc, y, c1, c2, c3, c4, c5,c6) => {
        doc
            .fontSize(10)
            .text(c1, 50, y)
            .text(c2, 200, y)
            .text(c3, 300, y,{ width: 70, align: "center" })
            .text(c4, 370, y, { width: 70, align: "center" })
            .text(c5, 440, y, { width: 50, align: "right" })
            .text(c6, 495, y, { width: 50, align: "right" })
    }
    generateHr = (doc, y) => {
        doc
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }
    
    formatCurrency = (cost) => {
  return "$" + (cost);
}

}

