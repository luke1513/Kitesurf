import L from 'leaflet'

export const blueIcon = L.icon({
  iconUrl: 'https://i.imgur.com/byPXzXX.png',
  shadowUrl: 'https://i.imgur.com/Gr8emCJ.png',
  iconSize: [25,40],
  iconAnchor: [10, 40],
  popupAnchor: [7, -35],
})
export const yellowIcon = L.icon({
  ...blueIcon.options, 
  iconUrl: 'https://i.imgur.com/CYZlggz.png'
})
export const starOn = 'https://i.imgur.com/EPbLkUO.png'
export const starOff = 'https://i.imgur.com/7fqfe8U.png'