After creating the update weather lambda resource, lets proceed to create it's corresponding lambda function.

Inside the `src` folder, create a file called `updateWeather.ts`.

Open up the `updateWeather.ts` file and type in the following code.


```ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";

const region = process.env.Region;
const tableName = process.env.TABLE_NAME
const client = new DynamoDBClient({ region: region });

export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    console.log(event)
    console.log(event.pathParameters.id)
    const weather_id = event.pathParameters.id
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
        TableName: tableName
    };
    try {
        
        const res = await client.send(new UpdateItemCommand(
            params
        )) 
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
```
Let's break down everything that's happening in the above code.

Firstly, we import a `APIGatewayProxyEvent `  and `APIGatewayProxyResult` from `aws-lambda`, which allows us to access api gateway resources such: `headers`, `body` `pathParameters`. 

We'll be using `@aws-sdk/client-dynamodb` to access all aws dynamodb commands.

`import { DynamoDBClient, UpdateItemCommand} from "@aws-sdk/client-dynamodb";`

Next, import the `TABLE_NAME` and `REGION` environment variable we defined in 
the Global Section of the `template.yaml` file and then initialized our table.

```ts 
const region = process.env.Region;
const tableName = process.env.TABLE_NAME

const client = new DynamoDBClient({ region: region });
```
In order to update a weather item in the database table, we need to pass in a pathParameter called `id`, alongside
the weather attributes we intend on updating.

We use the `JSON.parse()` method to get the values from the event body and path parameter.

```ts

const weather_id = event.pathParameters.id
const weather = JSON.parse(event['body']).weather
const town = JSON.parse(event['body']).town as string
console.log("event", event)
```
We use a couple of `console.log` statements for logging.

There are much better ways to log and monitor events in our serverless applications. We'll be looking into those in 
other courses.

Next, we use the `UpdateItemCommand` dynamodb function to update the specific record. 

Bear in mind that this method edits an existing item’s attributes, or adds a new item to the table if it does not already exist.

You can put, delete, or add attribute values. You can also perform a conditional update on an existing item (insert a new attribute name-value pair if it doesn’t exist, or replace an existing name-value pair if it has certain expected attribute values)

You can also return the item’s attribute values in the same UpdateItemCommand operation using the ReturnValues parameter.

We'll pass in a `Key` object which corresponds to the primary key of the item.

We'll set the `UpdateExpression` value to update both the weather and town attributes `"set #weather = :weather, #town = :town"` and return all new values by setting `ReturnValues="UPDATED_NEW"`



```python
var item = {
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
        TableName: tableName
    };
await client.send(new UpdateItemCommand(item)) 
```


## Github Repository

The complete code for this section is in the `update` branch of the project's github repository [here](https://github.com/EducloudHQ/rest_with_sam_typescript/tree/update)