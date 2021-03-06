const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  const postId = event?.queryStringParameters?.postId;
  const type = event?.queryStringParameters?.type;

  try {
    const params = {
      TableName: "CrawlingPosts",
      KeyConditionExpression: "#Type = :Type",
      ExpressionAttributeNames: {
        "#Type": "Type",
      },
      ExpressionAttributeValues: {
        ":Type": "tech",
      },
      ScanIndexForward: false,
      Limit: 20,
    };

    if (postId) params.ExclusiveStartKey = { PostId: postId, Type: type };

    body = await dynamo.query(params).promise();
  } catch (error) {
    statusCode = 400;
    body = error.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
