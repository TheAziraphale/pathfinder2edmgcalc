import React from 'react';
import './Components.css';

interface Props {
    value: number;
    setValue:(value:number) => void
    label?: string;
    min?: number;
    max?: number
}

const NumberInput = (props: Props) => {
    const { value, setValue, label, min, max } = props;

    return (
        <div className={'inputContainer'}>
            {label !== undefined && (
                <div className={'labelContainer'}>
                    <p className={'labelName'}>{label}</p>
                </div>
            )}
            <input className={'inputNumber'} type={'number'} min={min} max={max} value={value} onChange={(event) => { 
                setValue(parseInt(event.target.value))
            }} />
        </div>
    )
}

export default NumberInput;