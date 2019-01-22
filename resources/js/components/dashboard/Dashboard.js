import React, { Component, Fragment } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import { getProjects, setProject, setRedirect, deleteProject, setDeletedList, setTable, setProjectTitle } from "../../store/actions/project";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.dropdownRef = null;
    this.types = [
      { title: 'Expense', type: 'expense' },
      { title: 'Income', type: 'income' }
    ];
    this.state = {
      isAddProject: null,
      activeType: null,
      projectTitle: '',
      visibleDropdown: false,
      activeId: null,
      showConfirmationPopup: false,
      isTitleEditable: false,
      editedTitle: null
    }

    this.addProject = this.addProject.bind(this);
    this.editProjectTitle = this.editProjectTitle.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.closeProjectForm = this.closeProjectForm.bind(this);
    this.onPressKey = this.onPressKey.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.confirmDeleteTab = this.confirmDeleteTab.bind(this);
    this.backToDropdown = this.backToDropdown.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onClickEditBtn = this.onClickEditBtn.bind(this);
    this.editTitle = this.editTitle.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.changeTitleValue = this.changeTitleValue.bind(this);
  }

  componentDidMount() {
    this.props.getProjects();
    document.addEventListener('mousedown', this.onClickOutside);
  }

  addProject(index) {
    this.setState({
      isAddProject: index,
    })
  }

  editProjectTitle(e) {
    this.setState({
      projectTitle: e.target.value
    })
  }

  onPressKey(type, e) {
    if (e.charCode === 13 && this.state.projectTitle !== '') {
      this.props.setProject({
        type: type,
        name: this.state.projectTitle,
        description: 'New title added'
      });
    }
  }

  saveProject(type) {
    if (this.state.projectTitle !== '') {
      this.props.setProject({
        type: type,
        name: this.state.projectTitle,
        description: 'New title added'
      });
    }
    this.closeProjectForm();
  }

  closeProjectForm() {
    this.setState({
      isAddProject: null,
      projectTitle: ''
    })
  }

  showDropdown(id) {
    this.setState({
      activeId: id,
      visibleDropdown: !this.state.visibleDropdown
    })
  }

  deleteProject(i) {
    const { list } = this.props;
    this.props.deleteProject(list[i]._id);
    this.setState({
      visibleDropdown: false,
      showConfirmationPopup: false
    })
  }

  confirmDeleteTab() {
    this.setState({
      showConfirmationPopup: true
    });
  }
  backToDropdown() {
    this.setState({
      showConfirmationPopup: false
    });
  }

  onClickOutside(e) {
    if (this.dropdownRef && !this.dropdownRef.contains(e.target)) {
      this.setState({
        visibleDropdown: false
      });
    }
  }

  onClickEditBtn(i) {
    this.setState({
      isTitleEditable: true,
      visibleDropdown: false
    })
  }

  changeTitleValue(i, e) {
    this.setState({
      editedTitle: e.target.value
    });
  }

  editTitle(i, e) {
    if (e.charCode === 13) {
      this.onBlur(i, e);
    }
  }

  onBlur(i, e) {
    const { list } = this.props;
    if (!this.state.editedTitle) {

      this.props.setProjectTitle({
        name: list[i].name
      }, list[i]._id);

    }
    else {
      list[i].name = this.state.editedTitle;
      this.props.setProjectTitle({
        name: list[i].name
      }, list[i]._id);
      this.props.setTable({
        list: list
      });

    }
    this.setState({
      isTitleEditable: false,
    })
  }


  componentWillUnmount() {
    this.props.setRedirect(false);
    document.removeEventListener('mousedown', this.onClickOutside, true);
  }

  render() {
    const { list, redirect } = this.props;
    const { isAddProject, projectTitle, visibleDropdown, activeId, showConfirmationPopup, isTitleEditable } = this.state;

    if (redirect) {
      const project = list[list.length - 1];
      return <Redirect to={`project/${project.first_tab._id}`} />
    }
    return (
      <Fragment>
        <div className="dashboard p-3">
          {
            this.types.map((type, i) => {
              return <div className="section" key={i}>
                <h3 className="mb-4">{type.title}</h3>
                <div className="list">
                  <ul className="ml-3 list-inline unstyled">
                    {list.map((list, i) => (
                      list.type === type.type) && <ProjectCard
                        showDropdown={() => this.showDropdown(i)}
                        index={i}
                        activeId={activeId}
                        visibleDropdown={visibleDropdown}
                        project={list}
                        key={list._id}
                        deleteProject={() => this.deleteProject(i)}
                        confirmDeleteTab={this.confirmDeleteTab}
                        showConfirmationPopup={showConfirmationPopup}
                        backToDropdown={this.backToDropdown}
                        dropdownRef={dropdownRef => (this.dropdownRef = dropdownRef)}
                        onClickEditBtn={() => this.onClickEditBtn(i)}
                        editTitle={(e) => this.editTitle(i, e)}
                        isTitleEditable={isTitleEditable}
                        onBlur={(e) => this.onBlur(i, e)}
                        changeTitleValue={(e) => this.changeTitleValue(i, e)}
                      />
                    )}
                    <li className="list-inline-item">
                      {
                        (isAddProject === i) ?
                          <ProjectForm
                            projectTitle={projectTitle}
                            editProjectTitle={this.editProjectTitle}
                            saveProject={this.saveProject.bind(this, type.type)}
                            closeProjectForm={this.closeProjectForm}
                            onPressKey={(e) => this.onPressKey(type.type, e)}
                          />
                          :
                          <AddButton addProject={this.addProject.bind(this, i)} />
                      }
                    </li>
                  </ul>
                </div>
              </div>
            })
          }
        </div>
      </Fragment>
    );
  }
}

