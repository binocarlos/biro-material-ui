biro-material-ui
================

[material-ui](https://github.com/callemall/material-ui) library for [biro](https://github.com/binocarlos/biro)

## install

Install the module to your project:

```
$ npm install biro-material-ui --save
```

## usage

It is assumed that you will be using the `material-ui` module in your project.

```javascript
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Biro from 'biro'
import muiLibrary from 'biro-material-ui'
import muiLayout from 'biro-material-ui/layout'

const SCHEMA = [
  'firstname',   // this is turned into {type:'text',name:'firstname'}
  'surname',
  'email',
  {
    type:'text',
    name:'phone',
    validate:function(val = ''){
      return val.match(/^\+?[-\d\s]+$/) ? null : 'invalid phone number'
    }np
  }
]

const FORM_UPDATE = 'FORM_UPDATE'

function formUpdateAction(data, meta){
  return {
    type:FORM_UPDATE,
    data:data,
    meta:meta
  }
}

const initialState = {
  data:{},
  meta:null
}

const reducer = combineReducers({
  form: function(state = initialState, action = {}) {
    switch (action.type) {
      case FORM_UPDATE:
        return Object.assign({}, state, {
          data:action.data,
          meta:action.meta
        })
      default:
        return state
    }
  }
})

const finalCreateStore = compose(
  applyMiddleware.apply(null, []),
  window.devToolsExtension && window.devToolsExtension()
)(createStore)

const store = finalCreateStore(reducer)

class MyForm extends Component {
  render() {
    return (
      <Biro 
        data={this.props.data}
        meta={this.props.meta}
        schema={SCHEMA}
        update={this.props.update} 
        library={muiLibrary}
        layout={muiLayout} />
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    data:state.form.data,
    meta:state.form.meta
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    update:function(data, meta){
      dispatch(formUpdateAction(data, meta))
    }
  }
}

var FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyForm)

ReactDOM.render(  
  <Provider store={store}>
    <MuiThemeProvider>
      <FormContainer /> 
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('mount')
)
```

## license

MIT