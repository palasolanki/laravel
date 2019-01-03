import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../images/favicon.png';

export default class ProjectHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contenteditable: false,
      projectTitle: 'Project Title'
    }
    this.inputRef = React.createRef();
    this.editTitle = this.editTitle.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onkeyPress = this.onkeyPress.bind(this);
  }

  editTitle(e) {
      this.setState({
        contenteditable: true,
      });
  }

  setTitle(e) {
    this.setState({
      projectTitle: e.target.value
    });
  }

  onkeyPress(e) {
    if(e.charCode === 13) {
      this.setState({
        contenteditable: false
      })
    }
  }
  onBlur(e) {
    this.setState({
      contenteditable: false
    })
  }

  render() {
    const { contenteditable, projectTitle } = this.state;
    const { toggleSidebar } = this.props;
    return (
      <header className="project-header d-flex align-items-center justify-content-center">
      <img className="logo rounded-circle" src={logo} alt="Logo"/>
      <div className="ml-4" onClick={toggleSidebar}>
        <FontAwesomeIcon className="bars" icon="bars" />
      </div>
        { contenteditable ? <input
        type="text"
        value={projectTitle}
        contentEditable={true}
        onChange={this.setTitle}
        onKeyPress={this.onkeyPress}
        onBlur={this.onBlur}
        ref={this.inputRef}
        /> : <h3 className="mb-0" onDoubleClick={this.editTitle}>{projectTitle}</h3> }
      </header>
    )
  }
}
