After creating the update weather lambda resource, lets proceed to create it's corresponding lambda function.

Inside the `src` folder, create a file called `updateWeather.ts`.

Open up the `updateWeather.ts` file and type in the following code.


```python
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
        const res = await client.send(new PutItemCommand(params))
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

Next, we get the dynamodb resource from boto3, import the `TABLE_NAME` environment variable we defined in 
the Global Section of the `template.yaml` file and then initialized our table.

```python 
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get("TABLE_NAME")
table = dynamodb.Table(table_name)
```
In order to update a weather item in the database table, we need to pass in a pathParameter called `id`, alongside
the weather attributes we intend on updating.

We use the `json.loads()` method to get the values from the event body and path parameter.

```python

 weather = json.loads(event['body'])['weather']
    town = json.loads(event['body'])['town']
    print(f"event {event}")
    print(f"pathParameters {event['pathParameters']}")
    print(f"weather {weather}")
    print(f"town {town}")
    weather_id = event['pathParameters']['id']

```
We use a couple of print statements for logging.

There are much better ways to log and monitor events in our serverless applications. We'll be looking into those in 
other courses.

Next, we use the `update_item` dynamodb function to update the specific record. 

Bear in mind that this method edits an existing item’s attributes, or adds a new item to the table if it does not already exist.

You can put, delete, or add attribute values. You can also perform a conditional update on an existing item (insert a new attribute name-value pair if it doesn’t exist, or replace an existing name-value pair if it has certain expected attribute values)

You can also return the item’s attribute values in the same UpdateItem operation using the ReturnValues parameter.

We'll pass in a `Key` object which corresponds to the primary key of the item.

We'll set the `UpdateExpression` value to update both the weather and town attributes `"set #weather = :weather, #town = :town"` and 
return all new values by setting `ReturnValues="UPDATED_NEW"`



```python
table.update_item(
            Key={
                'id': weather_id
            },
            UpdateExpression="set #weather = :weather, #town = :town",
            ExpressionAttributeNames={
            "#weather": "weather",
            "#town": "town"
            },
            ExpressionAttributeValues={
             ":weather": weather,
             ":town": town
            },
            ReturnValues="UPDATED_NEW"
            )
```


## Github Repository

The complete code for this section is in the `update` branch of the project's github repository [here](https://github.com/EducloudHQ/rest_with_sam_python/tree/update)