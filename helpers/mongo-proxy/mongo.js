const MongoClient = require('mongodb').MongoClient

const configHelper = require('./config')
const secretsHelper = require('./secrets')

let cachedDb = null

const buildUrl = opts => {
  let connectionString = opts.connectionString

  if (!connectionString) {
    connectionString = `mongodb+srv://`

    if (opts.username) {
      connectionString += encodeURIComponent(opts.username)
      if (opts.password) connectionString += `:${encodeURIComponent(opts.password)}`
      connectionString += '@'
    }

    connectionString += opts.hostname

    if (opts.database) connectionString += `/${opts.database}`
    if (opts.query) connectionString += `?${opts.query}`
  }

  return connectionString
}

module.exports.buildUrl = buildUrl

const connect = async forceDetails => {
  if (cachedDb) {
    console.log('=> using existing database connection');
    return Promise.resolve(cachedDb)
  }
  console.log('=> using new database connection');
  const config = configHelper.getAll()

  // todo: hard coding these for POC
  // const connectionDetails = forceDetails || await secretsHelper.getSecret(config.secretsList.connectionDetails)
  const connectionDetails =   {
    "username": "REPLACEME",
    "password": "REPLACEME",
    "hostname": "REPLACEME-cluster.lbzfk.mongodb.net",
    "database": "REPLACEME",
    "query": "retryWrites=true&w=majority"
  }

  const url = buildUrl(connectionDetails)
  console.log({url})

  return MongoClient.connect(url, {
      poolSize: config.connection.poolSize,
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(client => {
      cachedDb = client.db(connectionDetails.database)
      return cachedDb
    })
}

module.exports.connect = connect

const query = async (db, opts) => {
  const collection = db.collection(opts.collection)
  let op = await collection[opts.op](opts.query, opts.options)

  if (op === null) return null

  const className = op.constructor.name

  switch(className) {
    case 'Cursor':
    case 'AggregationCursor':
      return op.toArray()
    case 'CommandResult':
      return op.result
    default:
      return op
  }
}

module.exports.query = query
