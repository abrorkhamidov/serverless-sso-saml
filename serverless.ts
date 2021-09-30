import type { AWS } from "@serverless/typescript";
import functions from "./resources/functions";

const serverlessConfiguration: AWS = {
  service: "demolab-back",
  frameworkVersion: "2",
  useDotenv: true,
  custom: {
    variablesResolutionMode: 20210326,
    region: "${opt:region, self:provider.region}",
    stage: "${env:STAGE}",
    main_dynamodb_table: "${env:MAIN_DYNAMODB_TABLE}",
    table_throughputs: {
      dev: 5,
      staging: 5,
    },
    table_throughput:
      "${self:custom.table_throughputs.${self:provider.stage}, self:custom.table_throughputs.staging}",
    "serverless-offline": {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"],
      },
    },
    iam_roles: {
      dev: "arn:aws:iam::341681825452:role/demolab-back-dev-us-east-1-lambdaRole",
      staging: "arn:aws:iam::341681825452:role/demolab-back-staging-lambdaRole"
    },
  },
  plugins: [
    "serverless-bundle",
    "serverless-dynamodb-local",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  package: {
    individually: false,
  },
  provider: {
    name: "aws",
    stage: "${env:STAGE}",
    region: "us-east-1",
    runtime: "nodejs14.x",
    iam: {
      role: "${self:custom.iam_roles.${self:custom.stage}}"
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      binaryMediaTypes: ['multipart/form-data']
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      REGION: "${self:custom.region}",
      STAGE: "${env:STAGE}",
      MAIN_DYNAMODB_TABLE: "${self:custom.main_dynamodb_table}",
    },
    lambdaHashingVersion: "20201221"
  },
  functions
};

module.exports = serverlessConfiguration;
