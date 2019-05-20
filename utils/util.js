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

// const urlFront = 'https://ljj.pznrfsy.com/index/';
const url = {
  // login: urlFront + 'login/login',
  // send_sms: urlFront + 'sms/send_sms',
  // bind_tel: urlFront + 'sms/bind_tel',
}
function _post(url, data, success, isLoading = true) {
  var header = { "content-type": "application/json" };
  wx.request({
    url: url,
    data: data,
    method: 'post',
    header: header,
    success: function (res) {
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
