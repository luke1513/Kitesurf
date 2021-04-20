import React from 'react'
import '../index.css'
import Select from 'react-select'
import { countries } from '../countries-data'

class CountrySelect extends React.Component
{
  constructor(props)
  {
    super()
    this.state = {
      options: countries
    }
    
    this.onSelectChange = this.onSelectChange.bind(this)
  }
  
  onSelectChange(e)
  {
    let country = e.label
    let corner1 = e.corner1
    let corner2 = e.corner2
    const aux1 = corner1[0], aux2 = corner2[0]
    corner1[0] = parseFloat(corner1[1])
    corner1[1] = parseFloat(aux1)
    corner2[0] = parseFloat(corner2[1])
    corner2[1] = parseFloat(aux2)
    this.props.handleCountryChange(country, corner1, corner2)
  }

  render()
  {
    return(
      <div>
        <p className="modal-subtitle" id="country-text">Country</p>
        <Select className="form-control" id="countries" defaultValue="default" onChange={this.onSelectChange} options={this.state.options} />
      </div>
    )
  }
}

export default CountrySelect
