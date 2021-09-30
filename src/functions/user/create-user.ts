import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
// Models
import UserModel from "../../models/user.model";
import ResponseModel from "../../models/response.model";
// Services
import DatabaseService from "../../services/database.service";
// utils
import { validateAgainstConstraints } from "../../utils/util";
import requestConstraints from "../../constraints/user/create.constraint.json";
// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

export const createUser: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  let response;
  const requestData = JSON.parse(event.body);

  return validateAgainstConstraints(requestData, requestConstraints)
    .then(async () => {
      const databaseService = new DatabaseService();
      const userModel = new UserModel(requestData);
      const data = userModel.getEntityMappings();

      const params = {
        TableName: process.env.MAIN_DYNAMODB_TABLE,
        Item: {
          pk: `USER#${data.email}`,
          user_id: data.user_id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          created_at: data.created_at,
        },
      };
      await databaseService.create(params);
      return data.email;
    })
    .then((userEmail) => {
      response = new ResponseModel(
        { userEmail },
        StatusCode.OK,
        ResponseMessage.CREATE_USER_SUCCESS
      );
    })
    .catch((error) => {
      response =
        error instanceof ResponseModel
          ? error
          : new ResponseModel(
              {},
              StatusCode.ERROR,
              ResponseMessage.CREATE_USER_FAIL
            );
    })
    .then(() => {
      return response.generate();
    });
};
