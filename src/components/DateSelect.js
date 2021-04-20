import React from 'react'
import '../index.css'
import $ from 'jquery'
import 'bootstrap-daterangepicker'
import moment from 'moment'

class DateSelect extends React.Component
{
  constructor(props)
  {
    super()
  }
  
  componentDidMount()
  {
    //The date picker
    $('#date-picker').daterangepicker({
    "opens": "center"
    }, function (start, end)
      {
        //On every new date selected, retrieve the months and make an average out of them,
        //then update the state
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                     'August', 'September', 'October', 'November', 'December']
        const first = parseInt(start.format('YYYY-MM-DD').substring(5, 7))
        const last = parseInt(end.format('YYYY-MM-DD').substring(5, 7))
        this.props.handleDateChange(months[parseInt((first + last) / 2 - 1)])
        
      }.bind(this))
    
    //On 'cancel', reset date
    $('#date-picker').on('cancel.daterangepicker', function(ev, picker) { 
      $('#date-picker').data('daterangepicker').setStartDate(moment())
      $('#date-picker').data('daterangepicker').setEndDate(moment())
      document.getElementById('date-picker').value = ''
      this.props.handleDateChange('')
    }.bind(this))
    
    $('#date-picker').on('mousedown',  function()
    {
      $('#date-picker').css({color: "white"})
    })
    
    $('#date-picker').on('apply.daterangepicker', function() 
    { 
      $('#date-picker').css({color: "black"})
    })
  }
  
  render()
  {
    return(
      <div>
        <p className="modal-subtitle" id="high-season">High Season</p>
        <input type="text" id="date-picker" className="modal-input"/>
      </div>
    )
  }
}

export default DateSelect
