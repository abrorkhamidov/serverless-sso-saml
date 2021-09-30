// import * as passport from 'passport';
// import * as saml from 'passport-saml';
import * as jwt from 'jsonwebtoken';
export default class AuthService {
   generatePolicy = (effect, resource, token) => {
    const decoded = token && jwt.decode(token);
    return ({
        principalId: decoded ? decoded.email : 'unauthorized-user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: effect,
                    Action: 'execute-api:Invoke',
                    Resource: resource,
                },
            ],
        },
        context: decoded,
    });
   };
 }
