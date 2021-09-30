import {
  Context,
} from "aws-lambda";
import "source-map-support/register";
import * as jwt from 'jsonwebtoken';
// Services
import AuthService from "../../services/auth.service";

export const authorizer = async (
  event, 
  context:Context,
  callback
) => {
  const authService = new AuthService();
    const token = event.authorizationToken;
    if (!token) {
        return callback(null, authService.generatePolicy('Deny', event.methodArn, token));
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
    } catch(error) {
        console.error(error);
        return callback(null, authService.generatePolicy('Deny', event.methodArn, token));
    }
    return callback(null, authService.generatePolicy('Allow', event.methodArn, token));
};
