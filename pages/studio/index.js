let util = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    shareData: {
      title: '快来看我的变装',
      desc: '自定义分享图片',
      imageUrl: '',
      path: '/pages/studio/index'
    },
    Obtaintel_state: false,
    userinfo: '',
    banner: [],
    hotlist: [],
    fenlewz: 0,
    fenle: [],
    current: 0,
    page: 1,
    tjlist: [],
    page_hd: true,
    page_state: false,
    xitong: ''
  },
  onLoad: function (options) {
    var xitong = wx.getStorageSync('xitong');
    var banner_zt = wx.getStorageSync('banner_zt');
    var hotlist_zt = wx.getStorageSync('hotlist_zt');
    var tjlist_zt = wx.getStorageSync('tjlist_zt');
    this.setData({
      xitong,
      banner_zt,
      hotlist_zt,
      tjlist_zt
    })
    this.cache();
    var thda = this;

    /*****openid*****/
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo.openid == '') {
      wx.clearStorageSync()
      wx.redirectTo({
        url: '/pages/login/index',
      })
    }
    console.log(userInfo)
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        // console.log(res)
        var userinfo = res.data;
        thda.setData({ userinfo });
        thda.banner(userinfo.openid);
        thda.hotlist(userinfo.openid);
        thda.recCare(userinfo.openid);

        thda.ewm(userinfo.openid);
        thda.getInfo(userinfo.openid);
        
        if (userinfo.tel == '' || userinfo.tel == 0) {
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
        // if (userinfo.tel) {
        //   var Obtaintel_state = true
        // } else {
        //   var Obtaintel_state = false
        // }
        // thda.setData({
        //   Obtaintel_state
        // })
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index'
        })
      }
    })
  },
  onReady: function () {
    this.setData({
      page_state: true
    })
  },
  getInfo: function (e) {
    var that = this;
    var reqBody = {
      openid: e
    };
    util.post(util.url.zx_getInfo, reqBody, (data) => {
      if (data.state == 1002) {
        var guanggao = wx.getStorageSync('guanggao');
        if (guanggao != data.ejectInfo.img_url) {
          console.log('显示')
          that.setData({
            guanggao_zt: true
          })
        } else {
          that.setData({
            guanggao_zt: false
          })
        }
        wx.setStorageSync('guanggao', data.ejectInfo.img_url);
        // data.ejectInfo.img_url = 'http://img5.imgtn.bdimg.com/it/u=3770052520,1127582357&fm=26&gp=0.jpg';
        that.setData({
          guanggao: data.ejectInfo
        })
        //console.log(that.data.guanggao)
      }
    })
  },
  click_gfsjk: function () {
    console.log('加载')
    wx.navigateToMiniProgram({
      appId: 'wxfcbb2540dc0ea331',
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
  close_popup: function () {
    this.setData({
      guanggao_zt: false
    })
  },
  cache: function () {
    var banner = wx.getStorageSync('banner');
    if (banner) {
      this.setData({
        banner
      })
    }
    var hotlist = wx.getStorageSync('hotlist');
    if (hotlist) {
      this.setData({
        hotlist
      })
    }
    // var fenle = wx.getStorageSync('index_total_fenle');
    // if (fenle) {
    //   this.setData({
    //     fenle
    //   })
    // }
    var tjlist = wx.getStorageSync('recommend');
    if (tjlist) {
      this.setData({
        tjlist
      })
    }
  },
  webview: function (e) {
    var url = e.currentTarget.dataset.url;
    getApp().globalData.webView = url
    wx.navigateTo({
      url: '/pages/index/webView'
    })

  },
  banner: function (e, type) {
    var thda = this;
    var reqBody = {
      openid: e
    };
    util.post(util.url.zx_banner, reqBody, (data) => {
      wx.setStorageSync('banner_zt', true);
      thda.setData({
        banner_zt: true
      })
      if (data.state == 1002) {
        var list = data.banner;
        if (type || thda.data.page_state) {
          for (var i = 0; i < list.length; i += 1) {
            list[i].load = true
          }
        }
        thda.setData({
          banner: list
        });
        if (type != 1) {
          wx.setStorage({
            key: "banner",
            data: list
          })
        }
      } else {
        thda.setData({
          banner: []
        });
        wx.setStorage({
          key: "banner",
          data: []
        });
        if (data.state == 1004 && data.info == '用户信息不存在') {
          wx.redirectTo({
            url: '/pages/login/index'
          })
        }
      }
    })
  },
  hotlist: function (e, type) {
    var thda = this;
    var reqBody = {
      openid: e,
      p: 1,
      num: 4
    };
    util.post(util.url.zx_hotlist, reqBody, (data) => {
      wx.setStorageSync('hotlist_zt', true);
      thda.setData({
        hotlist_zt: true
      })
      if (data.state == 1002) {
        var list = data.data;
        if (type || thda.data.page_state) {
          for (var i = 0; i < list.length; i += 1) {
            list[i].load = true
          }
        }
        thda.setData({
          hotlist: list
        });
        if (type != 1) {
          wx.setStorage({
            key: "hotlist",
            data: list
          })
        }
      } else {
        thda.setData({
          hotlist: []
        });
        wx.setStorage({
          key: "hotlist",
          data: []
        })
      }
    })
  },
  getList: function (e) {

    var thda = this;
    var reqBody = {
      openid: e
    };
    util.post(util.url.zx_getList, reqBody, (data) => {

      if (data.state == 1002) {
        var data = data.list;
        for (var i = 0; i < 5; i += 1) {
          var li = thda.paging(data[i].list);
          data[i].current = li[1];
          data[i].list = li[0]
        }
        thda.setData({
          fenle: data
        });
        wx.setStorage({
          key: "index_total_fenle",
          data: data
        })
      } else {
        thda.setData({
          fenle: []
        });
        wx.setStorage({
          key: "index_total_fenle",
          data: []
        })
      }
    });
    util.post(util.url.zx_getList, reqBody, (data) => {
      if (data.state == 1002) {
        var data = data.list;
        wx.setStorage({
          key: "total_fenle",
          data: data
        })
      } else {
        wx.setStorage({
          key: "total_fenle",
          data: []
        })
      }
    })
  },
  paging: function (e) {
    var dal = [
      []
    ];
    var s = 0;
    for (var i = 0; i < e.length; i += 1) {
      if (i % 10 == 0) {
        if (i > 0) {
          dal.push([]);
          s += 1
        }
      }
      dal[s].push(e[i])
    }
    var fenle_page = Math.ceil(e.length / 10);
    if (fenle_page == 0) {
      fenle_page = 1
    }
    return [dal, fenle_page]
  },
  recCare: function (e, type) {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
    var thda = this;
    var reqBody = {
      p: this.data.page,
      num: 10,
      openid: e
    };
    util.post(util.url.zx_recCare, reqBody, (data) => {
      wx.setStorageSync('tjlist_zt', true);
      thda.setData({
        tjlist_zt: true
      })


      if (data.state == 1002) {

        var list = data.list;

        if (thda.data.page != 1) {
          var a = thda.data.tjlist;
          list = a.concat(data.list);
          thda.setData({
            tjlist: list
          });
          wx.setStorage({
            key: "recommend",
            data: list
          })
        } else {
          console.log(type == 1 || thda.data.page_state)
          var list = data.list;
          if (type == 1 || thda.data.page_state) {
            for (var i = 0; i < list.length; i += 1) {
              list[i].load = true
            }
            console.log(list)

            thda.setData({
              tjlist: list
            })
          } else {
            thda.setData({
              tjlist: list
            });
            wx.setStorage({
              key: "recommend",
              data: list
            })
          }

        }

        setTimeout(function () {
          var list = thda.data.tjlist;
          for (var i = 0; i < list.length; i += 1) {
            list[i].load = true
          }
          thda.setData({
            tjlist: list
          })
        }, 300)
      } else {
        if (thda.data.page == 1) {
          wx.setStorage({
            key: "recommend",
            data: []
          });
          thda.setData({
            tjlist: []
          })
        }
        this.setData({
          page_hd: false
        })
      }
    })
  },
  ewm: function (e) {
    var thda = this;
    var reqBody = {
      openid: e
    };
    util.post(util.url.zx_ewm, reqBody, (data) => {
      if (data.state == 1002) {
        wx.setStorage({
          key: "xcx_code",
          data: data.img
        })
      } else {
        wx.setStorage({
          key: "xcx_code",
          data: false
        })
      }
    })
  },
  onSlideChangeEnd: function (e) {
    console.log(e.detail.current)
  },
  bindChange: function (e) { },
  start: function (e) {
    let x = e.changedTouches[0].pageX;
    this.setData({
      x
    })
  },
  end: function (e) {
    var current = this.data.current;
    var currentr = (this.data.fenle[this.data.fenlewz].current) - 1;
    var currents = (this.data.fenle[this.data.fenlewz].current) - 1;
    var fenlewz = this.data.fenlewz;
    if (this.data.x > e.changedTouches[0].pageX) {
      if (this.data.x - 10 > e.changedTouches[0].pageX) {
        console.log('向右');
        if (current < currentr) {
          this.setData({
            current: this.data.current + 1
          })
        } else if (current == currentr && fenlewz < 4) {
          var index = this.data.fenlewz + 1;
          var id = this.data.fenle[index].id;
          this.fenle_wz(index, id)
        }
      }
    } else if (this.data.x < e.changedTouches[0].pageX) {
      console.log('向左');
      if (current = 0) {
        this.setData({
          current: this.data.current - 1
        })
      } else if (fenlewz > 0) {
        var index = fenlewz - 1;
        var id = this.data.fenle[index].id;
        this.fenle_wz(index, id)
      }
    }
  },
  imageLoad: function (e) {
    var index = e.target.dataset.index;
    var type = e.target.dataset.type;
    if (type == 'banner') {
      var list = this.data.banner;
      list[index].load = true;
      this.setData({
        banner: list
      })
    } else if (type == 'hot') {
      var list = this.data.hotlist;
      list[index].load = true;
      this.setData({
        hotlist: list
      })
    } else if (type == 'tjlist') {
      var list = this.data.tjlist;
      list[index].load = true;
      this.setData({
        tjlist: list
      })
    }
  },
  fenle_wz: function (e, id) {
    if (id) {
      var index = e;
      var id = id
    } else {
      var index = e.currentTarget.dataset.index;
      var id = e.currentTarget.dataset.id
    }
    var fenle = this.data.fenle;
    this.setData({
      fenlewz: index,
      current: 0
    });
    this.Browsing(2, id)
  },
  remen: function (e) {
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    this.Browsing(1, id);
    wx.setStorage({
      key: "title",
      data: title
    })
  },
  djfl: function (e) {
    var e = e.currentTarget.dataset.id;
    this.Browsing(2, e)
  },
  Browsing: function (type, e) {
    var thda = this;
    if (type == 1) {
      var reqBody = {
        gid: e,
        openid: this.data.userinfo.openid
      }
    } else {
      var reqBody = {
        cid: e,
        openid: this.data.userinfo.openid
      }
    }
    util.post(util.url.zx_addView, reqBody, (data) => { })
  },
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      page_hd: true
    });
    var userinfo = this.data.userinfo;
    this.banner(userinfo.openid, 1);
    this.hotlist(userinfo.openid, 1);
    this.recCare(userinfo.openid, 1)
  },
  onReachBottom: function () {
    if (this.data.page_hd) {
      util.showLoading();
      var page = this.data.page + 1;
      this.setData({
        page
      });
      this.recCare(this.data.userinfo.openid, 1)
    }
  },
  click_index: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  onShareAppMessage: function () {
    //return this.data.shareData
  }
});