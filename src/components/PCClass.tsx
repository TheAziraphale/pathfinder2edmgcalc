import React, { useCallback, useEffect, useState } from 'react';
import ClassChoice, { SpecChoice } from './ClassChoice';
import { Paper } from '@material-ui/core';
import './PCClass.css';
import NumberInput from './NumberInput';
import DiceChoice from './DiceChoice';
import CheckboxButtonInput from './CheckboxButtonInput';
import { getClassJson, getAvgDmg } from './HelpFunctions';
import { getAttackChances } from './HelpFunctions';

interface Props {
    id: string;
    color: string;
    setGraphData: (data:any[]) => void;
    enemyAcMod?: string;
}

interface Stats {
    strength: number;
    dexterity: number;
    intelligence: number;
}

interface WeaponDices {
    diceSize: string;
    deadlyDiceSize: string;
    fatalDiceSize: string;
}

interface WeaponTraits {
    agile: boolean;
    backstabber: boolean;
    finesse: boolean;
    forceful: boolean;
    twin: boolean;
}

export interface PCState {
    classChoice: string;
    classSpec: string;
    stats: Stats;
    weaponDices: WeaponDices;
    weaponTraits: WeaponTraits;
    critRange:number;
    weaponType: string;
    rangedDmgBonus: string;
    applyPlusHitRunes: boolean;
    applyStrikingRunes: boolean;
    startAtMaxMAP: boolean;
    ignoreMAP: boolean;
    hitBonus: number;
    dmgBonus: number;
    canUseDexForDmg: boolean;
    applySneakDmg: boolean;
    applyPanache: boolean;
    markedTarget: boolean;
    rage: boolean;
    deviseAStratagem: boolean;
    lastAttackWithFinisher: boolean;
    amountOfAttacks: number;
}

const SwashbucklerFinisherDmgDice = 6;

