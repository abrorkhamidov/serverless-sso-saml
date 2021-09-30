import { SAML } from 'passport-saml/lib/passport-saml/saml';

const {
    CALLBACK_URL,
    ISSUER,
    ENTRY_POINT,
    LOGOUT_URL,
} = process.env;

const createRequest = (event):any =>({
    user: { nameID: event.queryStringParameters.nameID }
});

export const logoutUser = async (
  event,
  context,
  callback
) => {
    console.log('Logging out...');
    const samlParser = new SAML({
        entryPoint: ENTRY_POINT,
        callbackUrl: CALLBACK_URL,
        issuer: ISSUER,
        logoutUrl:LOGOUT_URL
    });
    samlParser.getLogoutUrl(createRequest(event), {}, (error, url) => {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log("SAMLRequestUrl",url);
        const response = {
            statusCode: 301,
            headers: {
                Location: url,
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Credentials': true,
            }
        };
        callback(null, response);
    });
     
};
