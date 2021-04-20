import React from 'react'
import '../index.css'
import { MapContainer, TileLayer, Marker, useMapEvent, MapConsumer } from 'react-leaflet'
import { blueIcon } from '../icons'

class SelectMap extends React.Component
{
  constructor(props)
  {
    super()
    this.state = {
      lat: '',
      long: '',
      map: null
    }
    
    this.onMapClick = this.onMapClick.bind(this)
    this.onMapCreate = this.onMapCreate.bind(this)
  }
  
  //When a marker is placed, update SelectMap state (for easier marker placement)
  //as well as AddSpot state (to provide the info to the API)
  onMapClick(e)
  {
    this.setState({lat: e.latlng.lat, long: e.latlng.lng})
    this.props.handleLatLongChange(e)
    this.state.map.getPane('markerPane').style.zIndex = 650
    this.state.map.getPane('shadowPane').style.zIndex = 650
  }
  
  //This is sent by the AddSpot component, and refreshes the view along with the correct bounds
  onMapUpdate(corner1, corner2)
  {
    this.state.map.invalidateSize()
    this.state.map.fitBounds([corner1, corner2], {animate: true, duration: 0.75})
    this.props.handleRequestMapUpdateComplete()
    this.state.map.getPane('markerPane').style.zIndex = 9
    this.state.map.getPane('shadowPane').style.zIndex = 9
  }

  onMapCreate(map)
  {
    this.setState({map: map}, () => {
    this.state.map.invalidateSize()
    const c1 = [-30.318572496, -80.5284298033]
    const c2 = [70.4862816432, 75.1580277851]
    this.state.map.fitBounds([c1, c2], {animate: true, duration: 0.75})
    this.props.handleRequestMapUpdateComplete()
    this.state.map.getPane('markerPane').style.zIndex = 9
    this.state.map.getPane('shadowPane').style.zIndex = 9
    })
  }
  
  render()
  {
    //If a refresh is requested, do it
    //Render should be a pure function and it will throw a warning, it's just a quick way to do it
    if(this.props.requestInfo[0]) this.onMapUpdate(this.props.requestInfo[1], this.props.requestInfo[2])
    return(
      <MapContainer center={[50, 12]} zoom={4} minZoom={0} scrollWheelZoom={false} doubleClickZoom={false} touchZoom={false} dragging={false} zoomControl={false} id="select-map" whenCreated={map => this.onMapCreate(map)}>
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>' url='https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=ZnKDqUrBu1DxLlBuSTDM'/>
        <Marker position={[this.state.lat, this.state.long]} icon={blueIcon} className="select-marker"/>
        <MapConsumer>
          {() => {
            useMapEvent('click', (e) => this.onMapClick(e))
            return null
          }}
        </MapConsumer>
      </MapContainer>
    )
  }
}

export default SelectMap
