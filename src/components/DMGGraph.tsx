import React from 'react';
import Paper from '@material-ui/core/Paper';
import './Components.css';
import { Line } from "react-chartjs-2";

interface Props {
    data?: any[];
    enemyAcMod?: string;
    acJson:any[];
}

const DMGGraph = (props: Props) => {
    const { data, enemyAcMod, acJson } = props;

    const datasets = [];
    const attackssummary = [];
    data.forEach((instance) => {
        if (Object.keys(instance).length !== 0) { 
            datasets.push(instance.datasets);
            attackssummary.push(instance.attacksSummary);
        }
    });

    const styledData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
        datasets: datasets,
        attackssummary: attackssummary,
    };

    const options = {
        legend: {
            display: true
        },
        tooltips: {
            callbacks: {
                title: function(tooltipItem, data) {
                    return (
                        data.datasets[tooltipItem[0].datasetIndex].label + " - Level " + data.labels[tooltipItem[0].index].toLocaleString("en-US", {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        })
                    );
                },
                label: function(tooltipItems, data) {
                    return "Average total Damage: " +  data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index].toFixed(1);
                },
                afterBody: function(tooltipItems, data) {
                    var multistring = ['----------------------------------------'];
                    data.attackssummary[tooltipItems[0].datasetIndex][tooltipItems[0].index].forEach((attack, index) => {
                        // console.log(attack);
                        multistring.push('Attack '+ (index + 1) + ' - Total hit: ' + attack.totalHit.toFixed(0) + 
                        ' - Bonus dmg: ' + attack.totalDmg.toFixed(1) + ' - Avg dmg: ' + attack.avgDmgThisAttack.toFixed(1));
                    });
        
                    return multistring;
                }
            },
            custom: function(tooltip) {
                tooltip.zindex = 1000;
              },
            xPadding: 20,
            yPadding: 10,
            displayColors: false,
            bodyFontStyle: "bold"
        },
        yAxes: [
            {
                stacked: true,
                gridLines: {
                    display: true,
                    drawBorder: true
                },
                ticks: {
                    display: false
                }
             }
         ]
    };

    return (
        <div className={'graphContainer'}>
            <Paper>
                <Line height={360} width={800} options={options} data={styledData} />
                <p className={'acLabel'} key={'ac'}>{'AC:'}</p>
                <div className={'graphRowChildren'}>
                {acJson.map((ac, index) => {
                    if(index === 0 || index >= 21) {
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