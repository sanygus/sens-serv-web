module.exports = (obj) => {
  if (obj) {
    const prefix = (new Date).toISOString() + '    ';
    let out = '';
    if (typeof obj === 'string') {
      out = obj.slice();
    } else if (typeof obj === 'object') {
      if (obj instanceof Error) {
        out = 'Error: ' + obj.message;
      } else {
        out = JSON.stringify(obj);
      }
    }
    console.log(prefix + out);
  }
}
