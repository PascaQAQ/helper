import Trans from '../trans'
import JokesComp from './jokesComp'

export default (props) =>
  <Trans className="jokes jokes-src">
    <nav>
      校园段子
      <i 
        className="fa-plus-1 create"
        onClick={ () => props.onViewChange('#jokesCreate') } />
    </nav>
    <JokesComp />
  </Trans>
