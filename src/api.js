import ReactDOM from 'react-dom'
import App from './App'

export const APIKey = 'https://5e6757671937020016fed9d0.mockapi.io'

export let APIInfo = {
  spots: [],
  favourites: [],
  nextId: 0
}

//Spot constructor
export function Spot(id, name, country, lat, long, probability, month)
{
  this.id = id
  this.name = name
  this.country = country
  this.lat = lat 
  this.long = long
  this.probability = probability
  this.month = month
  this.favourite = false
  this.filtered = true
}

//Get date formatted for API use
export let getDate = function()
{
  const date = new Date()
  let check = []
  const year = date.getFullYear()
  const month = date.getMonth() + 1; check.push(month)
  const day = date.getDate(); check.push(day)
  const hr = date.getHours(); check.push(hr)
  const min = date.getMinutes(); check.push(min)
  const sec = date.getSeconds(); check.push(sec)
  const mil = date.getMilliseconds(); check.push(mil)
  for(let i in check) if(check[i] < 10) check[i] = '0' + check[i]
  if(check[5] < 100) check[5] = '0' + check[5]
  return `${year}-${check[0]}-${check[1]}T${check[2]}:${check[3]}:${check[4]}.${check[5]}Z`
}

//Get correct favourites
export let getFavourites = function()
{
  const data = JSON.parse(this.response)
  APIInfo.favourites = data
  
  //Reset them
  APIInfo.spots.forEach(s => s.favourite = false)
  for(let i in data)
  {
    //If a spot is marked as favourite on the server, set it locally too
    if(APIInfo.spots.some(el => el.id === data[i].spot))
      APIInfo.spots.find(el => el.id === data[i].spot).favourite = true
  }
  ReactDOM.render(<App spots={APIInfo.spots}/>, document.getElementById('root'))
}

//Get all the spots
export let getSpots = function()
{
  const data = JSON.parse(this.response)
  let id = 0
  for(let i in data)
  {
    APIInfo.spots.push(new Spot(data[i].id, data[i].name, data[i].country, parseFloat(data[i].lat), parseFloat(data[i].long), parseInt(data[i].probability), data[i].month))
    if(parseInt(data[i].id) > id) id = data[i].id
  }
  
  //Get next available API spot id to use it for later
  APIInfo.nextId = (parseInt(id) + 1).toString()
  makeAPIRequest('GET', `${APIKey}/favourites/`, true, getFavourites)
}

//Common function to make an API request
export function makeAPIRequest(action, link, bool, func, args)
{
  let req = new XMLHttpRequest()
  req.open(action, link, bool)
  req.onload = func
  if(args) req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
  req.send(args ? args : args)
}