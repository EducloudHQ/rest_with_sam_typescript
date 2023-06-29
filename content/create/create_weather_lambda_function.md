The next step is to create our lambda function implementation. We want to be able to save weather 
item details to dynamodb.

Change the `hello_world` folder name to `src`. 

Inside the `src` folder, create a file called `createWeather.ts`.

Open up the `createWeather.ts` file and type in the following code.


```typescript
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";

const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });
export const lambdaHandler = async (event: any): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    var weather_id = Math.floor(Math.random() * 1000).toString();
    const weather = JSON.parse(event.body).weather
    const town = JSON.parse(event.body).town
    var weathItem = {
        Item:{
            id:{
                "S": weather_id
            },
            weather: {
                "S":  weather
            },
            town: {
                "S":  town
            }
        },
        TableName: tableName,
        ReturnConsumedCapacity: "TOTAL",
    };
    try {
        const result = await client.send(new PutItemCommand(weathItem))
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
```

There's a lot going on, so let's break it down. 

Firstly, we import a couple of libraries, but the highlight here is 
`import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';`.


The aws-lambda library in TypeScript is a set of tools that make it easier to write and deploy Lambda functions in TypeScript. It provides a number of features, including:

- TypeScript support: The library provides TypeScript types for all of the AWS Lambda APIs, making it easier to write code that is safe and correct.
- Event handling: The library provides a simple way to handle events, such as HTTP requests and DynamoDB events.
- Logging: The library provides a simple way to log messages to CloudWatch Logs.
- Error handling: The library provides a simple way to handle errors and exceptions.
- Deployment: The library provides a simple way to deploy Lambda functions to AWS Lambda.

`APIGatewayProxyEvent` is a type of event that is used to pass information from Amazon API Gateway to a Lambda function. It contains the details of the HTTP request that was received by API Gateway, such as the request method, path, headers, query string parameters, and body.

`APIGatewayProxyResult` is a type of object that is used to return a response from a Lambda function to Amazon API Gateway. It contains properties such as: `statusCode`, `body`, `headers`.

Next, 
 `import { DynamoDBClient, PutItemCommand} from "@aws-sdk/client-dynamodb";`

`@aws-sdk/client-dynamodb` package is a client for the Amazon DynamoDB service that is part of the AWS SDK for JavaScript (v3). It allows you to interact with DynamoDB from JavaScript code running in Node.js. 

Next, we get the `DynamoDBClient` and `PutItemCommand` from aws-sdk/client-dynamodb and initialize `DynamoDBClient` , import the `TABLE_NAME` and `REGION` environment variable we defined in the Global Section of the `template.yaml` file.

```ts 
const tableName = process.env.TABLE_NAME;
const region = process.env.Region;
const client = new DynamoDBClient({ region: region });
```

In order to add or insert a weather item to the database table, our lambda function expects the event body
to contain `weather` and `town` values.

We use the `JSON.parse()` method to get the above values from the event body like so.

```ts

 weather = JSON.parse(event.body).weather
 town = JSON.parse(event.body).town

```
Remember we specified `id` as the primary key for the table. When inserting data 
into the table, we must have an `id` key value pair.

This `id` value must be unique for each item. For this case, generate a random number and assign to the id.

```ts

var weather_id = Math.floor(Math.random() * 1000).toString();
var weathItem = {
        Item:{
            id:{
                "S": weather_id
            },
            weather: {
                "S":  weather
            },
            town: {
                "S":  town
            }
        },
        TableName: tableName,
        ReturnConsumedCapacity: "TOTAL",
    };
```

Finally, inside a `try` `catch` block, we put the item into the table,
using `PutItemCommand` method.

```ts
client.send(new PutItemCommand(weathItem))
```
Then we return messages and appropriate status codes, depending on the success or failure of the 
process.

## Github Repository

The complete code for this section is in the `create` branch of the project's github repository [here](https://github.com/EducloudHQ/rest_with_sam_typescript/tree/create)
