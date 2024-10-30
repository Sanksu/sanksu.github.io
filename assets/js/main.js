/**
 * 允许多次onload不被覆盖
 */
blog.addLoadEvent = function (func) {
  var oldonload = window.onload
  if (typeof window.onload != 'function') {
    window.onload = func
  } else {
    window.onload = function () {
      oldonload()
      func()
    }
  }
}

/**
 * 兼容的方式添加事件
 */
blog.addEvent = function (elm, evType, fn, useCapture) {
  if (elm.addEventListener) {
      elm.addEventListener(evType, fn, useCapture); //DOM2.0
      return true;
  } else if (elm.attachEvent) {
      var r = elm.attachEvent('on' + evType, fn); //IE5+
      return r;
  } else {
      elm['on' + evType] = fn; //DOM 0
  }
}


/**
 * DOM添加某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.addClass = function (dom, className) {
  if (!blog.hasClass(dom, className)) {
    var c = dom.className || ''
    dom.className = c + ' ' + className
    dom.className = blog.trim(dom.className)
  }
}

/**
 * DOM是否有某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.hasClass = function (dom, className) {
  var list = (dom.className || '').split(/\s+/)
  for (var i = 0; i < list.length; i++) {
    if (list[i] == className) return true
  }
  return false
}

/**
 * DOM删除某个class
 * @param {单个DOM节点} dom
 * @param {class名} className
 */
blog.removeClass = function (dom, className) {
  if (blog.hasClass(dom, className)) {
    var list = (dom.className || '').split(/\s+/)
    var newName = ''
    for (var i = 0; i < list.length; i++) {
      if (list[i] != className) newName = newName + ' ' + list[i]
    }
    dom.className = blog.trim(newName)
  }
}

/**
 * 转义html字符
 */
blog.htmlEscape = function (str) {
  var temp = document.createElement('div')
  temp.innerText = str
  str = temp.innerHTML
  temp = null
  return str
}

/**
 * 兼容ES5的trim方法
 */
blog.trim = function trim(str) {
  //不是字符串就不处理了
  if( typeof str !== 'string' ){
  return str;
  }
  //优先使用内置的trim方法
  if (str.trim) {
    return str.trim();
  }
  //把首尾空白字符替换掉，利用正则表达式的方法，然后返回
  return str.replace(/^\s+|\s+$/g, '');
}


/**
 * 转换实体字符防止XSS
 */
blog.encodeHtml = function (html) {
  var o = document.createElement('div')
  o.innerText = html
  var temp = o.innerHTML
  o = null
  return temp
}

/**
 * 反转义
 */
blog.decodeRegExp = function (str){  
  var temp = "";
  if(str.length == 0) return "";
  temp = str.replace(/&amp;/g,"&");
  temp = temp.replace(/&lt;/g,"<");
  temp = temp.replace(/&gt;/g,">");
  temp = temp.replace(/&nbsp;/g," ");
  temp = temp.replace(/&#39;/g,"\'");
  temp = temp.replace(/&quot;/g,"\"");
  temp = temp.replace(/&amp;/g,"&");
  temp = temp.replace(/&copy;/g,"©");
  // More
  return temp;  
}

/**
 * 转义正则关键字
 */
blog.encodeRegChar = function (str) {
  // \ 必须在第一位
  var arr = ['\\', '.', '^', '$', '*', '+', '?', '{', '}', '[', ']', '|', '(', ')']
  arr.forEach(function (c) {
    var r = new RegExp('\\' + c, 'g')
    str = str.replace(r, '\\' + c)
  })
  return str
}

/**
 * Ajax
 */
blog.ajax = function (option, success, fail) {
  var xmlHttp = null
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest()
  } else {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
  }
  var url = option.url
  var method = (option.method || 'GET').toUpperCase()
  var sync = option.sync === false ? false : true
  var timeout = option.timeout || 10000

  var timer
  var isTimeout = false
  xmlHttp.open(method, url, sync)
  xmlHttp.onreadystatechange = function () {
    if (isTimeout) {
      fail({
        error: '请求超时'
      })
    } else {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          success(xmlHttp.responseText)
        } else {
          fail({
            error: '状态错误',
            code: xmlHttp.status
          })
        }
        //清除未执行的定时函数
        clearTimeout(timer)
      }
    }
  }
  timer = setTimeout(function () {
    isTimeout = true
    fail({
      error: '请求超时'
    })
    xmlHttp.abort()
  }, timeout)
  xmlHttp.send()
}

