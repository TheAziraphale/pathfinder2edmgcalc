import React from 'react';
import './DMGCalculator.css';

interface Props {
    startDiceValue?: string
    setDiceValue: (diceValue: string) => void;
    allowNoInput: boolean;
    name?: string;
}

const DiceChoice = (props: Props) => {
    const { name, startDiceValue, setDiceValue, allowNoInput } = props;

    return (
        <div className={'inputContainer'}>
            {name !== undefined && (
                <div className={'labelContainer'}>
                    <p className={'labelName'}>{name}</p>
                </div>
            )}
            D <select className={'inputNumberSmall'} defaultValue={startDiceValue} onChange={(event) => { 
                setDiceValue(event.target.value)
            }}>
                {allowNoInput && <option> {'-'} </option>}
                <option> {'4'} </option>
                <option> {'6'} </option>
                <option> {'8'} </option>
                <option> {'10'} </option>
                <option> {'12'} </option>
            </select>
        </div>
    );
}

export default DiceChoice;