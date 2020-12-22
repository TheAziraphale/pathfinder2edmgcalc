import React, { useEffect, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import './Components.css';
import { Line } from "react-chartjs-2";

export interface GraphElement {
    id: number;
    data: any;
  }

interface Props {
    graphElement: GraphElement[];
    enemyAcMod?: string;
    enemySaveMod?: string;
    acJson:any[];
    saveJson:any[];
    reset?: boolean;
}

const DMGGraph = (props: Props) => {
    const { graphElement, enemyAcMod, enemySaveMod, acJson, saveJson, reset } = props;
    const [resetLine, setResetLine] = useState<boolean>(false);

    useEffect(() => {
        if(reset) {
            setResetLine(true);
        }
    },[reset])

    useEffect(() => {
        if(resetLine) {
            setResetLine(false);
        }
    },[resetLine])


    const datasets = [];
    const attackssummary = [];
    graphElement.forEach((element) => {
        if (Object.keys(element).length !== 0) { 
            if (element.data !== undefined && Object.keys(element.data).length !== 0) {
                datasets.push(element.data[0].datasets);
                attackssummary.push(element.data[0].attacksSummary);
            }
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
                        if (attack.spellDC === undefined) {
                            multistring.push('Attack '+ (index + 1) + ' - Total hit: ' + attack.totalHit.toFixed(0) +
                            ' - Bonus dmg: ' + attack.totalDmg.toFixed(1) + ' - Avg dmg: ' + attack.avgDmgThisAttack.toFixed(1));
                        } else if (attack.spellDC !== undefined) {
                            multistring.push('Saves - Spell DC ' + attack.spellDC);
                            multistring.push('-------------------------');
                            multistring.push('Enemy crit: ' + attack.attackChances.criticalHitChance);
                            multistring.push('Enemy success: ' + attack.attackChances.hitChance);
                            multistring.push('Enemy failed: ' + attack.attackChances.missChance);
                            multistring.push('Enemy crit failed: ' + attack.attackChances.criticalFailureChance);
                        }
                        
                        if (attack.attackSelection === undefined && attack.spellDC === undefined) {
                            multistring.push('-------------------------');
                            multistring.push('Crit chance: ' + attack.attackChances.criticalHitChance);
                            multistring.push('Hit chance: ' + attack.attackChances.hitChance);
                            multistring.push('Miss chance: ' + attack.attackChances.missChance);
                            multistring.push('Critical failure chance: ' + attack.attackChances.criticalFailureChance);
                        }
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
        <div style={{height: 400, width: 840, margin: 20, marginBottom: 0,
        }} className={'graphContainer'}>
            <Paper>
                {!resetLine && <Line height={360} width={800} options={options} data={styledData} /> }
                
                <div>
                    <p style={{position: 'absolute', fontSize: 12, marginLeft: 3, marginTop: 1, fontWeight: 700,}} className={'acLabel'} key={'ac'}>{'AC:'}</p>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: 3,marginLeft: 26,
    marginBottom: 0, height: 23,}} className={'graphRowChildren'}>
                        {acJson.map((ac, index) => {
                            if(index === 0 || index >= 21) {
                                return '';
                            }
                            return(<p style={{fontSize: 13, fontStyle: 'italic', marginTop: 0, width: 16 }} 
                            className={'acText'} key={ac + '_' + index}>{ac + (enemyAcMod !== undefined ? parseInt(enemyAcMod) : 0)}</p>)
                        })}
                    </div>
                </div>
                <div>
                    <p style={{position: 'absolute', fontSize: 8,marginLeft: 3, marginTop: 3, fontWeight: 700,
                    }} className={'saveLabel'} key={'saves'}>{'Save:'}</p>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginRight: 3,marginLeft: 26,
    marginBottom: 0, height: 23, width:'95%'}} className={'graphRowChildren'}>
                        {saveJson.map((saves, index) => {
                            if(index === 0 || index >= 21) {
                                return '';
                            }
                            return(<p style={{fontSize: 13, fontStyle: 'italic', marginTop: 0, width: 16 }} 
                            className={'acText'} key={saves + '_' + index}>{'+' + (saves + (enemySaveMod !== undefined ? parseInt(enemySaveMod) : 0))}</p>)
                        })}
                    </div>
                </div>
            </Paper>
        </div>
    );
}

export default DMGGraph;