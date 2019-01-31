import React, { Component } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class DateEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
  }

  getValue() {
    return { paid_date: this.state.startDate };
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
  }

  handleChange(date) {
    console.log(date);

    this.setState({
      startDate: date
    }, () => this.props.onCommit());
  }
  render() {
    return <DatePicker
      selected={this.state.startDate}
      onChange={this.handleChange}
    />
  }
}

export default DateEditor;