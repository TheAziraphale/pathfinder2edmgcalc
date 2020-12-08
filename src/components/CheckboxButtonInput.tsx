import React from 'react';
import './DMGCalculator.css';

interface Props {
    value: boolean;
    label: string;
    setValue:(value:boolean) => void
    id: string;
}

const CheckboxButtonInput = (props: Props) => {
    const { value, setValue, label, id} = props;

    return (
        <div>
            <label htmlFor={id} className={'noselect' + (value ? ' labelChecked' : '')}>{label}</label>
            <input id={id} name={label} className={'visually-hidden'} type={'checkbox'} checked={value} onChange={(event) => { 
                setValue(event.target.checked)
            }} />
        </div>
    )
}

export default CheckboxButtonInput;