import sha1 from 'sha1'
import React from 'react'
import Trans from '../trans'
import store from '../../store'
import dataformat from 'dateformat'
import Axios from '../../assets/js/axios.util'
import { toastIt } from '../../components/toast/toast'

import '../../assets/css/common/upload.less'

export default class Upload extends React.Component {
  constructor(props) {
    super(props)
    
    var id = store.userData.data.studentKH
    var code = store.userData.remember_code_app
    var date = dataformat('yyyy-mm')
    var enc = sha1(`${id}${code}${date}`)

    this.upURL = props.upURL || 
    store.picUpPrefix +  `/api/v3/upload/images/${id}/${code}/${enc}/0`

    this.onUploadPic = this.onUploadPic.bind(this)
    this.onDeletePic = this.onDeletePic.bind(this)
    this.state = {
      isMounted: false, 
      pending: false, 
      show: false,
      imgs: [ ], 
      urls: [ ] 
    }
  }

  onUploadPic() {
    if (this.state.pending) {
      toastIt('请等待上一张图片上传完成')
      return
    }

    var inputDOM = document.querySelector('#upload')
    var loading = document.querySelector('#loading-bar')

    var file = inputDOM.files[0]

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('不能大于 5MB')
      return
    }

    if (!/jpg|jpeg|gif|png/.test(file.type)) {
      toastIt('不是图片文件')
      return
    }

    var formData = new FormData()
    if (!formData) {
      toastIt('请更新浏览器')
      return
    }

    var render = new FileReader()
    
    render.onload = (e) => {
      this.state.imgs.push({ src: e.target.result })
      this.state.isMounted && this.setState({ imgs: this.state.imgs })
      setPercent(`正在上传`)
    }

    render.readAsDataURL(file)

    var setPercent = v => {
      this.state.imgs[this.state.imgs.length - 1].percent = v
      this.state.isMounted && this.setState({ imgs: this.state.imgs })
    }

    formData.append('file', file)

    var xhr = new XMLHttpRequest()

    this.state.pending = true

    xhr.open('POST', this.upURL)
    xhr.timeout = 30000

    xhr.onreadystatechange = e => {
      if (xhr.readyState === 4) {
        this.show = false
        if (xhr.status == 200 || xhr.status == 304) {
          var res = JSON.parse(xhr.response)
          if (res.code == 200) {
            setPercent('已上传')
            this.state.urls.push(res.data)
            this.props.onChange(this.state.urls)
          } else {
            toastIt(res.msg)
          }
        } else {
          console.error(e)
          toastIt('服务器错误，请重试')
          setPercent('出错')
        }
        this.state.pending = false
      }
    }

    xhr.onerror = e => {
      this.state.pending = false
      console.error(e)
      toastIt('网络错误，请重试')
      setPercent('出错')
    }

    xhr.ontimeout = e => {
      this.state.pending = false
      toastIt('上传超时，可能是因为图片太大，请重试')
      setPercent('出错')
    }

    xhr.upload.onprogress = e => {
      console.log(e.loaded, e.total)
      setPercent(`${parseInt(e.loaded / e.total * 100)}%`)
      if (Math.ceil(e.loaded / e.total * 100) === 100)
        setPercent(`正在压缩`)
    }

    xhr.send(formData)
    
    // if select the same file, we can also tigger it
    inputDOM.value = ''
  }

  componentDidMount() {
    this.state.isMounted = true
  }

  componentWillUnmount() {
    this.state.isMounted = false
  }

  onDeletePic(i) {
    if (this.state.pending) {
      toastIt('正在上传')
      return
    }
    this.state.imgs.splice(i, 1)
    this.state.isMounted && this.setState({ imgs: this.state.imgs })
  }

  render() {
    return (
      <Trans className="upload">
        <section className="pics">
          {
            this.state.imgs.map((v, i) => 
              <div className="img-warp" key={ i }>
                <img htmlFor="img" src={ v.src } />
                <div className="pic-loading">{ v.percent }</div>
                <div className="del" onClick={ () => this.onDeletePic(i) }>x</div>
              </div>
            )
          }
          <input 
            id="upload" type="file"
            onChange={ this.onUploadPic }/>
          {
            this.state.imgs.length < this.props.max ? 
            <label htmlFor="upload">添加图片</label> : ''
          }
        </section>
      </Trans>
    )
  }
}
