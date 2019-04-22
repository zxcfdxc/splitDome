(function () {
    var mouseStopId;
    var mouseOn = false;
    var startX = 0;
    var startY = 0;
	var endX = 0;
	var endY = 0;
    // 获取容器元素
    var selectContainer = document.getElementById('selectContainer');
    selectContainer.onmousedown = function (e) {
      clearEventBubble(e);
      if (e.buttons !== 1 || e.which !== 1) return;
      mouseStopId = setTimeout(function () {
        mouseOn = true;
        // 调整坐标原点为容器左上角
        startX = e.clientX - selectContainer.offsetLeft + selectContainer.scrollLeft;
        startY = e.clientY - selectContainer.offsetTop + selectContainer.scrollTop;
        var selDiv = document.createElement('div');
        selDiv.style.cssText = 'position:absolute;width:0;height:0;margin:0;padding:0;border:1px dashed #eee;background-color:#aaa;z-index:1000;opacity:0.6;display:none;';
        selDiv.id = 'selectDiv';
        // 添加框选元素到容器内
        document.getElementById('selectContainer').appendChild(selDiv);
        selDiv.style.left = startX + 'px';
        selDiv.style.top = startY + 'px';
      }, 20);
      document.onmousemove = function (e) {
        if (!mouseOn) return;
        clearEventBubble(e);
        var selectContainer = document.getElementById('selectContainer');
        var _x = e.clientX - selectContainer.offsetLeft + selectContainer.scrollLeft;
        var _y = e.clientY - selectContainer.offsetTop + selectContainer.scrollTop;
        var _H = selectContainer.offsetWidth
        // 鼠标移动超出容器内部，进行相应的处理
        // 向右拖拽
        if (e.clientX > selectContainer.offsetLeft + selectContainer.offsetWidth) {
          let maxLeft = selectContainer.scrollWidth - selectContainer.offsetWidth
          let step = selectContainer.scrollLeft + 20
          if (step >= maxLeft) {
            selectContainer.scrollLeft = maxLeft
          } else {
            selectContainer.scrollLeft = step
          }
        }
        // 向左拖拽
        if (e.clientX < selectContainer.offsetLeft) {
          let minLeft = 0
          let step = selectContainer.scrollLeft - 20
          if (step <= minLeft) {
            selectContainer.scrollLeft = minLeft
          } else {
            selectContainer.scrollLeft = step
          }
        }
        var selDiv = document.getElementById('selectDiv');
        selDiv.style.display = 'block';
        selDiv.style.left = Math.min(_x, startX) + 'px';
        selDiv.style.top = Math.min(_y, startY) + 'px';
        if ((Math.min(_x, startX) + Math.abs(_x - startX)) <= selectContainer.scrollWidth) {
          selDiv.style.width = Math.abs(_x - startX) + 'px';
        }
        selDiv.style.height = Math.abs(_y - startY) + 'px';
      };
      document.onmouseup = function (e) {
        if (!mouseOn) return;
        clearEventBubble(e);
        var selDiv = document.getElementById('selectDiv');
        var fileDivs = document.getElementsByClassName('fileDiv');
        var selectedEls = [];
        var l = selDiv.offsetLeft;
        var t = selDiv.offsetTop;
        var w = selDiv.offsetWidth;
        var h = selDiv.offsetHeight;
		  // 调整坐标原点为容器左上角
		endX = e.clientX - selectContainer.offsetLeft + selectContainer.scrollLeft;
		endY = e.clientY - selectContainer.offsetTop + selectContainer.scrollTop;
        for (var i = 0; i < fileDivs.length; i++) {
          var sl = fileDivs[i].offsetWidth + fileDivs[i].offsetLeft;
          var st = fileDivs[i].offsetHeight + fileDivs[i].offsetTop;
          if (sl < l + w && st < t + h && fileDivs[i].offsetLeft > l && fileDivs[i].offsetTop > t ) {
            fileDivs[i].style.background = 'red'
            selectedEls.push(fileDivs[i]);
          }else{
			  fileDivs[i].style.background = 'green'
		  }
        }
        console.log(selectedEls);
		layer.tips('起点：'+startX+','+startY+';终点'+endX+','+endY, '吸附元素选择器', {
  tips: [1, '#3595CC'],
  time: 4000
});
        // selDiv.style.display = 'none';
        mouseOn = false;
      };
    }
    function clearEventBubble (e) {
      if (e.stopPropagation) e.stopPropagation();
      else e.cancelBubble = true;

      if (e.preventDefault) e.preventDefault();
      else e.returnValue = false;
    }
  })();