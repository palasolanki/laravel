import React from 'react';
import Chart from '../dashboard/Chart';

export default function incomeChart(props) {
    const currentdata = {
        label: 'Income',
        title: 'Monthly Income',
    }
    return (
        <div>
            <Chart currentdata={currentdata} chartData={props.incomedata} labels={props.labels}/>
        </div>
    );
  }