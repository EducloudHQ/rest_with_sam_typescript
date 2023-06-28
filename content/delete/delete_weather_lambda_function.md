Inside the `src` folder, create a file called `deleteWeather.ts`.

Open up the `deleteWeather.ts` file and type in the following code.

```python
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });

export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    const weatherId = event.pathParameters.id as string
    try {
        const result = await client.send(new DeleteItemCommand({
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
                    body: JSON.stringify(result)
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
```
Next, we get the `DynamoDBClient` and `PutItemCommand` from aws-sdk/client-dynamodb and initialize `DynamoDBClient` , import the `TABLE_NAME` and `REGION` environment variable we defined in the Global Section of the `template.yaml` file.

The weather item id is gotten from pathParameters event object and used as a value in 
deleting an item from dynamodb.

```ts
const result = await client.send(new DeleteItemCommand(
    {
        TableName: tableName,
        Key:{
            id:{
                "S":weatherId
            }
        }
    })
)
```

We then wrap the method in a `try-except` block and return a status and a message, based on the result.


## Github Repository

The complete code for this section is in the `delete` branch of the project's Github repository [here](https://github.com/EducloudHQ/rest_with_sam_typescript/tree/delete)