export default {
  DynamoDBTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Retain",
    Properties: {
      TableName: "${self:provider.environment.MAIN_DYNAMODB_TABLE}",
      AttributeDefinitions: [{ AttributeName: "pk", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "pk", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.table_throughput}",
        WriteCapacityUnits: "${self:custom.table_throughput}",
      },
    },
  },
};
