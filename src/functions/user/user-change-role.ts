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

export const changeUserRole: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  let response;
  const role = event.queryStringParameters.role;
  const { userEmail } = event.pathParameters;
  const databaseService = new DatabaseService();
  const { MAIN_DYNAMODB_TABLE } = process.env;

  return Promise.all([
    validateAgainstConstraints({ userEmail }, requestConstraints),
    databaseService.getItem({
      hash: "pk",
      hashValue: `USER#${userEmail}`,
      tableName: MAIN_DYNAMODB_TABLE,
    }),
  ])
    .then(async () => {
      const params = {
        TableName: MAIN_DYNAMODB_TABLE,
        Key: {
          pk: `USER#${userEmail}`,
        },
        UpdateExpression: `set
                #role = :role,
                updated_at = :timestamp`,
        ExpressionAttributeNames: {
          "#role": "role",
        },
        ExpressionAttributeValues: {
          ":role": role,
          ":timestamp": new Date().getTime(),
        },
        ReturnValues: "UPDATED_NEW",
      };
      return await databaseService.update(params);
    })
    .then((results) => {
      response = new ResponseModel(
        { ...results.Attributes },
        StatusCode.OK,
        ResponseMessage.UPDATE_USER_SUCCESS
      );
    })
    .catch((error) => {
      response =
        error instanceof ResponseModel
          ? error
          : new ResponseModel(
              {},
              StatusCode.ERROR,
              ResponseMessage.UPDATE_USER_FAIL
            );
    })
    .then(() => { 
      return response.generate();
    });
};
