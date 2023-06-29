Inside the `src` folder, create a file called `getWeatherItem.ts`.

Open up the `getWeatherItem.ts` file and type in the following code.

```ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";

const region = process.env.Region;
const client = new DynamoDBClient({ region: region });

export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    console.log(event)
    console.log(event.pathParameters.id)
    const weatherId = event.pathParameters.id
    var params = {
            Key:{
                id: {
                    "S": weatherId as string
                },
            },
        TableName: process.env.TABLE_NAME
    };
    try {
        
        const res = await client.send(new GetItemCommand(
            params
        ))
        response = {
            statusCode: 200,
            body: JSON.stringify({
                Body: res.Item,
            }),
        };
    } catch {
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err instanceof Error ? err.message : 'some error happened',
            }),
        };
    }
    return response;
};
```
In the above code, we import `DynamoDBClient` and `GetItemCommand` from `@aws-sdk/client-dynamodb `then use that to access our dynamodb table.

The weather item id is gotten from pathParameters event object and used as a value in getting an item from dynamodb.

`const res = await client.send(new GetItemCommand(
            params
        ))`

We then wrap the method in a `try-catch` block and return a status and a message, based on the result.

## Github Repository

The complete code for this section is in the `get` branch of the project's Github repository [here](https://github.com/EducloudHQ/rest_with_sam_typescript/tree/get)