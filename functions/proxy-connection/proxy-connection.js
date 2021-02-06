require('dotenv').config({ path: './variables.env' });
const { Lambda } = require('aws-sdk')
module.exports.getAllProxy = async (event, context, callback) => {

  const dbQuery = {
    collection: 'notes',
    op: 'find'
  }

  return new Promise((resolve, reject) => {
    var params = {
      FunctionName: 'rest-api-dev-mongo-db-proxy',
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify(dbQuery)
    }
    const lambda = new Lambda({
      region: "eu-west-2",
      endpoint: process.env.IS_OFFLINE ? "http://localhost:3002" : "https://lambda.eu-west-2.amazonaws.com",
    });
    lambda.invoke(params, (err, result) => {
      if (err) return reject(err)
      const response = JSON.parse(result.Payload)
      if (!response.success) return reject({
        reason: response.reason,
        error: response.error
      })
      return resolve({
        statusCode: 200,
        body: JSON.stringify(response.result)
      })
    })
  })

};

module.exports.getOneProxy = async (event, context, callback) => {

  const dbQuery = {
    collection: 'notes',
    op: 'findOne',
    query: {
      Id: 'some title'
    }
  }

  return new Promise((resolve, reject) => {
    var params = {
      FunctionName: 'rest-api-dev-mongo-db-proxy',
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Payload: JSON.stringify(dbQuery)
    }
    const lambda = new Lambda({
      region: "eu-west-2",
      endpoint: process.env.IS_OFFLINE ? "http://localhost:3002" : "https://lambda.eu-west-2.amazonaws.com",
    });
    lambda.invoke(params, (err, result) => {
      if (err) return reject(err)
      const response = JSON.parse(result.Payload)
      if (!response.success) return reject({
        reason: response.reason,
        error: response.error
      })
      return resolve({
        statusCode: 200,
        body: JSON.stringify(response.result)
      })
    })
  })

};