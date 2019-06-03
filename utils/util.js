const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const urlFront = 'https://vip2.pznrfsy.com/index/';
const url = {
  login: urlFront + 'index/login',
  settel: urlFront + 'Player/settel',
  erporder: urlFront + 'Player/erporder',

  addrList: urlFront + 'integral/profile',
  addAddr: urlFront + 'integral/address',
  delAddr: urlFront + 'integral/delAddress',

  goodsList: urlFront + 'integral/goods_list',
  goodsInfo: urlFront + 'integral/goods_info',
  goodsOrder: urlFront + 'integral/goods_order',
  orderInfo: urlFront + 'integral/order_info',
  orderConvert: urlFront + 'integral/convert_goods',
  recommend: urlFront + 'integral/istj',
  myOrder: urlFront + 'integral/myOrder',
  finish_order: urlFront + 'integral/finish_order',

  signData: urlFront + 'sign/index',
  checkIn: urlFront + 'sign/sign',
  signRecord: urlFront + 'sign/sign_record',

  index: urlFront + 'Content/column',

  commentInfo: urlFront + 'Content/bookInfo',
  commentList: urlFront + 'Content/bookList',

  starList: urlFront + 'Content/mxhzList',
  starInfo: urlFront + 'Content/mxhzInfo',
  movieList: urlFront + 'Content/yshzList',

  storeList: urlFront + 'Content/storeList',
  storeInfo: urlFront + 'Content/storeInfo',

  themeCat: urlFront + 'Content/themeCat',
  themeList: urlFront + 'Content/themeList',
  themeInfo: urlFront + 'Content/themeInfo',
  themeZan: urlFront + 'Content/themeZan',

  videoList: urlFront + 'Content/videoList',

  category: urlFront + 'sns/category',
  index_list: urlFront + 'sns/index_list',
  details: urlFront + 'sns/details',
  details_comment: urlFront + 'sns/details_comment',
  add_content: urlFront + 'sns/add_content',
  // upload_img: urlFront + 'sns/upimg_base64',
  upload_img: urlFront + 'sns/upload_img',

  add_sns: urlFront + 'sns/add_sns',
  edit_sns: urlFront + 'sns/edit_sns',
  my_list: urlFront + 'sns/my_list',
  del_sns: urlFront + 'sns/del_sns',
  search: urlFront + 'sns/search',

  slicesList: urlFront + 'Content/slicesList',
  slicesInfo: urlFront + 'Content/slicesInfo',

}

function _post(url, data, success, isLoading = true) {
  var header = {
    "content-type": "application/json"
  };
  wx.request({
    url: url,
    data: data,
    method: 'post',
    header: header,
    success: function (res) {
      // token错误
      if (res.data.code == -1) {
        wx.clearStorageSync()
        wx.navigateTo({
          url: '/pages/login/index',
        })
      }
      if (res.data.state == '1002') {
        success(res.data);
      } else if (res.data.state == '1004' && res.data.info == '用户未登陆') {
        showFais(res.data.info, 2000)
        wx.clearStorage();
        wx.redirectTo({
          url: '/pages/index/index'
        })
      } else {
        success(res.data);
      }

    },
    fail: function (res) {
      success(res.data);
      console.log(res)
      hideToast()
      showFail('网络超时', 2000)
    }
  });
}

function showFais(title = "网络超时", duration = 2000) {
  wx.showToast({
    title: title,
    image: '/images/none.png',
    duration: (duration <= 0) ? 2000 : duration
  });
}

function showFail(title = "网络超时", duration = 2000) {
  wx.showToast({
    title: title,
    image: '/images/cancel.png',
    duration: (duration <= 0) ? 2000 : duration
  });
}

function hideToast() {
  wx.hideToast();
}
module.exports = {
  formatTime: formatTime,
  post: _post,
  url: url
}