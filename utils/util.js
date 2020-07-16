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

// const urlFront = 'https://vip2.pznrfsy.com/index/';
const urlFront = 'https://vip2.pznrf.cn/index/';
const urlFront2 = 'https://kpgl.pznrfsy.com/index/';
const urlFront3 = 'https://ceshi.pznrfsy.com/panzimall/';
const urlFront4 = 'https://zxg2.pznrfsy.com/index/'
const urlFront5 = 'http://kpgls.90cxkj.com/index/'
const urlFront6 = 'https://vip2.pznrfsy.com/index.php/'
const url = {
  payment: urlFront6 + '/index/photoshop/payment/',
  invite_list: urlFront6 + 'index/player/invite_list/', //邀约历史记录
  invite: urlFront6 + 'index/player/invite/', //邀约信息
  // dragon: urlFront6 + 'index/dragon/index',
  dial_list: urlFront6 + 'index/dial/dial_list', //转盘
  dial_log: urlFront6 + 'index/dial/dial_log', //转盘
  dial_prize: urlFront6 + 'index/dial/dial_prize', //转盘
  getcj: urlFront6 + 'index/dial/dial', //转盘抽奖
  cjtest: urlFront6 + 'index/dial/ceshi', //转盘抽奖测试

  zplotto: urlFront6 + 'index/integral/convert_goods_lotto', //转盘抽奖提交订单
  expire: urlFront6 + 'index/player/expire/', //积分过期提醒

  photoList: urlFront6 + 'index/photography/cameristnavyfzx',
  photoStoreList: urlFront6 + 'index/photography/camerismendian',

  invitation: urlFront6 + 'index/invitation/share',
  invitationLogin: urlFront6 + 'index/invitation/index',

  exchange: urlFront6 + 'index/exchange/index',
  camera: urlFront6 + 'index/camera/index',

  test_uploadImg: urlFront5 + 'api/upload_img', // 测试
  test_sborder: urlFront5 + 'api/sborder', // 测试

  jf_game: urlFront + 'h5/index', // 积分乐园
  game_list: urlFront + 'h5/index_content', // 游戏列表
  game_count: urlFront + 'h5/index_get', // 统计次数
  game_assist: urlFront + 'h5/share', // 分享助力请求增加游戏次数
  game_ranking: urlFront + 'h5/ranking', // 排行榜
  game_share: urlFront + 'Content/h5_share', // 分享数据

  pay_car: urlFront + 'shop/Pay_car', // 购物车提交订单支付
  myorder_new: urlFront + 'shop/myorder_new', // 我的订单新接口
  order_info_car: urlFront + 'shop/order_info_car', // 购物车下单订单详情
  goods_order_car: urlFront + 'shop/goods_order_car', // 购物车生成订单
  goods_nature: urlFront + 'car/goods_nature', // 购物车商品修改尺寸
  goods_del: urlFront + 'car/goods_del', // 购物车删除商品
  goods_reduce: urlFront + 'car/goods_reduce', // 购物车商品减数量
  goods_increase: urlFront + 'car/goods_increase', // 购物车商品加数量
  goods_price: urlFront + 'car/goods_price', // 购物车商品计算价格
  add_car: urlFront + 'car/add_car', // 加入购物车
  car_list: urlFront + 'car/car_list', // 购物车列表

  huaxu_share: urlFront + 'Content/huaxu_share', // 花絮分享进入页面
  assist: urlFront + 'picture/huaxu_share_sub', // 助力请求
  unlock: urlFront + 'picture/goods_order_share', // 解锁

  getHuaxuList: urlFront + 'picture/index', // 获取花絮订单列表
  getHuaxuItem: urlFront + 'picture/getlst', // 获取花絮图片列表
  goods_order: urlFront + 'picture/goods_order', // 生成订单
  goods_pay: urlFront + 'picture/goods_pay', // 付费
  hxDownload: urlFront + 'picture/download', // 下载高清图
  hxDownloadSucc: urlFront + 'picture/download_success', // 下载成功

  getMovies: urlFront + 'picture/video_index', // 获取我的视频列表
  getMoviesAR: urlFront + 'picture/video_index_ar', // 获取我的视频列表
  order_video: urlFront + 'picture/goods_order_video', // 购买视频生成订单

  yzsurvey: urlFront + 'survey/yzsurvey', // 验证是否已填写问卷调查
  survey: urlFront + 'survey/submission', // 提交问卷调查

  test: urlFront + 'test/test',


  check: urlFront + 'panfen/check', // 盘粉达人申请条件
  apply: urlFront + 'panfen/apply', // 盘粉达人提交信息
  send_sms: urlFront + 'panfen/send_sms', // 盘粉达人获取验证码

  verification: urlFront + 'verification/user', // 核销：是否是客户
  shopLogin: urlFront + 'verification/shop', // 核销：是否是客户
  businessInfo: urlFront + 'verification/info', // 核销：商户信息
  hxcheck: urlFront + 'verification/check', // 核销：商户信息

  wx_gqlist: urlFront2 + 'index/wx_gqlist',
  wx_list: urlFront2 + 'index/wx_lists',
  getdownloadImg: urlFront2 + 'index/getdownloadImg', // 获取资源完整地址
  getVideo: urlFront2 + 'index/video', // 获取订单视频
  downloadnum: urlFront2 + 'index/downloadnum', // 计算下载图片次数
  downloadgqnum: urlFront2 + 'index/downloadgqnum', // 计算下载高清图次数

  // sendFid: urlFront + 'index/sss',
  ad: urlFront + 'ad/ad', //授权后的广告
  ad_fsq: urlFront + 'index/ad', //授权前的
  ad_log: urlFront + 'ad/ad_log',
  login: urlFront + 'index/login',
  settel: urlFront + 'Player/settel',
  erporder: urlFront + 'Player/erporder',
  myewm: urlFront + 'Player/myewm',
  myewmlist: urlFront + 'Playercs/poster', //多二维码
  getUserInfo: urlFront + 'Player/index',
  myjifen: urlFront + 'Player/myjifen',
  myjunior: urlFront + 'Player/myjunior',
  addnegative: urlFront + 'Player/addnegative',

  province: urlFront + 'integral/inquire',
  addrList: urlFront + 'shop/profile',
  addAddr: urlFront + 'shop/address',
  delAddr: urlFront + 'shop/delAddress',

  hanfuList: urlFront + 'shop/goods_list_new', // 汉服列表
  hfclientList: urlFront + 'shop/goods_list_new_tc',
  recommend_new: urlFront + 'shop/istj_new',
  goodsOrder_new: urlFront + 'shop/goods_order_new', // 汉服立即购买生成订单
  pay: urlFront + 'shop/pay',
  copePay: urlFront + 'shop/copePay', // 汉服提交支付

  my_log: urlFront + 'shop/zp_log',
  my_prize: urlFront + 'shop/zp_prize',
  wheelSurf: urlFront + 'shop/goods_zp',
  prize_list: urlFront + 'shop/goods_list_zp',
  activity_list: urlFront + 'shop/goods_advert',
  lottoList: urlFront + 'shop/goods_list_lotto',
  goods_lotto: urlFront + 'shop/goods_lotto',
  convert_lotto: urlFront + 'shop/convert_goods_lotto', // 抽奖
  lotto_list: urlFront + 'shop/lotto_list',
  goods_classify: urlFront + 'shop/goods_classify',
  pay_goods: urlFront + 'shop/Pay_goods', // 积分+支付

  goodsList: urlFront + 'shop/goods_list',
  goodsInfo: urlFront + 'shop/goods_info',
  goodsOrder: urlFront + 'shop/goods_order', // 积分兑换生成订单
  orderInfo: urlFront + 'shop/order_info',
  orderConvert: urlFront + 'shop/convert_goods', // 积分确认兑换
  recommend: urlFront + 'content/istj',
  myOrder: urlFront + 'shop/myOrder',
  finish_order: urlFront + 'shop/finish_order',
  delOrder: urlFront + 'shop/delOrder',

  signData: urlFront + 'sign/index',
  checkIn: urlFront + 'sign/sign',
  signRecord: urlFront + 'sign/sign_record',
  welfare: urlFront + 'sign/welfare',
  welfare2: urlFront + 'sign/welfare2', //积分规则的富文本

  index: urlFront + 'Content/column',
  gywm: urlFront + 'Content/gywm',

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

  dailytasks: urlFront + 'sns/dailytasks',
  shareCode: urlFront + 'sns/share',
  notes: urlFront + 'sns/sns_config',
  category: urlFront + 'sns/categorys',
  index_list: urlFront + 'sns/index_list',
  index_lists: urlFront + 'sns/index_lists',
  details: urlFront + 'sns/details',
  details_comment: urlFront + 'sns/details_comment',
  add_content: urlFront + 'sns/add_content',
  // upload_img: urlFront + 'sns/upimg_base64',
  upload_img: urlFront + 'sns/upload_imgs',

  add_sns: urlFront + 'sns/add_sns',
  edit_sns: urlFront + 'sns/edit_sns',
  my_list: urlFront + 'sns/my_list',
  del_sns: urlFront + 'sns/del_sns',
  search: urlFront + 'sns/search',
  ranking: urlFront + 'shop/ranking',
  amendindex: urlFront + 'Player/amendindex',

  slicesCat: urlFront + 'Content/slicesCat',
  slicesList: urlFront + 'Content/slicesList',
  slicesInfo: urlFront + 'Content/slicesInfo',

  // 在线照相馆接口
  // getPhone: urlFront4 + 'homes/getPhone',
  // login: urlFront4 + 'user/login',
  zx_banner: urlFront4 + 'homes/banner',
  zx_hotlist: urlFront4 + 'goods/hotlist',
  zx_hotlistr: urlFront4 + 'user/hotlist',

  zx_getList: urlFront4 + 'category/getList',
  zx_recCare: urlFront4 + 'homes/recCare',
  // recCare: urlFront4 + 'index/recCare',        // 首页数据
  recCare: urlFront4 + 'index/hotList', // 首页数据

  zx_cateList: urlFront4 + 'goods/cateList',
  plate: urlFront4 + 'homes/plate',
  zx_ewm: urlFront4 + 'homes/ewm',
  userUpload: urlFront4 + 'file/userUpload',
  zx_getUserImg: urlFront4 + 'homes/getUserImg',
  zx_del_img: urlFront4 + 'homes/del_img',

  getTopCate: urlFront4 + 'homes/getTopCate',
  zx_getImg: urlFront4 + 'file/getImg',

  create_order: urlFront4 + 'order/create_order',
  create_pay: urlFront4 + 'order/create_pay',
  getKimg: urlFront4 + 'goods/getKimg',


  zx_orderList: urlFront4 + 'order/order_list',
  zx_delOrder: urlFront4 + 'order/delOrder',

  zx_orderInfo: urlFront4 + 'order/order_info',

  zx_addView: urlFront4 + 'homes/addView',

  zx_getInfo: urlFront4 + 'Eject/getInfo',

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
        wx.redirectTo({
          url: '/pages/login/index',
        })
      } else if (res.data.code == 1008) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
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

function showLoading(title = "加载中", duration = 2000) {
  wx.showToast({
    title: title,
    icon: 'loading',
    duration: (duration <= 0) ? 2000 : duration
  });
}

function hideToast() {
  wx.hideToast();
}

// 预约拍摄链接
function appointment(num, success) {
  var userInfo = wx.getStorageSync('userInfo');
  var that = this
  var reqBody = {
    token: userInfo.token,
    seat: num
  };
  _post(url.ad, reqBody, (res) => {
    success(res)
  })
}

function click_url(type, url) {
  //type = 1 外链  2 内链
  if (url == '') {
    return
  }
  if (type == 1) {
    getApp().globalData.webView = url;
    wx.navigateTo({
      url: '/pages/index/webView'
    })
  } else {
    wx.navigateTo({
      url: url,
    })
  }
}

module.exports = {
  formatTime: formatTime,
  post: _post,
  url: url,
  urlFront: urlFront,
  showLoading: showLoading,
  appointment: appointment,
  click_url: click_url
}