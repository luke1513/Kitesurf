import React from 'react'
import '../index.css'
import { APIKey, makeAPIRequest } from '../api'

class Login extends React.Component
{
  constructor(props)
  {
    super()
    this.state = {
      username: '',
      password: '',
      passwordAsterisk: ''
    }
    
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.loginSuccessful = this.loginSuccessful.bind(this)
  }
  
  handleUsernameChange(e)
  {
    this.setState({username: e.target.value})
  }
  
  //On every key pressed in the 'password' field, update two states
  //First is the actual password, second is the asterisk version
  handlePasswordChange(e)
  {
    let inte = this.state.interval
    clearInterval(inte) //Cancel the 1 second interval if a key is presssed meanwhile
    let newState  = this.state.password
    const lastCh = e.target.value.slice(-1)
    if(lastCh !== '*' && lastCh) newState += lastCh
    else newState = newState.substring(0, newState.length - 1)
    let asterisk = ''
    for(let i = 0; i < newState.length - 1; i++) asterisk = asterisk + '*'
    let fullAsterisk = asterisk + '*'
    if(lastCh) asterisk = asterisk + lastCh
    this.setState({password: newState, passwordAsterisk: asterisk}, () => 
    {
      //Set an interval to display last password character for 1 second
      let interval = setInterval(function() {
        if(lastCh) this.setState({passwordAsterisk: fullAsterisk})
      }.bind(this), 750)
      this.setState({interval: interval})
    })
  }
  
  handleLogin()
  {
    makeAPIRequest('POST', `${APIKey}/login`, true, this.loginSuccessful)
  }
  
  //On 'login' button, clear the fields and show the main app
  loginSuccessful()
  {
    let interval = this.state.interval
    clearInterval(interval)
    const usr = this.state.username
    this.setState({username: '', password: '', passwordAsterisk: ''})
    this.props.onLogin(usr)
    
  }
  
  render()
  {
    return(
      <div className="login-window">
        <div className="login-wrapper">
          <img src="https://i.imgur.com/D8kcCSB.png" alt="" id="logo-login"/>
          <p className="login-title notice" id="notice">This is a test. Use any login info</p>
          <p className="login-title">Username</p>
          <input type="text" className="login-input" value={this.state.username} onChange={this.handleUsernameChange}/>
          <p className="login-title">Password</p>
          <input type="text" className="login-input" value={this.state.passwordAsterisk} onChange={this.handlePasswordChange}/>
          {(this.state.username && this.state.password) ? 
            <input type="button" className="login-button" value="LOG IN" onClick={this.handleLogin}/> : 
            <input type="button" className="login-button" id="login-button-inactive" value="LOG IN" onClick={this.handleLogin}/>}
        </div>
      </div>
    )
  }
}

export default Login
