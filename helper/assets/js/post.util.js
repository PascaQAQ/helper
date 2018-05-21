import Axios from './axios.util'

var Post = ({ url, data }) => Axios({
  method: 'POST',
  url,
  data,
  transformRequest: [
    function (data) {
      let trans = ''
      for (let it in data) {
        trans += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return trans
    }
  ],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default Post
