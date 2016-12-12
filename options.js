module.exports = {
  mongoDBUrl: 'mongodb://localhost:27017/sens-serv',
  httpPort: 80,
  idDevKey: 'iddev',
  meteringInterval: 10 * 60000,
  chargeDevs: {
    'infDev1': [856, 1023],
    'infDev2': [856, 1023],
    'infDev3': [856, 1023],
  }
}
