import { MongoClient, Db } from 'mongodb'

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(process.env.MONGODB_DB)
}