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

export const getUser: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  
  let response;

  
  const { userEmail } = event.pathParameters;

  
  const databaseService = new DatabaseService();

  
  const { MAIN_DYNAMODB_TABLE } = process.env;

  
  return validateAgainstConstraints({ userEmail }, requestConstraints)
    .then(() => {
      const params = {
        hash: "pk",
        hashValue: `USER#${userEmail}`,
        tableName: MAIN_DYNAMODB_TABLE,
      };
      return databaseService.getItem(params);
    })
    .then((data) => {  
      response = new ResponseModel(
        { ...data.Item },
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
