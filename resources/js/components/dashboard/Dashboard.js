import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { getProjects } from "../../store/actions/project";
import { Link } from "react-router-dom";

class Dashboard extends Component {
    componentDidMount() {
        this.props.getProjects();
    }
    render() {
        const { list } = this.props;
        return (
            <div className="ml-2 mt-2 mr-2">
                <h3>This is Dashboard</h3>
                <div className="row">
                    {list.map((list, index) => (
                        <ProjectCard project={list} key={list._id} />
                    ))}
                </div>
            </div>
        );
    }
}

const ProjectCard = props => (
    <div className="col-sm-3 mt-2">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{props.project.name}</h5>
                <p className="card-text">{props.project.description}</p>
                <Link
                    to={`project/${props.project._id}`}
                    className="btn btn-primary"
                >
                    Go
                </Link>
            </div>
        </div>
    </div>
);

const mapStateToProps = state => {
    return {
        list: state.project.list
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getProjects: () => dispatch(getProjects())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
