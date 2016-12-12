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
                let tmpId = '';
                if (lastDocs.length === 1) {
                  result = lastDocs.slice()[0];
                  tmpId = result[options.idDevKey];
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
                if ((result.volt !== undefined) && (tmpId.length > 0)) {
                  const chargeConvSettings = options.chargeDevs[tmpId];
                  if (chargeConvSettings !== undefined) {
                    let chrg = -1;
                    if (result.volt === 0) {
                      chrg = -1;
                      log('volt no connected!   ' + tmpId); // WARN
                    } else if (result.volt < chargeConvSettings[0]) {
                      chrg = 0;
                      log('outside charge interval <   ' + result.volt + ' ' + tmpId);
                    } else if (result.volt > chargeConvSettings[1]) {
                      chrg = 1;
                      log('outside charge interval >   ' + result.volt + ' ' + tmpId);
                    } else {
                      chrg = (result.volt - chargeConvSettings[0]) / (chargeConvSettings[1] - chargeConvSettings[0]);
                    }
                    result.volt2 = chrg;
                  }
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
