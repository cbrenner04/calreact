import React, {Component} from 'react';
import update from 'immutability-helper';
import moment from 'moment';
import PropTypes from 'prop-types';

import AppointmentForm from './AppointmentForm';
import {AppointmentList} from './AppointmentList';
import {FormErrors} from './FormErrors';

export default class Appointments extends Component {
  static propTypes = {
    appointments: PropTypes.array.isRequired
  }

  constructor(props, _railsContext) {
    super(props)
    this.state = {
      appointments: this.props.appointments,
      title: { value: '', valid: false },
      appt_time: { value: new Date(), valid: false},
      formErrors: {},
      formValid: false
    }
  }

  handleUserInput = (fieldName, fieldValue, validations) => {
    const newFieldState = update(this.state[fieldName],
                                 { value: { $set: fieldValue} })
    this.setState({ [fieldName]: newFieldState },
                    () => { this.validateField(fieldName, fieldValue, validations) });
  }

  validateField(fieldName, fieldValue, validations) {
    let fieldValid;
    let fieldErrors = validations.reduce((errors, v) => {
      let e = v(fieldValue);
      if (e !== '') {
        errors.push(e);
      }
      return errors;
    }, [])

    fieldValid = fieldErrors.length === 0;
    const newFieldState = update(this.state[fieldName],
                                 { valid: { $set: fieldValid } });
    const newFormErrors = update(this.state.formErrors,
                                 { $merge: { [fieldName]: fieldErrors } });
    this.setState({
      [fieldName]: newFieldState,
      formErrors: newFormErrors
    }, this.validateForm)
  }

  validateForm() {
    this.setState({
      formValid: this.state.title.valid && this.state.appt_time.valid
    })
  }

  handleFormSubmit = () => {
    const appointment = {
      title: this.state.title.value,
      appt_time: this.state.appt_time.value
    }
    $.post('/appointments', { appointment: appointment })
      .done((data) => {
        this.addNewAppointment(data);
        this.resetState();
      })
      .fail((response) => {
        this.setState({
          formErrors: response.responseJSON });
      });
  }

  resetState() {
    this.setState({
      title: { value: '', valid: false },
      appt_time: { value: new Date(), valid: false},
      formErrors: {},
      formValid: false
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
        <FormErrors formErrors={ this.state.formErrors } />
        <AppointmentForm title={ this.state.title }
          appt_time={ this.state.appt_time }
          formValid={ this.state.formValid }
          onUserInput={ this.handleUserInput }
          onFormSubmit={ this.handleFormSubmit } />
        <AppointmentList appointments={ this.state.appointments } />
      </div>
    )
  }
}
