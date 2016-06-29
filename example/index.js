import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import biroreducer from 'biro/reducer'
import Biro from 'biro'
import muiLibrary, { FormLayout, RowLayout } from '../src'

const SCHEMA = [
  'firstname',   // this is turned into {type:'text',name:'firstname'}
  'surname',
  'email',
  {
    type:'text',
    name:'phone',
    validate:function(val = ''){
      return val.match(/^\+?[-\d\s]+$/) ? null : 'invalid phone number'
    }
  }
]

const reducer = combineReducers({
  biro: biroreducer
})

/*
  store
*/
const finalCreateStore = compose(
  applyMiddleware.apply(null, []),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)

const store = finalCreateStore(reducer)

/*
  routes
*/
ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>

      <Biro 
        name="contact"
        library={muiLibrary} 
        schema={SCHEMA}
        formrenderer={FormLayout}
        rowrenderer={RowLayout} />

    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)
