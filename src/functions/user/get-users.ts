import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

export const getUsers: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  let response;
  const email =
    event.queryStringParameters.userEmail 
      ? event.queryStringParameters.userEmail
      : "";
  const limit = event.queryStringParameters.limit ? parseInt(event.queryStringParameters.limit) : 10
  const page = event.queryStringParameters.page ? parseInt(event.queryStringParameters.page):1
  const databaseService = new DatabaseService();
  const { MAIN_DYNAMODB_TABLE } = process.env;
  const params = {
    TableName: MAIN_DYNAMODB_TABLE,
    IndexName: "email-index",
    FilterExpression: "contains(#email, :email)",
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": email,
    },
  };
  const allData = await databaseService.scan(params);
  return databaseService
    .getScannedData(params,page,limit)
    .then((data) => {
      response = new ResponseModel(
        { items:data, count: allData.Items.length},
        StatusCode.OK,
        ResponseMessage.GET_USER_SUCCESS
      );
    })
    .catch((error) => {
      response =
        error instanceof ResponseModel
          ? error
          : new ResponseModel(
              {},
              StatusCode.ERROR,
              ResponseMessage.GET_USER_FAIL
            );
    })
    .then(() => {
      return response.generate();
    });
};
