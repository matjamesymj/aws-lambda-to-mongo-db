Lambda to MongoDB Proof Of Concept
===================

POC project to demonstrate potential connection methods to MongoDB from LAMBDA functions

The below links were used and code has been taken from various sources for speed.

Useful links:

https://medium.com/hackernoon/building-a-serverless-rest-api-with-node-js-and-mongodb-2e0ed0638f47

https://github.com/adnanrahic/building-a-serverless-rest-api-with-nodejs

https://github.com/joseconstela/mongodb-lambda-proxy

https://www.webiny.com/blog/using-aws-lambda-to-create-a-mongodb-connection-proxy-2bb53c4a0af4

https://medium.com/javascript-in-plain-english/serverless-things-i-wish-i-had-known-part-2-dynamodb-x-mongodb-x-aurora-serverless-1053cfddff36

Setup
------------------------

You will need to point at a mongodb instance and change the config values marked REPLACEME in:

- helpers/mongo-proxy/mongo.js
- variables.env


Building the application
------------------------
npm install

Running the application locally using serverless offline
------------------------

sls offline start --allowCache

The --allowCache simulates a db connection being cached outside of the lambda because we are following the below principles:

1. The connection must be out of the lambda handler. This is the code that will be freezed.
2. You should check if the connection is already open before trying to connect to the DB again.
3. Inside the lambda handler set the “callbackWaitsForEmptyEventLoop” to false.

Detailed: https://medium.com/javascript-in-plain-english/serverless-things-i-wish-i-had-known-part-2-dynamodb-x-mongodb-x-aurora-serverless-1053cfddff36

Deploying the application
------------------------

Log into AWS

Deploy the serverless stack using:
```
sls deploy
```

Add some sample data first
------------------------

Post to http://localhost:3000/dev/notes with the following json
```json
{
    "title": "some title",
    "description": "Amazing mongodb lambda description"
}
```


Load test
------------------------

An example load test can be found at:

LoadTest.jmx

You will need to change the endpoints to point at either the proxy version or normal connection version

Offline Proxy endpoint examples:

http://localhost:3000/dev/notes-proxy
http://localhost:3000/dev/notes-proxy/60151ad1407e16c8e5b0ad10

Offline Normal connection from each lambda examples:

http://localhost:3000/dev/notes
http://localhost:3000/dev/notes/60151ad1407e16c8e5b0ad10


