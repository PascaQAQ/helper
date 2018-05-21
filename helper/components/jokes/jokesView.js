import ReactDOM from 'react-dom'
import JokesComp from './jokesComp'
import store from '../../store/index'

export default (userId) => {
  document.querySelector('.jokes-src').style.display = 'none'
  if (store.jokesView == 0)
    history.pushState(null, null, '#jokesView')
  store.jokesView = 1

  ReactDOM.unmountComponentAtNode(document.querySelector('#details'))

  var e = 
  <div className="jokes jokes-float">
    <nav>
      此人的段子
    </nav>
    
    <JokesComp userId={ userId } />
  </div>

  ReactDOM.render(
    e, document.querySelector('#details')
  )
}
