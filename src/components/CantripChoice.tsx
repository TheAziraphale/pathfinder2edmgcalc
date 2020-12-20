//import React from 'react';
import { useEffect } from 'react';
import Cantrips from '../jsons/Cantrips.json';

export interface CantripStandardEffect {
    diceAmount: number;
    diceSize: number;
    extraCritDmg: number;
    splashDmg: number;
    abilityBoost: boolean;
    extraCritDmgDiceAmount: number;
    extraCritDmgDiceSize: number;
}

export interface Cantrip {
    id: string;
    name: string;
    school: string;
    range: number;
    targets: number;
    actions: number;
    traditions: string[];
    spellAttack: boolean;
    savingThrow: boolean;
    savingThrowEffect: any;
    standardEffect: CantripStandardEffect;
    heightenedEffects: any;
}

interface Props {
    setCantripSpell: (cantrip: Cantrip) => void;
    cantripSpell: Cantrip;
}

export const CantripChoice = (props: Props) => {
    const { setCantripSpell, cantripSpell } = props;

    useEffect(() => {
        if(cantripSpell === undefined) {
            setCantripSpell({...Cantrips['acid_splash'], id: 'acid_splash'})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cantripSpell])

    return (
        <div className={'inputContainer'}>
            <select value={cantripSpell !== undefined ? cantripSpell.id : ''} style={{width: 130}} onChange={(event) => { 
                setCantripSpell({...Cantrips[event.target.value], id: event.target.value})
            }}>
                { Object.keys(Cantrips).map(key => (
                    <option key={key} value={key}>
                        { Cantrips[key].name }
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CantripChoice;