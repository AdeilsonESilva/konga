'use strict';

module.exports.datastores = {
  /**
   * Local disk storage for DEVELOPMENT ONLY
   *
   * Installed by default.
   */
  default: {
    // adapter: 'sails-disk',
    // filePath:  process.env.NODE_ENV == 'test' ? './.tmp/' : ( process.env.STORAGE_PATH || './kongadata/' ),
    // fileName: process.env.NODE_ENV == 'test' ? 'localDiskDb.db' : 'konga.db'
    // adapter: require('sails-postgresql'),
    // url: 'postgresql://kong:kong@localhost:5432/kong',
    adapter: require('sails-postgresql'),
    url: 'postgresql://kong:kong@localhost:5432/kong',
    ssl: false
  },

  /**
   * MySQL is the world's most popular relational database.
   * http://en.wikipedia.org/wiki/MySQL
   *
   * Run:
   * npm install sails-mysql
   */
  // mysql: {
  //   adapter: 'sails-mysql',
  //   url: process.env.DB_URI || null,
  //   host: process.env.DB_HOST || 'localhost',
  //   port: process.env.DB_PORT || 3306,
  //   user: process.env.DB_USER || 'root',
  //   password: process.env.DB_PASSWORD || null,
  //   database: process.env.DB_DATABASE || 'konga_database'
  // },

  /**
   * MongoDB is the leading NoSQL database.
   * http://en.wikipedia.org/wiki/MongoDB
   *
   * Run:
   * npm install sails-mongo
   */
  // mongo: {
  //   adapter: 'sails-mongo',
  //   url: process.env.DB_URI || null,
  //   host: process.env.DB_HOST || 'localhost',
  //   port: process.env.DB_PORT || 27017,
  //   user: process.env.DB_USER ||  null,
  //   password: process.env.DB_PASSWORD ||  null,
  //   database: process.env.DB_DATABASE ||  'konga_database',
  // },

  /**
   * PostgreSQL is another officially supported relational database.
   * http://en.wikipedia.org/wiki/PostgreSQL
   *
   * Run:
   * npm install sails-postgresql
   */
  postgres: {
    adapter: 'sails-postgresql',
    url: process.env.DB_URI,
    host: process.env.DB_HOST || 'localhost',
    user:  process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'admin1!',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_DATABASE ||'konga_database',
    // schema: process.env.DB_PG_SCHEMA ||'public',
    poolSize: process.env.DB_POOLSIZE || 10,
    ssl: process.env.DB_SSL ? true : false // If set, assume it's true
  },

  /**
   * More adapters:
   * https://github.com/balderdashy/sails
   */

  // 'sqlserver': {
  //   adapter: 'sails-sqlserver',
  //   url: process.env.DB_URI || null,
  //   host: process.env.DB_HOST || 'localhost',
  //   user:  process.env.DB_USER || null,
  //   password: process.env.DB_PASSWORD || null,
  //   port: process.env.DB_PORT || 49150,
  //   database: process.env.DB_DATABASE ||'konga_database'
  // },
};