// 新建DIV包裹TABLE
blog.addLoadEvent(function () {
  // 文章页生效
  if (document.getElementsByClassName('page-post').length == 0) {
    return
  }
  var tables = document.getElementsByTagName('table')
  for (var i = 0; i < tables.length; i++) {
    var table = tables[i]
    var elem = document.createElement('div')
    elem.setAttribute('class', 'table-container')
    table.parentNode.insertBefore(elem, table)
    elem.appendChild(table)
  }
})

// 回到顶部
blog.addLoadEvent(function () {
  var el = document.querySelector('.footer-btn.to-top')
  if (!el) return
  function getScrollTop() {
    if (document.documentElement && document.documentElement.scrollTop) {
      return document.documentElement.scrollTop
    } else if (document.body) {
      return document.body.scrollTop
    }
  }
  function ckeckToShow() {
    if (getScrollTop() > 200) {
      blog.addClass(el, 'show')
    } else {
      blog.removeClass(el, 'show')
    }
  }
  blog.addEvent(window, 'scroll', ckeckToShow)
  blog.addEvent(
    el,
    'click',
    function (event) {
      window.scrollTo(0, 0)
      event.stopPropagation()
    },
    true
  )
  ckeckToShow()
})

// 点击图片全屏预览
blog.addLoadEvent(function () {
  if (!document.querySelector('.page-post')) {
    return
  }
  console.debug('init post img click event')
  let imgMoveOrigin = null
  let restoreLock = false
  let imgArr = document.querySelectorAll('.page-post img')

  let css = [
    '.img-move-bg {',
    '  transition: opacity 300ms ease;',
    '  position: fixed;',
    '  left: 0;',
    '  top: 0;',
    '  right: 0;',
    '  bottom: 0;',
    '  opacity: 0;',
    '  background-color: #000000;',
    '  z-index: 100;',
    '}',
    '.img-move-item {',
    '  transition: all 300ms ease;',
    '  position: fixed;',
    '  opacity: 0;',
    '  cursor: pointer;',
    '  z-index: 101;',
    '}'
  ].join('')
  var styleDOM = document.createElement('style')
  if (styleDOM.styleSheet) {
    styleDOM.styleSheet.cssText = css
  } else {
    styleDOM.appendChild(document.createTextNode(css))
  }
  document.querySelector('head').appendChild(styleDOM)

  window.addEventListener('resize', toCenter)

  for (let i = 0; i < imgArr.length; i++) {
    imgArr[i].addEventListener('click', imgClickEvent, true)
  }

  function prevent(ev) {
    ev.preventDefault()
  }

  function toCenter() {
    if (!imgMoveOrigin) {
      return
    }
    let width = Math.min(imgMoveOrigin.naturalWidth, parseInt(document.documentElement.clientWidth * 0.9))
    let height = (width * imgMoveOrigin.naturalHeight) / imgMoveOrigin.naturalWidth
    if (window.innerHeight * 0.95 < height) {
      height = Math.min(imgMoveOrigin.naturalHeight, parseInt(window.innerHeight * 0.95))
      width = (height * imgMoveOrigin.naturalWidth) / imgMoveOrigin.naturalHeight
    }

    let img = document.querySelector('.img-move-item')
    img.style.left = (document.documentElement.clientWidth - width) / 2 + 'px'
    img.style.top = (window.innerHeight - height) / 2 + 'px'
    img.style.width = width + 'px'
    img.style.height = height + 'px'
  }

  function restore() {
    if (restoreLock == true) {
      return
    }
    restoreLock = true
    let div = document.querySelector('.img-move-bg')
    let img = document.querySelector('.img-move-item')

    div.style.opacity = 0
    img.style.opacity = 0
    img.style.left = imgMoveOrigin.x + 'px'
    img.style.top = imgMoveOrigin.y + 'px'
    img.style.width = imgMoveOrigin.width + 'px'
    img.style.height = imgMoveOrigin.height + 'px'

    setTimeout(function () {
      restoreLock = false
      document.body.removeChild(div)
      document.body.removeChild(img)
      imgMoveOrigin = null
    }, 300)
  }

  function imgClickEvent(event) {
    imgMoveOrigin = event.target

    let div = document.createElement('div')
    div.className = 'img-move-bg'

    let img = document.createElement('img')
    img.className = 'img-move-item'
    img.src = imgMoveOrigin.src
    img.style.left = imgMoveOrigin.x + 'px'
    img.style.top = imgMoveOrigin.y + 'px'
    img.style.width = imgMoveOrigin.width + 'px'
    img.style.height = imgMoveOrigin.height + 'px'

    div.onclick = restore
    div.onmousewheel = restore
    div.ontouchmove = prevent

    img.onclick = restore
    img.onmousewheel = restore
    img.ontouchmove = prevent
    img.ondragstart = prevent

    document.body.appendChild(div)
    document.body.appendChild(img)

    setTimeout(function () {
      div.style.opacity = 0.5
      img.style.opacity = 1
      toCenter()
    }, 0)
  }
})

