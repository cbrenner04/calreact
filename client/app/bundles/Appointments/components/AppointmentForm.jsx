import React, {Component} from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import PropTypes from 'prop-types';

import Label from './Label';
import {validations} from '../utils/validations';

export default class AppointmentForm extends Component {
  static propTypes = {
    title: PropTypes.shape({
      value: PropTypes.string.isRequired,
      valid: PropTypes.bool.isRequired
    }).isRequired,
    appt_time: PropTypes.shape({
      value: PropTypes.instanceOf(Date).isRequired,
      valid: PropTypes.bool.isRequired
    }).isRequired,
    formValid: PropTypes.bool.isRequired,
    onUserInput: PropTypes.func.isRequired,
    onFormSubmit: PropTypes.func.isRequired
  }

  static formValidations = {
    title: [
      (s) => { return validations.checkMinLength(s, 3) }
    ],
    appt_time: [
      (t) => { return validations.timeShouldBeInTheFuture(t) }
    ]
  }

  focus = () => {
    this.titleInput.focus();
  }

  handleChange = (e) => {
    const fieldName = this.titleInput.name;
    const fieldValue = this.titleInput.value;
    this.props.onUserInput(
      fieldName,
      fieldValue,
      AppointmentForm.formValidations[fieldName]
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onFormSubmit();
  }

  setApptTime = (e) => {
    const fieldName = 'appt_time';
    const fieldValue = e.toDate();
    this.props.onUserInput(
      fieldName,
      fieldValue,
      AppointmentForm.formValidations[fieldName]
    );
  }

  render() {
    const inputProps = {
      name: 'appt_time'
    }

    return (
      <div>
        <h3>Make a new Appointment</h3>
        <Label label='Enter a title, date and time' />
        <form onSubmit={ this.handleSubmit }>
          <input name='title'
                 ref={ (input) => { this.titleInput = input } }
                 placeholder='Appointment Title'
                 value={ this.props.title.value }
                 onChange={ this.handleChange } />
          <input type="button"
                 value="Focus the title input"
                 onClick={ this.focus } />
          <Datetime input={ false }
                    open={ true }
                    inputProps={ inputProps }
                    value={ moment(this.props.appt_time.value) }
                    onChange={ this.setApptTime } />
          <input type='submit'
                 value='Make Appointment'
                 className='submit-button'
                 disabled={ !this.props.formValid } />
        </form>
      </div>
    )
  }
}
