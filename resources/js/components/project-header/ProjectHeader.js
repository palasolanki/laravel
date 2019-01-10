import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../images/favicon.png';
import { connect } from 'react-redux';
import { setProjectTitle, setTable} from '../../store/actions/project';

export class ProjectHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contenteditable: false,
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
    this.props.setTable({
      name: e.target.value
    })
  }

  onkeyPress(e) {
    if(e.charCode === 13) {
      this.props.setProjectTitle({
        name: this.props.projectName
      }, this.props.projectId);
      this.setState({
        contenteditable: false
      })
    }
  }
  onBlur(e) {
    this.props.setProjectTitle({
      name: this.props.projectName
    }, this.props.projectId);
    this.setState({
      contenteditable: false
    })
  }

  render() {
    const { contenteditable } = this.state;
    const { toggleSidebar, projectName } = this.props;

    return (
      <header className="project-header d-flex align-items-center">
        <Link to={'/'}>
          <img className="logo rounded-circle" src={logo} alt="Logo"/>
        </Link>
        <div className="ml-sm-4 ml-2" onClick={toggleSidebar}>
          <FontAwesomeIcon className="bars" icon="bars" />
        </div>
        <div className="header__pos-abs">
          { contenteditable ? <input
          type="text"
          value={projectName}
          contentEditable={true}
          onChange={this.setTitle}
          onKeyPress={this.onkeyPress}
          onBlur={this.onBlur}
          ref={this.inputRef}
          /> : <h3 className="mb-0" onDoubleClick={this.editTitle}>{projectName}</h3> }
        </div>
      </header>
    )
  }
}

const mapStateToProps = state => {
  return {
    projectName: state.project.name,
    projectId: state.project._id,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setProjectTitle: (data, projectId) => dispatch(setProjectTitle(data, projectId)),
    setTable: (data) => dispatch(setTable(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(ProjectHeader);