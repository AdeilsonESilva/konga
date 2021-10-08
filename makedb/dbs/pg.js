/**
 * Created by user on 06/10/2017.
 */

'use strict'

var pgImport = require("pg");
var dbConf = require("../../config/datastores");
var _ = require("lodash");
var url = require('url');
var pg;

//Parse method copied from https://github.com/brianc/node-postgres
//Copyright (c) 2010-2014 Brian Carlson (brian.m.carlson@gmail.com)
//MIT License

//parses a connection string
function parse(str) {
  //unix socket
  if(str.charAt(0) === '/') {
    var config = str.split(' ');
    return { host: config[0], database: config[1] };
  }

  // url parse expects spaces encoded as %20
  var result = url.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str) ? encodeURI(str).replace(/\%25(\d\d)/g, "%$1") : str, true);
  var config = result.query;
  for (var k in config) {
    if (Array.isArray(config[k])) {
      config[k] = config[k][config[k].length-1];
    }
  }

  config.port = result.port;
  if(result.protocol == 'socket:') {
    config.host = decodeURI(result.pathname);
    config.database = result.query.db;
    config.client_encoding = result.query.encoding;
    return config;
  }
  config.host = result.hostname;

  // result.pathname is not always guaranteed to have a '/' prefix (e.g. relative urls)
  // only strip the slash if it is present.
  var pathname = result.pathname;
  if (pathname && pathname.charAt(0) === '/') {
    pathname = result.pathname.slice(1) || null;
  }
  config.database = pathname && decodeURI(pathname);

  var auth = (result.auth || ':').split(':');
  config.user = auth[0];
  config.password = auth.splice(1).join(':');

  if (config.ssl === 'true' || config.ssl === '1') {
    config.ssl = true;
  }

  return config;
}

module.exports = {
  run : function (next) {

    console.log("Using postgres DB Adapter.");

    var self     = this;
    // var url      = dbConf.datastores.postgres.url;
    // var user     = dbConf.datastores.postgres.user;
    // var password = dbConf.datastores.postgres.password;
    // var dbName   = dbConf.datastores.postgres.database;
    // var dbHost   = dbConf.datastores.postgres.host;
    // var dbPort   = dbConf.datastores.postgres.port;
    // var ssl      = dbConf.datastores.postgres.ssl;

    // var opts = url ? parse(url) : {
    //   user: user,
    //   host: dbHost,
    //   database: dbName,
    //   password: password,
    //   port: dbPort,
    //   ssl,
    // }

      //   adapter: 'sails-postgresql',
      //   url: process.env.DB_URI,
      //   host: process.env.DB_HOST || 'localhost',
      //   user:  process.env.DB_USER || 'postgres',
      //   password: process.env.DB_PASSWORD || 'admin1!',
      //   port: process.env.DB_PORT || 54322,
      //   database: process.env.DB_DATABASE ||'konga_database',
      //   // schema: process.env.DB_PG_SCHEMA ||'public',
      //   poolSize: process.env.DB_POOLSIZE || 10,
      //   ssl: process.env.DB_SSL ? true : false // If set, assume it's true
    
    var opts = {
      user: 'kong',
      host: 'localhost',
      database: 'kong',
      password: 'kong',
      port: 5432,
      ssl: false,
    }

    // console.log("Connection Options =>", opts);

    pg = new pgImport.Client(opts);
    console.log(`opts`, opts)

    pg.connect(function (err, client, done) {
      if (err) {

        if(err.code == "3D000")
        {
          console.log("Database `" + opts.database + "` does not exist. Creating...");
          done();
          return self.create(opts,next);

        }else{
          console.error("Failed to connect to DB",err);
          return next(err);
        }
      }else{
        console.log("Database exists. Continue...");
        return next();
      }

    });
  },


  create : function(opts,next) {

    // Hook up to postgres db so we can create a new one
    var defaultDbOpts = _.merge(_.cloneDeep(opts),{
      database : "postgres"
    });

    pg.connect(defaultDbOpts, function (err, client, done) {
      if (err) {
        console.log(err);
        done();
        return next(err);
      }

      client.query('CREATE DATABASE ' + opts.database, function (err, res) {
        if (err) {
          console.log("Failed to create `" + opts.database +"`",err);
          done();
          return next(err);

        }

        console.log("Database `" + opts.database + "` created! Continue...");

        return next();

      });
    });
  }
}
