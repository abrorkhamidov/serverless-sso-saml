import { SAML } from 'passport-saml/lib/passport-saml/saml';

const {
    CALLBACK_URL,
    ISSUER,
    ENTRY_POINT
} = process.env;

const createRequest = (event):any =>({
    query: {
        RelayState: event.queryStringParameters.returnUrl,
    }
});

export const loginUser = (
  event,
  context,
  callback
) => {
    const samlParser = new SAML({
        entryPoint: ENTRY_POINT,
        callbackUrl: CALLBACK_URL,
        issuer: ISSUER
    });
    samlParser.getAuthorizeUrl(createRequest(event), {}, (error, url) => {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log(url);
        const response = {
            statusCode: 301,
            headers: {
                Location: url,
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Credentials': true
            },
        };
       callback(null,response); 
    });    
};
