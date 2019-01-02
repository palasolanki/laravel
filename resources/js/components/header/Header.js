import React, { Component } from 'react'

export default class Header extends Component {
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
   // this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  editTitle(e) {

    // if(!this.state.contenteditable) {
    //   document.addEventListener('click', this.handleClickOutside, false);
    // }
    // else {
    //   document.removeEventListener('click', this.handleClickOutside, false);
    // }
   // setTimeout(() => {
      this.setState({
        contenteditable: true,
      });
   // }, 200);
  }

  setTitle(e) {
    this.setState({
      projectTitle: e.target.value
    })
  }
  onBlur(e) {
    this.setState({
      contenteditable: false
    })
  }

  // handleClickOutside(e) {
  //   if (this.projectTitleRef.contains(e.target)) {
  //     return;
  //   }
  //   else {
  //     this.setState({
  //       contenteditable: false,
  //     })
  //   }
  // }

  render() {
    const { contenteditable, projectTitle } = this.state;
    return (
      <header className="d-flex align-items-center justify-content-center">
        { contenteditable ? <input
        type="text"
        value={projectTitle}
        contentEditable={true}
        onChange={this.setTitle}
        onBlur={this.onBlur}
        ref={this.inputRef}
        /> : <h3 className="mb-0" onDoubleClick={this.editTitle}>{projectTitle}</h3> }
      </header>
    )
  }
}
