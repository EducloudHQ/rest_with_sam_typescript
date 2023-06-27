import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";

// const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });

export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    console.log(event)
    console.log(event.pathParameters.id)
    const weather_id = event.pathParameters.id
    var params = {
            Key:{
                id: {
                    "S": weather_id as string
                },
            },
        TableName: process.env.TABLE_NAME
    };
    try {
        
        const res = await client.send(new GetItemCommand(
            params
        ))
        // console.log("Hello world",test)
        response = {
            statusCode: 200,
            body: JSON.stringify({
                Body: res.Item,
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

