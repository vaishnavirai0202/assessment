const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB Client
const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

// Queries
const getUserByEmail = async (email) => {
  const params = {
    TableName: 'Users_New',
    Key: { email },
  };
  return dynamoDb.send(new GetCommand(params));
};

const createUser = async (user) => {
  const params = {
    TableName: 'Users_New',
    Item: user,
  };
  return dynamoDb.send(new PutCommand(params));
};

const updateUserPassword = async (email, hashedPassword) => {
  const params = {
    TableName: 'Users_New',
    Key: { email },
    UpdateExpression: 'set password = :password',
    ExpressionAttributeValues: {
      ':password': hashedPassword,
    },
  };
  return dynamoDb.send(new UpdateCommand(params));
};

module.exports = {
  getUserByEmail,
  createUser,
  updateUserPassword,
};
