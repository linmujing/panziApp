//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    service: app.globalData.imgUrl + 'zx.png',
    indicatorDots: true,
    cindicatorColor: '#fff',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    carouselData: [],
    navData: [],
    hotList: [],
    starList: [],
    movieList: [],
    wzrylist: [],
    titleImg: {
      star: app.globalData.imgUrl + 'experience.png',
      movie: app.globalData.imgUrl + 'movie.png',
    },
    weekData: {
      weekList: [],
      week_logo: app.globalData.imgUrl + 'week_logo.png'
    },
    storeData: {},
    commentsList: [],
    videoPlay: null,
    videoData: {
      list: [],
      video_status: 1
    },
    recommend: [],
    current: 0,
    ad: {
      img: '',
      state: true,
      seat: 1
    },
    // P图高手nav图
    ptgs_navList: [{
      img: 'http://vip2.pznrfsy.com/bin/panziApp/nav-01.JPG',
    }, {
      img: 'http://vip2.pznrfsy.com/bin/panziApp/nav-02.JPG',
    }, {
      img: 'http://vip2.pznrfsy.com/bin/panziApp/nav-03.JPG',
    }],

    //初始化数据
    slide: {
      text: '张天爱 宋祖儿 安以轩 蒋梦婕 王智等众多明星倾力推荐',
      marqueePace: 1, //滚动速度
      marqueeDistance: 0, //初始滚动距离
      marquee_margin: 60,
      size: 14,
      interval: 20 // 时间间隔
    }
  },
  click_live: function (e) {
    let roomId = e.currentTarget.dataset.id
    // let customParams = encodeURIComponent(JSON.stringify({ path: 'pages/index/index', pid: 1 })) 
    wx.navigateTo({
      url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=5`
    })
  },
  onLoad: function () {
    // this.ctx = wx.createCameraContext()//创建摄像头对象

    this.myVideo = wx.createVideoContext('myVideo')
    this.recCare()
    this.getRecommend()
    this.getIndex()

    var length = this.data.slide.text.length * this.data.slide.size; //文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    //console.log(length,windowWidth);
    this.setData({
      length: length,
      windowWidth: windowWidth
    });
    this.scrolltxt(); // 第一个字消失后立即从右边出现

  },
  h5: function () {
    // getApp().globalData.webView = 'https://vip2.pznrfsy.com/lmj/activity/divide.html';
    // wx.navigateTo({
    //   url: 'webView'
    // })
    wx.navigateTo({
      url: '/pages/index/hanFu_client',
    })
  },
  onShow: function () {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    this.ad()
    if (userInfo.tel == '' || userInfo.tel == 0) {
      wx.showToast({
        title: '为了更好的体验小程序，同时保障账户的安全性，请先绑定手机号',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }, 2000)
    }
  },

  // 跳转P图高手
  click_ptgs() {
    wx.navigateToMiniProgram({
      appId: 'wx670c2bb8bbc0d58f',
      path: 'pages/index/index',
      // extraData: {
      //   foo: 'bar'
      // },
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  // 跳转古风手机壳活动页
  click_gfsjk() {
    wx.navigateToMiniProgram({
      appId: 'wxfcbb2540dc0ea331',
      // path: 'pages/index/index',
      path: 'pages/active/qixi_active',
      // extraData: {
      //   foo: 'bar'
      // },
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }
    })
  },

  // 广告弹窗
  ad: function () {
    var userInfo = wx.getStorageSync('userInfo');
    var that = this
    var reqBody = {
      token: userInfo.token,
      seat: that.data.ad.seat
    };
    util.post(util.url.ad, reqBody, (res) => {
      if (res.state == 1) {
        var data = res.data[0]
        this.setData({
          'ad.img': data.img,
          'ad.state': false,
          'ad.url': data.url,
          'ad.type': data.type
        })
      } else {
        this.setData({
          'ad.state': true
        })
      }
    })
  },

  // 弹窗跳转
  click_url: function (e) {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      seat: that.data.ad.seat
    };
    util.post(util.url.ad_log, reqBody, (res) => {
      that.click_banner(e)
    })
  },
  close_ad: function (e) {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token,
      seat: that.data.ad.seat
    };
    util.post(util.url.ad_log, reqBody, (res) => {
      that.setData({
        'ad.state': true
      })
    })
  },
  click_banner: function (e) {
    var that = this
    //type = 1 外链  2 内链
    var type = e.currentTarget.dataset.type
    var url = e.currentTarget.dataset.url
    if (url == '' && type !== 99 && type !== 98) {
      return
    }

    if (type == 1) {
      getApp().globalData.webView = url;
      wx.navigateTo({
        url: 'webView'
      })
    } else if (type === 98) { //跳转古风手机壳活动
      that.click_gfsjk()
    } else if (type === 99) { //跳转P图高手
      that.click_ptgs()
    } else if (type == 4) { // 跳转盘粉达人
      var userInfo = wx.getStorageSync('userInfo');
      var reqBody = {
        token: userInfo.token
      };
      util.post(util.url.check, reqBody, (res) => {
        if (res.code == 1111) { // 已经通过
          wx.navigateTo({
            url: '/pages/personal/audit_status?status=2'
          })
        } else if (res.code === 1112) { //未通过
          wx.navigateTo({
            url: '/pages/personal/audit_status?status=0'
          })
        } else if (res.code === 1113) { //正在审核
          wx.navigateTo({
            url: '/pages/personal/audit_status?status=1'
          })
        } else {
          wx.navigateTo({
            url: '/pages/personal/pf_master'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: url,
      })
    }

  },
  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var _index = e.currentTarget.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(this.data._index)
    videoContextPrev.stop();
    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index)
      videoContext.play();
    }, 500)
  },
  getIndex: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    var reqBody = {};
    util.post(util.url.index, reqBody, (res) => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      wx.hideLoading()
      if (res.state == 1) {
        wx.setStorageSync('vstatus', res.video_status);
        that.setData({
          carouselData: res.banner,
          navData: res.data,
          hotList: res.theme_classify,
          commentsList: res.book,
          'storeData': res.store,
          'weekData.weekList': res.slices,
          starList: res.mxhz,
          movieList: res.yshzlist,
          'videoData.list': res.video,
          'videoData.video_status': res.video_status,
          wzrylist: res.wzrylist
        })
      }
    })
  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.slide.marquee_margin; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.slide.marqueeDistance;
        if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
          that.setData({
            'slide.marqueeDistance': crentleft + that.data.slide.marqueePace
          })
        } else {
          //console.log("替换");
          that.setData({
            'slide.marqueeDistance': 42 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.slide.interval);
    } else {
      that.setData({
        'slide.marquee_margin': "2000"
      }); //只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  getRecommend: function () {
    var userInfo = wx.getStorageSync('userInfo');
    var that = this
    var reqBody = {
      // token: userInfo.token
    };
    util.post(util.url.recommend, reqBody, (res) => {
      // console.log(res)
      if (res.state == 1) {
        var data = res.data
        var res = []
        if (data.length >= 2 && data.length < 4) {
          res = data.slice(0, 2);
        } else {
          res = data.slice(0, 4);
        }
        that.setData({
          recommend: res
        })
      }
    })
  },
  recCare: function () {
    var that = this;
    var reqBody = {
      p: 1,
      num: 5
    };
    util.post(util.url.recCare, reqBody, (res) => {
      if (res.state == 1002) {
        that.setData({
          zxList: res.data,
          urlType: res.url //百变女王
        })
      }
    })
  },

  // 导航列表
  click_nav: function (e) {
    var that = this
    //type = 1 内链  2 外链
    var type = e.currentTarget.dataset.type
    var url = e.currentTarget.dataset.url

    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    var urlType = that.data.urlType;
    console.log(id)

    if (type === 1) {
      wx.navigateTo({
        url: url,
      })
    } else if (type === 3) { //跳转小程序
      console.log(e)
      var appId = e.currentTarget.dataset.appid
      console.log(appId)
      if (appId) {
        wx.navigateToMiniProgram({
          appId: appId,
          path: 'pages/index/index',
          // extraData: {
          //   foo: 'bar'
          // },
          envVersion: 'release',
          success(res) {
            // 打开成功
            console.log(res)
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    } else if (type === 2) {
      getApp().globalData.webView = url;
      wx.navigateTo({
        url: 'webView'
      })
    }
    // var id = e.currentTarget.dataset.id;
    // var title = e.currentTarget.dataset.title;
    // var urlType = this.data.urlType;
    switch (id) {
      case 2:
        wx.navigateTo({
          url: '/pages/index/store',
        })
        break
      case 3:
        wx.switchTab({
          url: '/pages/theme/index',
        })
        break
      case 4:
        wx.navigateTo({
          url: '/pages/index/showcase',
        })
        break
      case 5:
        wx.navigateTo({
          url: '/pages/index/video',
        })
        break
      case 6:
        wx.navigateTo({
          url: '/pages/index/hanFu',
        })
        break
      case 7:
        wx.navigateTo({
          url: '/pages/index/star?title=' + title + '&type=2'
        })
        break
      case 8:
        wx.navigateTo({
          url: '/pages/index/star?title=' + title + '&type=1'
        })
        break
      case 9:
        console.log(999)
        wx.navigateTo({
          url: '/pages/index/jifen_mall',
        })
        break
      case 10:
        if (urlType === 2) { //百变女王换脸
          wx.navigateTo({
            url: '/pages/webH5/onlinePhoto'
          })
        } else {
          wx.navigateTo({
            url: '/pages/studio/index',
          })
        }
        break
      case 11:
        wx.navigateTo({
          url: '/pages/index/photos_list',
        })
        break
      case 12:
        // wx.navigateTo({
        //   url: '/pages/personal/trivia',
        // })
        // 跳转P图高手
        wx.navigateToMiniProgram({
          appId: 'wx670c2bb8bbc0d58f',
          path: 'pages/index/index',
          // extraData: {
          //   foo: 'bar'
          // },
          envVersion: 'release',
          success(res) {
            // 打开成功
            console.log(res)
          },
          fail(res) {
            console.log(res)
          }
        })
        break
      case 13:
        wx.navigateTo({
          url: '/pages/index/myMovies',
        })
        break
    }
  },
  click_msg: function () {
    wx.navigateTo({
      url: 'message'
    })
  },
  click_theme: function (e) {
    var id = e.currentTarget.dataset.id;
    getApp().globalData.themeId = id;
    wx.switchTab({
      url: '/pages/theme/index'
    })
  },
  click_themeDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../theme/detail?id=' + id + '&type=1',
    })
  },
  click_store: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'store_detail?id=' + id,
    })
  },
  click_kepian: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../theme/detail?id=' + id + '&type=2',
    })
  },
  click_star: function (e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: 'star_detail?id=' + id + '&type=' + type,
    })
  },
  click_comments: function () {
    wx.navigateTo({
      url: 'comments',
    })
  },
  comments_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'comments_detail?id=' + id,
    })
  },
  jifen_detail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'jifen_detail?id=' + id,
    })
  },
  click_material: function (e) {
    var cid = e.currentTarget.dataset.cid;
    var scimg = e.currentTarget.dataset.scimg;
    var scid = e.currentTarget.dataset.scid;
    var urlType = this.data.urlType;

    var title = e.currentTarget.dataset.title;
    wx.setStorage({
      key: "title",
      data: title
    })
    // 百变女王H5
    if (urlType === 2) {
      wx.navigateTo({
        url: '/pages/webH5/onlinePhoto'
      })
    } else {
      wx.navigateTo({
        url: '/pages/studio/material?scid=' + scid + '&scimg=' + scimg + '&cid=' + cid
      })
    }
    // wx.navigateTo({
    //   url: '/pages/studio/material?scid=' + scid + '&scimg=' + scimg + '&cid=' + cid
    // })
  },
  click_zxgList: function (e) {
    var cid = e.currentTarget.dataset.cid;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/studio/classification?cid=' + cid + '&title=' + title
    })
  },
  onHide: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getIndex()
    this.getRecommend()
    this.recCare()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log("111", res);
    } else {
      // console.log("222", res);
    }
    return {
      title: '盘子女人坊官方',
      path: 'pages/index/index?scene=' + this.data.userInfo.tel
    }
  },
})