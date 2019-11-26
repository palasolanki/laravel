import React from "react";
import { connect } from 'react-redux';


export default function (ComposedComponent) {
  class Authenticate extends React.Component {

    componentDidMount() {
      if (!this.props.isAuthenticated) {
        this.props.history.push('/login');
      }
    }

    componentDidUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        nextProps.history.push('/login');
      }
    }

    render() {

      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.auth.isAuthenticated
    }
  }

  return connect(mapStateToProps)(Authenticate);
}