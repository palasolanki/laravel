import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Editors } from "react-data-grid-addons";
import api from "../../../helpers/api"

const { DropDownEditor } = Editors;
// const clients = [
//   { id: "john", value: "John" },
//   { id: "kim", value: "Kim" },
//   { id: "jack", value: "Jack" },
//   { id: "joe", value: "Joe" }
// ];

export class ClientEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : '',
      clients: []
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.fetchClients = this.fetchClients.bind(this);
  }
  componentDidMount() {
    this.fetchClients();
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

  async fetchClients() {
    return await api.get('/clients')
      .then(res => {
        const clientsData = (res.data.data).filter((client) => {
          client.key = client._id
          client.id = client._id
          client.value = client.name
          return client
        })
        this.setState({
          clients: clientsData
        })
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div tabIndex="-1">
        <DropDownEditor
          value={this.state.value}
          options={this.state.clients}
        />
      </div>
    );
  }
}

export default ClientEditor;
