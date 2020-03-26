// pages/studio/preview.js
var util = require('../../utils/util.js');
Page({
  data: {
    xitong: '',
    imgloadr: false,
    imgloads: false,
    pagezt: false,
    userinfo: '',
    cid: '',
    yhimgid: '',
    scid: '',
    hcimg: '',
    hcid: '',
    price: '',
    status: '',
    watermark: false,
    Loadstate: false,
    active: 0,
    listi: 0,
    yj_list: [],
    list: [],
    list_state: true
  },
  imageOnLoad(e) {
    var thda = this;
    console.log('图片加载');
    if (this.data.imgloads) {
      setTimeout(function () {
        thda.setData({
          imgloadr: true
        })
      }, 500)
    } else {
      this.setData({
        imgloadr: true
      })
    }
  },
  onLoad: function (options) {
    console.log(options)
    var xitong = wx.getStorageSync('xitong');
    this.setData({
      xitong
    })
    var thda = this;
    thda.setData({
      pagezt: true,
      cid: options.cid,
      yhimgid: options.yhimgid,
      scid: options.scid,
      hcimg: options.hcimg,
      hcid: options.hcid
    });
    var datar = {
      cid: options.cid,
      yhimgid: options.yhimgid,
      scid: options.scid,
      hcimg: options.hcimg,
      hcid: options.hcid
    };
    wx.setStorage({
      key: "hcdata",
      data: datar
    });
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        var userinfo = res.data;
        thda.setData({
          userinfo
        });
        thda.getTopCate(userinfo.openid);
      },
      fail: function () {
        wx.redirectTo({
          url: '/pages/login/index'
        })
      }
    })
  },
  getTopCate: function (e) {
    var reqBody = {
      openid: e,
      gid: this.data.scid
    };
    util.post(util.url.getTopCate, reqBody, (data) => {
      if (data.state == 1002) {
        var dqi = 0;
        for (var i = 0; i < data.list.length; i += 1) {
          if (this.data.cid == data.list[i].id) {
            dqi = i;
            this.setData({
              active: i
            })
          }
        }
        this.cateList(data.list[dqi].id, 0, true);
        if (dqi != 0) {
          var fruits = data.list;
          fruits.unshift(data.list[dqi]);
          var index = dqi + 1;
          if (index > -1) {
            fruits.splice(index, 1)
          }
          this.setData({
            active: 0
          })
        }
        this.setData({
          yj_list: data.list
        })
      }
    })
  },
  cateList: function (id, index, zhuangta) {
    var reqBody = {
      openid: this.data.userinfo.openid,
      cid: id,
      p: 1,
      num: 100
    };
    util.post(util.url.zx_cateList, reqBody, (data) => {
      this.setData({
        list_state: false
      });
      if (data.state == 1002) {
        if (this.data.pagezt) {
          var dqi = 0;
          for (var i = 0; i < data.list.length; i += 1) {
            if (this.data.scid == data.list[i].id) {
              dqi = i;
              this.setData({
                listi: i,
                status: data.list[i].status,
                price: data.list[i].price
              });
              if (data.list[i].status == 1) {
                this.setData({
                  watermark: true
                })
              } else {
                this.setData({
                  watermark: false
                })
              }
            }
          }
          //console.log(zhuangta);
          //console.log(dqi);
          if (zhuangta) {
            var fruits = data.list;
            fruits.unshift(data.list[dqi]);
            var inder = dqi + 1;
            if (inder > -1) {
              fruits.splice(inder, 1)
            }
            this.setData({
              listi: 0
            })
          }
        }
        var yili = this.data.yj_list[index];
        var yj_list = this.data.yj_list;
        yili.list = data.list;
        yj_list[index] = yili;
        this.setData({
          yj_list,
          list: data.list,
          pagezt: false
        })
      }
    })
  },
  fenlei: function (e) {
    var active = e.currentTarget.dataset.index;
    this.setData({
      active
    });
    var yj_li = this.data.yj_list[active];
    if (yj_li.list) {
      var list = yj_li.list;
      this.setData({
        list
      })
    } else {
      this.cateList(e.currentTarget.dataset.id, active);
      this.setData({
        list_state: true
      })
    }
    this.setData({
      listi: false
    });
    wx.getStorage({
      key: 'hcdata',
      success: function (res) {
        var datar = res.data;
        datar.cid = e.currentTarget.dataset.id;
        wx.setStorage({
          key: "hcdata",
          data: datar
        })
      }
    })
  },
  click_list: function (e) {
    var title = e.currentTarget.dataset.title;
    wx.setStorage({
      key: "title",
      data: title
    })
    this.setData({
      listi: e.currentTarget.dataset.index,
      status: e.currentTarget.dataset.status,
      scid: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price
    });
    wx.getStorage({
      key: 'hcdata',
      success: function (res) {
        var datar = res.data;
        datar.scid = e.currentTarget.dataset.id;
        wx.setStorage({
          key: "hcdata",
          data: datar
        })
      }
    });
    var make = e.currentTarget.dataset.make;
    console.log('点击切换');
    if (make) {
      var data = this.data.list[e.currentTarget.dataset.index].data;
      if (e.currentTarget.dataset.status == 1) {
        this.setData({
          watermark: true
        })
      } else {
        this.setData({
          watermark: false
        })
      }
      if (data.status == 1) {
        this.setData({
          status: 3
        })
      }
      this.setData({
        hcimg: data.image,
        hcid: data.rid
      });
      wx.getStorage({
        key: 'hcdata',
        success: function (res) {
          var datar = res.data;
          datar.hcimg = data.image;
          datar.hcid = data.rid;
          wx.setStorage({
            key: "hcdata",
            data: datar
          })
        }
      });
      this.setData({
        Loadstate: false
      })
    } else {
      this.setData({
        Loadstate: true
      });
      this.getImg(e.currentTarget.dataset.id, e.currentTarget.dataset.status);
    }
  },
  goumai: function () {
    var reqBody = {
      openid: this.data.userinfo.openid,
      resimg: this.data.hcid,
      gid: this.data.scid
    };
    util.post(util.url.create_order, reqBody, (data) => {
      if (data.state == 1002) {
        wx.navigateTo({
          url: 'payment?oid=' + data.data + '&hcid=' + this.data.hcid + '&hcimg=' + this.data.hcimg + "&price=" + this.data.price
        })
      }
    })
  },
  huanzhuan: function () {
    var reqBody = {
      openid: this.data.userinfo.openid,
      resimg: this.data.hcid,
      gid: this.data.scid
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.create_order, reqBody, (data) => {
      wx.hideLoading()
      if (data.state == 1002) {
        wx.navigateTo({
          url: 'completion?oid=' + data.data + '&hcid=' + this.data.hcid + '&hcimg=' + this.data.hcimg + '&type=1'
        })
      }
    })
  },
  getImg: function (e, stater) {
    this.setData({
      imgloads: true
    });
    var reqBody = {
      openid: this.data.userinfo.openid,
      mid: this.data.yhimgid,
      gid: e
    };
    util.post(util.url.zx_getImg, reqBody, (data) => {
      if (stater == 1) {
        this.setData({
          watermark: true
        })
      } else {
        this.setData({
          watermark: false
        })
      }
      this.setData({
        Loadstate: false
      });
      if (data.state == 1002) {
        this.setData({
          imgloadr: false
        });
        if (data.status == 1) {
          this.setData({
            status: 3
          })
        }
        this.setData({
          hcimg: data.image,
          hcid: data.rid
        });
        var yjli = this.data.yj_list[this.data.active].list[this.data.listi];
        var llsr = this.data.list[this.data.listi];
        yjli.make = true;
        yjli.data = data;
        llsr.make = true;
        llsr.data = data;
        this.setData({
          yj_list: this.data.yj_list,
          list: this.data.list
        });
        wx.getStorage({
          key: 'hcdata',
          success: function (res) {
            var datar = res.data;
            datar.hcimg = data.image;
            datar.hcid = data.rid;
            wx.setStorage({
              key: "hcdata",
              data: datar
            })
          }
        })
      } else {
        console.log('请求失败');
        this.setData({
          imgloadr: true
        });
        if (data.ret) {
          wx.showModal({
            content: "出现错误，错误码" + data.ret,
            showCancel: false,
            confirmText: "我知道了"
          })
        } else {
          if (data.info) {
            wx.showModal({
              content: data.info,
              showCancel: false,
              confirmText: "我知道了"
            })

          } else {
            wx.showModal({
              content: '请求失败,请重试',
              showCancel: false,
              confirmText: "我知道了"
            })
          }
        }
      }
    })
  },
  scroll: function (e) { }
});