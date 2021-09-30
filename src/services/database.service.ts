import * as AWS from "aws-sdk";
import { v4 as UUID } from 'uuid';

// Models
import ResponseModel from "../models/response.model";

import { createChunks } from '../utils/util';

// Interfaces
import IConfig from "../interfaces/config.interface";

// Enums
import { StatusCode } from "../enums/status-code.enum";
import { ResponseMessage } from "../enums/response-message.enum";
//import { QueryInput } from "aws-sdk/clients/dynamodb";

// Put
type PutItem = AWS.DynamoDB.DocumentClient.PutItemInput;
type PutItemOutput = AWS.DynamoDB.DocumentClient.PutItemOutput;

// Batch write
type BatchWrite = AWS.DynamoDB.DocumentClient.BatchWriteItemInput;
type BatchWriteOutPut = AWS.DynamoDB.DocumentClient.BatchWriteItemOutput;

// Update
type UpdateItem = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type UpdateItemOutPut = AWS.DynamoDB.DocumentClient.UpdateItemOutput;

// Query
type QueryItem = AWS.DynamoDB.DocumentClient.QueryInput;
type QueryItemOutput = AWS.DynamoDB.DocumentClient.QueryOutput;

// Query
type ScanItem = AWS.DynamoDB.DocumentClient.ScanInput;
type ScanItemOutput = AWS.DynamoDB.DocumentClient.ScanOutput;

// Get
type GetItem = AWS.DynamoDB.DocumentClient.GetItemInput;
type GetItemOutput = AWS.DynamoDB.DocumentClient.GetItemOutput;

// Delete
type DeleteItem = AWS.DynamoDB.DocumentClient.DeleteItemInput;
type DeleteItemOutput = AWS.DynamoDB.DocumentClient.DeleteItemOutput;

type Item = { [index: string]: string };

import UserModel from "../models/user.model";

const {
  STAGE,
  DYNAMODB_STAGE,
  DYNAMODB_ACCESS_KEY_ID,
  DYNAMODB_SECRET_ACCESS_KEY,
  MAIN_DYNAMODB_TABLE
  // DYNAMODB_ENDPOINT,
} = process.env;

const config: IConfig = { region: "us-east-1" };
if (STAGE === DYNAMODB_STAGE) {
  config.accessKeyId = DYNAMODB_ACCESS_KEY_ID; // local dynamodb accessKeyId
  config.secretAccessKey = DYNAMODB_SECRET_ACCESS_KEY; // local dynamodb secretAccessKey
  //config.endpoint = DYNAMODB_ENDPOINT; // local dynamodb endpoint
}
AWS.config.update(config);

const documentClient = new AWS.DynamoDB.DocumentClient();
const dynamodb = new AWS.DynamoDB({
    region: 'us-east-1'
});
export default class DatabaseService {
  getItem = async ({ hash, hashValue, tableName }: Item) => {
    const params = {
      TableName: tableName,
      Key: {},
    };
    if (hash) {
      params.Key[hash] = hashValue;
    }
    const results = await this.get(params);
    if (Object.keys(results).length) {
      return results;
    }
    console.error("Item does not exist");
    throw new ResponseModel(
      { hash: hashValue },
      StatusCode.BAD_REQUEST,
      ResponseMessage.INVALID_REQUEST
    );
  };

  create = async (params: PutItem): Promise<PutItemOutput> => {
    try {
      return await documentClient.put(params).promise();
    } catch (error) {
      console.error(`create-error: ${error}`);
      throw new ResponseModel({}, 500, `create-error: ${error}`);
    }
  };

  createOrGet = async (params): Promise<any> => {
    const param = {
      TableName: MAIN_DYNAMODB_TABLE,
      Key: {
        "pk": `USER#${params.email}`
      },
    };
    const user = await documentClient.get(param).promise();
    console.log(user.Item);
    if (user.Item == null) {
      const userModel = new UserModel(params);
      
      const userData = userModel.getEntityMappings();
      console.log(userData);
      await this.create(
        {
          TableName: MAIN_DYNAMODB_TABLE,
          Item: {
            pk: `USER#${userData.email}`,
            user_id: userData.user_id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            created_at: userData.created_at,
          }
        })
      return {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      };
    } else {
      return {
        email: user.Item.email,
        firstName: user.Item.firstName,
        lastName: user.Item.lastName,
        role: user.Item.role,
      }
    }
  }

  batchCreate = async (params: BatchWrite): Promise<BatchWriteOutPut> => {
    try {
      return await documentClient.batchWrite(params).promise();
    } catch (error) {
      console.error(`batch-write-error: ${error}`);
      throw new ResponseModel({}, 500, `batch-write-error: ${error}`);
    }
  };

