import React from 'react';
import Paper from '@material-ui/core/Paper';
/*
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  Title,
} from '@devexpress/dx-react-chart-material-ui';
*/
import './DMGCalculator.css';
import { Line } from "react-chartjs-2";

interface Props {
    data?: any[]
}

const DMGGraph = (props: Props) => {
    const { data } = props;
    const styledData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 
                 '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        datasets: data,
      };

    return (
        <div className={'graphContainer'}>
            <Paper>
                <Line height={360} width={800} data={styledData} />
                { /*
                <Chart height={360} width={770} data={data} >
                    <ArgumentAxis />
                    <ValueAxis />
                    <Title text={"Damage per round"}/>
                    <LineSeries color={'blue'} valueField="first_value" argumentField="first" />
                    <LineSeries color={'red'}  valueField="second_value" argumentField="second" />
                    <LineSeries color={'green'}  valueField="third_value" argumentField="third" />
                    <LineSeries color={'yellow'} valueField="fourth_value" argumentField="fourth" />
                </Chart>
                */}
            </Paper>
        </div>
    );
}

export default DMGGraph;