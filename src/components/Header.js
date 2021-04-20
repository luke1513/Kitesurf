import React from 'react'
import '../index.css'
import $ from 'jquery'

class Header extends React.Component
{
  constructor(props)
  {
    super()
  }
  
  componentDidMount()
  {
    $("#welcome-prompt").delay(700).animate(
    {
      opacity: 1
    }, 400, "linear", function()
    { 
      $("#welcome-prompt").delay(1000).animate(
      {
        opacity: 0
      }, 200, "linear", function()
      { 
        $("#welcome-prompt").css("display", "none")
      })
    })
  }
  
  //Show/hide popup
  onButtonClick()
  {
    let modal = document.getElementById('user-popup')
    let opacity = modal.style.display === 'block' ? 0 : 1
    modal.style.display = 'block'
    $("#user-popup").animate(
    {
      opacity: opacity
    }, 175, "linear", function()
    { 
      modal.style.display = opacity === 0 ? 'none' : 'block'
    })
  }
  
  render()
  {
    const welcome = `Welcome, ${this.props.username}.`
    return(
      <div id="header">
        <img src="https://i.imgur.com/Sh3JKak.png" alt="" id="logo-img"/>
        <p id="welcome-prompt">{welcome}</p>
        <img src="https://i.imgur.com/joOQdsb.png" alt="" id="user-img" onClick={this.onButtonClick}/>
        <div id="user-popup">
          <input type="button" value="LOG OUT" id="logout-btn" onClick={this.props.onLogout}/>
        </div>
      </div>
    )
  }
}

export default Header
