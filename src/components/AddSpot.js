import React from 'react'
import ReactDOM from 'react-dom'
import '../index.css'
import App from '../App'
import { APIInfo, APIKey, makeAPIRequest, Spot, getDate } from '../api'
import CountrySelect from './CountrySelect'
import DateSelect from './DateSelect'
import SelectMap from './SelectMap'
import $ from 'jquery'

class AddSpot extends React.Component
{
  constructor(props)
  {
    super()
    this.state = {
      name: '',
      country: '',
      month: '',
      lat: '',
      long: '',
      mapUpdateRequest: false,
      corner1: '',
      corner2: ''
    }
    
    this.onNameChange = this.onNameChange.bind(this)
    this.onCountryChange = this.onCountryChange.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
    this.onLatLongChange = this.onLatLongChange.bind(this)
    this.onDateChange = this.onDateChange.bind(this)
    this.onAddSpot = this.onAddSpot.bind(this)
    this.resetValues = this.resetValues.bind(this)
    this.onRequestMapUpdate = this.onRequestMapUpdate.bind(this)
    this.onRequestMapUpdateComplete = this.onRequestMapUpdateComplete.bind(this)
  }
  
  //Show/hide popup
  onButtonClick()
  {
    this.resetValues()
    let modal = document.getElementById('add-spot-modal')
    let opacity = modal.style.display === 'block' ? 0 : 1
    modal.style.display = 'block'
    $("#add-spot-modal").animate(
    {
      opacity: opacity
    }, 175, "linear", function()
    { 
      modal.style.display = opacity === 0 ? 'none' : 'block'
      const c1 = [-30.318572496, -80.5284298033]
      const c2 = [70.4862816432, 75.1580277851]
      this.onRequestMapUpdate(c1, c2)
    }.bind(this))  
  }
  
  onNameChange(e)
  {
    this.setState({name: e.target.value ? e.target.value : e.target.value})
  }

  onCountryChange(country, corner1, corner2)
  {
    this.setState({country: country, lat: ''})
    this.onRequestMapUpdate(corner1, corner2)
  }
  
  onLatLongChange(e)
  {
    this.setState({lat: e.latlng.lat, long: e.latlng.lng})
  }
  
  onDateChange(month)
  {
    this.setState({month: month})
  }
  
  onRequestMapUpdate(corner1, corner2)
  {
    this.setState({mapUpdateRequest: true, corner1: corner1, corner2: corner2})
  }
  
  onRequestMapUpdateComplete()
  {
    this.setState({mapUpdateRequest: false})
  }
  
  //When the user clicks 'add', make a POST request, followed by updating the spots locally
  onAddSpot()
  {
    let prob = Math.floor(Math.random() * 100) + 1
    let lat = this.state.lat.toPrecision(Math.abs(parseInt(this.state.lat)).toString().length + 4)
    let long = this.state.long.toPrecision(Math.abs(parseInt(this.state.long)).toString().length + 4)
    let args = `createdAt=${getDate()}&name=${this.state.name}&country=${this.state.country}&lat=${lat}&long=${long}&probability=${prob}&month=${this.state.month}`
    makeAPIRequest('POST', `${APIKey}/spot/`, true, this.onAddedSpot(0, this.state.name, this.state.country, lat, long, prob, this.state.month), args)
  }
  
  //First provide the info, then erase it
  onAddedSpot(id, name, country, lat, long, prob, month)
  {
    id = APIInfo.nextId
    APIInfo.spots.push(new Spot(id, name, country, lat, long, prob, month))
  
    //Add 1 to the next available API id, since we just used the current id
    APIInfo.nextId = parseInt(APIInfo.nextId) + 1
    ReactDOM.render(<App spots={APIInfo.spots}/>, document.getElementById('root'))
    this.onButtonClick()
  }
  
  //Reset all values
  resetValues()
  {
    //this.setState({name: '', country: '', lat: '', long: '', month: ''})
    //const c1 = [-30.318572496, -80.5284298033]
    //const c2 = [70.4862816432, 75.1580277851]
    //this.onRequestMapUpdate(c1, c2)
    //set default val for country select
    //document.getElementById('date-picker').value = ''
  }
  
  componentDidMount()
  {
    //Set initial values
    this.resetValues()
  }
  
  render()
  {
    //Show marker position only when coordinates exist
    //Make 'add' button visible only when all the info is completed
    return(
      <div className="add-spot-wrapper">
          <img src="https://i.imgur.com/G5RvkFF.png" alt="" className="add-spot-image" onClick={this.onButtonClick}/>
        <div id="add-spot-modal">
          <div id="add-spot-modal-content">
            <h1 className="modal-title">Add spot</h1>
            <p className="modal-subtitle">Name</p>
            <input type="text" value={this.state.name} onChange={this.onNameChange} className="modal-input"/>
            <CountrySelect handleCountryChange={this.onCountryChange}/>
            <DateSelect handleDateChange={this.onDateChange}/>
            <p className="modal-subtitle" id="pick-spot-text">Pick a Spot</p>
            <SelectMap handleLatLongChange={this.onLatLongChange} requestInfo={[this.state.mapUpdateRequest, this.state.corner1, this.state.corner2]} handleRequestMapUpdateComplete={this.onRequestMapUpdateComplete}/>
            <div className="buttons-wrapper">
              <input type="button" value="CANCEL" className="add-spot-btn" id="cancel-spot-button" onClick={this.onButtonClick}/>
              {(this.state.name && this.state.country && this.state.lat && this.state.month) ? 
                <input type="button" value="ADD" className="add-spot-btn" id="add-spot-button" onClick={this.onAddSpot}/> :
                <input type="button" value="ADD" className="add-spot-btn" id="btn-inactive"/>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddSpot
