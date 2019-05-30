// pages/personal/address.js
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        addressId: 705, uid: 5214, userName: "测试", phoneNum: "15522113322", contryId: 110101, address: "测试测试测试测试测试测试测试测试", contryInfo: { pName: "北京市", cName: "市辖区", xName: "东城区" }, isDefault: 1 },
      { addressId: 705, uid: 5214, userName: "测试", phoneNum: "15522113322", contryId: 110101, address: "测试测试", contryInfo: { pName: "北京市", cName: "市辖区", xName: "东城区" }, isDefault: 0 }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  click_xjdz: function(e){
    var mode = e.currentTarget.dataset.mode; 
    var url = ''
    if(mode == 0){
      url = 'add_address'
    }else{
      var index = e.currentTarget.dataset.index;
      var info = this.data.list[index]
      url = 'add_address?info=' + JSON.stringify(info)
    }
    wx.navigateTo({
      url: url
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})