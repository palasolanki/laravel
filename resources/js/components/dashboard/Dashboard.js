import React, { Component, Fragment } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";
import classnames from 'classnames';
import { getProjects, setProject, setRedirect, deleteProject, setDeletedList, setTable, setProjectData, resetProject } from "../../store/actions/project";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChartExpense from '../expense/Chart-Expense';
import ChartIncome from '../income/Chart-Income';
import api from '../../helpers/api';

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
      financialYear: '',
      visibleDropdown: false,
      activeId: null,
      showConfirmationPopup: false,
      isTitleEditable: false,
      editedTitle: null,
      editedFinancialYear: ''
    }
    this.state = {
        chart_range:'current_year',
        incomeChartData: [this.setMonthlyIncomeChart('current_year')],
        expenseChartData: [this.setMonthlyExpenseChart('current_year')],
        incomeLabels: [],
        expenseLabels: []
    }

    this.addProject = this.addProject.bind(this);
    this.editProjectTitle = this.editProjectTitle.bind(this);
    this.getFinancialYear = this.getFinancialYear.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.closeProjectForm = this.closeProjectForm.bind(this);
    this.onPressKey = this.onPressKey.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.confirmDeleteTab = this.confirmDeleteTab.bind(this);
    this.backToDropdown = this.backToDropdown.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onClickEditBtn = this.onClickEditBtn.bind(this);
    // this.editTitle = this.editTitle.bind(this);
    this.saveEditedData = this.saveEditedData.bind(this);
    this.changeTitleValue = this.changeTitleValue.bind(this);
    this.changeFinancialYear = this.changeFinancialYear.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.setMonthlyIncomeChart = this.setMonthlyIncomeChart.bind(this);
    this.setMonthlyExpenseChart = this.setMonthlyExpenseChart.bind(this);
  }

  componentDidMount() {

    if (this.props.tabId !== null) {
      this.props.resetProject(this.props.project);
    }
    this.props.getProjects();
    document.addEventListener('mousedown', this.onClickOutside);
  }

  addProject(index) {
    this.setState({
      isAddProject: index,
      isTitleEditable: false
    })
  }

  editProjectTitle(e) {
    this.setState({
      projectTitle: e.target.value
    })
  }

  getFinancialYear(e) {
    this.setState({
      financialYear: e.target.value
    })
  }

  onPressKey(type, e) {
    if (e.charCode === 13 && this.state.projectTitle !== '') {
      this.props.setProject({
        type: type,
        name: this.state.projectTitle,
        financial_year: this.state.financialYear,
        description: 'New title added'
      });
    }
  }

  saveProject(type) {
    if (this.state.projectTitle !== '') {
      this.props.setProject({
        type: type,
        name: this.state.projectTitle,
        financial_year: this.state.financialYear,
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
      visibleDropdown: !this.state.visibleDropdown,
      isAddProject: false,
      showConfirmationPopup: false
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
      showConfirmationPopup: false,
      visibleDropdown:false,
      activeId:null
    });
  }

  onClickOutside(e) {
    if (this.dropdownRef && !this.dropdownRef.contains(e.target)) {
      this.setState({
        visibleDropdown: false,
        isTitleEditable: false,
        activeId:null
      });
    }
  }

  onClickEditBtn(i) {
    this.setState({
      isTitleEditable: true,
      visibleDropdown: false,
      editedFinancialYear: this.props.list[i].financial_year
    })
  }

  changeTitleValue(i, e) {
    this.setState({
      editedTitle: e.target.value
    });
  }

  changeFinancialYear(i, e) {
    this.setState({
      editedFinancialYear: e.target.value
    })
  }

  // editTitle(i, e) {
  //   if (e.charCode === 13) {
  //     this.onBlur(i, e);
  //   }
  // }

  saveEditedData(i, e) {
    const { list } = this.props;
    list[i].name = (this.state.editedTitle) ? this.state.editedTitle : list[i].name;
    list[i].financial_year = (this.state.editedFinancialYear) ? this.state.editedFinancialYear : list[i].financial_year;
    this.props.setProjectData({
      name: list[i].name,
      financial_year: list[i].financial_year
    }, list[i]._id);

    this.props.setTable({
      list: list
    });
    this.setState({
      isTitleEditable: false,
      visibleDropdown: false,
      activeId: null
    })
  }

  cancelEdit() {
    this.setState({
      isTitleEditable: false,
      activeId: null
    })
  }

  componentWillUnmount() {
    this.props.setRedirect(false);
    document.removeEventListener('mousedown', this.onClickOutside, true);
  }

  setMonthlyIncomeChart(url) {
      api.post('/monthlyIncomeChart', {chart_range: url})
      .then((res) => {
        this.setState({
          incomeChartData: res.data.monthlyIncome
        });
        this.setState({
          incomeLabels: res.data.labels
        })
        return this.state.incomeChartData;
      })
  }
  setMonthlyExpenseChart(url) {
    api.post('/monthlyExpenseChart', {chart_range: url})
    .then((res) => {
      this.setState({
        expenseChartData: res.data.monthlyExpense
      });
      this.setState({
        expenseLabels: res.data.labels
      })
      return this.state.expenseChartData;
    })
}

  handleInputChange(e) {
    this.setState({
      chart_range:e.target.value
    });
    this.setMonthlyIncomeChart(e.target.value);
    this.setMonthlyExpenseChart(e.target.value);
  }

  render() {
    const { list, redirect } = this.props;
    const { isAddProject, projectTitle, financialYear, editedFinancialYear, visibleDropdown, activeId, showConfirmationPopup, isTitleEditable } = this.state;

    if (redirect) {
      const project = list[list.length - 1];
      return <Redirect to={`project/${project.first_tab._id}`} />
    }
    return (
      <Fragment>
        <div className="row form-group">
            <select className="form-control" onChange={(e) => this.handleInputChange(e)} value={this.state.chart_range}>
                <option value="current_year">Current-Year</option>
                <option value="past_year">Past-Year</option>
                <option value="last_12_month">Last-12 Month</option>
            </select>
        </div>
        <div style={{display:'flex', width:1600}} className="row">
          <div className="col-md-6">
            { this.state.expenseChartData.length > 0 && this.state.expenseLabels.length > 0 &&
                <ChartExpense expesedata={this.state.expenseChartData} labels={this.state.expenseLabels}/>
            }
          </div>
          <div className="col-md-6">
            { this.state.incomeChartData.length > 0 && this.state.incomeLabels.length > 0 &&
              <ChartIncome incomedata={this.state.incomeChartData} labels={this.state.incomeLabels}/>
            }
          </div>
        </div>
        <div className={classnames({ "overlay": isAddProject !== null }, "dashboard p-3")} >
          {
            this.types.map((type, i) => {
              return <div className={classnames({ "position-relative": isAddProject !== i }, "section")} key={i}>
                <h3 className="mb-4">{type.title}</h3>
                <div className="list">
                  <ul className="ml-md-3 list-inline unstyled">
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
                        saveEditedData={(e) => this.saveEditedData(i, e)}
                        changeTitleValue={(e) => this.changeTitleValue(i, e)}
                        changeFinancialYear={(e) => this.changeFinancialYear(i, e)}
                        editedFinancialYear={editedFinancialYear}
                        cancelEdit={this.cancelEdit}
                      />
                    )}
                    <li className="list-inline-item">
                      {
                        (isAddProject === i && !isTitleEditable) ?
                          <ProjectForm
                            projectTitle={projectTitle}
                            financialYear={financialYear}
                            getFinancialYear={this.getFinancialYear}
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
const currentYear = new Date().getFullYear();

const financialYears = [];

for (let year = 2016; year <= currentYear; year++) {
  let num = 0;
  financialYears.push(`${year - num}-${year - (num - 1)}`);
  num++;
}

const ProjectCard = props => (
  <Fragment>
    <li className="list-inline-item title-items">
      {
        (props.isTitleEditable && props.index === props.activeId && !props.visibleDropdown) ?
          // <input type="text" onChange={props.changeTitleValue} defaultValue={props.project.name} onKeyPress={props.editTitle} onBlur={props.onBlur} />
          <div>
            <div className="form-group">
              <input type="text" onChange={props.changeTitleValue} defaultValue={props.project.name} />
              <br />
              <select className="form-control" name="financial_year" value={props.editedFinancialYear} onChange={props.changeFinancialYear}>
                <option value="" disabled>Financial Year</option>
                {financialYears.map((year, key) => <option key={key} value={year}>{year}</option>)}
              </select>
            </div>
            <div className="d-flex justify-content-end mt-2">
              <button type="button" className="btn btn-sm btn--prime mr-3" onClick={props.saveEditedData}>Save</button>
              <button type="button" className="btn btn-sm btn--cancel" onClick={props.cancelEdit}>Cancel</button>
            </div>
          </div>
          :
          <Link to={`project/${props.project.first_tab._id}`}>{props.project.name}</Link>
      }

      {(((props.index !== props.activeId) && props.visibleDropdown) || (!props.visibleDropdown && (props.index !== props.activeId))) && <button className={classnames({ 'd-block': (props.visibleDropdown && (props.index === props.activeId)) }, "btn ellipsis-h")} type="button" onClick={props.showDropdown}>
        <FontAwesomeIcon icon="ellipsis-v" />
      </button>}
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
    <button type="button" className="btn--custom btn btn-prime rounded-circle" onClick={props.addProject}>+ {props.isAddProject}</button>
  </div >
)

const ProjectForm = props => (
  <div className="form__project bg-white p-4 d-inline-flex">
    <div className="w-100">
      <div className="form-group">
        <input className="form-control" type="text" value={props.projectTitle} onKeyPress={props.onPressKey} onChange={props.editProjectTitle} placeholder="Project Name" />
        <br />
        <select className="form-control" name="financial_year" value={props.financialYear} onChange={props.getFinancialYear}>
          <option value="" disabled>Financial Year</option>
          {financialYears.map((year, key) => <option key={key} value={year}>{year}</option>)}
        </select>
      </div>
      <div className="d-flex justify-content-end mt-2">
        <button type="button" className="btn btn-sm btn--prime mr-3" onClick={props.saveProject}>Save</button>
        <button type="button" className="btn btn-sm btn--cancel" onClick={props.closeProjectForm}>Cancel</button>
      </div>
    </div>
  </div>
)

const mapStateToProps = state => {
  return {
    list: state.project.list,
    redirect: state.project.redirect,
    listDeleted: state.project.listDeleted,
    tabId: state.project.tabId
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
    setProjectData: (data, projectId) => dispatch(setProjectData(data, projectId)),
    resetProject: data => dispatch(resetProject(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
