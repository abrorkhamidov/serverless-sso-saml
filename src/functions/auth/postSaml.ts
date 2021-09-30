import * as xml2js from "xml2js";
import * as jwt from "jsonwebtoken";

import DatabaseService from "../../services/database.service";
const databaseService = new DatabaseService();

const getAttributeValue = (key, attributes) => {
  const attribute = attributes.find(attr => attr['$'].Name === key);
  if (!attribute) {
    return null;
  }
  const value = attribute['saml:AttributeValue'][0]._;
  return value;
}

const extractUserInfo = samlObject => {
  const response = samlObject['samlp:Response'];
  const assertion = response['saml:Assertion'][0];
  const attributeStatement = assertion['saml:AttributeStatement'][0];
  const attributes = attributeStatement['saml:Attribute'];

  const email = getAttributeValue('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress', attributes);
  const firstName = getAttributeValue('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname', attributes);
  const lastName = getAttributeValue('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname', attributes);
  const role = 'USER';

  return {
    email,
    firstName,
    lastName,
    role,
  };
};

export const postSaml = async (event) => {
  const arr = event.body.split('&RelayState=');
  const relayState = decodeURIComponent(arr[1]);
  const samlResponse = unescape(arr[0].replace('SAMLResponse=', ''));
  const samlBuffer = Buffer.from(samlResponse, 'base64').toString('ascii');
  const samlObject = await xml2js.parseStringPromise(samlBuffer);
  
  try {
    const userInfo = extractUserInfo(samlObject);
    const user = await databaseService.createOrGet(userInfo)
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: parseInt(process.env.JWT_EXPIRATION_SECONDS),
    });
    return {
      statusCode: 301,
      headers: {
        Location: `${relayState}?token=${encodeURIComponent(token)}`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      }
    };
  } catch(error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'An error occured!',
    };
  }
};
