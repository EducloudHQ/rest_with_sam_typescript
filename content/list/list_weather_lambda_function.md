Inside the `src` folder, create a file called `getAllWeather.ts`.

Open up the `getAllWeather.ts` file and type in the following code.

```ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    try {
        const res = await client.send(new ScanCommand({
            TableName: tableName
        }))
        response = {
            statusCode: 200,
            body: JSON.stringify(res),
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
```
After importing all required dependencies, the only significant change here is the dynamodb `ScanCommand` method which scans and reads all items from the database table.

Using the `scan` method on really large tables would greatly affect the performance of your application, unless you are using pagination.

For this use case, we only have a couple of items in our table, so no pagination.

`await client.send(new ScanCommand({
            TableName: tableName
        }))`

We then wrap the method in a `try-catch` block and return a status and a message, based on the result.

## Github Repository

The complete code for this section is in the `list` branch of the project's Github repository [here](https://github.com/EducloudHQ/rest_with_sam_typescript/tree/list)

