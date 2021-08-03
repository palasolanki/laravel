import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';

export default function Chart(props) {
  // console.log(props);
    const data = {
        labels:props.labels,
        datasets:[
            {
                label:props.currentdata.label,
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
                  text:props.currentdata.title,
                  fontSize:24,
                  fontColor:'#32afbc'
                },
                legend:{
                  display:true,
                  position:"bottom"
                },
                tooltips: {
                  callbacks: {
                    label: (tooltipItem, data) => {
                      let dataset = data.datasets[tooltipItem.datasetIndex];
                      let currentValue = new Intl.NumberFormat('en',{style:'currency', currency:'INR'}).format(dataset.data[tooltipItem.index]);
                      return currentValue;
                    }
                  }
                }
              }}/>
            }
        </div>
    );
  }