// pages/personal/pfApply_info.js
var util = require('../../utils/util.js');
var CountTime = require("../../utils/countTime.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    sex: '2',
    tel: null,
    yzcode: null,
    items: [{
      value: '女士',
      checked: true,
      id: 2
    }, {
      value: '先生',
      checked: false,
      id: 1
    }],
    birth: '',
    flag: false,
    imgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 验证码倒计时
    this.time = new CountTime(this);
  },

  // 获取name
  bindBlurName(e) {
    this.setData({
      name: e.detail.value,
    })
  },

  // 获取手机号码
  bindBlurTel(e) {
    this.setData({
      tel: e.detail.value,
    })
  },

  // 获取验证码
  getCode() {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    var tel = that.data.tel
    var reqBody = {
      tel,
      token: userInfo.token
    };
    if (!that.data.flag) {
      if (!tel) {
        wx.showToast({
          title: '请输入手机号码！',
          icon: 'none',
          duration: 1000
        })
      } else {
        util.post(util.url.send_sms, reqBody, (res) => {
          // console.log(res)
          wx.showToast({
            title: res.info,
            icon: 'none',
            duration: 1000
          })
          if (res.state == 1) {
            that.time.countTime();
          }
        })
      }
      // that.getCodeData();
    } else {
      wx.showToast({
        title: '请不要急躁，60s后再次获取！',
        icon: 'none',
        duration: 1000
      })
    }
    // }
    // else {
    //   wx.showToast({
    //     title: '手机号码格式不正确，请重新输入！',
    //     icon: 'none',
    //     duration: 1000
    //   })
    // }
  },

  // 上传图片并旋转
  uploadFrontImg: function (e) {
    var that = this;
    const front = wx.createCanvasContext('front')
    const back = wx.createCanvasContext('back')
    //定义为px单位
    var imgWidth = 300;
    var imgHeight = 150;

    wx.chooseImage({
      count: 1,
      // count: count, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var arr = res.tempFilePaths
        if (e.currentTarget.dataset.sign == 1) {
          var look = 1
          that.uploadFile(look, arr) //上传图片接口方法
        } else if (e.currentTarget.dataset.sign == 2) {
          var look = 2
          that.uploadFile(look, arr) //上传图片接口方法
        }

        wx.getFileSystemManager().readFile({ //读取本地文件
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success(base) {
            wx.getImageInfo({ //获取图片信息
              src: res.tempFilePaths[0],
              success: function (info) {
                //旋转正面照
                if (e.currentTarget.dataset.sign == 1) {
                  if (info.height > info.width) {
                    // console.log('旋转270度')
                    front.rotate(90 * Math.PI / 180);
                    front.drawImage(res.tempFilePaths[0], 0, -300, imgHeight, imgWidth)
                  } else {
                    front.drawImage(res.tempFilePaths[0], 0, 0, imgWidth, imgHeight, 0, 0)
                  }
                  front.draw()
                } else if (e.currentTarget.dataset.sign == 2) {
                  //反面照
                  if (info.height > info.width) {
                    // console.log('旋转270度')
                    back.rotate(90 * Math.PI / 180);
                    back.drawImage(res.tempFilePaths[0], 0, -300, imgHeight, imgWidth)
                  } else {
                    back.drawImage(res.tempFilePaths[0], 0, 0, imgWidth, imgHeight, 0, 0)
                  }
                  back.draw()
                }
                // wx.hideLoading()
              }
            })
          }
        })
      },
      complete: function (res) {}
    })
  },

  // 上传图片接口
  uploadFile: function (look, arr) {
    var that = this
    var arr = arr
    var look = look
    // var images = that.data.images;
    var userInfo = wx.getStorageSync('userInfo');
    var token = userInfo.token
    // var all_n = arr.length;
    wx.setKeepScreenOn({ //保持屏幕常亮
      keepScreenOn: true
    })
    wx.uploadFile({
      url: util.urlFront + 'panfen/uploadimg?token=' + token, //这个方法就是后台处理上传的方法
      filePath: arr[0], //获取到上传的图片
      name: 'file',
      success: function (info) {
        // console.log(info)
        var data = JSON.parse(info.data)
        if (look == 1) {
          if (data.state == 1) {
            // images.push(data.url)
            that.setData({
              frontUrl: data.url
            })
          } else {}
        } else if (look == 2) {
          if (data.state == 1) {
            // images.push(data.url)
            that.setData({
              backUrl: data.url
            })
          } else {}
        }
      }
    })
  },

  // 出生日期
  bindDateChange: function (e) {
    this.setData({
      birth: e.detail.value
    })
  },

  // 性别
  radioChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },

  //验证码
  bindBlurCode(e) {
    this.setData({
      // code: e.detail.value,
      yzcode: e.detail.value,
    })
  },

  // 保存提交
  preserve() {
    var that = this
    var userInfo = wx.getStorageSync('userInfo');
    var name = that.data.name
    var sex = that.data.sex
    var yzcode = that.data.yzcode
    var birth = that.data.birth
    var token = userInfo.token
    var tel = that.data.tel
    var front = that.data.frontUrl
    var aspect = that.data.backUrl

    if (name == '') {
      wx.showToast({
        title: '请输入您的名字！',
        icon: "none",
        duration: 800
      })
      return
    }
    if (sex == "") {
      wx.showToast({
        title: '请选择性别',
        icon: "none",
        duration: 800
      })
      return
    }
    if (birth == "") {
      wx.showToast({
        title: '请选择出生日期',
        icon: "none",
        duration: 800
      })
      return
    }
    if (!yzcode) {
      wx.showToast({
        title: '请输入验证码！',
        icon: "none",
        duration: 800
      })
      return
    }
    if (!front || !aspect) {
      wx.showToast({
        title: '请提交认证证件信息!',
        icon: "none",
        duration: 800
      })
      return
    }

    var reBody = {
      token,
      name,
      sex,
      birth,
      front,
      aspect,
      code: yzcode,
      tel
    }
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.apply, reBody, (res) => {
      wx.hideLoading()
      console.log(res)
      if (res.state == 1) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/personal/index',
          })
        }, 1000)
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  // 取消
  cancel() {
    wx.switchTab({
      url: '/pages/personal/index',
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})