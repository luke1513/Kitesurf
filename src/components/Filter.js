import React from 'react'
import '../index.css'
import $ from 'jquery'

class Filter extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = {
      clicked: false
    }
    
    this.handlerOnCouChange = this.handlerOnCouChange.bind(this)
    this.handlerOnProbChange = this.handlerOnProbChange.bind(this)
  }
  
  //Show/hide popup
  onFilterClick()
  {
    let modal = document.getElementById('filter-modal')
    let opacity = modal.style.display === 'block' ? 0 : 1
    modal.style.display = 'block'
    $("#filter-modal").animate(
    {
      opacity: opacity
    }, 175, "linear", function()
    { 
      modal.style.display = opacity === 0 ? 'none' : 'block'
    })
  }
  
  handlerOnCouChange(e)
  {
    this.props.onCouChange(e)
  }
  
  handlerOnProbChange(e)
  {
    this.props.onProbChange(e)
  }
  
  render()
  {
    return(
      <div className="filter-wrapper">
          <img src="https://i.ibb.co/dQKKfkr/filter.png" alt="" className="filter-image" onClick={this.onFilterClick}/>
        <div id="filter-modal">
          <div id="filter-modal-content">
            <h1 className="modal-title">Filter</h1>
            <p className="modal-subtitle">Country</p> 
            <input type="text" className="modal-input" onChange={this.handlerOnCouChange}/>
            <p className="modal-subtitle">Wind probability</p>
            <input type="text" value={ isNaN(this.props.probText) ? "" : this.props.probText } className="modal-input" onChange={this.handlerOnProbChange}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Filter
