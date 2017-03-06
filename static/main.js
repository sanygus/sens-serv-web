window.onload = function () {

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

  var createChart = function (id, parent, data, params) {
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
   
  xhr.onreadystatechange = processRequest;
   
  function processRequest(e) {
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

      for (var iddev in DATA) {
        createChart(
          iddev + 'TempChart',
          document.querySelector('.sunItem#' + iddev + ' .graphItem.temp'),
          DATA[iddev].temp.slice(-10),
          {min: -10, max: 32}
        );
        createChart(
          iddev + 'PressChart',
          document.querySelector('.sunItem#' + iddev + ' .graphItem.press'),
          DATA[iddev].press.slice(-10),
          {min: 720, max: 780}
        );
      }

    }
  }
  
};