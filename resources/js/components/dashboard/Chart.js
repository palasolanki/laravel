import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

export default function Chart(props) {
    const data = {
        labels:props.lablesName,
        datasets:[
            {
                label:props.currentdata.lableName,
                data:props.chartData,
            },
        ],
    };

    return (
        <div className="chart">
            {
              <Bar data={data} options={{
                title:{
                  display:true,
                  text:props.currentdata.titleName,
                  fontSize:25,
                  fontColor:'green'
                },
                legend:{
                  display:true,
                  position:"bottom"
                },
              }}/>
            }
        </div>
    );
  }