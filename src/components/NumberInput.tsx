import React from 'react';
import './DMGCalculator.css';

interface Props {
    value: string;
    setValue:(value:string) => void
    label: string;
    min?: number;
    max?: number
}

const NumberInput = (props: Props) => {
    const { value, setValue, label, min, max } = props;

    return (
        <div className={'inputContainer'}>
            <div className={'labelContainer'}>
                <p className={'labelName'}>{label}</p>
            </div>
            <input className={'inputNumber'}  type={'number'} min={min} max={max} value={value} onChange={(event) => { 
                setValue(event.target.value)
            }} />
        </div>
    )
}

export default NumberInput;