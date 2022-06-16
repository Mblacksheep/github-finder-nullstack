import Nullstack from 'nullstack';
import Application from './src/Application';
import { MongoClient } from 'mongodb';

const context = Nullstack.start(Application);

context.start = async function start() {
  const { secrets } = context;
  const databaseClient = new MongoClient(secrets.mongodbUri);
  await databaseClient.connect();
  context.database = await databaseClient.db(secrets.databaseName);
}

export default context;