// 切换夜间模式
blog.addLoadEvent(function () {
  const $el = document.querySelector('.footer-btn.theme-toggler')
  const $icon = $el.querySelector('.svg-icon')

  blog.removeClass($el, 'hide')
  if (blog.darkMode) {
    blog.removeClass($icon, 'icon-theme-light')
    blog.addClass($icon, 'icon-theme-dark')
  }

  function initDarkMode(flag) {
    blog.removeClass($icon, 'icon-theme-light')
    blog.removeClass($icon, 'icon-theme-dark')
    if (flag === 'true') blog.addClass($icon, 'icon-theme-dark')
    else blog.addClass($icon, 'icon-theme-light')

    document.documentElement.setAttribute('transition', '')
    setTimeout(function () {
      document.documentElement.removeAttribute('transition')
    }, 600)

    blog.initDarkMode(flag)
  }

  blog.addEvent($el, 'click', function () {
    const flag = blog.darkMode ? 'false' : 'true'
    localStorage.darkMode = flag
    initDarkMode(flag)
  })

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function (ev) {
      const systemDark = ev.target.matches
      if (systemDark !== blog.darkMode) {
        localStorage.darkMode = '' // 清除用户设置
        initDarkMode(systemDark ? 'true' : 'false')
      }
    })
  }
})

// 标题定位
blog.addLoadEvent(function () {
  if (!document.querySelector('.page-post')) {
    return
  }
  const list = document.querySelectorAll('.post h1, .post h2')
  for (var i = 0; i < list.length; i++) {
    blog.addEvent(list[i], 'click', function (event) {
      const el = event.target
      if (el.scrollIntoView) {
        el.scrollIntoView({ block: 'start' })
      }
      if (el.id && history.replaceState) {
        history.replaceState({}, '', '#' + el.id)
      }
    })
  }
})

// 加载所有文章数据，优先使用localStorage缓存
function loadAllPostData(callback) {
  if (localStorage.db && localStorage.dbVersion == blog.buildAt) {
    document.querySelector('.page-search .icon-loading').style.opacity = 0
    callback ? callback(localStorage.db) : ''
    return
  }

  localStorage.removeItem('dbVersion')
  localStorage.removeItem('db')

  blog.ajax(
    {
      timeout: 20000,
      url: blog.baseurl + '/assets/xml/search.xml?t=' + blog.buildAt
    },
    function (data) {
      document.querySelector('.page-search .icon-loading').style.opacity = 0
      localStorage.db = data
      localStorage.dbVersion = blog.buildAt
      callback ? callback(data) : ''
    },
    function () {
      console.error('全文检索数据加载失败...')
      callback ? callback(null) : ''
    }
  )
}

// 搜索功能
blog.addLoadEvent(function () {
  // 标题等信息
  let titles = []
  // 正文内容
  let contents = []
  // 低版本chrome，输入拼音的过程中也会触发input事件
  let inputLock = false
  // 输入框
  let input = document.getElementById('search-input')

  // 非搜索页面
  if (!input) {
    return
  }

  loadAllPostData(function (data) {
    titles = parseTitle()
    contents = parseContent(data)
    search(input.value)
  })

  function parseTitle() {
    let arr = []
    let doms = document.querySelectorAll('.list-search .title')
    for (let i = 0; i < doms.length; i++) {
      arr.push(doms[i].innerHTML)
    }
    return arr
  }

  function parseContent(data) {
    let arr = []
    let root = document.createElement('div')
    root.innerHTML = data
    let doms = root.querySelectorAll('li')
    for (let i = 0; i < doms.length; i++) {
      arr.push(doms[i].innerHTML)
    }
    return arr
  }

  function search(key) {
    // <>& 替换
    key = blog.trim(key)
    key = key.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')

    let doms = document.querySelectorAll('.list-search li')
    let h1 = '<span class="hint">'
    let h2 = '</span>'
    for (let i = 0; i < doms.length; i++) {
      let title = titles[i]
      let content = contents[i]
      let dom_li = doms[i]
      let dom_title = dom_li.querySelector('.title')
      let dom_content = dom_li.querySelector('.content')

      dom_title.innerHTML = title
      dom_content.innerHTML = ''

      // 空字符隐藏
      if (key == '') {
        dom_li.setAttribute('hidden', true)
        continue
      }
      let hide = true
      let r1 = new RegExp(blog.encodeRegChar(key), 'gi')
      let r2 = new RegExp(blog.encodeRegChar(key), 'i')

      // 标题全局替换
      if (r1.test(title)) {
        hide = false
        dom_title.innerHTML = title.replace(r1, h1 + key + h2)
      }
      // 内容先找到第一个，然后确定100个字符，再对这100个字符做全局替换
      let cResult = r2.exec(content)
      if (cResult) {
        hide = false
        let index = cResult.index
        let leftShifting = 10
        let left = index - leftShifting
        let right = index + (100 - leftShifting)
        if (left < 0) {
          right = right - left
        }
        content = content.substring(left, right)
        dom_content.innerHTML = content.replace(r1, h1 + key + h2) + '...'
      }
      // 内容未命中标题命中，内容直接展示前100个字符
      if (!cResult && !hide && content) {
        dom_content.innerHTML = content.substring(0, 100) + '...'
      }
      if (hide) {
        dom_li.setAttribute('hidden', true)
      } else {
        dom_li.removeAttribute('hidden')
      }
    }
  }

  blog.addEvent(input, 'input', function (event) {
    if (!inputLock) {
      search(event.target.value)
    }
  })

  blog.addEvent(input, 'compositionstart', function (event) {
    inputLock = true
  })

  blog.addEvent(input, 'compositionend', function (event) {
    inputLock = false
    search(event.target.value)
  })
})

