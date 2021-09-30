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
// utils
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from "../../constraints/user/email.constraint.json";
// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

export const deleteUser: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  let response;
  const requestData = event.pathParameters;
  const databaseService = new DatabaseService();
  const { userEmail } = requestData;
  const { MAIN_DYNAMODB_TABLE } = process.env;

  return validateAgainstConstraints({ userEmail }, requestConstraints)
    .then(() => {
      return databaseService.getItem({
        hash: "pk",
        hashValue: `USER#${userEmail}`,
        tableName: MAIN_DYNAMODB_TABLE,
      });
    })
    .then(() => {
      const params = {
        TableName: MAIN_DYNAMODB_TABLE,
        Key: {
          pk: `USER#${userEmail}`,
        },
      };
      return databaseService.delete(params);
    })
    .then(() => {
      response = new ResponseModel(
        {},
        StatusCode.OK,
        ResponseMessage.DELETE_USER_SUCCESS
      );
    })
    .catch((error) => {
      response =
        error instanceof ResponseModel
          ? error
          : new ResponseModel(
              {},
              StatusCode.ERROR,
              ResponseMessage.DELETE_USER_FAIL
            );
    })
    .then(() => { 
      return response.generate();
    });
};