const ProjectCard = props => (
  <Fragment>
    <li className="list-inline-item title-items">
      {
        (props.isTitleEditable && props.index === props.activeId) ? <input type="text" onChange={props.changeTitleValue} defaultValue={props.project.name} onKeyPress={props.editTitle} onBlur={props.onBlur} />
          :
          <Link to={`project/${props.project.first_tab._id}`}>{props.project.name}</Link>
      }

      <button className={classnames({ 'd-block': (props.visibleDropdown && (props.index === props.activeId)) }, "btn ellipsis-h")} type="button" onClick={props.showDropdown}>
        <FontAwesomeIcon icon="ellipsis-v" />
      </button>
      {
        (props.visibleDropdown && (props.index === props.activeId)) && <div className="custom-dropdown" ref={props.dropdownRef}>
          {
            <div className="dropdown-menu show">
              {
                props.showConfirmationPopup ?
                  <div className="popup">
                    <p className="text-center">Are you sure?</p>
                    <div className="d-flex justify-content-around px-4">
                      <button className="btn btn-sm btn--prime" onClick={props.deleteProject}>Yes</button>
                      <button className="btn btn-sm btn--cancel" onClick={props.backToDropdown}>No</button>
                    </div>
                  </div>
                  :
                  <Fragment>
                    <button className="dropdown-item" type="button" onClick={props.onClickEditBtn}>Edit</button>
                    <button className="dropdown-item" type="button" onClick={props.confirmDeleteTab}>Delete</button>
                  </Fragment>
              }

            </div>
          }
        </div>
      }
    </li>
  </Fragment>
);

const AddButton = props => (
  <div className="btn__add-project d-inline-flex">
    <button type="button" className="btn--custom btn btn-prime rounded-circle" onClick={props.addProject}>+</button>
  </div>
)

const ProjectForm = props => (
  <div className="form__project bg-white p-4 d-inline-flex">
    <div className="w-100">
      <div className="form-group">
        <input className="form-control" type="text" value={props.projectTitle} onKeyPress={props.onPressKey} onChange={props.editProjectTitle} placeholder="Project Name" />
      </div>
      <div className="d-flex justify-content-end mt-2">
        <button type="button" className="btn btn--prime mr-3" onClick={props.saveProject}>Save</button>
        <button type="button" className="btn btn--cancel" onClick={props.closeProjectForm}>Cancel</button>
      </div>
    </div>
  </div>
)

const mapStateToProps = state => {
  return {
    list: state.project.list,
    redirect: state.project.redirect,
    listDeleted: state.project.listDeleted
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProjects: () => dispatch(getProjects()),
    setProject: (data) => dispatch(setProject(data)),
    setRedirect: (data) => dispatch(setRedirect(data)),
    deleteProject: (projectId) => dispatch(deleteProject(projectId)),
    setDeletedList: (flag) => dispatch(setDeletedList(flag)),
    setTable: data => dispatch(setTable(data)),
    setProjectTitle: (data, projectId) => dispatch(setProjectTitle(data, projectId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
