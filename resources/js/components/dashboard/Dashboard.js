import React, { Component, Fragment } from "react";
import { Redirect } from 'react-router-dom';
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
        chart_range:'current_year',
        incomeChartData: [this.setMonthlyIncomeChart('current_year')],
        expenseChartData: [this.setMonthlyExpenseChart('current_year')],
        incomeLabels: [],
        expenseLabels: []
    }

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

  getFinancialYear(e) {
    this.setState({
      financialYear: e.target.value
    })
  }


  changeFinancialYear(i, e) {
    this.setState({
      editedFinancialYear: e.target.value
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
          incomeLabels: res.data.labels,
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

    if (redirect) {
      const project = list[list.length - 1];
      return <Redirect to={`project/${project.first_tab._id}`} />
    }

    let incomeTotal = 0;
    let expenseTotal = 0;

    return (
      <Fragment>
        <div className="form-group d-flex align-items-center pl-4 mt-3">
          <label htmlFor="filterlabel" className="mb-0 font-weight-bold">Filter</label>
          <select aria-label="filterlabel" className="form-control col-xl-2 col-md-3" style={{margin:20}} onChange={(e) => this.handleInputChange(e)} value={this.state.chart_range}>
              <option value="current_year">Current-Year</option>
              <option value="past_year">Past-Year</option>
              <option value="last_12_month">Last-12 Month</option>
          </select>
        </div>
        <div className="d-flex">
          <div className="col-xl-6">
            { this.state.expenseChartData.length > 0 && this.state.expenseLabels.length > 0 &&
                <ChartExpense expesedata={this.state.expenseChartData} labels={this.state.expenseLabels}/>
            }
          </div>
          <div className="text-bolder mt-3 ml-5">
            {this.state.expenseChartData.map((v,k) => {
              expenseTotal = expenseTotal + v;
            })}
            Average: {new Intl.NumberFormat('en',{style:'currency', currency:'INR'}).format(expenseTotal / this.state.expenseChartData.length)}
          </div>
        </div>
        <div className="d-flex">
          <div className="col-xl-6 mt-md-5 mt-3">
            { this.state.incomeChartData.length > 0 && this.state.incomeLabels.length > 0 &&
              <ChartIncome incomedata={this.state.incomeChartData} labels={this.state.incomeLabels}/>
            }
          </div>
          <div className="text-bolder mt-md-5 mt-5 ml-5">
            {this.state.incomeChartData.map((v,k) => {
              incomeTotal = incomeTotal + v;
            })}
            Average: {new Intl.NumberFormat('en',{style:'currency', currency:'INR'}).format(incomeTotal / this.state.incomeChartData.length)}
          </div>
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

export default Dashboard;
