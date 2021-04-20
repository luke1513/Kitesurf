import React from 'react'
import './index.css'
import Login from './components/Login'
import Header from './components/Header'
import Filter from './components/Filter'
import Markers from './components/Markers'
import SpotTable from './components/SpotTable'
import AddSpot from './components/AddSpot'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from 'leaflet'

class App extends React.Component
{
  constructor(props)
  {
    super()
    this.state = {
      lat: 50,
      lng: 12,
      zoom: 4,
      bounds: L.latLngBounds(L.latLng(-10000000, -180), L.latLng(10000000, 180)),
      couValue: '',
      probValue: NaN,
      spots: props.spots,
      loggedIn: false,
      username: ''
    }
    
    this.updateCou = this.updateCou.bind(this)
    this.updateProb = this.updateProb.bind(this)
    this.updateMarkers = this.updateMarkers.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }
  
  //Set filtered property of the spot. Ran every time the filter input changes
  updateMarkers()
  {
    const newState = this.state.spots
    newState.forEach(spot => (spot.country.toLowerCase().includes(this.state.couValue.toLowerCase()) && (isNaN(this.state.probValue) || spot.probability === this.state.probValue)) ? spot.filtered = true : spot.filtered = false)
    this.setState({spots: newState})
  }
  
  updateCou(e)
  {
    this.setState({couValue: e.target.value }, () => this.updateMarkers())
  }
  
  updateProb(e)
  {
    this.setState({probValue: parseInt(e.target.value) }, () => this.updateMarkers())
  }
  
  handleLogin(username)
  {
    this.setState({loggedIn: true, username: username})
  }
  
  handleLogout()
  {
    this.setState({loggedIn: false})
  }
  
  render() 
  {
    const position = [this.state.lat, this.state.lng]
    return (
      <div>
        {!this.state.loggedIn && <Login onLogin={this.handleLogin}/>}
        {this.state.loggedIn && 
        <div>
          <Header onLogout={this.handleLogout} username={this.state.username}/>
          <div className="map-overlay">
            <AddSpot />
            <Filter onCouChange={this.updateCou} onProbChange={this.updateProb} couText={this.state.couValue} probText={this.state.probValue}/>
          </div>
          <MapContainer center={position} zoom={this.state.zoom} minZoom={2} id="map" worldCopyJump={true}>
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>' url='https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=ZnKDqUrBu1DxLlBuSTDM' id="tilelayer"/>
            <Markers spots={this.state.spots}/>
          </MapContainer>
          <SpotTable spots={this.state.spots}/>
        </div>}
      </div>
    )
  }
}

export default App
