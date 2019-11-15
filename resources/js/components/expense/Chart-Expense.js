import React from 'react';
import Chart from '../dashboard/Chart';

export default function expenseChart(props) {
    const currentdata = {
        label: 'Expense',
        title: 'Monthly Expense',
    }
    return (
        <div>
            <Chart currentdata={currentdata} chartData={props.expesedata} labels={props.labels}/>
        </div>
    );
  }