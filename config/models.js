'use strict';

var _ = require("lodash");
var async = require("async");

/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#/documentation/concepts/ORM
 */
module.exports.models = {
    // datastore: process.env.DB_ADAPTER || 'default',
    datastore: 'default',

    migrate: 'alter',
    // migrate: 'safe',

    fetchRecordsOnUpdate: true,
    fetchRecordsOnCreate: true,
    fetchRecordsOnCreateEach: true,

    connection: null,

    attributes: {
        // In Sails 1.0, the `autoCreatedAt` and `autoUpdatedAt` model settings
        // have been removed.  Instead, you choose which attributes (if any) to use as
        // timestamps.  By default, "sails new" will generate these two attributes as numbers,
        // giving you the most flexibility.  But for compatibility with your existing project,
        // we'll define them as strings.
        createdAt: { type: 'string', autoCreatedAt: true, },
        updatedAt: { type: 'string', autoUpdatedAt: true, },
        // In Sails 1.0, the primary key field is no longer created for you, and `autoPK` is
        // not a valid model option.  Instead, you define it yourself and tell Sails which
        // attribute to use as the primary key by setting the `primaryKey` setting on the model.
        // That setting defaults to `id`.
        id: { type: 'number', autoIncrement: true, }
    },

    updateOrCreate: function(instanceModel, criteria, values, cb){
        var self = instanceModel; // reference for use by callbacks
        // If no values were specified, use criteria
        if (!values) values = criteria.where ? criteria.where : criteria;

        self.findOne(criteria).exec(function (err, result) {
            if(err) return cb(err, false);

            if(result){
                self.update(criteria).set(values).exec(cb);
            }else{
                self.create(values).exec(cb);
            }
        });
    },

    /**
     * This method adds records to the database
     *
     * To use add a variable 'seedData' in your model and call the
     * method in the bootstrap.js file
     */
    seed: function (instanceModel, callback) {
        // console.log(`111222`, instanceModel.identity)
        // callback();
        // return;
        var self = instanceModel;
        var modelName = self.identity.charAt(0).toUpperCase() + self.identity.slice(1);
        if (!self.seedData) {
            sails.log.debug('No data available to seed ' + modelName);
            callback();
            return;
        }
        self.count().exec(function (err, count) {

            if(err) {
                sails.log.error("Failed to seed " + modelName, err);
                return callback();
            }

            if(count === 0) {
                sails.log.debug('Seeding ' + modelName + '...');
                if (self.seedData instanceof Array) {
                    self.seedArray(instanceModel, callback);
                } else {
                    self.seedObject(callback);
                }
            }else{
                if(modelName === 'Emailtransport') {
                    // Update records
                    self.updateRecords(instanceModel, callback);
                }else{
                    sails.log.debug(modelName + ' had models, so no seed needed');
                    return callback();
                }
            }
        });
    },

    updateRecords : function (instanceModel, callback) {
        var self = instanceModel;
        var modelName = self.identity.charAt(0).toUpperCase() + self.identity.slice(1);
        self.find({}).exec(function (err, results) {
            if (err) {
                sails.log.debug(err);
                callback();
            } else {



                var data = [];

                self.seedData.forEach(function (seed) {

                    const updateItem = _.find(results, (item) => {
                        return item.name === seed.name;
                    })

                    if(updateItem) data.push(_.merge(seed, updateItem));
                })

                var fns = [];

                data.forEach(function (item) {
                    fns.push(function(cb){
                        self.update({
                            id :item.id
                        },_.omit(item, ["id"])).exec(cb)
                    })
                })

                async.series(fns,function (err,data) {
                    if (err) {
                        sails.log.debug(err);
                        callback();
                    }else{
                        sails.log.debug(modelName + ' seeds updated');
                        callback();
                    }
                })
            }
        });
    },

    seedArray: function (instanceModel, callback) {
        // console.log('seedArray')
        // callback();
        // return;
        var self = instanceModel;
        var modelName = self.identity.charAt(0).toUpperCase() + self.identity.slice(1);
        self.createEach(self.seedData).exec(function (err, results) {
            if (err) {
                sails.log.debug(err);
                callback();
            } else {
                sails.log.debug(modelName + ' seed planted');
                callback();
            }
        });
    },

    seedObject: function (callback) {
        // TODO fix
        console.log('################## seedObject')
        callback();
        return;
        var self = this;
        var modelName = self.adapter.identity.charAt(0).toUpperCase() + self.adapter.identity.slice(1);
        self.create(self.seedData).exec(function (err, results) {
            if (err) {
                sails.log.debug(err);
                callback();
            } else {
                sails.log.debug(modelName + ' seed planted');
                callback();
            }
        });
    },

    dataEncryptionKeys: {
        default: 'BcbYY79CNOXe6t74q5EZ0UMk1x3WmhtmAU1r+K6HNuQ='
    }
};
