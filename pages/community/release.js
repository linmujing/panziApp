var util = require('../../utils/util.js');
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
    baseUrl: 'https://vip2.pznrf.cn',
    baseUrl2: 'https://panzisns.oss-cn-shanghai.aliyuncs.com',
    // 提示
    notes: {
      txt: '',
      state: false
    },
    label: [],
    current: 0,
    showMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    this.getNotes()
    this.getCategory()
  },
  listToggle: function () {
    this.setData({
      showMore: !this.data.showMore
    })
  },
  getCategory() {
    var userInfo = wx.getStorageSync('userInfo');
    var reBody = {
      token: userInfo.token,
    };
    util.post(util.url.category, reBody, (res) => {
      if (res.state == 1) {
        var label = res.data.list
        this.setData({
          label: label
        })
        if (this.data.options.id) {
          for (var i = 0; i < label.length; i++) {
            if (label[i].id == this.data.options.id) {
              this.setData({
                current: i
              })
            }
          }
        }
      }
    })
  },
  getNotes() {
    var userInfo = wx.getStorageSync('userInfo');
    var reBody = {
      token: userInfo.token,
    };
    util.post(util.url.notes, reBody, (res) => {
      if (res.state == 1) {
        this.setData({
          'notes.txt': res.data
        })
      }
    })
  },
  close_notes: function () {
    this.setData({
      'notes.state': true
    })
  },
  release() {
    var userInfo = wx.getStorageSync('userInfo');
    var value = this.data.content
    var images = this.data.images
    var category_id = this.data.label[this.data.current].id
    if (value == '') {
      wx.showToast({
        title: '说点什么吧~',
        icon: "none"
      })
      return
    }
    if (images.length == 0) {
      wx.showToast({
        title: '还没有上传图片哦~',
        icon: "none"
      })
      return
    }
    // console.log(images)
    var reBody = {
      token: userInfo.token,
      images: images,
      content: value,
      category_id: category_id
    }
    wx.showLoading({
      title: '加载中',
    })
    util.post(util.url.add_sns, reBody, (res) => {
      wx.hideLoading()
      if (res.state == 1) {
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/community/community',
          })
        }, 600)
      } else {
        wx.showToast({
          title: res.info,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  select: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    that.setData({
      current: index
    })

  },
  // 获取文字
  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    // this.data.contentCount = value.length //计算已输入的正文字数
  },
  uploadImg: function () {
    var that = this;
    var images = that.data.images;
    if (images.length == 9) {
      wx.showToast({
        title: '已经到达上限了~',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var count = 9 - images.length;
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        var arr = res.tempFilePaths
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        that.uploadFile(0, arr)
      },
    })
  },
  uploadFile: function (i, arr) {
    var that = this
    var arr = arr
    console.log(arr)
    var images = that.data.images;
    var userInfo = wx.getStorageSync('userInfo');
    var token = userInfo.token
    var all_n = arr.length;
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
    if (i < all_n) {
      const uploadTask = wx.uploadFile({
        url: util.urlFront + 'sns/upload_img_oss?token=' + token, //这个方法就是后台处理上传的方法
        filePath: arr[i], //获取到上传的图片
        name: 'file',
        success: function (info) {
          var data = JSON.parse(info.data)
          if (data.state == 1) {
            images.push(data.url)
            // console.log(images)
            that.setData({
              images: images
            })
            wx.showLoading({
              title: '第' + (i + 1) + '张上传成功',
              mask: true
            })
            that.uploadFile(i + 1, arr)
          } else {
            wx.showLoading({
              title: '第' + (i + 1) + '张上传失败',
              mask: true
            })
            that.uploadFile(i + 1, arr)
          }
        }
      })
      uploadTask.onProgressUpdate((res) => {
        wx.showLoading({
          title: i + '/' + all_n + '上传至' + res.progress + '%',
          mask: true
        })
      })
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '上传完成',
        icon: 'none',
        duration: 1000
      })
    }

  },
  // 删除图片
  removeImage(e) {
    const idx = e.target.dataset.idx
    const list = this.data.images
    list.splice(idx, 1)
    this.setData({
      images: list
    })
  },

  // 预览图片
  handleImagePreview(e) {
    var idx = e.target.dataset.idx
    var img = this.data.images
    var list = []
    for (var i = 0; i < img.length; i++) {
      list.push(this.data.baseUrl2 + img[i])
    }
    wx.previewImage({
      current: list[idx], //当前预览的图片
      urls: list, //所有要预览的图片
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
  // onShareAppMessage: function () {

  // }
})