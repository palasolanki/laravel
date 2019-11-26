import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Editors } from "react-data-grid-addons";
const { DropDownEditor } = Editors;
const mediums = [
  { id: "netbanking", value: "Netbanking" },
  { id: "smartCard", value: "Smart Card" },
  { id: "mobilePayment", value: "Mobile Payment " },
];

export class MediumEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : ''
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleMouseDown, true);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseDown, true);
    this.props.onCommitCancel();
  }

  handleMouseDown(e) {
    e.stopPropagation();
  }

  getValue() {
    const value = ReactDOM.findDOMNode(this).getElementsByTagName("select")[0].value;
    const key = this.props.column.key;
    return { [key]: value };
  }

  getInputNode() {
    return ReactDOM.findDOMNode(this).getElementsByTagName("select")[0];
  }

  render() {
    return (
      <div tabIndex="-1">
        <DropDownEditor
          value={this.state.value}
          options={mediums} />
      </div>
    );
  }
}

export default MediumEditor;
