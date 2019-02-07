import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../images/favicon.png';
import { connect } from 'react-redux';
import { setProjectTitle, setTable } from '../../store/actions/project';
import { logout } from '../../store/actions/auth';

export class ProjectHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contenteditable: false,
      editedTitle: null
    }
    this.inputRef = React.createRef();
    this.editTitle = this.editTitle.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onPressKey = this.onPressKey.bind(this);
    this.onChange = this.onChange.bind(this);
    this.logout = this.logout.bind(this);

  }

  editTitle(e) {
    this.setState({
      contenteditable: true,
    });
  }

  onChange(e) {
    this.setState({
      editedTitle: e.target.value
    })
  }
  onPressKey(e) {
    if (e.charCode === 13) {
      this.onBlur(e);
    }
  }
  onBlur(e) {
    if (!this.state.editedTitle) {

      this.props.setTable({
        name: this.props.projectName
      })
    }
    else {
      this.props.setTable({
        name: this.state.editedTitle
      })
      this.props.setProjectTitle({
        name: this.state.editedTitle
      }, this.props.projectId);
    }
    this.setState({
      contenteditable: false
    })
  }

  logout() {
    this.props.logout();
  }

  render() {
    const { contenteditable } = this.state;
    const { toggleSidebar, projectName, projectType } = this.props;

    return (
      <header className="project-header d-flex align-items-center justify-content-between">
        <div className="flex-row d-flex align-items-center">
          <Link to={'/'}>
            <img className="logo rounded-circle" src={logo} alt="Logo" />
          </Link>
          <div className="ml-md-4 ml-3 hamburger d-flex" onClick={toggleSidebar}>
            <FontAwesomeIcon className="bars" icon="bars" />
          </div>
        </div>
        <h4 className="project-type mb-0 text-capitalize">{projectType}</h4>
        <div className="mr-3 text-white font-weight-bold cursor-pointer logout" onClick={this.logout}>Logout</div>
        <div className="header__pos-abs">
          {contenteditable ? <input
            type="text"
            defaultValue={projectName}
            contentEditable={true}
            onKeyPress={this.onPressKey}
            onBlur={this.onBlur}
            onChange={this.onChange}
            ref={this.inputRef}
          /> : <h3 className="mb-0" onDoubleClick={this.editTitle}>{projectName}</h3>}
        </div>
      </header >
    )
  }
}

const mapStateToProps = state => {
  return {
    projectName: state.project.name,
    projectId: state.project._id,
    projectType: state.project.type
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setProjectTitle: (data, projectId) => dispatch(setProjectTitle(data, projectId)),
    setTable: (data) => dispatch(setTable(data)),
    logout: () => dispatch(logout())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectHeader);