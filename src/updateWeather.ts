import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });

export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    console.log(event)
    console.log(event.pathParameters.id)
    const weather_id = event.pathParameters.id
    // console.log(event['body'])
    var params = {
        "Item":{
            id:{
                "S": weather_id
            },
            weather: {
                "S":  JSON.parse(event.body).weather
            },
            town: {
                "S":  JSON.parse(event.body).town
            }
        },
        TableName: tableName,
        ReturnConsumedCapacity: "TOTAL",
    };
    try {
        const test = await client.send(new PutItemCommand(params))
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