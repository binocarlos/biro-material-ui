import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Biro from 'biro'
import muiLibrary from '../src'
import muiLayout from '../src/layout'

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

function validateForm(data, meta){
  var ret = {}
  if(data.password!=data.password2 && meta.fields.password.dirty && meta.fields.password2.dirty){
    ret.password = ret.password2 = 'passwords must match'
  }
  return ret
}

class MyForm extends Component {
  render() {
    return (
      <Biro 
        data={this.props.data}
        meta={this.props.meta}
        schema={SCHEMA}
        update={this.props.update} 
        validate={validateForm}
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
