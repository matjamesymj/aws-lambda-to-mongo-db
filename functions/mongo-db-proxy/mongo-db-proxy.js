'use strict'
const mongoHelper = require('../../helpers/mongo-proxy/mongo')

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  return mongoHelper.connect()
    .then(db => mongoHelper.query(db, event))
    .then(r => {
      return { success: true, result: r }
    })
    .catch(err => {
      return { success: false, reason: err.message, error: err }
    })
}

module.exports.mongodbproxy = handler
