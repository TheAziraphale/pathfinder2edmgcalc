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
import EnemyAC from '../jsons/EnemyAC.json';

interface Props {
    data?: any[];
    enemyAcMod?: string;
}

const DMGGraph = (props: Props) => {
    const { data, enemyAcMod } = props;
    const styledData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 
                 '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        datasets: data,
      };
    
      /*
    for (let i = 0; i < 20; i++) {
        styledData.labels[i] += ' (' + EnemyAC['ac'][i+1] + ')'
    }
    */

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
                <p className={'acLabel'} key={'ac'}>{'AC:'}</p>
                <div className={'rowChildren'}>
                {EnemyAC['ac'].map((ac, index) => {
                    if(ac === 0) {
                        return '';
                    }
                    return(<p className={'acText'} key={ac + '_' + index}>{ac + (enemyAcMod !== undefined ? parseInt(enemyAcMod) : 0)}</p>)
                })}
                </div>
            </Paper>
        </div>
    );
}

export default DMGGraph;