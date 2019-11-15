import React from 'react';
import Chart from '../dashboard/Chart';

export default function expenseChart(props) {
    const currentdata = {
        lableName: 'Expense',
        titleName: 'Monthly Expense',
    }
    return (
        <div>
            <Chart currentdata={currentdata} chartData={props.expesedata} chartyear={props.chartyear} lablesName={props.lablesName}/>
        </div>
    );
  }