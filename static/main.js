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
  var placemark2 = new YMaps.Placemark(new YMaps.GeoPoint(47.264441,56.125351),{style: s});
  placemark2.setBalloonContent("<div>ул. Чапаева, 19</div>");
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

  
  var arena = [];
  var yar = [];
  var splitData = {};
  var DATA = {
    arena: {
      temp: [],
      press: []
    },
    yar: {
      temp: [],
      press: []
    }
  };

  var xhr = new XMLHttpRequest();
  xhr.open('GET', "/export?json", true);
  xhr.send();
   
  xhr.onreadystatechange = processRequest;
   
  function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var exp = JSON.parse(xhr.responseText);

      exp.values.forEach(function (item) {
        if (item.location == 'ул. Ярославская, 30 / 1') {
          yar.push(item);
        } else if (item.location == 'Чебоксары-Арена') {
          arena.push(item);
        }
      });
      splitData.arena = arena.slice(-10);
      splitData.yar = yar.slice(-10);

      splitData.arena.forEach(function (el) {
        if (el.temp && el.temp !== null) DATA.arena.temp.push(el.temp);
        if (el.press && el.press !== null) DATA.arena.press.push(el.press);
      });
      splitData.yar.forEach(function (el) {
        if (el.temp && el.temp !== null) DATA.yar.temp.push(el.temp);
        if (el.press && el.press !== null) DATA.yar.press.push(el.press);
      });

      // console.log(DATA);

      createChart(
        'yarTempChart',
        document.querySelector('.sunItem.yarItem .graphItem.temp'),
        DATA.yar.temp,
        {min: 20, max: 32}
      );
      createChart(
        'yarPressChart',
        document.querySelector('.sunItem.yarItem .graphItem.press'),
        DATA.yar.press,
        {min: 720, max: 780}
      );

      createChart(
        'arenaTempChart',
        document.querySelector('.sunItem.arenaItem .graphItem.temp'),
        DATA.arena.temp,
        {min: 20, max: 32}
      );
      createChart(
        'arenaPressChart',
        document.querySelector('.sunItem.arenaItem .graphItem.press'),
        DATA.arena.press,
        {min: 720, max: 780}
      );

    }
  }
  
};