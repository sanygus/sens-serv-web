const MongoClient = require('mongodb').MongoClient;
const map = require('async/map');
const fs = require('fs');
const options = require('./options');
const log = require('./log');

const dbCollectSensors = 'sensors';
const dbCollectDevices = 'devs';
let dataBase;

MongoClient.connect(options.mongoDBUrl, (err, db) => {
  if (err) {
    log(err);
  } else {
    dataBase = db;
    console.log('connect to DB success');
  }
  //db.close();
});

module.exports.getLastValues = (callback) => {
  getAllDevices((err, devs) => {
    if (err) { callback(err); } else {
      map(
        devs,
        (devObj, callback) => {
          const search = {};
          search[options.idDevKey] = devObj[options.idDevKey];
          dataBase.collection(dbCollectSensors).find(
            search,
            { '_id': false },
            {
              'limit': 1,
              'sort': [['date', 'desc']]
            }
          ).toArray((err, lastDocs) => {
            if (err) { callback(err); } else {
              if (lastDocs.length <=1) {
                let result = {};
                if (lastDocs.length === 1) {
                  result = lastDocs.slice()[0];
                  delete result[options.idDevKey];
                }
                result.location = devObj.location;
                result.online = false;
                if ((result.date !== undefined) && ((Date.now() - Date.parse(result.date)) <= options.meteringInterval)) {
                  result.online = true;
                }
                if (result.online) {
                  result.next = (new Date(Date.parse(result.date) + options.meteringInterval)).toISOString();
                }
                fs.access(`static/photos/${devObj[options.idDevKey]}.jpg`, fs.constants.R_OK, (err) => {
                  if (!err) {
                    result.imgURL = `/static/photos/${devObj[options.idDevKey]}.jpg`;
                  }
                  callback(null, result);
                })
              } else {
                callback(new Error('more 1 records on limit'));
              }
            }
          });
        },
        (err, lastObjs) => {
          if (err) { callback(err); } else {
            callback(null, lastObjs);
          }
        }
      );
    }
  });
}

const getAllDevices = (callback) => {
  dataBase.collection(dbCollectDevices).find({}).toArray(callback);
}

module.exports.exportAll = (callback) => {
  getAllDevices((errGet, devs) => {
    dataBase.collection(dbCollectSensors).find(
      {},
      { '_id': false },
      {
        'limit': 10,
        'sort': 'date'
      }
    ).toArray((errArr, values) => {
      const newValues = values.map((value) => {
        devs.forEach((dev) => {
          if (value[options.idDevKey] === dev[options.idDevKey]) {
            value.location = dev.location;
          }
        });
        delete value[options.idDevKey];
        return value;
      });
      callback(errGet || errArr, newValues);
    });
  });
}

module.exports.getAllDevices = getAllDevices;
