import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";

// const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });

export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    console.log(event)
    console.log(event.pathParameters.id)
    const weather_id = event.pathParameters.id
    // console.log(event['body'])
    const weather = JSON.parse(event['body']).weather
    const town = JSON.parse(event['body']).town as string
    var params = {
            Key:{
                id: {
                    "S": weather_id as string
                },
            },
            UpdateExpression: "set weather = :weather, town = :town",
            ExpressionAttributeValues: {
                ':weather': {
                    "S": weather as string
                },
                ':town':{
                    "S": town as string
                }
        },
        returnValues: "UPDATED_NEW",
        TableName: process.env.TABLE_NAME
    };
    try {
        
        const test = await client.send(new UpdateItemCommand(
            params
        ))
        // console.log("Hello world",test)
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Weather Successfully updated',
            }),
        };
    } catch (err: unknown) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }
    return response;
};

// lambda function to upate weather item in dynamodb