/**
 * 特效：点击页面文字冒出特效
 */
function clickEffect() {
  let balls = [];
  let longPressed = false;
  let longPress;
  let multiplier = 0;
  let width, height;
  let origin;
  let normal;
  let ctx;
  const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
  const pointer = document.createElement("span");
  pointer.classList.add("pointer");
  document.body.appendChild(pointer);
 
  if (canvas.getContext && window.addEventListener) {
    ctx = canvas.getContext("2d");
    updateSize();
    window.addEventListener('resize', updateSize, false);
    loop();
    window.addEventListener("mousedown", function(e) {
      pushBalls(randBetween(10, 20), e.clientX, e.clientY);
      document.body.classList.add("is-pressed");
      longPress = setTimeout(function(){
        document.body.classList.add("is-longpress");
        longPressed = true;
      }, 500);
    }, false);
    window.addEventListener("mouseup", function(e) {
      clearInterval(longPress);
      if (longPressed == true) {
        document.body.classList.remove("is-longpress");
        pushBalls(randBetween(25 + Math.ceil(multiplier), 50 + Math.ceil(multiplier)), e.clientX, e.clientY);
        longPressed = false;
      }
      document.body.classList.remove("is-pressed");
    }, false);
    window.addEventListener("mousemove", function(e) {
      let x = e.clientX;
      let y = e.clientY;
      pointer.style.top = y + "px";
      pointer.style.left = x + "px";
    }, false);
  } else {
    console.log("canvas or addEventListener is unsupported!");
  }
 
 
  function updateSize() {
    canvas.width = window.innerWidth * 1;
    canvas.height = window.innerHeight * 1;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(2, 2);
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
    origin = {
      x: width / 5,
      y: height / 5
    };
    normal = {
      x: width / 5,
      y: height / 5
    };
  }
  class Ball {
    constructor(x = origin.x, y = origin.y) {
      this.x = x;
      this.y = y;
      this.angle = Math.PI * 2 * Math.random();
      if (longPressed == true) {
        this.multiplier = randBetween(10 + multiplier, 11 + multiplier);
      } else {
        this.multiplier = randBetween(2, 8);
      }
      this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
      this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
      this.r = randBetween(4, 8) + 2 * Math.random();
      this.color = colours[Math.floor(Math.random() * colours.length)];
    }
    update() {
      this.x += this.vx - normal.x;
      this.y += this.vy - normal.y;
      normal.x = -2 / window.innerWidth * Math.sin(this.angle);
      normal.y = -2 / window.innerHeight * Math.cos(this.angle);
      this.r -= 0.3;
      this.vx *= 0.9;
      this.vy *= 0.9;
    }
  }
 
  function pushBalls(count = 1, x = origin.x, y = origin.y) {
    for (let i = 0; i < count; i++) {
      balls.push(new Ball(x, y));
    }
  }
 
  function randBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
  }
 
  function loop() {
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];
      if (b.r < 0) continue;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
      ctx.fill();
      b.update();
    }
    if (longPressed == true) {
      multiplier += 0.2;
    } else if (!longPressed && multiplier >= 0) {
      multiplier -= 0.4;
    }
    removeBall();
    requestAnimationFrame(loop);
  }
 
  function removeBall() {
    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];
      if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
        balls.splice(i, 1);
      }
    }
  }
}
