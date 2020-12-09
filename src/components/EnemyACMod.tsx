import { Paper } from '@material-ui/core';
import React from 'react';
import './Components.css';

interface Props {
    value: string;
    setValue:(value:string) => void
    min?: number;
    max?: number
}

const EnemyACMod = (props: Props) => {
    const { value, setValue, min, max } = props;

    return (
        <div className={'enemyAcModWrapper'}>
            <Paper>
                <div className={'enemyAcModInnerWrapper'}>
                    <div className={'enemyACModlabelContainer'}>
                        <p className={'labelName'}>{'Enemy AC Mod'}</p>
                    </div>
                    <input className={'inputNumber'} type={'number'} min={min} max={max} value={value} onChange={(event) => { 
                        setValue(event.target.value)
                    }} />
                    <div className={'enemyACModDescriptionContainer'}>
                        <p className={'labelName'}>{'(Using standard ac progression for enemies)'}</p>
                    </div>
                </div>
            </Paper>
        </div>
    )
}

export default EnemyACMod;