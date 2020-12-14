import { Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './Components.css';
import EnemyAC from '../jsons/EnemyAC.json';

interface Props {
    value: string;
    setValue:(value:string) => void;
    setACJson:(value:any[]) => void;
    min?: number;
    max?: number;
}

const EnemyACMod = (props: Props) => {
    const { value, setValue, min, max, setACJson } = props;
    const [enemyAcString, setEnemyAcString] = useState<string>('averageAC');
    const [standardACMod, setStandardACMod] = useState<string>('moderate');

    useEffect(() => {
        if (enemyAcString === 'averageAC') {
            setACJson(EnemyAC[enemyAcString]);
            setStandardACMod('moderate');
        } else {
            setACJson(EnemyAC[enemyAcString][standardACMod]);
        }
    }, [enemyAcString, standardACMod, setACJson]);

    return (
        <div className={'enemyAcModWrapper'}>
            <Paper>
                <div className={'enemyAcModInnerWrapper'}>
                    <div className={'enemyACdropdownContainer'}>
                        <select onChange={(event) => { 
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
                            
                        <select defaultValue={'moderate'} onChange={(event) => { 
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
                        <p className={'labelName'}>{'Enemy AC Mod'}</p>
                    </div>
                    <input className={'inputNumber'} type={'number'} min={min} max={max} value={value} onChange={(event) => { 
                        setValue(event.target.value)
                    }} />
                </div>
            </Paper>
        </div>
    )
}

export default EnemyACMod;