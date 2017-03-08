function getRenderContent() {
  document.getElementById('loaderimg').style.display = 'block';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "/content", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var cnt = JSON.parse(xhr.responseText);
      document.getElementById('sunPuterContent').innerHTML = ejs.render(template, cnt);
      document.getElementById('loaderimg').style.display = 'none';
      window.main();
      setTimeout(getRenderContent, 20000);
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
