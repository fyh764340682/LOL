/*===================顶部导航及封面图=================*/
const topNav = (function () {
  let navData = null, navListData = null;
  let uls = document.querySelector(".head-nav"),
    ulsHover = document.querySelector(".head-nav-sub");//子导航下拉框
  let navLis = document.querySelectorAll(".head-nav-sub-inner li");//导航栏
  let phoneHover = document.querySelector(".head-app-hover");//小手机二维码
  let phone = document.querySelector(".head-app");//小手机
  let headUser = document.querySelector(".head-user"),//用户
    headUserHover = document.querySelector(".head-user-hover");//用户下拉
  /* 获取导航数据 */
  const getNavData = function getNavData() {
    $.ajax({
      type: "get",
      url: "json/nav.json",
      data: null,
      async: false,
      success: function (data) {
        navData = data
      }
    });
  }
  const render = function render() {
    navData.forEach(item => {
      let { link, title1, title2 } = item;
      let str = `<li>
      <a href="${link}" target=_blank>
        <span class="head-nav-title">${title1}</span>
        <span class="head-nav-subtitle">${title2}</span>
      </a>
    </li>`
      uls.innerHTML += str
    })
  }

  $sub.emit("hover", phone, phoneHover, "show");
  $sub.emit("hover", headUser, headUserHover, "show");

  /* 渲染子导航数据 */
  const getNavList = function getNavList() {
    $.ajax({
      type: "GET",
      url: "json/nav-sub.json",
      data: null,
      async: false,
      success: function (data) {
        navListData = data;
      }
    })
  }
  const renderList = function renderList() {
    let groups = [], i;
    for (i = 0; i < navListData.length; i += 5) {
      groups = navListData.slice(i, i + 5);
      groups.forEach((item, index) => {
        let { link, classname, title } = item
        let str = `<a href="${link}" target="_blank">
      <i class="${classname}"></i>
      ${title}
    </a>`
        navLis[index].innerHTML += str
      })

    }


  }
  $sub.emit("hover", uls, ulsHover, "show");
  /* 放大镜点击 */
  const searchOnclick = function searchOnclick() {
    let search = document.querySelector(".search-onclick"),
      btnOpen = document.querySelector(".head-search-btn"),
      btnClose = search.querySelector(".btn-close-search");
    btnOpen.onclick = function () {
      search.classList.add("show");
    };
    btnClose.onclick = function () {
      search.classList.remove("show");
    };
  }
  return {
    init() {
      getNavData();
      render();
      getNavList();
      renderList();
      searchOnclick();
    }
  }
})();
topNav.init();
/*==================下边内容部分==============*/
/* ----------------part1--------------------- */
const part1 = (function () {
  let timer = null;
  /*----------------轮播图-------------------*/
  const Carousel = function Carousel() {
    let CarList = document.querySelector(".car-list"),
      titleList = document.querySelector(".car-title-list");//渲染数据
    let lis = null, pags = null;
    /* 获取数据 */
    const getCardata = function getCardata() {
      return new Promise(resolve => {
        $.ajax({
          type: "get",
          url: "json/car-List.json",
          data: null,
          success: function (data) {
            setTimeout(function () {
              resolve(data)
            }, 1500);
          }

        });

      })
    }
    //渲染数据
    const carRender = function carRender(value) {
      let Cstr = "", Tstr = "";
      value["car-list"].forEach(item => {
        let { link, url } = item;
        Cstr += `<li class="car-item">
    <a href="${link}" target="_blank">
      <img src="${url}">
    </a>
  </li>`

      })
      CarList.innerHTML = Cstr;
      value["title-list"].forEach(item => {
        let { title } = item;
        Tstr += `<span class="title">${title}</span>`;
      })
      titleList.innerHTML = Tstr;
      lis = Array.from(document.querySelectorAll(".car-list .car-item"));
      pags = titleList.querySelectorAll("span");
    };
    //实现功能
    let step = 0,
      speed = 300,
      interval = 3000,
      autoTimer = null,
      count = null,
      w = CarList.offsetWidth;

    const autoFocus = function autoFocus() {
      let temp = step;
      if (temp >= count - 1) {
        temp = 0;
      };
      pags.forEach((pag, index) => {
        if (temp === index) {
          pag.classList.add("active");
          return;
        }
        pag.classList.remove("active");
      })
    }
    const swiperInit = function swiperInit() {
      count = lis.length;
      //克隆第一张
      let clone = lis[0].cloneNode(true);
      CarList.appendChild(clone);
      count++;
      lis.push(clone);
      CarList.style.width = `${w * count}px`;
      //控制默认选中
      if (step < 0) step = 0;
      if (step > count - 1) step = count - 1;
      CarList.style.left = `${-step * w}px`
      CarList.style.transitionDuration = "0ms";
      autoFocus();
    }

    const moveToNext = function moveToNext() {
      step++
      if (step > count - 1) {
        CarList.style.transitionDuration = '0ms';
        CarList.style.left = '0px';
        step = 1;
        CarList.offsetWidth;
      }
      CarList.style.transitionDuration = `${speed}ms`;
      CarList.style.left = `${-step * w}px`;
      autoFocus();
    }
    if (autoTimer === null) {
      autoTimer = setInterval(moveToNext, interval)
    }
    document.onvisibilitychange = function () {
      if (document.hidden) {
        clearInterval(autoTimer);
        autoTimer = null;
        return;
      }
      if (autoTimer === null) {
        autoTimer = setInterval(moveToNext, interval)
      }
    }
    const pagsalignment = function () {
      pags.forEach((pag, index) => {
        pag.onmouseenter = function () {
          if (step === index) return;
          step = index;
          CarList.style.transitionDuration = `${speed}ms`;
          CarList.style.left = `${-step * w}px`;
          autoFocus();
        }
      })
    }
    return getCardata().then(value => {
      carRender(value);
      swiperInit();
      pagsalignment();
    })
  }

  /*-----------------新闻选项卡---------------------*/
  const newTab = function newTab() {
    let newsTitleBox = document.querySelector(".part-tab-title"),
      newstitle = newsTitleBox.querySelectorAll("li"),
      newsContentBox = document.querySelector(".news-content-box");
    /* 获取数据 */
    const getNewsData = function getNewsData() {
      return new Promise(resolve => {
        $.ajax({
          type: "get",
          url: "json/news.json",
          data: null,
          success: function (data) {
            resolve(data);
          }
        });

      })
    }
    /* 渲染数据 */
    const newsRender = function newsRender(data) {
      let str = '';
      newstitle.forEach((item, index) => {
        if (item.className) {
          data[index].forEach(item => {
            let { first, link1, type, typename, title, link2, time } = item;
            str += `${first ? `<li class="first">
          <a href="${link1}" target="_blank">${first}</a>
        </li>`: ``}
          <li class="newsitem ${type}">
            <span class="item-type">${typename}</span>
            <a href="${link2}" target="_blank" class="item-a">
            ${title}
            </a>
            <span class="item-time">${time}</span>
          </li>`
          })
          newsContentBox.innerHTML = str;
        };
      });
    }
    /* 实现功能 */
    const newsHandle = function newsHandle(data) {
      for (let i = 0; i < newstitle.length; i++) {
        (function (i) {
          newstitle[i].onmouseenter = function () {
            change(i);
            newsRender(data);
          };

        })(i)
        function change(i) {
          for (var a = 0; a < newstitle.length; a++) {
            newstitle[a].className = "";
          }
          newstitle[i].className = "selected";
        }
      }

    }
    return getNewsData().then(value => {
      newsRender(value);
      newsHandle(value);
    });
  }

  /* ---------------热门活动----------------*/
  const hotEvents = function hotEvents() {
    let act = document.querySelector(".act"),
      actList = act.querySelectorAll(".part-tab-title li"),
      actContent = act.querySelector(".act-content ul");
    /* 获取数据 */
    const getActData = function getActData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/act.json",
          data: null,
          success: function (data) {
            resolve(data)
          }
        })
      })
    }
    /* 渲染数据 */
    const actRender = function actRender(data) {
      let str = '';
      actList.forEach((item, index) => {
        if (item.className) {
          data[index].forEach(item => {
            let { url, title, overtime, title2, time, link } = item;
            str += `<li class="act-item">
          <img src="${url}">
          <p>${title}</p>
          <a class="overtime">${overtime}</a>
          <div class="hover_border">
            <i class="hover-border"></i>
            <div class="hover_border_inner">
              <h4 class="p1">${title}</h4>
              <p class="p2">${title2}</p>
              <p class="p2">${time}</p>
            </div>
          </div>
          <a href="${link}" class="mask" target="_blank" title="${title}"></a>
        </li>`
          })
          actContent.innerHTML = str;
        }
      })
    }
    /* 实现功能 */
    const actHandle = function actHandle(data) {
      for (let i = 0; i < actList.length; i++) {
        (function () {
          actList[i].onmouseenter = function () {
            change(i);
            actRender(data);
          };
        })();
      };
      const change = function change(i) {
        for (let a = 0; a < actList.length; a++) {
          actList[a].className = "";
        }
        actList[i].className = "selected";
      };
    };
    return getActData().then(value => {
      actRender(value);
      actHandle(value);
    })
  };
  /* ---------------新英雄皮肤----------------*/
  const newHeroSkin = function newHeroSkin() {
    let newHS = document.querySelector(".new-hero_skin"),
      newH = newHS.querySelector(".new-hero"),
      newS = newHS.querySelector(".new-skin"),
      moreSkin = document.querySelector(".more-skin");
    const getHeroSkinData = function getHeroSkinData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/newheroskin.json",
          data: null,
          success: function (data) {
            resolve(data)
          }
        })
      })
    }
    /* 渲染数据 */
    const heroSkinRender = function heroSkinRender(data) {
      let Hstr = '', Sstr = '';
      Hstr = `<img src="${data[0].url}" alt="">
    <i class="pic-mark"></i>
    <a class="subtitle">英雄更新</a>
    <p class="hero_skin-name">${data[0].name}</p>
    <p class="hero_skin-title">${data[0].title}</p>
    <!-- hover -->
    <div class="hero-inner-hover">
      <i class="border"></i>
      <p class="p1">${data[0].title}</p>
      <a href="${data[0].link}" class="inner-hover-a" target="_blank">
        查看详情
        <i class="more-arrow-2"></i>
      </a>
    </div>`

      Sstr = `<img src="${data[1].url}" alt="">
    <i class="pic-mark"></i>
    <a class="subtitle">新皮肤</a>
    <p class="hero_skin-name">${data[1].name}</p>
    <p class="hero_skin-title">${data[1].title}</p>
    <!-- hover -->
    <div class="skin-inner-hover">
    <video loop controls muted>
    <source src="img/底部内容/part1/英雄皮肤更新/【英雄联盟】毒菇梦魇 - 安妮、厄加特、巨魔、德莱文、泰坦、烈娜塔 新皮肤预览 - 1.惊魂之夜 安妮(Av857809477,P1).mp4" type="video/mp4">
  </video>
      <p class="p1">${data[1].name}</p>
      <p class="p2">${data[1].title}</p>
      <a href="${data[1].link}" class="inner-hover-a" target="_blank">
        查看详情
      </a>
    </div>`
      newH.innerHTML = Hstr;
      newS.innerHTML = Sstr;
      Svideo = newS.querySelector("video")
    }
    /* 实现功能 */
    const heroSkinHandle = function heroSkinHandle() {
      /* 划入划出 */
      newS.onmouseenter = function () {
        newS.classList.add("show");
        moreSkin.classList.add("show");
        Svideo.play();
      };
      newS.onmouseleave = function () {
        timer = setTimeout(() => {
          newS.classList.remove("show");
          moreSkin.classList.remove("show");
        }, 100);
        Svideo.pause();
      };
      /* 懒加载 */
      let ob = new IntersectionObserver(changes => {
        if (changes[0].isIntersecting) {
          newHS.classList.add("appear")
        }
      }, {
        threshold: [0.7]
      })
      ob.observe(newHS)
    }

    return getHeroSkinData().then(value => {
      heroSkinRender(value);
      heroSkinHandle();
    })
  }
  /* ---------------版本导航----------------*/
  const versionNav = function versionNav() {
    let versionNav = document.querySelector(".version-nav"),
      video, newVersion;
    const getversionNavData = function getversionNavData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/versionNav.json",
          data: null,
          success: function (data) {
            resolve(data)
          }
        })
      })
    }
    const versionNavRender = function versionNavRender(data) {
      let { url1, p1, p11, link1, a1, url2, p2, p22, link2, url3, link3, title3, title4 } = data[0];
      let str = `<!-- part1 -->
      <div class="new-version">
        <img src="${url1}">
        <div class="innerhover">
        <video  loop controls muted>
        <source src="img/底部内容/part1/英雄皮肤更新/【英雄联盟】毒菇梦魇 - 安妮、厄加特、巨魔、德莱文、泰坦、烈娜塔 新皮肤预览 - 1.惊魂之夜 安妮(Av857809477,P1).mp4" type="video/mp4">
      </video>
          <p class="p1">${p1}</p>
          <p class="p2">${p11}</p>
          <a href="${link1}" target="_blank">${a1}</a>
        </div>
      </div>
      <!-- part2 -->
      <div class="club-developer">
        <img src="${url2}">
        <div class="innerhover-border">
          <i class="hover-border-2"></i>
          <div class="innerhover-border-inner">
            <h4 class="p1">${p2}</h4>
            <p class="p2">${p22}</p>
          </div>
        </div>
        <a href="${link2}" title="${p2}" target="_blank"></a>
      </div>
      <!-- part3 -->
      <div class="new-model">
        <img src="${url3}">
        <a href="${link3}" title="${title3}" target="_blank"></a>
      </div>
      <!-- part4 -->
      <div class="week-free">
        <a href="javascript:;" class="week-free-a">
          <i class="inline-icon-left"></i>
          ${title4}
          <i class="more-arrow-1"></i>
          <i class="inline-icon-right"></i>
        </a>
      </div>`
      versionNav.innerHTML = str;
      newVersion = document.querySelector(".new-version")
      video = newVersion.querySelector(".new-version video");
    }
    /* 实现功能 */
    const versionNavHandle = function versionNavHandle() {
      /* 鼠标划入播放视频 */
      newVersion.onmouseenter = function () {
        video.play()
      }
      newVersion.onmouseleave = function () {
        video.pause()
      }
      /* 懒加载 */
      let ob = new IntersectionObserver(changes => {
        if (changes[0].isIntersecting) {
          versionNav.classList.add("appear")
        }
      }, {
        threshold: [0.8]
      })
      ob.observe(versionNav)
    }
    return getversionNavData().then(value => {
      versionNavRender(value);
      versionNavHandle();
    })
  }
  /*---------------------------更多皮肤--------------------------------*/
  const moreSkin = function moreSkin() {
    let moreSkin = document.querySelector(".more-skin"),
      moreSkinBox1 = moreSkin.querySelector(".content")
    moreSkinBox = moreSkin.querySelector(".content ul"),
      newHS = document.querySelector(".new-hero_skin"), newS = newHS.querySelector(".new-skin");
    /* 获取数据 */
    const getMoreSkinData = function getMoreSkinData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/moreskin.json",
          success: function (data) {
            resolve(data)
          }
        })
      })
    }
    /* 渲染数据 */
    const moreSkinRender = function moreSkinRender(data) {
      let str = "";
      data.forEach(item => {
        let { url, title, link } = item;
        str += `<li class="more-skin-item">
      <img src="${url}">
      <p class="skinname">
      ${title}
      </p>
      <a href=" ${link}" target="_blank" title=" ${title}" class="herf-mask"></a>
    </li>`
      });
      moreSkinBox.innerHTML = str
    }
    /* 实现功能 */
    const moreSkinHandle = function moreSkinHandle() {
      moreSkinBox1.onmouseenter = function () {
        clearTimeout(timer)
        moreSkin.classList.add("show");
        newS.classList.add("show");
      }
      moreSkinBox1.onmouseleave = function () {
        moreSkin.classList.remove("show");
        newS.classList.remove("show");
      }
    }
    return getMoreSkinData().then(value => {
      moreSkinRender(value);
      moreSkinHandle();
    })
  }
  return {
    init() {
      Carousel();
      newTab();
      hotEvents();
      newHeroSkin();
      versionNav();
      moreSkin();
    }
  }
})();
part1.init();
/* ----------------part2--------------------- */
const part2 = (function () {
  let conPart2 = document.querySelector(".con-part2")
  /* 最新视频 */
  const newVideos = function newVideos() {
    let newVideo = document.querySelector(".new-video"),
      newVideoTab = newVideo.querySelector(".part-top-tab"),
      newVideoTabList = newVideoTab.querySelectorAll(".part-tab-title li"),
      newVideoContent = newVideo.querySelector(".new-video-content"),
      iconp = change.querySelector(".change-icon");
    /* 获取数据 */
    const getNewVideoData = function getNewVideoData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/newvideo.json",
          data: null,
          success: function (data) {
            /* 懒加载 */
            let ob = new IntersectionObserver(changes => {
              if (changes[0].isIntersecting) {
                resolve(data)
                conPart2.classList.add("appear");
              }
            }, {
              threshold: [0.3]
            })
            ob.observe(conPart2)
          }
        })
      })
    }
    /* 渲染数据 */
    const newVideoRender = function newVideoRender(data) {
      let Cstr = ``;
      newVideoTabList.forEach((item, index) => {
        if (item.className) {
          let { titlep, titleclass } = data.title[index]
          iconp.innerHTML = `${titlep}
          <i class="${titleclass}"></i>`;
          data[index].forEach(item => {
            let { url, link, title, length, count, time } = item;
            Cstr += `<li class="video-item">
          <div class="hover-img">
            <img src="${url}">
            <span class="btn-play">
              <i></i>
              <a></a>
            </span>
            <a href="${link}" class="href-mask" target="_blank"></a>
          </div>
          <a class="video-length">${length}</a>
          <p class="video-name">
            <a href="${link}" target="_blank">
            ${title}
            </a>
          </p>
          <a class="play-count">
          ${count}
          </a>
          <a class="update-time">
          ${time}
          </a>
        </li>`
          })
          newVideoContent.innerHTML = Cstr
        }
      })
    }
    /* 实现选项卡 */
    const newVideoHandle = function newVideoHandle(data) {
      for (let i = 0; i < newVideoTabList.length; i++) {
        (function () {
          newVideoTabList[i].onmouseenter = function () {
            change(i);
            newVideoRender(data);
          };
        })();
      };
      const change = function change(i) {
        for (let a = 0; a < newVideoTabList.length; a++) {
          newVideoTabList[a].className = "";
        }
        newVideoTabList[i].className = "selected";
      };
    }

    return getNewVideoData().then(value => {
      newVideoRender(value);
      newVideoHandle(value)
    })
  }
  const hotVideo = function hotVideo() {
    let hotVideo = document.querySelector(".hot-video"),
      hotVideoTitle = hotVideo.querySelector(".part-top-tab"),
      hotVideoTitleList = hotVideoTitle.querySelectorAll(".part-tab-title li")
    hotVideoContent = hotVideo.querySelector(".hot-video-content"),
      hotVideoSwiperBox = hotVideoContent.querySelector(".swiper-wrapper"),
      btnLeft = hotVideoContent.querySelector(".hot-video-left"),
      btnRight = hotVideoContent.querySelector(".hot-video-right");
    /* 获取数据 */
    const getHotVideoData = function getHotVideoData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/hotvideo.json",
          data: null,
          success: function (data) {
            /* 懒加载 */
            let ob = new IntersectionObserver(changes => {
              if (changes[0].isIntersecting) {
                resolve(data)
              }
            }, {
              threshold: [0.3]
            })
            ob.observe(conPart2)
          }
        })
      })
    };
    /* 渲染数据 */
    const hotVideoRender = function hotVideoRender(data) {
      let str = ``, flag;
      hotVideoTitleList.forEach((item, index) => {
        if (item.className) {
          if (index === 0) {
            flag = true;
          }
          data[index].forEach(item => {
            let { imgtitle, imgtime, link, title, link2, name } = item;
            str += `<li class="hot-video-list swiper-slide">
            <img src="img/底部内容/part2/热门/${name}1.jpg" class="bigimg">
            <h4 class="img-title">${imgtitle}</h4>
            <p class="time">${imgtime}</p>
            <a href="${link}" class="href-mask" target="_blank" title="${name}"></a>
            <a href="${link}" class="hot-video-title" target="_blank">${title}</a>
            <a href="${link2}" target="_blank" class="bottom-box">
              <img src="img/底部内容/part2/热门/${name}2.jpg" alt="${name}">
              ${name}
            </a>
          </li>`
          });
          if (index === 0) {
            btnLeft.style.display = "none";
            btnRight.style.display = "none";
            return;
          }
          btnLeft.style.display = "block";
          btnRight.style.display = "block";
        }
      })
      hotVideoSwiperBox.innerHTML = str;
      if (!flag) hotVideoSwiper();
    }
    /* 实现选项卡 */
    const hotVideoTab = function hotVideoTab(data) {
      for (let i = 0; i < hotVideoTitleList.length; i++) {
        (function () {
          hotVideoTitleList[i].onmouseenter = function () {
            change(i);
            hotVideoRender(data);
          };
        })();
      };
      const change = function change(i) {
        for (let a = 0; a < hotVideoTitleList.length; a++) {
          hotVideoTitleList[a].className = "";
        }
        hotVideoTitleList[i].className = "selected";
      };
    };
    /* swiper实现轮播 */
    const hotVideoSwiper = function hotVideoSwiper() {
      let mySwiper = new Swiper('#hotVideo', {
        direction: 'horizontal',
        effect: "slide",
        loop: true,
        slidesPerView: 3,
        slidesPerGroup: 3,
        autoplay: true,
        navigation: {
          nextEl: '.hot-video-right',
          prevEl: '.hot-video-left',
        }

      })
    }
    return getHotVideoData().then(value => {
      hotVideoRender(value);
      hotVideoTab(value);
    })
  }
  return {
    init() {
      newVideos();
      hotVideo();
    }
  }
})();
part2.init();
/* ----------------part3--------------------- */
const part3 = (function () {
  let topTitle = document.querySelector(".top-tab"),
    topTitleList = topTitle.querySelectorAll(".part-tab-title li"),
    bottomEventsBox = document.querySelectorAll(".bottom-events>div");
  /* 第一页 */
  const finalists = function finalists() {
    /* -------------赛程------------------------- */
    let M_swiperBox = document.querySelector(".swiperBox"),
      M_swiperWrapper = M_swiperBox.querySelector(".swiper-wrapper"),
      scoreBoard = document.querySelector(".scoreboard"),
      S_swiperSlide = scoreBoard.querySelector(".scoreboard-list"),
      S_titleList = scoreBoard.querySelectorAll(".part-tab-title li"),
      conPart3 = document.querySelector(".con-part3");
    /* 获取数据 */
    const getFirstData = function getFirstData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/firstround.json",
          data: null,
          success: function (data) {
            /* 懒加载 */
            let ob = new IntersectionObserver(changes => {
              if (changes[0].isIntersecting) {
                resolve(data)
                conPart3.classList.add("appear");
              }
            }, {
              threshold: [0.3]
            })
            ob.observe(conPart3)

          }
        })
      })
    }
    /* 渲染赛程 */
    const firseRoundRender = function firseRoundRender(data) {
      let str = '';
      data["race"].forEach(item => {
        let { top, topdate, toptime, teama, teamb, match } = item;
        str += `<li class="gamelist-item swiper-slide">
        <!-- 直播情况 -->
        <p class="gamelist-item-top">
          <i></i>
          <span class="span1">${top}</span>
          <span class="span2">${toptime}</span>
          <span class="span3">${topdate}</span>
        </p>
        <!-- 战队1 -->
        <div class="gamelist-team-a">
          <span>
            <img src="img/底部内容/part3/比赛队伍/${teama}.png">
          </span>
          <a>${teama}</a>
        </div>
        <!-- 战队2 -->
        <div class="gamelist-team-b">
          <span>
            <img src="img/底部内容/part3/比赛队伍/${teamb}.png">
          </span>
          <a>${teamb}</a>
        </div>
        <!-- 赛局比分 -->
        <span class="gamelist-score">
          <a>0</a>
          <a>:</a>
          <a>0</a>
        </span>
        <!-- 观看直播 -->
        <a href="javascript:;" class="gamelist-wait" target="_blank" title="敬请期待">敬请期待</a>
        <!-- 比赛类型 -->
        <p class="p1">2022全球总决赛</p>
        <!-- 赛程 -->
        <p class="p2">${match}</p>
      </li>`
      })
      M_swiperWrapper.innerHTML = str
    }
    /* swiper实现轮播图 */
    const leftInit = function leftInit() {
      let mySwiper = new Swiper('#Container', {
        direction: 'horizontal',
        effect: "slide",
        slidesPerView: 3,
        slidesPerGroup: 3,
        navigation: {
          nextEl: '.icon-right-arrow',
          prevEl: '.icon-left-arrow',
          disabledClass: 'hidden',
        }

      })
    }
    /* ------------------积分榜------------------------- */
    /* 渲染积分榜 */
    const scoreBoardRender = function scoreBoardRender(data) {
      let str = ""
      S_titleList.forEach((item, index) => {
        if (item.className) {
          data[index].sort((a, b) => {
            return b.integral - a.integral
          }).forEach((item, index) => {
            let { teamname, WL, integral } = item;
            str += `<li>
            <a class="a1">${index + 1}</a>
            <span class="a2">
              <img src="img/底部内容/part3/比赛队伍/${teamname}.png">
              ${teamname}
            </span>
            <a class="a3">${WL}</a>
            <a class="a4">${integral}</a>
          </li>`
          });
          S_swiperSlide.innerHTML = str
        };
      });
    };
    /* 实现选项卡 */
    const scoreBoardHandle = function scoreBoardHandle(data) {
      for (let i = 0; i < S_titleList.length; i++) {
        (function (i) {
          S_titleList[i].onmouseenter = function () {
            change(i);
            scoreBoardRender(data);
          };

        })(i)
        function change(i) {
          for (var a = 0; a < S_titleList.length; a++) {
            S_titleList[a].className = "";
          }
          S_titleList[i].className = "selected";
        }
      }
    }
    /* swiper实现内容拖动 */
    const rightInit = function rightInit() {
      let mySwiper = new Swiper('#scoreboardSwiper', {
        direction: 'vertical',
        roundLengths: true,
        slidesPerView: 'auto',
        mousewheel: true,
        grabCursor: true,
        scrollbar: {
          el: '.scrollbar',
          draggable: true,
        }
      })
    }
    /* 第二轮渲染 */
    const secondRender = function secondRender(data) {
      let secondMatch = document.querySelector(".second-match"),
        firstWinnerList = secondMatch.querySelector(".winner-list"),
        secondGamelist = secondMatch.querySelector(".second-gamelist"),
        secondWinerList = secondMatch.querySelector(".second-winer");
      let Fstr = ``, Mstr = ``, Sstr = ``;
      data["first"].forEach(item => {
        let { teamname } = item;
        Fstr += `<p class="winer">
        <i></i>
        <span>
          <img src="img/底部内容/part3/比赛队伍/${teamname}1.png" >
        </span>
        <a class="a1">第一轮晋级小组赛队伍</a>
        <a class="a2">${teamname}</a>
      </p>`
      })
      data["match"].forEach(item => {
        let { status, time, wait, team1, score1, team2, score2 } = item;
        Mstr += `<div class="gamelist">
        <!-- 对局上tips -->
        <p class="info">
          <span class="status">${status}</span>
          <span class="time">${time}</span>
          <a class="wait">${wait}</a>
        </p>
        <!-- 两支队伍 -->
        <p class="team">
          <span class="img-wrap">
            <img src="img/底部内容/part3/比赛队伍/${team1}2.png">
          </span>
          <a class="teamname">${team1}</a>
          <a class="score">${score1}</a>
        </p>
        <p class="team">
          <span class="img-wrap">
            <img src="img/底部内容/part3/比赛队伍/${team2}2.png">
          </span>
          <a class="teamname">${team2}</a>
          <a class="score">${score2}</a>
        </p>
      </div>`
      });
      data["second"].forEach(item => {
        let { teamname } = item;
        Sstr += `<p class="winer">
        <i></i>
        <span>
          <img src="img/底部内容/part3/比赛队伍/${teamname}1.png" >
        </span>
        <a class="a1">第二轮晋级小组赛队伍</a>
        <a class="a2">${teamname}</a>
      </p>`
      });
      firstWinnerList.innerHTML = Fstr
      secondGamelist.innerHTML = Mstr
      secondWinerList.innerHTML = Sstr
    }


    return getFirstData().then(value => {
      firseRoundRender(value);
      leftInit();
      scoreBoardRender(value);
      scoreBoardHandle(value);
      rightInit();
      secondRender(value)
    })
  }
  /* 第二页积分榜 */
  const secondlists = function secondlists() {
    let secondPage = document.querySelector(".second-page"),
      S_topLeftBox = secondPage.querySelector(".score-board"),
      S_topTitleList = S_topLeftBox.querySelectorAll(".part-tab-title li"),
      topTitle = document.querySelector(".top-tab"),
      topTitleList = topTitle.querySelectorAll(".part-tab-title li"),
      S_bottomContent = S_topLeftBox.querySelector(".score-board-content"),
      S_bottomScoreList = S_bottomContent.querySelector(".score-board-list");
    /* 获取数据 */
    const getSecondDate = function getSecondDate() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/secondScore.json",
          data: null,
          success: function (data) {
            resolve(data)
          }
        })
      })

    }
    /* 渲染 */
    const secondLeftRender = function secondLeftRender(data) {
      let str = ``;
      S_topTitleList.forEach((item, index) => {
        if (item.className) {
          data[index].sort((a, b) => {
            return b.integral - a.integral
          }).forEach((item, index) => {
            let { teamname, WL, integral } = item;
            str += ` <li>
          <a class="a1">${index + 1}</a>
          <span class="a2">
            <img src="img/底部内容/part3/比赛队伍/${teamname}.png">
            ${teamname}
          </span>
          <a class="a3">${WL}</a>
          <a class="a4">${integral}</a>
        </li>`
          })
        }
      })
      S_bottomScoreList.innerHTML = str
    }
    /* 实现功能 */
    const secondLeftHandle = function secondLeftHandle(data) {
      for (let i = 0; i < S_topTitleList.length; i++) {
        (function (i) {
          S_topTitleList[i].onmouseenter = function () {
            change(i);
            secondLeftRender(data);
          };

        })(i)
        function change(i) {
          for (var a = 0; a < S_topTitleList.length; a++) {
            S_topTitleList[a].className = "";
          }
          S_topTitleList[i].className = "selected";
        }
      }
    }

    return getSecondDate().then(value => {
      secondLeftRender(value);
      secondLeftHandle(value);
    })
  }
  /* 第二页赛程 */
  const secondMatch = function secondMatch() {
    let secondMatchTitle = document.querySelector("#match-title"),
      secondMatchTitleList = secondMatchTitle.querySelectorAll(".swiper-wrapper li")
    secondMatchContent = document.querySelector(".matchlist-day-tab-content"),
      secondMatchList = secondMatchContent.querySelector(".swiper-wrapper");
    /* 获取数据 */
    const getSecondMatchData = function getSecondMatchData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/secondmatchday.json",
          data: null,
          success: function (data) {
            resolve(data)
          }
        })
      })

    }
    /* 渲染数据 */
    const secondMatchRender = function secondMatchRender(data) {
      let str = ``;
      secondMatchTitleList.forEach((item, index) => {
        if (item.className.includes("selected")) {
          data[index].forEach(item => {
            let { status, date, time, teama, scorea, scoreb, teamb, wait } = item;
            str += `<li class="swiper-slide matchlist-day-list">
            <a class="status">${status}</a>
            <a class="time">
            ${date}
              <i></i>
              ${time}
            </a>
            <div class="team teama">
              <span class="img-box">
                <img src="img/底部内容/part3/比赛队伍/${teama}.png">
              </span>
              <a>${teama}</a>
            </div>
            <span class="score">
              <a class="a1">${scorea}</a>
              <a class="a2">:</a>
              <a class="a1">${scoreb}</a>
            </span>
            <div class="team teamb">
              <span class="img-box">
                <img src="img/底部内容/part3/比赛队伍/${teamb}.png">
              </span>
              <a>${teamb}</a>
            </div>
            <a class="href-video">${wait}</a>
          </li>`
          })
          secondMatchList.innerHTML = str
        }
      })

    }
    /* 实现选项卡 */
    const secondMatchHandle = function secondMatchHandle(data) {
      for (let i = 0; i < secondMatchTitleList.length; i++) {
        (function (i) {
          secondMatchTitleList[i].onmouseenter = function () {
            change(i);
            secondMatchRender(data);
          };

        })(i)
        function change(i) {
          for (var a = 0; a < secondMatchTitleList.length; a++) {
            secondMatchTitleList[a].className = "swiper-slide";
          }
          secondMatchTitleList[i].className = "swiper-slide selected";
        }
      }
    }
    /* swiper实现第二页赛程标题 */
    const matchTitle = function matchTitle() {
      let mySwiper = new Swiper('#match-title', {
        direction: 'horizontal',
        effect: "slide",
        slidesPerView: 5,
        slidesPerGroup: 1,
        navigation: {
          nextEl: '.match-right',
          prevEl: '.match-left',
          disabledClass: 'hidden',
        }
      })
    };
    /* swiper实现内容拖动 */
    const matchContent = function matchContent() {
      let mySwiper = new Swiper('#matchContent', {
        direction: 'vertical',
        roundLengths: true,
        slidesPerView: 'auto',
        mousewheel: true,
        grabCursor: true,
        scrollbar: {
          el: '.scrollbar',
          draggable: true,
        }
      })
    }
    return getSecondMatchData().then(value => {
      secondMatchRender(value);
      matchTitle();
      matchContent();
      secondMatchHandle(value)
    })


  }
  /* 第三页 */
  const thirdpage = function thirdpage() {
    /* 获取数据并渲染 */
    const getthirdData = function getthirdData() {
      return new Promise(resolve => {
        $.ajax({
          type: "GET",
          url: "json/wait.json",
          data: null,
          success: function (data) {
            resolve(data)
          }
        })
      })
    }
    const thirdRender = function thirdRender(data) {
      let matchShow3 = document.querySelector(".match-show3"), str = ``;
      let { url, tips } = data[0];
      str += `<div class="wait-tips">
      <img src="${url}">
      <a>${tips}</a>
    </div>`
      matchShow3.innerHTML = str
    }
    return getthirdData().then(value => {
      thirdRender(value)
    })
  }
  /* 实现最大的选项卡 */
  const tabHandle = function tabHandle() {
    for (let i = 0; i < topTitleList.length; i++) {
      (function () {
        topTitleList[i].onmouseenter = function () {
          change(i);
        }
      })();
      const change = function change(a) {
        for (let i = 0; i < topTitleList.length; i++) {
          topTitleList[i].className = ""
          bottomEventsBox[i].style.display = "none"
        };
        topTitleList[a].className = "selected";
        bottomEventsBox[a].style.display = "block"
      }
    }
  }
  return {
    init() {
      finalists();
      secondlists();
      secondMatch();
      thirdpage();
      tabHandle();
    }
  }
})();
part3.init()
/* ----------------part4--------------------- */
const part4 = (function () {
  let conpart4 = document.querySelector(".con-part4"),
    heroListContainer = document.querySelector(".heroList-container"),
    heroContentListBox = heroListContainer.querySelector(".swiper-slide"),
    heroListBox = document.querySelector(".heroList-box"),
    heroTilteList = heroListBox.querySelectorAll(".part-tab-title li"),
    heroContentList = null, roles;
  /* 获取数据 */
  const getHeroData = function getHeroData() {
    return new Promise(resolve => {
      $.ajax({
        url: "json/hero.json",
        type: "GET",
        success: function (data) {
          /* 懒加载 */
          let ob = new IntersectionObserver(changes => {
            if (changes[0].isIntersecting) {
              resolve(data)
              conpart4.classList.add("appear");
            }
          }, {
            threshold: [0.3]
          })
          ob.observe(conpart4)

        }
      })
    })
  }
  /* 渲染数据 */
  const heroListRender = function heroListRender(data) {
    let str = ``;
    data.forEach(item => {
      let { heroId, name, alias, roles } = item;
      str += `<li class="heroList-item" data-roles="${roles}">
      <img src="//game.gtimg.cn/images/lol/act/img/champion/${alias}.png">
      <i class="hover-icon"></i>
      <p>${name}</p>
      <a href="https://101.qq.com/?ADTAG=cooperation.glzx.web#/hero-detail?heroid=${heroId}&tab=overview&lane=all" target="_blank" class="href-mask" title="${name}"></a>
    </li>`
    });
    heroContentListBox.innerHTML = str;
    heroContentList = heroContentListBox.querySelectorAll("li");

  }
  /* swiper实现内容滚动 */
  const heroContentScoring = function heroContentScoring() {
    let mySwiper1 = new Swiper('#heroListSwiper', {
      direction: 'vertical',
      roundLengths: true,
      freeMode: true,
      autoHeight: true,
      slidesPerView: 'auto',
      mousewheel: true,
      grabCursor: true,
      observer: true,
      observeParents: true,
      scrollbar: {
        el: '.scrollbar2',
        draggable: true,
      },
    });
  }
  /* 实现点击更改类名 */
  const heroContentTab = function heroContentTab() {
    for (let i = 0; i < heroTilteList.length; i++) {
      (function () {
        heroTilteList[i].onclick = function () {
          change(i);
          heroSort();
          heroContentScoring();
        };
      })();
    };
    const change = function change(i) {
      for (let a = 0; a < heroTilteList.length; a++) {
        heroTilteList[a].className = "";
      }
      heroTilteList[i].className = "selected";
    };
  }
  /* 实现排序 */
  const heroSort = function heroSort() {
    /* 获取每个标题上的分类 */
    heroTilteList.forEach(item => {
      if (item.className) {
        roles = item.getAttribute("data-roles").toLocaleLowerCase()
      }
    });
    /* 根据每个英雄的分类控制display */
    heroContentList.forEach(item => {
      if (roles == "all") {
        item.style.display = "block";
        return;
      }
      if (item.getAttribute("data-roles").includes(roles)) {
        item.style.display = "block";
        return;
      }
      item.style.display = "none";
    });
  }
  return {
    init() {
      getHeroData().then(value => {
        heroListRender(value);
        heroContentScoring();
        heroContentTab();
      })
    }
  }
})();
part4.init()
/* ----------------part5--------------------- */
const part5 = (function () {
  let conPart5 = document.querySelector(".con-part5"),
    fanartLeftContent = conPart5.querySelector(".fanart-left-content"),
    fanartRightContent = conPart5.querySelector(".fanart-right"),
    bigImg = fanartRightContent.querySelector(".rightbig")
  rightBox = fanartRightContent.querySelector(".right");

  let partnerListBox = null, partnerListContainer = null;
  /* 获取数据 */
  const getAllData = function getActData() {
    return new Promise(resolve => {
      $.ajax({
        url: "json/part5.json",
        type: "GET",
        success: function (data) {
          /* 懒加载 */
          let ob = new IntersectionObserver(changes => {
            if (changes[0].isIntersecting) {
              resolve(data)
              conPart5.classList.add("appear");
            }
          }, {
            threshold: [0.5]
          })
          ob.observe(conPart5)
        }
      })
    })
  }
  /* 渲染数据 */
  const part5Render = function part5Render(data) {
    let Lstr = ``, Bstr = ``, Rstr = ``, ListStr = ``
    data["left"].forEach(item => {
      let { link1, name, link2, author, num, url, url1 } = item;
      Lstr += ` <li>
    <a href="${link1}" target="_blank" title="${name}">
      <img src="${url}" class="fanart-img">
    </a>
    <!-- hover -->
    <div class="innerhover-content">
      <p class="p1">
        <a href="${link1}" target="_blank">
        ${name}
        </a>
      </p>
      <p class="p2">
        <a href="${link2}" class="a1">
          <img src="${url1}" alt="${author}">
          ${author}
        </a>
        <a href="javascript:;" class="a2">
          <i class="icon-666"></i>
          <span class="num">${num}</span>
        </a>
      </p>
    </div>
  </li>`
    })
    data["big"].forEach(item => {
      let { url, title, link } = item;
      Bstr = ` <img src="${url}">
      <span class="p1">
        <i class="inline-icon-1"></i>
        ${title}
        <i class="inline-icon-1"></i>
      </span>
      <a href="${link}" class="herf-mask"
        target="_blank"></a>`
    });
    data["rightlist"].forEach(item => {
      let { url, link, title } = item;
      Rstr += `${url ? `<li class="href-right">
      <img src="${url}">
      <a href="${link}" class="href-mask">
        <i class="inline-icon-1"></i>
        ${title}
      </a>
    </li>`: `<li class="href-partner">
    <a href="${link}" target="_blank">
      <i class="inline-icon-left"></i>
      ${title}
      <i class="more-arrow-1"></i>
      <i class="inline-icon-right"></i>
    </a>
    <div class="swiper partner-list-container" id="rightSwiper">
      <div class="partner-list-box swiper-wrapper">
        <ul class="partner-list-silde swiper-silde">
        </ul>
      </div>
      <div class="scrollbar3"></div>
    </div>
  </li>`}`
    })
    data["list"].forEach(item => {
      let { link, title } = item;
      ListStr += `<li>
      <a href="${link}" target="_blank">${title}</a>
    </li>`
    })
    fanartLeftContent.innerHTML = Lstr;
    bigImg.innerHTML = Bstr;
    rightBox.innerHTML = Rstr;
    partnerListBox = rightBox.querySelector(".partner-list-silde");
    partnerListContainer = rightBox.querySelector(".partner-list-container")
    partnerListBox.innerHTML = ListStr;
  }
  /* swiper实现功能 */
  const part5Handle = function part5Handle() {
    let mySwiper = new Swiper('#rightSwiper', {
      direction: 'vertical',
      roundLengths: true,
      slidesPerView: 'auto',
      mousewheel: true,
      grabCursor: true,
      scrollbar: {
        el: '.scrollbar3',
        draggable: true,
      }
    });
  }
  return {
    init() {
      getAllData().then(value => {
        part5Render(value);
        part5Handle();
      })
    }
  }
})();
part5.init()
/* ---------侧边栏和侧边二维码封面图变化------------- */
const rightContent = (function () {
  let html = document.documentElement || document.body,
    vH,
    vW = html.clientWidth,
    topDistance = html.scrollTop,
    topImg = document.querySelector(".comm-top"),
    QRcode = document.querySelector(".QRcode"),
    rightNav = document.querySelector(".right-nav"),
    spzx = rightNav.querySelector(".rn-spzx"),
    rmhd = rightNav.querySelector(".rn-rmhd"),
    sszx = rightNav.querySelector(".rn-sszx"),
    yxzl = rightNav.querySelector(".rn-yxzl"),
    conpart4 = document.querySelector(".con-part4"),
    yxzlT = conpart4.offsetTop - (conpart4.offsetHeight / 2),
    fanart = rightNav.querySelector(".rn-fanart"),
    conPart5 = document.querySelector(".con-part5"),
    fanartT = conPart5.offsetTop - (conPart5.offsetHeight / 2),
    rightNavList = rightNav.querySelector("ul"),
    top = rightNav.querySelector(".rn-top"),
    target, step = 60;
  const QRcodeFun = function QRcodeFun() {
    if (vH < 2048) {
      QRcode.className = "";
      return;
    }
    if (topDistance >= 0) {
      rightNav.classList.add("show");
    }
    window.onresize = function () {
      vH = html.clientHeight;
      vW = html.clientWidth;
    }
    window.onscroll = function () {
      topDistance = html.scrollTop;
      /* 控制侧边二维码 */
      if (topDistance >= 250 || vH >= 850 && vW >= 1650) {
        QRcode.classList.add("show");
      };
      if (topDistance < 250 || vH < 850 || vW < 1650) {
        QRcode.classList.remove("show");
      }
      /* 控制封面图 */
      if (topDistance > 0) {
        topImg.classList.remove("big");
      }
      /* 侧面导航 */
      if (topDistance >= 250) {
        rightNav.classList.add("showTop");
      }
      if (topDistance < 250) {
        rightNav.classList.remove("showTop");
      }
      if (topDistance >= 750 && topDistance < 1500) {
        rmhd.classList.add("selected")
      } else {
        rmhd.classList.remove("selected")
      }
      if (topDistance >= 1500 && topDistance < 2125) {
        spzx.classList.add("selected");
      } else {
        spzx.classList.remove("selected");
      }
      if (topDistance >= 2125 && topDistance < 2326) {
        sszx.classList.add("selected");
      } else {
        sszx.classList.remove("selected");
      }
      if (topDistance >= 2326 && topDistance < 3210) {
        yxzl.classList.add("selected");
      } else {
        yxzl.classList.remove("selected");
      }
      if (topDistance >= 3210) {
        fanart.classList.add("selected");
      } else {
        fanart.classList.remove("selected");
      }
      // rightNavList.onclick=function(e){
      //   if(e.target.tagName==="LI"){
      //     console.log(e.target);
      //   }
      // }
    }
    const moveT = function moveT() {
      let now = html.scrollTop;
      if (topDistance <= target) {
        cancelAnimationFrame(moveT)
        return;
      }
      html.scrollTop = now - step;
      requestAnimationFrame(moveT);
    }
    const moveB = function moveB() {
      let now = html.scrollTop;
      if (topDistance >= target) {
        cancelAnimationFrame(moveB)
        return;
      }
      html.scrollTop = now + step;
      requestAnimationFrame(moveB);
    }
    rmhd.onclick = function () {
      let now = html.scrollTop;
      target = 750;
      console.log(now);
      if (now > target) {
        requestAnimationFrame(moveT);
      }
      if (now < target) {
        requestAnimationFrame(moveB);
      }
      if (now = target) return;

    };
    spzx.onclick = function () {
      let now = html.scrollTop;
      target = 1500
      if (now >= target) {
        requestAnimationFrame(moveT);
      }
      if (now <= target) {
        requestAnimationFrame(moveB);
      }
      if (now = target) return;
    }
    sszx.onclick = function () {
      let now = html.scrollTop;
      target = 2125
      if (now >= target) {
        requestAnimationFrame(moveT);
      }
      if (now <= target) {
        requestAnimationFrame(moveB);
      }
      if (now = target) return;
    }
    yxzl.onclick = function () {
      let now = html.scrollTop;
      target = yxzlT
      if (now >= target) {
        requestAnimationFrame(moveT);
      }
      if (now <= target) {
        requestAnimationFrame(moveB);
      }
      if (now = target) return;
    }
    fanart.onclick = function () {
      let now = html.scrollTop;
      target = fanartT
      if (now >= target) {
        requestAnimationFrame(moveT);
      }
      if (now <= target) {
        requestAnimationFrame(moveB);
      }
      if (now = target) return;

    }
    top.onclick = function () {
      target = 0
      requestAnimationFrame(moveT);
    }
  }

  return {
    init() {
      QRcodeFun();
    }
  }
})();
rightContent.init();