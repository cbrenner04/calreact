import React, {Component} from 'react';
import update from 'immutability-helper';

import AppointmentForm from './appointment_form';
import {AppointmentList} from './appointment_list';

export default class Appointments extends Component {
  constructor(props, _railsContext) {
    super(props)
    this.state = {
      appointments: this.props.appointments,
      title: 'Team standup',
      appt_time: 'Tomorrow at 9am'
    }
  }

  handleUserInput(obj) {
    this.setState(obj);
  }

  handleFormSubmit() {
    const appointment = {
      title: this.state.title,
      appt_time: this.state.appt_time
    }
    $.post('/appointments', { appointment: appointment })
      .done((data) => {
        this.addNewAppointment(data);
      });
  }

  addNewAppointment(appointment) {
    const appointments =
      update(this.state.appointments, { $push: [appointment] })
    this.setState({
      appointments: appointments.sort(function(a, b) {
        return new Date(a.appt_time) - new Date(b.appt_time)
      })
    })
  }

  render() {
    return (
      <div>
        <AppointmentForm title={ this.state.title }
          appt_time={ this.state.appt_time }
          onUserInput={ (object) => this.handleUserInput(object) }
          onFormSubmit={ () =>  this.handleFormSubmit() } />
        <AppointmentList appointments={ this.state.appointments } />
      </div>
    )
  }
}