  update = async (params: UpdateItem): Promise<UpdateItemOutPut> => {
    try {
      // result.Attributes
      return await documentClient.update(params).promise();
    } catch (error) {
      console.error(`update-error: ${error}`);
      throw new ResponseModel({}, 500, `update-error: ${error}`);
    }
  };

  query = async (params: QueryItem): Promise<QueryItemOutput> => {
    try {
      return await documentClient.query(params).promise();
    } catch (error) {
      console.error(`query-error: ${error}`);
      throw new ResponseModel({}, 500, `query-error: ${error}`);
    }
  };

  scan = async (params: ScanItem): Promise<ScanItemOutput> => {
    try {
      return await documentClient.scan(params).promise();
    } catch (error) {
      console.error(`query-error: ${error}`);
      throw new ResponseModel({}, 500, `query-error: ${error}`);
    }
  };

  getScannedData = async (params: ScanItem, page: number, limit: number): Promise<any> => {
    try {
      const data = await documentClient.scan(params).promise();
      const chunks = await createChunks(data['Items'], limit);
      return chunks[page - 1];
      
    } catch (error) {
      console.error(`query-error: ${error}`);
      throw new ResponseModel({}, 500, `query-error: ${error}`);
    }
  };

  getEnvironmentFilters = async (type: string): Promise<any> => {
    const { MAIN_DYNAMODB_TABLE } = process.env;
    if (type === "version") {
      const params = {
        TableName: MAIN_DYNAMODB_TABLE,
        FilterExpression: "begins_with(#pk,:pk)",
        ExpressionAttributeNames: {
          "#pk": "pk"
        },
        ExpressionAttributeValues: {
          ":pk": "ENVIRONMENT"
        }
      };
      try {
        const data = await documentClient.scan(params).promise();
        const allFilters = [];
        data["Items"].forEach(item => {
          allFilters.push({
            id: item[type],
            name: item[type]
          })
        })
        const result = allFilters.filter((item, index, self) =>
          index === self.findIndex((f) => (
            f.name === item.name
          ))
        );
        return result
      } catch (error) {
        console.error(`filters-get-error: ${error}`);
        throw new ResponseModel({}, 500, `filters-get-error: ${error}`);
      }
    } else {
      const params = {
        TableName: MAIN_DYNAMODB_TABLE,
        FilterExpression: "begins_with(#pk,:pk)",
        ExpressionAttributeNames: {
          "#pk": "pk"
        },
        ExpressionAttributeValues: {
          ":pk": type
        }
      };
      try {
        const data = await documentClient.scan(params).promise();
        const allFilters = [];
        data["Items"].forEach(item => {
          allFilters.push({ id: item.id, name: item.name })
        })
        const result = allFilters.filter((item, index, self) =>
          index === self.findIndex((f) => (
            f.name === item.name && f.id === item.id
          ))
        );
        return result
      } catch (error) {
        console.error(`filters-get-error: ${error}`);
        throw new ResponseModel({}, 500, `filters-get-error: ${error}`);
      }
    }
  };


  get = async (params: GetItem): Promise<GetItemOutput> => {
    console.log("DB GET - STAGE: ", STAGE);
    console.log("DB GET - params.TableName: ", params.TableName);
    console.log("DB GET - params.Key: ", params.Key);

    try {
      return await documentClient.get(params).promise();
    } catch (error) {
      console.error(`get-error - TableName: ${params.TableName}`);
      console.error(`get-error: ${error}`);
      throw new ResponseModel({}, 500, `get-error: ${error}`);
    }
  };

  delete = async (params: DeleteItem): Promise<DeleteItemOutput> => {
    try {
      return await documentClient.delete(params).promise();
    } catch (error) {
      console.error(`delete-error: ${error}`);
      throw new ResponseModel({}, 500, `delete-error: ${error}`);
    }
  };

  transactWriteItems = async (params): Promise<void> => {
    try {
      console.log(params);
      await dynamodb.transactWriteItems(params).promise();
    } catch (error) {
      console.log(error);
    }
  };

  createBillingInfo = async (params): Promise<any> => {
    const data = params;
      await this.create(
        {
         TableName: process.env.BILLING_INFO_DYNAMODB_TABLE,
          Item: {
          pk: `BILLING#booking_${data.booking_id}`,
          billing_info_id: UUID(),
          environment: {
            environment_id: data.environment.environment_id,
            name: data.environment.name,
            version: data.environment.version,
            type: data.environment.type,
            vendor: data.environment.vendor,
            product: data.environment.product,
            cost: data.environment.cost
          },
          user: {
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
          },
          booking: {
            booking_id: "booking_" + data.booking_id,
            startDate: data.startDate,
            endDate: data.endDate,
          },
          total_cost: 0,
          spent_hours: 0,
          created_at: data.created_at,
        }
        })
    }
  }



