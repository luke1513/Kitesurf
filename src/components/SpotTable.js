import React from 'react'
import '../index.css'

function TableRow(props)
{
  const classn = `table-row table-row-${props.even}`
  return(
    <tr className={classn}>
      <td className="table-cell">{props.spot.name}</td>
      <td className="table-cell">{props.spot.country}</td>
      <td className="table-cell">{parseFloat(props.spot.lat).toFixed(2)}</td>
      <td className="table-cell">{parseFloat(props.spot.long).toFixed(2)}</td>
      <td className="table-cell">{props.spot.probability}%</td>
      <td className="table-cell">{props.spot.month}</td>
    </tr>
  )
}

class SpotTable extends React.Component
{
  constructor(props)
  {
    super()
    this.state = {
      sortedSpots: [],
      sortedBy: '',
      filterText: ''
    }
    
    this.sortSpots = this.sortSpots.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }
  
  //Called everytime the user clicks on a table header
  sortSpots(e)
  {
    let arr = this.props.spots
    let filterBy //Get last sort value
    let shouldSort = true
    
    //If the function call is coming from a search callback, do not sort
    if(!e) 
    {
      shouldSort = false
      filterBy = this.state.sortedBy
    }
    else
    {
      switch(e.target.textContent.substring(0, 2))
      {
        case 'Na':
          filterBy = 'name'
          break
         case 'Co':
          filterBy = 'country'
          break
        case 'La':
          filterBy = 'lat'
          break
        case 'Lo':
          filterBy = 'long'
          break
        case 'Wi':
          filterBy = 'probability'
          break
        case 'Wh':
          filterBy = 'month'
          break      
        default:
          break
      }
    }
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    if(shouldSort)
    {
      //If it's needed to sort the same column again, just reverse it
      if(filterBy === this.state.sortedBy)
      {
        let i = 0, j = arr.length - 1
        while(i < j)
        {
          const aux = arr[i]
          arr[i] = arr[j]
          arr[j] = aux
          i++
          j--
        }
      }

      //Else, sort it
      else
      {
        //For each element
        for(let i = 0; i < arr.length - 1; i++)
        {
          let j = arr.length - 1
          //Compare it with each element with a higher position
          while(i < j)
          {
            //If it's higher, switch them
            if(filterBy !== 'month' && 
              //For numbers
              ((filterBy === 'lat' || filterBy === 'long' || filterBy === 'probability') && arr[i][filterBy] > arr[j][filterBy]) ||
              //For strings
              ((filterBy === 'name' || filterBy === 'country') && arr[i][filterBy].toLowerCase() > arr[j][filterBy].toLowerCase()))
            {
              const aux = arr[i]
              arr[i] = arr[j]
              arr[j] = aux
            }
            //For months
            else if(months.findIndex(el => el === arr[i][filterBy]) > months.findIndex(el => el === arr[j][filterBy]))
            {
              const aux = arr[i]
              arr[i] = arr[j]
              arr[j] = aux
            }
            j--
          }
        }
      }
    }
    
    //Apply filters to the final table
    const filteredArr = arr.map(el => el.name.toLowerCase().includes(this.state.filterText) && el)
    this.setState({ 
      sortedSpots: filteredArr,
      sortedBy: filterBy
      })
  }
  
  componentDidMount()
  {
    //Sort by name by default
     this.sortSpots({target: {textContent: 'Name'}})
  }
  
  //Called every time the search input changes
  handleSearchChange(e)
  {
    this.setState({filterText: e.target.value.toLowerCase()}, () => this.sortSpots(false))
  }
  
  render()
  {
    //Iterate through sorted spots. If it's also filtered, show it
    return(
      <div className="table-wrapper">
        <div id="locations-text">Locations</div>
        <input type="text" placeholder="Search..." className="table-search" onChange={this.handleSearchChange}/>
        <table className='table'>
          <tbody>
            <tr className='table-header'>
              <th onClick={this.sortSpots} className="table-cell-h">Name <b className="table-arrow">↕</b></th>
              <th onClick={this.sortSpots} className="table-cell-h">Country ↕</th>
              <th onClick={this.sortSpots} className="table-cell-h">Lat. ↕</th>
              <th onClick={this.sortSpots} className="table-cell-h">Long. ↕</th>
              <th onClick={this.sortSpots} className="table-cell-h">Wind prob. ↕</th>
              <th onClick={this.sortSpots} className="table-cell-h">When to go ↕</th>
            </tr>
            {this.state.sortedSpots.map( (spot, index) =>
            spot.filtered && <TableRow key={spot.id} spot={spot}/>
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default SpotTable
