import React, {Fragment} from 'react';
import Chart from '../dashboard/Chart';

export default function expenseChart(props) {
    const currentdata = {
        label: 'Expense',
        title: 'Monthly Expense',
    }
    return (
        <Fragment>
            <Chart currentdata={currentdata} chartData={props.expesedata} labels={props.labels}/>
        </Fragment>
    );
  }