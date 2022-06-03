import React, { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => { //Important! use 'refs' as paramater here in parent componenent and use 'ref' as argument in child comp!
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  //component uses imperativeHandle hook to make its toggleVisibility function available outside of itself!
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })


  //props.children is used for referencing the child components of the component. (LoginForm, NoteForm, etc...)
  //The child components are the React elements that we define between the opening and closing tags of a component.
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        {/* {console.log('props children:', props.children)} */}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired //red console log specifying a buttonLabel:String is required
}

Togglable.displayName = 'Togglable'

export default Togglable