function itemizer (obj) {
  console.log(obj);
  var itemRoot = obj.parentNode.parentNode;
  if (itemRoot.className == 'sunItem') {
    itemRoot.className = 'sunItem opened';
    obj.innerHTML = 'Скрыть';
  } else {
    itemRoot.className = 'sunItem';
    obj.innerHTML = 'Подробнее';
  }
}
