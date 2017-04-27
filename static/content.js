function getRenderContent() {
  document.getElementById('loaderimg').style.display = 'block';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "/content?" + Math.random(), true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var cnt = JSON.parse(xhr.responseText);
      var lastDate = lastDateInData(cnt.values);
      if (lastDate != window.lastDateCnt) {
        document.getElementById('sunPuterContent').innerHTML = ejs.render(template, cnt);
        window.main();
        window.lastDateCnt = lastDate;
      }
      document.getElementById('loaderimg').style.display = 'none';
      setTimeout(getRenderContent, 10000);
    }
  }
  xhr.send();
}

var template = "";
var xhrtempl = new XMLHttpRequest();
xhrtempl.open('GET', "/static/template.ejs", true);
xhrtempl.onreadystatechange = function() {
  if (xhrtempl.readyState == 4 && xhrtempl.status == 200) {
    template = xhrtempl.responseText;
    getRenderContent();
  }
}
xhrtempl.send();

function lastDateInData(arr) {
  var lastDate = "";
  arr.forEach(function (v) {
    if (v.status.date > lastDate) { lastDate = v.status.date; }
    if (v.sensors.date > lastDate) { lastDate = v.sensors.date; }
  });
  return lastDate;
}
