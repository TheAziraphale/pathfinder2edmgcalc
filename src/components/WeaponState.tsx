import React, { useEffect, useState } from 'react';
import './Components.css';
import PropertyRuneChoice from './PropertyRuneChoice';
import DiceChoice from './DiceChoice';
import NumberInput from './NumberInput';
import CheckboxButtonInput from './CheckboxButtonInput';
import { Button } from '@material-ui/core';

interface Props {
    label: string;
    setWeapon: (weapon: Weapon) => void;
    pcId: string;
    weapon?: Weapon;
    buttonCommand?: () => void;
}

export interface Weapon {
    dices: WeaponDices;
    traits: WeaponTraits;
    runes: WeaponRunes;
    type: string;
    rangedDmgBonus: string;
    critRange: number;
}

export interface WeaponRunes {
    hit: boolean;
    striking: boolean;
    firstPropRune: string;
    secondPropRune: string;
    thirdPropRune: string;
}

export interface WeaponDices {
    diceSize: string;
    deadlyDiceSize: string;
    fatalDiceSize: string;
}

export interface WeaponTraits {
    agile: boolean;
    backstabber: boolean;
    finesse: boolean;
    forceful: boolean;
    twin: boolean;
}

const WeaponState = (props: Props) => {
    const { setWeapon, weapon, pcId, label, buttonCommand } = props;
    const [diceSize, setDiceSize] = useState<string>(weapon?.dices.diceSize);
    const [deadlyDiceSize, setDeadlyDiceSize] = useState<string>(weapon?.dices.deadlyDiceSize);
    const [fatalDiceSize, setFatalDiceSize] = useState<string>(weapon?.dices.fatalDiceSize);
    const [weaponType, setWeaponType] = useState<string>(weapon?.type);
    const [rangedDmgBonus, setRangedDmgBonus] = useState<string>(weapon?.rangedDmgBonus);  
    const [critRange, setCritRange] = useState<number>(weapon?.critRange);  
    const [agile, setAgile] = useState<boolean>(weapon?.traits.agile);
    const [backstabber, setBackstabber] = useState<boolean>(weapon?.traits.backstabber);
    const [finesse, setFinesse] = useState<boolean>(weapon?.traits.finesse);
    const [forceful, setForceful] = useState<boolean>(weapon?.traits.forceful);
    const [twin, setTwin] = useState<boolean>(weapon?.traits.twin);
    const [applyPlusHitRunes, setApplyPlusHitRunes] = useState<boolean>(weapon?.runes.hit);
    const [applyStrikingRunes, setApplyStrikingRunes] = useState<boolean>(weapon?.runes.striking);
    const [firstPropRune, setFirstPropRune] = useState<string>(weapon?.runes.firstPropRune);
    const [secondPropRune, setSecondPropRune] = useState<string>(weapon?.runes.secondPropRune);
    const [thirdPropRune, setThirdPropRune] = useState<string>(weapon?.runes.thirdPropRune);

    useEffect(() => {
        if (weapon !== undefined) {
            setDiceSize(weapon.dices.diceSize);
            setDeadlyDiceSize(weapon.dices.deadlyDiceSize);
            setFatalDiceSize(weapon.dices.fatalDiceSize);
            setWeaponType(weapon.type);
            setRangedDmgBonus(weapon.rangedDmgBonus);
            setCritRange(weapon.critRange);
            setAgile(weapon.traits.agile);
            setBackstabber(weapon.traits.backstabber);
            setFinesse(weapon.traits.finesse);
            setForceful(weapon.traits.forceful);
            setTwin(weapon.traits.twin);
            setApplyPlusHitRunes(weapon.runes.hit);
            setApplyStrikingRunes(weapon.runes.striking);
            setFirstPropRune(weapon.runes.firstPropRune);
            setSecondPropRune(weapon.runes.secondPropRune);
            setThirdPropRune(weapon.runes.thirdPropRune);
        }
    }, [weapon])

    useEffect(() => {
        const weaponDices: WeaponDices = {
            diceSize:diceSize,
            deadlyDiceSize: deadlyDiceSize,
            fatalDiceSize: fatalDiceSize
        };
        const weaponTraits: WeaponTraits = {
            agile: agile, 
            backstabber: backstabber,
            finesse: finesse,
            forceful: forceful,
            twin: twin
        };
        const weaponRunes: WeaponRunes = {   
            hit: applyPlusHitRunes,
            striking: applyStrikingRunes,
            firstPropRune: firstPropRune,
            secondPropRune: secondPropRune,
            thirdPropRune: thirdPropRune
        }
        const newValueForWeapon: Weapon = {
            dices: weaponDices,
            traits: weaponTraits,
            runes: weaponRunes,
            type: weaponType,
            rangedDmgBonus: rangedDmgBonus,
            critRange: critRange
        };
        setWeapon(newValueForWeapon);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diceSize, deadlyDiceSize, fatalDiceSize, weaponType, rangedDmgBonus, critRange, agile, backstabber, finesse, forceful, 
        twin, applyPlusHitRunes, applyStrikingRunes, firstPropRune, secondPropRune, thirdPropRune])

    if (weapon === undefined) {
        return null;
    }

    return (
        <div>
            <div className={'labelElement'}>
                <div className={'elementContainer'} style={{height: 30}}>
                <p className={'labelHeader'}>{label}</p>   
                {buttonCommand !== undefined && 
                    <div className={'buttonContainer'}>
                        <Button style={{minWidth: 0, padding: 0, paddingLeft: 1,  borderRadius: 10, fontSize:20,
                        color: 'white', paddingBottom: 3, backgroundColor: 'rgb(255, 50, 50)'}} 
                        fullWidth={true} className={'addbutton'} variant="contained" onClick={() => { buttonCommand()}}>{'-'}</Button>
                    </div>
                }
                </div>
            </div>
            <div className={'elementWrapper'}>
                <div className={'elementContainer'}>
                    <div className={'quarterElement'} >
                        <p className={'label'}>Dice size</p>                
                        <DiceChoice diceValue={weapon.dices.diceSize} allowNoInput={false} setDiceValue={setDiceSize} /> 
                    </div>
                    <div className={'quarterElement'} >
                        <p className={'label'}>Deadly?</p>                
                        <DiceChoice diceValue={weapon.dices.deadlyDiceSize} allowNoInput={true} setDiceValue={setDeadlyDiceSize} />
                    </div>
                    <div className={'quarterElement'} >
                        <p className={'label'}>Fatal?</p>                
                        <DiceChoice diceValue={weapon.dices.fatalDiceSize} allowNoInput={true} setDiceValue={setFatalDiceSize} />
                    </div>
                    <div className={'quarterElement'} >
                        <p className={'label'}>Crit range</p>                
                        <NumberInput min={2} max={20} value={weapon.critRange} setValue={setCritRange} />
                    </div>
                </div>
                <div className={'elementContainer'}>
                    <div className={'twoFifthElement'} >
                        <p className={'label'}>Weapon type </p>   
                        <select defaultValue={weapon.type} onChange={(event) => {
                            setWeaponType(event.target.value);
                        }}>
                            <option key={'melee'} value={'Melee'}>Melee</option>
                            <option key={'ranged'} value={'Ranged'}>Ranged</option>
                        </select>
                    </div>
                    {weaponType === 'Melee' && (
                        <div className={'twoThirdElement'}>
                            <p className={'label'}>Traits</p>   
                            <div className={'buttonCheckboxWrapper'}>
                                <CheckboxButtonInput value={weapon.traits.agile} setValue={setAgile} label={'Agile'} id={'checkbox_agile' + pcId} /> 
                                <CheckboxButtonInput value={weapon.traits.backstabber} setValue={setBackstabber} label={'Backstabber'} id={'checkbox_backstabber' + pcId} /> 
                                <CheckboxButtonInput value={weapon.traits.finesse} setValue={setFinesse} label={'Finesse'} id={'checkbox_finesse' + pcId} /> 
                                <CheckboxButtonInput value={weapon.traits.forceful} setValue={setForceful} label={'Forceful'} id={'checkbox_forceful' + pcId} /> 
                                <CheckboxButtonInput value={weapon.traits.twin} setValue={setTwin} label={'Twin'} id={'checkbox_twin' + pcId} /> 
                            </div>
                        </div>
                    )}
                    {weaponType === 'Ranged' && (
                        <div className={'twoThirdElement'}>
                            <p className={'label'}>Damage bonus</p>   
                            <select defaultValue={weapon.rangedDmgBonus} onChange={(event) => { 
                                setRangedDmgBonus(event.target.value)
                            }}>
                                <option key={"-"} value={'-'}>
                                    { "None"}
                                </option>
                                <option key={"propulsive"} value={'propulsive'}>
                                    { "Propulsive"}
                                </option>
                                <option key={"thrown"} value={'thrown'}>
                                    { "Thrown" }
                                </option>
                            </select>
                        </div>
                    )}
                </div>
                <div className={'elementContainer'} style={{height: 50}}>
                    <div className={'fullElement'} >
                        <p className={'label'}>Fundamental runes </p>  
                            <div className={'buttonCheckboxWrapper'}>
                                <div style={{marginRight: 5}}>
                                    <CheckboxButtonInput value={weapon.runes.hit} setValue={setApplyPlusHitRunes} label={'Hit runes (+1, +2, +3)'} id={'checkbox_hit_runes' + pcId} /> 
                                </div>
                                <div>
                                    <CheckboxButtonInput value={weapon.runes.striking} setValue={setApplyStrikingRunes} label={'Striking runes'} id={'checkbox_striking_runes' + pcId} /> 
                                </div>
                            </div>
                    </div>
                </div>
                <div className={'elementContainer'} style={{height: 50}}>
                    <div className={'oneThirdElement'} >
                        <p className={'label'}>1# Prop. rune</p>  
                        <PropertyRuneChoice property={weapon.runes.firstPropRune} setPropertyRune={setFirstPropRune} />
                    </div>
                    <div className={'oneThirdElement'} >
                        <p className={'label'}>2# Prop. rune</p>  
                        <PropertyRuneChoice property={weapon.runes.secondPropRune} setPropertyRune={setSecondPropRune} />
                    </div>
                    <div className={'oneThirdElement'} >
                        <p className={'label'}>3# Prop. rune</p>  
                        <PropertyRuneChoice property={weapon.runes.thirdPropRune} setPropertyRune={setThirdPropRune} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeaponState;