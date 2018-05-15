import axios from 'axios'

var isBrowser = typeof window !== 'undefined'

var Axios = axios.create({
  baseURL: isBrowser ? 'https://api.huthelper.cn' : 'http://server_api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true
})

export default Axios
