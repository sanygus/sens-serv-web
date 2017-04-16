window.onload = function() {
  var map = new YMaps.Map(document.getElementById("YMapsID"));
  map.setCenter(new YMaps.GeoPoint(47.243413, 56.134724), 13);
  map.addControl(new YMaps.Zoom());

  var s = new YMaps.Style();
  s.iconStyle = new YMaps.IconStyle();
  s.iconStyle.href = "/static/img/marker2.gif";
  s.iconStyle.size = new YMaps.Point(32, 32);
  s.iconStyle.offset = new YMaps.Point(0, 0);
  var placemark1 = new YMaps.Placemark(new YMaps.GeoPoint(47.252752,56.144475),{style: s});
  placemark1.setBalloonContent("<div>ул. Ярославская, 30</div>");
  map.addOverlay(placemark1); 
  var placemark2 = new YMaps.Placemark(new YMaps.GeoPoint(47.253981,56.121727),{style: s});
  placemark2.setBalloonContent("<div>пр. Ленина, 36</div>");
  map.addOverlay(placemark2); 
}

window.main = function () {
  [].forEach.call(
    document.querySelectorAll('.itemDataTabs span'),
    function (el) {
      el.onclick = function () {
        if (!(el.className.indexOf('active') + 1)) {

          var oldEl = el.parentNode.querySelector('.active');
          var oldTargetName = oldEl.getAttribute('data-ref');
          var newTargetName = el.getAttribute('data-ref');
          var oldTargItem = el.parentNode.parentNode.querySelector('.sunItemBody.' + oldTargetName);
          var newTargItem = el.parentNode.parentNode.querySelector('.sunItemBody.' + newTargetName);

          oldEl.className = oldEl.className.replace(' active', '');
          el.className = el.className + ' active';

          oldTargItem.className = oldTargItem.className.replace(' active', '');
          newTargItem.className = newTargItem.className + ' active';
        }
      }
    }
  );

  window.createChart = function (id, parent, data, params) {
    var node = document.createElement('div');
    node.id = id;
    node.style.width = '400px';
    node.style.height = '100px';
    parent.appendChild(node);

    var myChart = Highcharts.chart(id, {
      chart: {
          type: 'area'
      },
      title: {
          text: ''
      },
      legend: {
          enabled: false
      },
      xAxis: {
          visible: false
      },
      yAxis: {
          visible: false,
          params
      },
      series: [{
          // data: [1, 0, 4, 7],
          data: data
      }]
    });
  };

  var DATA = {};
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "/export?json", true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var exp = JSON.parse(xhr.responseText);

      exp.values.forEach(function (item) {
        if (!(item['iddev'] in DATA)) {
          DATA[item['iddev']] = { temp: [], press: [] }
        }
        if (item.temp && item.temp !== null) {
          DATA[item['iddev']].temp.push(item.temp);
        }
        if (item.press && item.press !== null) {
          DATA[item['iddev']].press.push(item.press);
        }
      });

      var container;
      for (var iddev in DATA) {
        container = document.querySelector('.sunItem#' + iddev + ' .graphItem.temp');
        if (container) {
          createChart(
            iddev + 'TempChart',
            container,
            DATA[iddev].temp.slice(-10),
            {min: -10, max: 32}
          );
        }
        container = document.querySelector('.sunItem#' + iddev + ' .graphItem.press');
        if (container) {
          createChart(
            iddev + 'PressChart',
            container,
            DATA[iddev].press.slice(-10),
            {min: 720, max: 780}
          );
        }
      }

    }
  }
  
};

window.openVideo = function(device) {
  var port = "";
  switch (device) {
    case 'infDev3': port = "23288"; break;
    case 'infDev4': port = "23289"; break;
  }
  document.getElementById('videoContainer').style.display = 'block';
  document.getElementById('video').src = "http://geoworks.pro:" + port + "/stream/video.mjpeg";
};

window.closeVideo = function() {
  document.getElementById('videoContainer').style.display = 'none';
  document.getElementById('video').src = "";
};

window.wakeUpDevice = function(device) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "http://geoworks.pro:1234/watch?action=set&iddev=" + device + "&status=1", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (JSON.parse(xhr.responseText).status === "ok") {
        document.getElementById('wakeUpAction-' + device).children[0].src = "/static/img/wakeup.png";
        document.getElementById('wakeUpAction-' + device).children[0].title = "Пробуждается... подождите минуту";
      } else { console.log('error'); }
    }
  }
  xhr.send();
};

window.lastDateCnt = "";
