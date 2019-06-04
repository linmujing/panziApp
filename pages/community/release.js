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
    slecte: false,
    pics: [],
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

  // 上传图片
  uploadImg: function () {
    var that = this,
      images = this.data.images;
    if (this.data.images.length < 3) {
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // console.log(res.tempFilePaths)
          var userInfo = wx.getStorageSync('userInfo');
          var token = userInfo.token
          var images = []
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            wx.uploadFile({
              url: 'https://vip2.pznrfsy.com/index/sns/upload_imgs?token=' + token, //这个方法就是后台处理上传的方法
              filePath: res.tempFilePaths[i], //获取到上传的图片
              name: 'file',
              success: function (info) {
                var img = info.data
                // var imgs = []
                images.push(img)
                console.log(images)
                that.setData({
                  images: images
                })
                // console.log(images)
              }
            })
          }
          // console.log(imgs)
          // that.setData({
          //   imgs: imgs
          // })
          // wx.uploadFile({
          //   // url: 'https://vip2.pznrfsy.com/index/sns/upload_imgs?token=16b56a5232dedbd5a9dccf91826147f4', //这个方法就是后台处理上传的方法
          //   url: 'https://vip2.pznrfsy.com/index/sns/upload_imgs?token=' + token, //这个方法就是后台处理上传的方法
          //   filePath: res.tempFilePaths[0], //获取到上传的图片
          //   name: 'file',
          //   success: function (info) {
          //     var img = info.data
          //     var imgs = []
          //     imgs.push(img)
          //     console.log(imgs)
          //     that.setData({
          //       imgs: imgs
          //     })
          //     // console.log(images)
          //     // console.log(img); //info.data就是上传成功的图片名称 您可以在wxml里面搞一个隐藏域存储起来，在上面Submit提交里拼装一块提交出去
          //   }
          // })
        },
        complete: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          if (that.data.images.length == 2) {
            that.setData({
              img_button: 'none',
            })
          }
          images.push(res.tempFilePaths);
          that.setData({
            images: images,
          })
        }
      })
    }
  },

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


// 图片选择功能
// chooseImage(e) {
//   wx.chooseImage({
//     // count: 3,    
//     sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
//     sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
//     success: res => {
//       // console.log(res)
//       var imgs = res.tempFilePaths
//       console.log(imgs)
//       const images = this.data.images.concat(res.tempFilePaths)
//       // const images = this.data.images.concat(res.tempFilePaths)
//       // 限制最多只能留下9张照片
//       this.data.images = images.length <= 9 ? images : images.slice(0, 9)
//       console.log(this.data.images)
//       $digest(this)

//       for (var i = 0; i < this.data.images.length; i++) {
//         console.log(this.data.images[i])
//         var userInfo = wx.getStorageSync('userInfo');
//         var reqBody = {
//           token: userInfo.token,
//           file: this.data.images[i]
//           // file: images
//         }
//         util.post(util.url.upload_img, reqBody, (res) => {
//           console.log(res)
//           if (res.state == 1) {
//             var data = res.src
//             this.setData({
//               images: data
//             })
//           }
//         })
//       }


//       // var userInfo = wx.getStorageSync('userInfo');
//       // var reqBody = {
//       //   token: userInfo.token,
//       //   file: this.data.images
//       //   // file: images
//       // }
//       // util.post(util.url.upload_img, reqBody, (res) => {
//       //   console.log(res)
//       //   if (res.state == 1) {
//       //     var data = res.src
//       //     this.setData({
//       //       images: data
//       //     })
//       //   }
//       // })



//       // var images = this.data.images
//       // console.log(images)
//       // var images = that.data.images
//       // for (var i = 0; i < imgs.length; i++) {

//       //   // wx.getFileSystemManager().readFileSync({

//       //   wx.getFileSystemManager().readFile({
//       //     filePath: imgs[i],
//       //     // filePath: res.tempFilePaths[0], //选择图片返回的相对路径
//       //     encoding: 'base64', //编码格式

//       //     success: res => { //成功的回调
//       //       console.log(res)
//       //       // console.log('data:image/png;base64,' + res.data)
//       //       var img = 'data:image/png;base64,' + res.data
//       //       // console.log(img, typeof (img))
//       //       const images = this.data.images.concat(img)
//       //       images.push(img)

//       //       // console.log(images)

//       //       // var userInfo = wx.getStorageSync('userInfo');
//       //       // var reqBody = {
//       //       //   token: userInfo.token,
//       //       //   file: images
//       //       // }
//       //       // util.post(util.url.upload_img, reqBody, (res) => {
//       //       //   console.log(res)
//       //       //   if (res.state == 1) {
//       //       //     var data = res.src
//       //       //     this.setData({
//       //       //       images: data
//       //       //     })
//       //       //   }
//       //       // })
//       //     }
//       //   })
//       // }
//     }
//   })
// },


//启动上传等待中...
// wx.showToast({
//   title: '正在上传...',
//   icon: 'loading',
//   mask: true,
//   duration: 2000
// })