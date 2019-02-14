import React, { Component } from "react";

export class CustomEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : ''
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleMouseDown, true);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseDown, true);
  }

  handleMouseDown(e) {
    e.stopPropagation();
    this.props.onCommit();
  }

  getValue() {
    const key = this.props.column.key;
    return { [key]: this.state.value };
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  };

  getInputNode() {
    return this.refs.input;
  }

  render() {
    return (
      <input
        ref="input"
        value={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}

export default CustomEditor;