const PCClass = (props: Props) => {
    const { id, color, setGraphData, enemyAcMod } = props;
    const [currentPCState, setCurrentPCState] = useState<PCState>();
    const [classChoice, setClassChoice] = useState<string>('-');
    const [classSpec, setClassSpec] = useState<string>('-');
    const [diceSize, setDiceSize] = useState<string>('4');
    const [deadlyDiceSize, setDeadlyDiceSize] = useState<string>('-');
    const [fatalDiceSize, setFatalDiceSize] = useState<string>('-');
    const [weaponType, setWeaponType] = useState<string>('Melee');
    const [rangedDmgBonus, setRangedDmgBonus] = useState<string>('-');
    const [strength, setStrength] = useState<number>(18);
    const [dexterity, setDexterity] = useState<number>(18);
    const [intelligence, setIntelligence] = useState<number>(18);
    const [critRange, setCritRange] = useState<number>(20);
    const [amountOfAttacks, setAmountOfAttacks] = useState<number>(1);
    const [hitBonus, setHitBonus] = useState<number>(0);
    const [dmgBonus, setDmgBonus] = useState<number>(0);
    const [canUseDexForDmg, setCanUseDexForDmg] = useState<boolean>(false);
    const [agile, setAgile] = useState<boolean>(false);
    const [backstabber, setBackstabber] = useState<boolean>(false);
    const [finesse, setFinesse] = useState<boolean>(false);
    const [forceful, setForceful] = useState<boolean>(false);
    const [twin, setTwin] = useState<boolean>(false);
    const [applyPlusHitRunes, setApplyPlusHitRunes] = useState<boolean>(true);
    const [applyStrikingRunes, setApplyStrikingRunes] = useState<boolean>(true);
    const [startAtMaxMAP, setStartAtMaxMAP] = useState<boolean>(false);
    const [ignoreMAP, setIgnoreMAP] = useState<boolean>(false);
    const [applySneakDmg, setApplySneakDmg] = useState<boolean>(false);
    const [applyPanache, setApplyPanache] = useState<boolean>(false);
    const [markedTarget, setMarkedTarget] = useState<boolean>(false);
    const [rage, setRage] = useState<boolean>(false);
    const [deviseAStratagem, setDeviseAStratagem] = useState<boolean>(false);
    const [lastAttackWithFinisher, setLastAttackWithFinisher] = useState<boolean>(false);
    
    useEffect(() => {
        const weaponDices: WeaponDices = {
            diceSize, 
            deadlyDiceSize, 
            fatalDiceSize
        };
        const stats: Stats = {
            strength,
            dexterity,
            intelligence
        };
        const weaponTraits: WeaponTraits = {
            agile, 
            backstabber,
            finesse,
            forceful,
            twin
        };
        setCurrentPCState({
            classChoice, 
            classSpec,
            stats: stats,
            weaponDices: weaponDices,
            weaponTraits: weaponTraits,
            critRange,
            weaponType,
            rangedDmgBonus,
            applyPlusHitRunes,
            applyStrikingRunes,
            startAtMaxMAP,
            ignoreMAP,
            hitBonus,
            dmgBonus,
            canUseDexForDmg,
            applySneakDmg,
            applyPanache,
            markedTarget,
            rage,
            deviseAStratagem,
            lastAttackWithFinisher,
            amountOfAttacks,
        })
    }, [
        classChoice, classSpec, strength, dexterity, intelligence, diceSize, deadlyDiceSize, fatalDiceSize, agile, backstabber, finesse, forceful, 
        twin, critRange, weaponType, rangedDmgBonus, applyPlusHitRunes, applyStrikingRunes, startAtMaxMAP, ignoreMAP, hitBonus,  dmgBonus, 
        canUseDexForDmg, applySneakDmg,  applyPanache,  markedTarget, rage,  deviseAStratagem, lastAttackWithFinisher, amountOfAttacks, enemyAcMod
    ])

    const doesClassHaveASpec = useCallback(() => {
        if (currentPCState.classChoice === 'barbarian' || currentPCState.classChoice === 'ranger') {
            return true;
        }

        return false;
    }, [currentPCState])

    useEffect(() => {
        /* Reset values when classChoice is set */
        setApplySneakDmg(classChoice === 'rogue');
        setApplyPanache(classChoice === 'swashbuckler');
        setLastAttackWithFinisher(false);
        setMarkedTarget(classChoice === 'ranger');
        setRage(classChoice === 'barbarian');
        setDeviseAStratagem(classChoice === 'investigator');
        setStrength(18);
        setDexterity(18);
        setIntelligence(18);
        setCanUseDexForDmg(false);
        setDiceSize('4');
        setDeadlyDiceSize('-');
        setFatalDiceSize('-');
        setAgile(false);
        setBackstabber(false);
        setFinesse(false);
        setForceful(false);
        setTwin(false);
        setCritRange(20);
        setWeaponType('Melee');
        setRangedDmgBonus('-');
        setApplyPlusHitRunes(true);
        setApplyStrikingRunes(true);
        setStartAtMaxMAP(false);
        setIgnoreMAP(false);
        setHitBonus(0);
        setDmgBonus(0);
        setAmountOfAttacks(1);
    }, [classChoice]);

    useEffect(() => {
        if(currentPCState === undefined || currentPCState.classChoice === '-' || (doesClassHaveASpec() && currentPCState.classSpec === '-')) {
            setGraphData([]);
        } else {
            setGraphData(getDamageChart());
        }
    // eslint-disable-next-line
    }, [currentPCState]);

    const getClassJsonInternal = useCallback(() => {
        return getClassJson(currentPCState.classChoice, currentPCState.classSpec);
    },[currentPCState])

    const getDamageChart = () => {
        let level = 1;

        const attackData: any[] = [];

        while(level < 21) {
            let totalAmountOfDmg = 0;
            for(let attack = 1; attack <= amountOfAttacks; attack++) {
                const attackChances = getAttackChances(currentPCState, attack, level, parseInt(enemyAcMod));
                const lastAttack = attack === amountOfAttacks;
                totalAmountOfDmg += (attackChances.hitChance / 100) * getAvgDmg(currentPCState, false, level, lastAttack, attack);
                totalAmountOfDmg += (attackChances.criticalHitChance / 100) * getAvgDmg(currentPCState, true, level, lastAttack, attack);

                if (classChoice === 'swashbuckler' && applyPanache && lastAttackWithFinisher && lastAttack) {
                    totalAmountOfDmg += ((attackChances.missChance / 100) * (SwashbucklerFinisherDmgDice/2 + 0.5) * getClassJsonInternal().panacheBonus[level]) / 2;
                }
            }
            attackData.push(totalAmountOfDmg);
            level++;
        }
        return [{
                label: (parseInt(id) + 1) +'# ' + (classSpec !== '-' ? Capitalize(classSpec) : '') + ' ' + Capitalize(classChoice),
                data: attackData,
                fill: false,
                borderColor: color,
            }];
    };

    const Capitalize = (str:string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className={'pcWrapper'}>
            <Paper className={'innerPCWrapper'}>
                <div className={'labelElement'}>
                    <p className={'labelHeader'}>Class and specialization</p>   
                </div>
                <div style={{backgroundColor: color, width: 160, height: 16, marginTop: 10, marginLeft: 25, borderTopRightRadius: 10, borderTopLeftRadius: 10 }} />
                <div className={'elementWrapper'}>
                    <div className={'elementContainer'}>
                        <div className={'halfElement'}>
                            <p className={'label'}>Choose your class</p>                
                            <ClassChoice setClassChoice={(val: string) => { 
                                setClassChoice(val);
                                if (val === 'barbarian') {
                                    setClassSpec("animal");
                                } else if (val === 'ranger') {
                                    setClassSpec("flurry");
                                } else {
                                    setClassSpec('-');
                                }
                            }} noLabel={true} />
                        </div>
                        {classChoice !== '-' && doesClassHaveASpec() && (
                            <div className={'halfElement'}>
                                <p className={'label'}>Choose your spec</p>                
                                <SpecChoice setSpecChoice={setClassSpec} classId={currentPCState.classChoice} noLabel={true} />
                            </div>
                        )}
                    </div>
                </div>
                {classChoice !== '-' && (classSpec !== '-' || !doesClassHaveASpec()) && (
                    <div>
                        <div className={'labelElement'}>
                            <p className={'labelHeader'}>Important stats (ability scores scales with level)</p>   
                        </div>
                        <div className={'elementWrapper'}>
                            <div className={'elementContainer'}>
                                <div className={'quarterElement'} >
                                    <p className={'label'}>Strength</p>                
                                    <NumberInput min={8} max={18} value={currentPCState.stats.strength} setValue={setStrength} /> 
                                </div>
                                <div className={'quarterElement'}>
                                    <p className={'label'}>Dexterity</p>                
                                    <NumberInput min={8} max={18} value={currentPCState.stats.dexterity} setValue={setDexterity} /> 
                                </div>
                                {classChoice === 'investigator' && (  
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Intelligence</p>                
                                        <NumberInput min={8} max={18} value={currentPCState.stats.intelligence} setValue={setIntelligence} /> 
                                    </div>
                                )}
                                {classChoice === 'swashbuckler' && 
                                    <div className={'halfElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.applyPanache} setValue={(val:boolean) => {
                                                setApplyPanache(val);
                                                if(!currentPCState.applyPanache) {
                                                    setLastAttackWithFinisher(false);
                                                }
                                            }} label={'Panache'} id={'checkbox_panache' + id} />
                                            {currentPCState.applyPanache && <CheckboxButtonInput value={currentPCState.lastAttackWithFinisher} setValue={setLastAttackWithFinisher} label={'Last attack - finisher'} id={'checkbox_finisher' + id} />} 
                                        </div>
                                    </div>
                                }
                                {classChoice === 'rogue' && (  
                                    <div className={'halfElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput fixedWidth={80} value={currentPCState.applySneakDmg} setValue={setApplySneakDmg} label={'Sneak damage'} id={'checkbox_sneak_dmg' + id} />
                                            <CheckboxButtonInput fixedWidth={88} value={currentPCState.canUseDexForDmg} setValue={setCanUseDexForDmg} label={'Dex for damage'} id={'checkbox_dex_for_dmg' + id} />
                                        </div> 
                                    </div>
                                )}
                                { classChoice === 'investigator' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.deviseAStratagem} setValue={setDeviseAStratagem} label={'Devise a Stratagem'} id={'checkbox_devise_a_stratagem' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'ranger' && 
                                    <div className={'halfElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.markedTarget} setValue={setMarkedTarget} label={"Hunter's Edge"} id={'checkbox_hunters_edge' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'barbarian' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.rage} setValue={setRage} label={"Raging"} id={'checkbox_rage' + id} />
                                        </div>  
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={'labelElement'}>
                            <p className={'labelHeader'}>Weapon</p>   
                        </div>
                        <div className={'elementWrapper'}>
                            <div className={'elementContainer'}>
                                <div className={'quarterElement'} >
                                    <p className={'label'}>Dice size</p>                
                                    <DiceChoice startDiceValue={'4'} allowNoInput={false} setDiceValue={setDiceSize} /> 
                                </div>
                                <div className={'quarterElement'} >
                                    <p className={'label'}>Deadly?</p>                
                                    <DiceChoice startDiceValue={'-'} allowNoInput={true} setDiceValue={setDeadlyDiceSize} />
                                </div>
                                <div className={'quarterElement'} >
                                    <p className={'label'}>Fatal?</p>                
                                    <DiceChoice startDiceValue={'-'} allowNoInput={true} setDiceValue={setFatalDiceSize} />
                                </div>
                                <div className={'quarterElement'} >
                                    <p className={'label'}>Crit range</p>                
                                    <NumberInput min={2} max={20} value={critRange} setValue={setCritRange} />
                            </div>
                            </div>
                            <div className={'elementContainer'}>
                                <div className={'twoFifthElement'} >
                                    <p className={'label'}>Weapon type </p>   
                                    <select onChange={(event) => {
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
                                            <CheckboxButtonInput value={currentPCState.weaponTraits.agile} setValue={setAgile} label={'Agile'} id={'checkbox_agile' + id} /> 
                                            <CheckboxButtonInput value={currentPCState.weaponTraits.backstabber} setValue={setBackstabber} label={'Backstabber'} id={'checkbox_backstabber' + id} /> 
                                            <CheckboxButtonInput value={currentPCState.weaponTraits.finesse} setValue={setFinesse} label={'Finesse'} id={'checkbox_finesse' + id} /> 
                                            <CheckboxButtonInput value={currentPCState.weaponTraits.forceful} setValue={setForceful} label={'Forceful'} id={'checkbox_forceful' + id} /> 
                                            <CheckboxButtonInput value={currentPCState.weaponTraits.twin} setValue={setTwin} label={'Twin'} id={'checkbox_twin' + id} /> 
                                        </div>
                                    </div>
                                )}
                                {weaponType === 'Ranged' && (
                                    <div className={'twoThirdElement'}>
                                        <p className={'label'}>Damage bonus</p>   
                                        <select onChange={(event) => { 
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
                            <div className={'elementContainer'} style={{height: 25}}>
                                <div style={{marginRight: 5}}>
                                    <CheckboxButtonInput value={currentPCState.applyPlusHitRunes} setValue={setApplyPlusHitRunes} label={'Hit runes (+1, +2, +3)'} id={'checkbox_hit_runes' + id} /> 
                                </div>
                                <div>
                                    <CheckboxButtonInput value={currentPCState.applyStrikingRunes} setValue={setApplyStrikingRunes} label={'Striking runes'} id={'checkbox_striking_runes' + id} /> 
                                </div>
                            </div>
                        </div>
                        <div className={'labelElement'}>
                            <p className={'labelHeader'}>Attacks and extra</p>   
                        </div>
                        <div className={'elementWrapper'}>
                            <div className={'elementContainer'}>
                                <div className={'oneThirdElement'} style={{width: 140}} >
                                    <p className={'label'}>Number of attacks</p>                
                                    <NumberInput min={1} max={10} value={currentPCState.amountOfAttacks} setValue={setAmountOfAttacks} /> 
                                </div>
                                <div className={'twoFifthElement'}>
                                    <p className={'label'}>Bonus to hit</p>  
                                    <NumberInput min={-20} max={20} value={currentPCState.hitBonus} setValue={setHitBonus} /> 
                                 </div>
                                <div className={'oneThirdElement'}>
                                    <p className={'label'}>Bonus to damage</p>  
                                    <NumberInput min={-20} max={20} value={currentPCState.dmgBonus} setValue={setDmgBonus} /> 
                                 </div>
                            </div>
                            <div className={'elementContainer'} style={{height: 25}}>
                                <div style={{marginRight: 5}}>
                                <CheckboxButtonInput value={currentPCState.startAtMaxMAP} setValue={(val:boolean) => {
                                        setStartAtMaxMAP(val)
                                        if (val) {
                                            setIgnoreMAP(false);
                                        }
                                    }} label={'Always max MAP'} id={'checkbox_max_map' + id} />
                                </div>
                                <div>
                                    
                                <CheckboxButtonInput value={currentPCState.ignoreMAP} setValue={(val:boolean) => {
                                        setIgnoreMAP(val)
                                        if (val) {
                                            setStartAtMaxMAP(false);
                                        }
                                    }} label={'Ignore MAP'} id={'checkbox_ignore_map' + id} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Paper>
        </div>
    );
}

export default PCClass;