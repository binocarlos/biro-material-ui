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
  'password',
  'password2',
  {
    type:'text',
    name:'phone',
    validate:function(val = ''){
      if(!val) return false
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

function validateForm(data, meta){
  var ret = {}
  if(data.password!=data.password2 && meta.password.dirty && meta.password2.dirty){
    ret.password = ret.password2 = 'passwords must match'
  }
  return ret
}

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
        validate={validateForm} 
        formrenderer={FormLayout}
        rowrenderer={RowLayout} />

    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)
