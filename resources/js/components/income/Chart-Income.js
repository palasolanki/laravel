import React from 'react';
import Chart from '../dashboard/Chart';

export default function incomeChart(props) {
    const currentdata = {
        lableName: 'Income',
        titleName: 'Monthly Income',
    }
    return (
        <div>
            <Chart currentdata={currentdata} chartData={props.incomedata} chartyear={props.chartyear} lablesName={props.lablesName}/>
        </div>
    );
  }