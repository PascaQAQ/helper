import ReactDOM from 'react-dom'
import store from '../../store/index'
import { toastIt } from '../../components/toast/toast'
import { viewer } from '../common/viewer'
import '../../assets/css/common/details.less'

export let details = (state) => {
  var close = () => {
    ReactDOM.unmountComponentAtNode(document.querySelector('#details'))
  }

  ReactDOM.render(
    <div className="details">
      <a className="btn-back" style={{ color: '#000' }} onClick={ close }>
        <i className="fa fa-angle-left fa-2x"></i>
      </a>
      <nav> 
        商品详情
      </nav>
      <section className="main scroll">
        <div className="detailsImg">
          { 
            state.pics.map((u, i) => 
              <div className="img" key= { i }>
                <div className="fill"></div>
                <div className="img-content">
                  <img
                    className="img-box"
                    onClick={ () => viewer(
                      store.picPrefix + u,
                      store.picPrefix + u.replace(/_thumb/, '')
                    ) }
                    alt="图裂开了"
                    src={ store.picPrefix + u } />
                </div>
              </div>
            )
          }
        </div>
        <div className="imgDes">
          { state.content }
        </div>
        <div className="detatilsContent">
          <div className="messageBox">
            <p>价格</p> 
            <span>{ state.prize } 元</span>
          </div>
          <div className="messageBox">
            <p>成色</p> 
            <span>{ state.attr }</span>
          </div>
          <div className="messageBox">
            <p>联系方式</p> 
            <span>{ state.phone }</span>
          </div>
          <div className="messageBox">
            <p>发布区域</p> 
            <span>{ state.address }</span>
          </div>
        </div>
      </section>
    </div>
    ,

    document.querySelector('#details')
  )
}
