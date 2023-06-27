import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });

export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    const weatherId = event.pathParameters.id as string
    // const weatherId = JSON.parse(event.pathParameters)
    // console.log(weatherId)
    try {
        const test = await client.send(new DeleteItemCommand({
            TableName: tableName,
            Key:{
                id:{"S":weatherId}
            }
        }))
        response = {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: 'Weather Item deleted successfully',
                    body: JSON.stringify(test)
                }
            ),
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