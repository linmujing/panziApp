var util = require('../../utils/util.js');
import {
  $init,
  $digest
} from '../../utils/common.util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    content: '', //正文内容
    position: "我的位置",
    slecte: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    $init(this)
  },

  release() {
    var userInfo = wx.getStorageSync('userInfo');
    var value = this.data.content
    var images = this.data.images
    var reBody = {
      token: userInfo.token,
      images: images,
      content: value,
      category_id: 3
    }
    util.post(util.url.add_sns, reBody, (res) => {
      console.log(res)
      if (res.state == 1) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.reLaunch({
            url: './community'
          })
        }, 2000)
      }
    })
  },
  // 获取文字
  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    // this.data.contentCount = value.length //计算已输入的正文字数
    $digest(this)
  },

  // 图片选择功能
  chooseImage(e) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log(res)

        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            console.log(res)
            console.log('data:image/png;base64,' + res.data)
            var img = 'data:image/png;base64,' + res.data
            console.log(img)
            var userInfo = wx.getStorageSync('userInfo');
            var reBody = {
              token: userInfo.token,
              file: img
            }
            util.post(util.url.upload_img, reBody, (res) => {
              console.log(res)
              if (res.state == 1) {
                var data = res.src
                const images = this.data.images.concat(data)

                // 限制最多只能留下3张照片
                this.data.images = images.length <= 9 ? images : images.slice(0, 9)
                $digest(this)

                console.log(this.data.images)
                // this.setData({
                //   images: data
                // })
              }
            })
          }
        })
      }
    })
  },





  // // 图片选择功能
  // chooseImage(e) {
  //   wx.chooseImage({
  //     sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
  //     sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
  //     success: res => {
  //       console.log(res)
  //       const images = this.data.images.concat(res.tempFilePaths)

  //       // 限制最多只能留下3张照片
  //       this.data.images = images.length <= 3 ? images : images.slice(0, 3)
  //       $digest(this)

  //       console.log(this.data.images)

  //       var userInfo = wx.getStorageSync('userInfo');
  //       var reBody = {
  //         token: userInfo.token,
  //         file: res.tempFilePaths[0]
  //       }
  //       util.post(util.url.upload_img, reBody, (res) => {
  //         console.log(res)
  //         // if (res.state == 1) {
  //         //   var list = res.data
  //         //   this.setData({
  //         //     details: list
  //         //   })
  //         // }
  //       })
  //     }
  //   })
  // },


  // 删除图片
  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },
  // 预览图片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  // 点击取消返回页面
  cancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取定位
  qqMapApi: 'http://apis.map.qq.com/ws/geocoder/v1/',
  getPosition() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        // wx.setStorageSync('latitude', latitude) //纬度
        // wx.setStorageSync('longitude', longitude) //经度
        var qqMapApi = that.qqMapApi + "?location=" + latitude + ',' +
          longitude + "&key=" + 'XVLBZ-BSU66-ULJSQ-MFGXD-TM7GZ-55F2M' + "&get_poi=1";
        wx.request({
          url: qqMapApi,
          data: {},
          method: 'GET',
          success: (res) => {
            console.log(res)
            if (res.statusCode == 200 && res.data.status == 0) {
              let country = res.data.result.address_component.nation;
              // 国家
              console.log(country)
              let province = res.data.result.address_component.province;
              // 省
              console.log(province)
              let city = res.data.result.address_component.city;
              // 市
              console.log(city)
              let county = res.data.result.address_component.district;
              // 区
              console.log(county)
              let street = res.data.result.address_component.street;
              // 街道
              console.log(street)
              that.setData({
                position: city,
                slecte: true
              })
            }
          }
        })
      },
      fail() {
        that.fn_fail();
      }
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