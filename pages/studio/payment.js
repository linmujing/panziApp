// pages/studio/payment.js
var util = require('../../utils/util.js');
Page({
  data: {
    oid: '',
    userinfo: '',
    hcimg: '',
    price: '',
    jifen: {
      msg: '积分余额不足！',
      state: true
    }
  },
  onLoad: function (options) {
    var thda = this;
    wx.getStorage({
      key: 'userInfo', success: function (res) {
        var userinfo = res.data;
        thda.setData({ oid: options.oid, hcimg: options.hcimg, price: options.price, userinfo })
      },
      fail: function () { wx.redirectTo({ url: '/pages/login/index' }) }
    })
  },
  zhifu: function () {
    var thda = this;
    var reqBody = { openid: this.data.userinfo.openid, oid: this.data.oid };
    util.post(util.url.create_pay, reqBody, (data) => {
      if (data.state == 1004) {
        console.log(data.info)
        thda.setData({
          'jifen.state': false,
          'jifen.msg': data.info
        })
        return
      } else if (data.state == 1002) {
        // var data=data.data;
        wx.redirectTo({
          url: '/pages/studio/completion?oid=' + thda.data.oid + '&hcimg=' + thda.data.hcimg + '&type=0&title=' + thda.data.title
        })
        // wx.requestPayment({
        //   'timeStamp':data.timeStamp,
        //   'nonceStr':data.nonce_str,
        //   'package':data.package,
        //   'signType':'MD5',
        //   'paySign':data.paySign,
        //   'success':function(res){
        //     wx.redirectTo({
        //       url:'completion?oid='+thda.data.oid+'&hcimg='+thda.data.hcimg+'&type=0&title='+thda.data.title
        //     })
        //   },
        //   'fail':function(res){}
        // })
      } else {
        wx.navigateBack({ changed: true })
      }
    })
  },
  click_panzi: function () {
    wx.navigateTo({
      url: '/pages/community/task',
    })
    // wx.navigateToMiniProgram({
    //   appId: 'wx62400f34c7d6628e',
    //   path: 'pages/login/index',
    //   // extraData: {
    //   //   foo: 'bar'
    //   // },
    //   envVersion: 'release',
    //   success(res) {
    //     // 打开成功
    //     console.log(res)
    //   },
    //   fail(res) {
    //     console.log(res)
    //   }
    // })
  }
});