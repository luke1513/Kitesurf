import './index.css'
import { APIKey, makeAPIRequest, getSpots } from './api'

//Get the spots and favourites from the API, then render the App component
makeAPIRequest('GET', `${APIKey}/spot/`, true, getSpots)