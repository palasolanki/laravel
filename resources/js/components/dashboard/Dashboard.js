import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import classnames from 'classnames';
import { getProjects, setProject } from "../../store/actions/project";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.types = [
      {title: 'Expense'},
      {title: 'Income'}
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

    saveProject() {

      this.props.setProject({
        _id: this.props.list.length ,
        name: this.state.projectTitle,
        description: 'New title added'
      });

    }

    closeProjectForm() {
      this.setState({
        isAddProject: null
      })
    }


    render() {
        const { list } = this.props;
        const { isAddProject, projectTitle } = this.state;
        return (
          <Fragment>
          <div className="dashboard p-3">
              {
                this.types.map((type, i) => {
                 return <div className="section" key={i}>
                    <h3 className="mb-5">{type.title}</h3>
                    <div className="list">
                    <ul className="ml-3 list-inline unstyled">
                      {list.map((list) => (
                          <ProjectCard project={list} key={list._id} />
                      ))}
                    </ul>
                    <div className={classnames(
                      {'btn__add-project' : (isAddProject !== i)},
                      {'form__project bg-white p-4' : (isAddProject === i)},
                       "d-inline-flex")
                      }
                      >
                      {
                        (isAddProject === i)  ?
                          <div className="w-100">
                          {/* <h5>Add Project Title:</h5> */}
                            <div className="form-group">
                              <input className="form-control" type="text" value={projectTitle} onChange={this.editProjectTitle} placeholder="Project Name"/>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                              <button type="button" className="btn btn--prime mr-3" onClick={this.saveProject}>Save</button>
                              <button type="button" className="btn btn--cancel" onClick={this.closeProjectForm}>Cancel</button>
                            </div>
                          </div>
                        :
                          <button type="button" className="btn--custom btn btn-prime rounded-circle" onClick={() => this.addProject(i)}>+</button>
                      }
                      </div>
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
      <Link to={`project/${props.project._id}`}>{props.project.name} </Link>
    </li>
);

const mapStateToProps = state => {
    return {
        list: state.project.list
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getProjects: () => dispatch(getProjects()),
        setProject: (data) => dispatch(setProject(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
