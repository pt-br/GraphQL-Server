/** 
 * Do not edit this file. 
 * Instead, duplicate it as 'connectionConfig.js' and setup your configs.
*/

const config = {
  database: 'graphql',
  user: 'root',
  password: '1234',
  authSource: 'admin',
}

const url = `mongodb://${config.user}:${config.password}@localhost:27017/${config.database}?ssl=true&replicaSet=storage-shard-0&authSource=${config.authSource}`;

module.exports = url;