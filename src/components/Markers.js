import React from 'react'
import '../index.css'
import { APIInfo, APIKey, makeAPIRequest, getFavourites, getDate } from '../api'
import { Marker, Popup } from 'react-leaflet'
import { starOn, starOff, yellowIcon, blueIcon } from '../icons'

function Favourite(props)
{
  return(
    <div>{props.val ?
         <input type="button" className="button-fav button-fav-remove" value="REMOVE FROM FAVOURITES" onClick={() => props.handleRemoveFromFav(props.id)}/>
         :
         <input type="button" className="button-fav button-fav-add" value="ADD TO FAVOURITES" onClick={() => props.handleAddToFav(props.id)}/>
         }
    </div>
  )
}

function PopupProp(props)
{
  return(
    <div className="popup-prop">
      <div className="popup-prop-title">{props.title}</div>
      <div className="popup-prop-content">{props.content}{props.add}</div>
    </div>
  )
}

function PopupContent(props)
{
  return(
   <div>
     <h1 className="popup-name">{props.name} <img src={props.favourite ? starOn : starOff} alt="" className='popup-star'/></h1>
     <h2 className="popup-country">{props.country}</h2>
     <PopupProp title="WIND PROBABILITY" content={props.probability} add='%' />
     <PopupProp title="LATITUDE" content={props.lat} add='°N' />
     <PopupProp title="LONGITUDE" content={props.long} add='°W' />
     <PopupProp title="WHEN TO GO" content={props.month} />
   </div>
  )
}

class Markers extends React.Component
{
  constructor(props)
  {
    super()
    this.onFavChange = this.onFavChange.bind(this)
    this.onAddToFav = this.onAddToFav.bind(this)
    this.onRemoveFromFav = this.onRemoveFromFav.bind(this)
  }

  onFavChange()
  {
    makeAPIRequest('GET', `${APIKey}/favourites/`, true, getFavourites)
  }
  
  //On the 'add to favourites' button, make a POST request, then refresh favourites
  onAddToFav(spotId)
  {
    const args = `id=${APIInfo.spots.length + 1}&createdAt=${getDate()}&spot=${spotId}`
    makeAPIRequest('POST', `${APIKey}/favourites/`, true, this.onFavChange, args)
  }
  
  //On the 'remove from favourites' button, make a DELETE request, then refresh favourites
  onRemoveFromFav(spotId)
  {
    const id = APIInfo.favourites.find(el => el.spot === spotId).id
    makeAPIRequest('DELETE', `${APIKey}/favourites/${id}`, true, this.onFavChange)
  }
  
  render()
  {
    //Iterate through the spots. If a spot is filtered, show it
    return(
      <div>
        {this.props.spots.map( spot => spot.filtered && 
          <Marker position={[spot.lat, spot.long]} key={spot.id} icon={spot.favourite ? yellowIcon : blueIcon}>
            <Popup className="popup">
              <PopupContent name={spot.name} country={spot.country} probability={spot.probability} lat={spot.lat} long={spot.long} month={spot.month} favourite={spot.favourite}/>
              <Favourite val={spot.favourite} id={spot.id} handleAddToFav={this.onAddToFav}  handleRemoveFromFav={this.onRemoveFromFav}/>
            </Popup>
          </Marker>
        )}
      </div>
    )
  }
}

export default Markers