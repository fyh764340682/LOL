/* 发布订阅设计模式 */
(function () {
  /* 构建事件池 */
  let listeners = {};
  /* 向事件池中注入方法 */
  const on = function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    let arr = listeners[event]
    if (!arr.includes(callback)) arr.push(callback);
  }
  /* 向事件池中移除方法 */
  const off = function off(event, callback) {
    let arr = listeners[event];
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (item === callback) {
        // arr.splice(i, 1,null);//因为产生数组塌陷，让程序出现bug
        arr[i] = null;
        break;
      }
    }
  }
  /* 通知事件池中的方法执行 */
  const emit = function emit(event, ...params) {
    let arr = listeners[event];
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (typeof item === "function") {
        item(...params);
        continue
      }
      arr.splice(i, 1);
      i--;
    }
  }
  /* 暴露API */
  window.$sub = {
    on,
    off,
    emit
  }
})();

/* 添加类名 */
const hover = function hover(val1, val2, attr) {
  let timer = null, timer1 = null;
  val1.onmouseenter = function () {
    timer = setTimeout(function () {
      console.log('进入');
      val2.classList.add(attr)
    }, 700);
  };
  val1.onmouseleave = function () {

    timer1 = setTimeout(() => {
      val2.classList.remove(attr);
      //clearTimeout(timer);
    }, 200);
  }

  val2.onmouseenter = function () {
    clearTimeout(timer1)
  };
  val2.onmouseleave = function () {
    val2.classList.remove(attr);
  }

}
$sub.on("hover", hover);
/* 选项卡 */
const tabs = function tabs(lis, css1,fn) {
  for (let i = 0; i < lis.length; i++) {
    (function (i) {
      lis[i].onmouseenter = function () {
        change(i);
        `${fn}`
      }
    })(i)
    function change() {
      for (var a = 0; a < lis.length; a++) {
        lis[a].className = '';
        // dis[a].className = `${css1}`
      }
      lis[i].className = `${css1}`;
      // dis[i].className = `${css3}`
      
    }
  }
}
$sub.on("tab",tabs)