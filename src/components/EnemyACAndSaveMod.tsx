import { Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './Components.css';
import EnemyAC from '../jsons/EnemyAC.json';
import EnemySaves from '../jsons/EnemySaves.json';

interface Props {
    acMod: string;
    setACMod:(value:string) => void;
    setACJson:(value:any[]) => void;
    saveMod: string;
    setSaveMod:(value:string) => void;
    setSaveJson:(value:any[]) => void;
    min?: number;
    max?: number;
}

const EnemyACAndSaveMod = (props: Props) => {
    const { acMod, setACMod, saveMod, setSaveMod,  min, max, setACJson, setSaveJson } = props;
    const [enemyAcString, setEnemyAcString] = useState<string>('standardAC');
    const [standardACMod, setStandardACMod] = useState<string>('moderate');
    const [enemySaveString,] = useState<string>('standardSaves');
    const [standardSaveMod, setStandardSaveMod] = useState<string>('moderate');

    useEffect(() => {
        if (enemyAcString === 'averageAC') {
            setACJson(EnemyAC[enemyAcString]);
            setStandardACMod('moderate');
        } else {
            setACJson(EnemyAC[enemyAcString][standardACMod]);
        }
    }, [enemyAcString, standardACMod, setACJson]);

    useEffect(() => {
        setSaveJson(EnemySaves[enemySaveString][standardSaveMod]);
    }, [enemySaveString, standardSaveMod, setSaveJson]);

    return (
        <div className={'enemyAcModWrapper'}>
            <Paper>
                <div className={'enemyAcModInnerWrapper'}>
                    <div className={'enemyACdropdownContainer'}>
                        <select value={enemyAcString} onChange={(event) => { 
                            setEnemyAcString(event.target.value)
                        }}>
                            <option key={'averageAC'} value={'averageAC'}>
                                { 'Average AC' }
                            </option>
                            <option key={'standardAC'} value={'standardAC'}>
                                { 'Standard AC' }
                            </option>
                        </select>
                    </div>
                    {enemyAcString === 'standardAC' && (
                        <div className={'enemyACdropdownContainer'}>
                            
                        <select value={standardACMod} onChange={(event) => { 
                            setStandardACMod(event.target.value)
                        }}>
                            <option key={'extreme'} value={'extreme'}>
                                { 'Extreme' }
                            </option>
                            <option key={'high'} value={'high'}>
                                { 'High' }
                            </option>
                            <option key={'moderate'} value={'moderate'}>
                                { 'Moderate' }
                            </option>
                            <option key={'low'} value={'low'}>
                                { 'Low' }
                            </option>
                        </select>
                        </div>
                    )}
                    <div className={'enemyACModlabelContainer'}>
                        <p className={'labelName'}>{'Enemy Ac Mod'}</p>
                    </div>
                    <input className={'inputNumber'} type={'number'} min={min} max={max} value={acMod} onChange={(event) => { 
                        setACMod(event.target.value)
                    }} />
                    <div style={{marginLeft: 10}}>|</div>
                    <div style={{marginLeft: 10}} className={'enemyACdropdownContainer'}>
                        <select onChange={(event) => { 
                            setEnemyAcString(event.target.value)
                        }}>
                            <option key={'standardSave'} value={'standardSave'}>
                                { 'Standard Saves' }
                            </option>
                        </select>
                    </div>
                    {enemySaveString === 'standardSaves' && (
                        <div className={'enemyACdropdownContainer'}>
                            
                        <select value={standardSaveMod} onChange={(event) => { 
                            setStandardSaveMod(event.target.value)
                        }}>
                            <option key={'extreme'} value={'extreme'}>
                                { 'Extreme' }
                            </option>
                            <option key={'high'} value={'high'}>
                                { 'High' }
                            </option>
                            <option key={'moderate'} value={'moderate'}>
                                { 'Moderate' }
                            </option>
                            <option key={'low'} value={'low'}>
                                { 'Low' }
                            </option>
                            <option key={'terrible'} value={'terrible'}>
                                { 'Terrible' }
                            </option>
                        </select>
                        </div>
                    )}
                    <div className={'enemyACModlabelContainer'}>
                        <p className={'labelName'}>{'Enemy Save Mod'}</p>
                    </div>
                    <input className={'inputNumber'} type={'number'} min={min} max={max} value={saveMod} onChange={(event) => { 
                        setSaveMod(event.target.value)
                    }} />
                </div>
            </Paper>
        </div>
    )
}

export default EnemyACAndSaveMod;