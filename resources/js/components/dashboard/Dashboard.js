import React, { Component, Fragment } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import { getProjects, setProject, setRedirect } from "../../store/actions/project";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.types = [
      { title: 'Expense', type: 'expense' },
      { title: 'Income', type: 'income' }
    ];
    this.state = {
      isAddProject: null,
      activeType: null,
      projectTitle: ''
    }
    this.addProject = this.addProject.bind(this);
    this.editProjectTitle = this.editProjectTitle.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.closeProjectForm = this.closeProjectForm.bind(this);
    this.onPressKey = this.onPressKey.bind(this);
  }

  componentDidMount() {
    this.props.getProjects();
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
  componentWillUnmount() {
    this.props.setRedirect(false);
  }

  render() {
    const { list, redirect } = this.props;
    const { isAddProject, projectTitle } = this.state;

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
                    {list.map((list) => (
                      list.type === type.type) && <ProjectCard project={list} key={list._id} />
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
  <li className="list-inline-item">
    <Link to={`project/${props.project.first_tab._id}`}>{props.project.name} </Link>
  </li>
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
    redirect: state.project.redirect
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProjects: () => dispatch(getProjects()),
    setProject: (data) => dispatch(setProject(data)),
    setRedirect: (data) => dispatch(setRedirect(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
