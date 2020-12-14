import React from 'react';
import './Components.css';

interface Props {
    setPropertyRune: (diceValue: string) => void;
    property: string;
    name?: string;
}

const PropertyRuneChoice = (props: Props) => {
    const { name, setPropertyRune, property } = props;

    return (
        <div className={'inputContainer'}>
            {name !== undefined && (
                <div className={'labelContainer'}>
                    <p className={'labelName'}>{name}</p>
                </div>
            )}
            <select defaultValue={property} className={'propertyRuneSelect'} onChange={(event) => { 
                setPropertyRune(event.target.value)
            }}>
                <option> {'-'} </option>
                <option value={'disrupting'}> {'Disrupting'} </option>
                <option value={'disrupting_greater'}> {'Disrupting (Greater)'} </option>
                <option value={'corrosive'}> {'Corrosive'} </option>
                <option value={'corrosive_greater'}> {'Corrosive (Greater)'} </option>
                <option value={'flaming'}> {'Flaming'} </option>
                <option value={'flaming_greater'}> {'Flaming (Greater)'} </option>
                <option value={'frost'}> {'Frost'} </option>
                <option value={'frost_greater'}> {'Frost (Greater)'} </option>
                <option value={'shock'}> {'Shock'} </option>
                <option value={'shock_greater'}> {'Shock (Greater)'} </option>
                <option value={'thundering'}> {'Thundering'} </option>
                <option value={'thundering_greater'}> {'Thundering (Greater)'} </option>
                <option value={'serrating'}> {'Serrating'} </option>
                <option value={'anarchic'}> {'Anarchic'} </option>
                {/*
                    <option value={'axiomatic'}> {'Axiomatic'} </option>
                */}
                <option value={'holy'}> {'Holy'} </option>
                <option value={'unholy'}> {'Unholy'} </option>
                <option value={'wounding'}> {'Wounding'} </option>
            </select>
        </div>
    );
}

export default PropertyRuneChoice;