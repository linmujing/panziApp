// pages/personal/add_address.js
// var area = require('../../utils/area_data.js'); 
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*地区 */
    area_state: false,
    province: {},
    province_active: 0,
    city: {},
    city_active: 0,
    area: {},
    area_active: 0,
    /*地区 End */

    isIPX: getApp().globalData.isIPX,
    region: [],
    regionr: [{
      name: '请选择',
      code: ""
    }, {
      name: '请选择',
      code: ""
    }, {
      name: '请选择',
      code: ""
    }],
    user: {
      uid: 100001
    },
    page_data: {
      'addressId': '',
      'userName': '',
      'phoneNum': '',
      'contryId': '',
      'address': '',
      'isDefault': 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo
    })
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
    }
    if (options.info) {
      var data = JSON.parse(options.info)
      console.log(data)
      this.setData({
        'page_data.addressId': data.id,
        'page_data.userName': data.consignee,
        'page_data.phoneNum': data.consignee_tel,
        'page_data.contryId': data.area,
        'page_data.isDefault': data.type,
        'page_data.address': data.append,
        'regionr[0].name': data.provinces,
        'regionr[1].name': data.citys,
        'regionr[2].name': data.areas,
      })
    }
    this.getProvince()
    // this.setData({
    //   province: area.area_data
    // })
  },
  getProvince: function () {
    var that = this
    var reqBody = {
      token: that.data.userInfo.token
    };
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    util.post(util.url.province, reqBody, (res) => {
      wx.hideLoading()
      that.setData({
        province: res
      })
      that.blishuji(2, 0);
    })
  },
  blishuji: function (e, active) { //2级 3级
    if (e == 2) {
      var city = this.data.province[active].child;
      this.setData({
        city,
        city_active: active
      })
      this.blishuji(3, 0);
    } else if (e == 3) {
      var area = this.data.city[active].child;
      this.setData({
        area,
        area_active: active
      })
    }
  },
  bindChange: function (e) {
    // console.log(e);
    var province = this.data.province;
    var value = e.detail.value;
    var active1 = value[0];
    var active2 = value[1];
    var active3 = value[2];
    // console.log(province)
    console.log(value)
    this.setData({
      value: value
    })
    if (active1 != this.data.province_active) {
      var city = this.data.province[active1].child;
      this.setData({
        province_active: active1,
        city
      })
      this.blishuji(3, 0);
    }
    if (active2 != this.data.city_active) {
      var area = this.data.city[active2].child;
      this.setData({
        city_active: active2,
        area,
        area_active: 0,
      })
    }
    if (active3 != this.data.city_active) {
      this.setData({
        area_active: active3,
      })
    }
  },
  click_Area_window: function () {
    this.setData({
      area_state: true
    })
  },
  click_dqsjqx: function () {
    console.log('取消');
    this.setData({
      area_state: false
    })
  },
  click_dqsjqd: function () {
    console.log('确定')
    this.setData({
      area_state: false
    })
    var province = this.data.province[this.data.province_active];
    var city = this.data.city[this.data.city_active];
    var area = this.data.area[this.data.area_active];
    console.log(province)
    console.log(city)
    console.log(area)
    var regionr = [{
        name: province.cityName,
        code: province.codeid
      },
      {
        name: city.cityName,
        code: city.codeid
      }, {
        name: area.cityName,
        code: area.codeid
      }
    ]
    this.setData({
      regionr,
      'page_data.contryId': area.codeid
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
  click_userName: function (e) {
    this.setData({
      'page_data.userName': e.detail.value
    })
  },
  click_phoneNum: function (e) {
    this.setData({
      'page_data.phoneNum': e.detail.value
    })
  },
  click_address: function (e) {
    this.setData({
      'page_data.address': e.detail.value
    })
  },
  click_mrdz: function () {
    console.log(this.data.page_data.isDefault)
    if (this.data.page_data.isDefault) {
      this.setData({
        'page_data.isDefault': 0
      })
    } else {
      this.setData({
        'page_data.isDefault': 1
      })
    }
  },
  click_qx: function () {
    wx.navigateBack()
  },
  click_bc: function () {
    var pattern = /^[\u4E00-\u9FA5]{2,10}$/; //姓名
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
      regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im; //特殊字符
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/; //电话
    if (!this.data.page_data.userName) {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // else if (!pattern.test(this.data.page_data.userName)) {
    //   wx.showToast({
    //     title: '收货人格式错误(请输入中文名称2~10个字)',
    //     icon: "none",
    //     duration: 2000
    //   })
    //   return
    // }

    if (!this.data.page_data.phoneNum) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (!myreg.test(this.data.page_data.phoneNum)) {
      wx.showToast({
        title: '联系电话格式错误',
        icon: "none",
        duration: 1000
      })
      return
    }
    if (!this.data.page_data.contryId) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.page_data.address) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var data = this.data.page_data;
    var regionr = this.data.regionr;
    // var province = regionr[0].code;
    // var city = regionr[1].code;
    // var area = regionr[2].code;
    var addressId = ''
    if (this.data.page_data.addressId) {
      addressId = this.data.page_data.addressId
    }
    var reqBody = {
      token: this.data.userInfo.token,
      id: addressId,
      consignee: data.userName,
      consignee_tel: data.phoneNum,
      area: data.contryId,
      append: data.address,
      type: data.isDefault
    };
    util.post(util.url.addAddr, reqBody, (res) => {
      if (res.state == 1) {
        wx.showToast({
          title: '保存成功',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
      }
    })

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

  }
})