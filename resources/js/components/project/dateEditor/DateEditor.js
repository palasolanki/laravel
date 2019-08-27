import React, { Component } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export class DateEditor extends Component {
    constructor(props) {
        super(props);
        const date = moment(props.value, "DD/MM/YYYY");

        this.state = {
            startDate: date.isValid() ? new Date(date) : new Date()
        };
        this.handleChange = this.handleChange.bind(this);
    }

    getValue() {
        const { column } = this.props;
        let newDate = moment(this.state.startDate).format("DD/MM/YYYY");
        if (column.key === "paid_date") {
            return { paid_date: newDate };
        }
        if (column.key === "paid_by") {
            return { paid_by: newDate };
        }
    }

    getInputNode() {
        return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
    }

    handleChange(date) {
        this.setState(
            {
                startDate: date
            },
            () => this.props.onCommit()
        );
    }

    componentWillUnmount() {
        this.props.onCommitCancel();
    }

    render() {
        return (
            <div tabIndex="-1">
                <DatePicker
                    selected={this.state.startDate}
                    onChange={this.handleChange}
                    dateFormat="dd/MM/yyyy"
                />
            </div>
        );
    }
}

export default DateEditor;
