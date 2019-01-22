import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../images/favicon.png';
import { connect } from 'react-redux';
import { setProjectTitle, setTable } from '../../store/actions/project';

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
    console.log(e.target.value);

    if (e.charCode === 13) {
      if (!e.target.value) {
        this.props.setTable({
          name: this.props.projectName
        })
      }
      else {
        this.props.setTable({
          name: e.target.value
        })
      }
      this.onBlur(e);
    }
  }
  onBlur(e) {

    // if (!this.state.editedTitle) {
    //   this.props.setTable({
    //     name: this.props.projectName
    //   })
    // }
    // else {
    //   this.props.setTable({
    //     list: newList
    //   });

    //   this.props.setProjectTitle({
    //     name: this.props.projectName
    //   }, this.props.projectId);
    // }

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
          <img className="logo rounded-circle" src={logo} alt="Logo" />
        </Link>
        <div className="ml-sm-4 ml-2" onClick={toggleSidebar}>
          <FontAwesomeIcon className="bars" icon="bars" />
        </div>
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
      </header>
    )
  }
}

const mapStateToProps = state => {
  return {
    projectName: state.project.name,
    projectId: state.project._id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setProjectTitle: (data, projectId) => dispatch(setProjectTitle(data, projectId)),
    setTable: (data) => dispatch(setTable(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectHeader);