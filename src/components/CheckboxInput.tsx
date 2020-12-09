import React from 'react';
import './DMGCalculator.css';

interface Props {
    value: boolean;
    setValue:(value:boolean) => void
    label?: string;
}

const CheckboxInput = (props: Props) => {
    const { value, setValue, label} = props;

    return (
        <div className={'inputContainer'}>
            {label !== undefined && (
                <div className={'labelContainer'}>
                    <p className={'labelName'}>{label}</p>
                </div>
            )}
            <input className={'inputNumber'} type={'checkbox'} checked={value} onChange={(event) => { 
                setValue(event.target.checked)
            }} />
        </div> 
    )
}

export default CheckboxInput;