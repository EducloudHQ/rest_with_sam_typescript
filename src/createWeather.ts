import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";


const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });
export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    var blog_id = Math.floor(Math.random() * 1000).toString();
    var weathItem = {
        Item:{
            id:{
                "S": blog_id
            },
            weather: {
                "S":  JSON.parse(event.body).weather as string
            },
            town: {
                "S":  JSON.parse(event.body).town
            }
        },
        TableName: tableName,
        ReturnConsumedCapacity: "TOTAL",
    };
    try {
        const test = await client.send(new PutItemCommand(weathItem))
        // console.log("Hello world",test)
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Weather item created Successfully',
            }),
        };
    } catch (err: unknown) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'An error occured while creating weather.',
            }),
        };
    }
    return response;
};