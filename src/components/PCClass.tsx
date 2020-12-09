import React, { useCallback, useEffect, useState } from 'react';
import ClassChoice, { SpecChoice } from './ClassChoice';
import { Paper } from '@material-ui/core';
import './PCClass.css';
import NumberInput from './NumberInput';
import CheckboxInput from './CheckboxInput';
import DiceChoice from './DiceChoice';
import CheckboxButtonInput from './CheckboxButtonInput';
import ClassChoices from '../jsons/ClassChoices.json';
import EnemyAC from '../jsons/EnemyAC.json';
import Bonuses from '../jsons/Bonuses.json';

interface AttackChance {
    criticalHitChance: number;
    hitChance: number;
    missChance: number;
    criticalFailureChance: number;
}

interface Props {
    id: string;
    color: string;
    setGraphData: (data:any[]) => void;
}

const RangerPrecisionDiceSize = 8;
const RogueSneakDmgDice = 6;
const SwashbucklerFinisherDmgDice = 6;
const InvestigatorPrecisionDiceSize = 6;

const PCClass = (props: Props) => {
    const { id, color, setGraphData } = props;
    const [classChoice, setClassChoice] = useState<string>('-');
    const [classSpec, setClassSpec] = useState<string>('-');
    const [strength, setStrength] = useState<string>('18');
    const [dexterity, setDexterity] = useState<string>('18');
    const [intelligence, setIntelligence] = useState<string>('18');
    const [canUseDexForDmg, setCanUseDexForDmg] = useState<boolean>(false);
    const [diceSize, setDiceSize] = useState('4');
    const [deadlyDiceSize, setDeadlyDiceSize] = useState('-');
    const [fatalDiceSize, setFatalDiceSize] = useState('-');
    const [agile, setAgile] = useState(false);
    const [backstabber, setBackstabber] = useState(false);
    const [finesse, setFinesse] = useState(false);
    const [forceful, setForceful] = useState(false);
    const [twin, setTwin] = useState(false);
    const [critRange, setCritRange] = useState('20');
    const [weaponType, setWeaponType] = useState<string>('Melee');
    const [rangedDmgBonus, setRangedDmgBonus] = useState<string>('-');
    const [applyPlusHitRunes, setApplyPlusHitRunes] = useState(true);
    const [applyStrikingRunes, setApplyStrikingRunes] = useState(true);
    const [startAtMaxMAP, setStartAtMaxMAP] = useState(false);
    const [ignoreMAP, setIgnoreMAP] = useState(false);
    const [hitBonus, setHitBonus] = useState<string>('0');
    const [applySneakDmg, setApplySneakDmg] = useState(false);
    const [applyPanache, setApplyPanache] = useState(false);
    const [markedTarget, setMarkedTarget] = useState(false);
    const [rage, setRage] = useState(false);
    const [deviseAStratagem, setDeviseAStratagem] = useState(false);
    const [lastAttackWithFinisher, setLastAttackWithFinisher] = useState(false);
    const [amountOfAttacks, setAmountOfAttacks] = useState('1');
    const [amountOfExtraAc, setAmountOfExtraAc] = useState('0');

    const doesClassHaveASpec = useCallback(() => {
        if (classChoice === 'barbarian' || classChoice === 'ranger') {
            return true;
        }

        return false;
    }, [classChoice])

    useEffect(() => {
        setClassSpec('-');

        setApplySneakDmg(classChoice === 'rogue');
        setApplyPanache(classChoice === 'swashbuckler');
        setLastAttackWithFinisher(false);
        setMarkedTarget(classChoice === 'ranger');
        setRage(classChoice === 'barbarian');
        setDeviseAStratagem(classChoice === 'investigator');
        setStrength('18');
        setDexterity('18');
        setIntelligence('18');
        setCanUseDexForDmg(false);
        setDiceSize('4');
        setDeadlyDiceSize('-');
        setFatalDiceSize('-');
        setAgile(false);
        setBackstabber(false);
        setFinesse(false);
        setForceful(false);
        setTwin(false);
        setCritRange('20');
        setWeaponType('Melee');
        setRangedDmgBonus('-');
        setApplyPlusHitRunes(true);
        setApplyStrikingRunes(true);
        setStartAtMaxMAP(false);
        setIgnoreMAP(false);
        setHitBonus('0');
        setAmountOfAttacks('1');
        setAmountOfExtraAc('0');
    }, [classChoice]);

    useEffect(() => {
        if(classChoice === '-' || (doesClassHaveASpec() && classSpec === '-')) {
            setGraphData([]);
        } else {
            setGraphData(getDamageChart());
        }
        // eslint-disable-next-line
    }, [
        classChoice, 
        classSpec,
        agile, 
        diceSize, 
        deadlyDiceSize, 
        fatalDiceSize, 
        amountOfAttacks, 
        amountOfExtraAc,
        critRange,
        startAtMaxMAP,
        ignoreMAP,
        rangedDmgBonus,
        strength,
        dexterity,
        intelligence,
        applySneakDmg,
        applyPanache,
        lastAttackWithFinisher,
        backstabber,
        forceful,
        twin,
        rage,
        finesse,
        canUseDexForDmg,
        markedTarget,
        deviseAStratagem,
        applyPlusHitRunes,
        applyStrikingRunes,
        weaponType,
        hitBonus
    ])

    const getClassJson = useCallback(() => {
        if (classChoice === 'barbarian') {
            return ClassChoices[classChoice][classSpec];
        } else if (classChoice === 'ranger') {
            return ClassChoices[classChoice][classSpec];
        }

        return ClassChoices[classChoice];
    },[classChoice, classSpec])

    const getDamageChart = () => {
        let level = 1;

        const attackData: any[] = [];

        while(level < 21) {
            let totalAmountOfDmg = 0;
            for(let attack = 1; attack <= parseInt(amountOfAttacks); attack++) {
                const attackChances = getAttackChances(attack, level);
                const lastAttack = attack === parseInt(amountOfAttacks);
                totalAmountOfDmg += (attackChances.hitChance / 100) * getAvgDmg(false, level, lastAttack, attack);
                totalAmountOfDmg += (attackChances.criticalHitChance / 100) * getAvgDmg(true, level, lastAttack, attack);

                if (classChoice === 'ranger' && classSpec === 'precision' && markedTarget) {
                    if(attack === 1) {
                        totalAmountOfDmg += (attackChances.hitChance / 100) * (RangerPrecisionDiceSize/2 + 0.5) * getClassJson().precision1AttackDice[level];
                        totalAmountOfDmg += (attackChances.criticalHitChance / 100) * (RangerPrecisionDiceSize/2 + 0.5) * 2 * getClassJson().precision1AttackDice[level];
                    } else if(attack === 2) {
                        totalAmountOfDmg += (attackChances.hitChance / 100) * (RangerPrecisionDiceSize/2 + 0.5) * getClassJson().precision2AttacksDice[level];
                        totalAmountOfDmg += (attackChances.criticalHitChance / 100) * (RangerPrecisionDiceSize/2 + 0.5) * 2 * getClassJson().precision2AttacksDice[level];
                    } else if(attack === 3) {
                        totalAmountOfDmg += (attackChances.hitChance / 100) * (RangerPrecisionDiceSize/2 + 0.5) * getClassJson().precision3AttacksDice[level];
                        totalAmountOfDmg += (attackChances.criticalHitChance / 100) * (RangerPrecisionDiceSize/2 + 0.5) * 2 * getClassJson().precision3AttacksDice[level];
                    }
                }

                if (classChoice === 'swashbuckler' && applyPanache && lastAttackWithFinisher && lastAttack) {
                    totalAmountOfDmg += ((attackChances.missChance / 100) * (SwashbucklerFinisherDmgDice/2 + 0.5) * getClassJson().panacheBonus[level]) / 2;
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

    const getAbilityBonus = (level:number, stat:"Hit" | "Dmg", overrideStat?:number) => {
        let abilityStat = 0;  

        if (stat === 'Hit') {
            abilityStat = overrideStat !== undefined ? overrideStat : (finesse && dexterity > strength) || weaponType === 'Ranged' ?  parseInt(dexterity) : parseInt(strength);
        } else {
            abilityStat = overrideStat !== undefined ? overrideStat : (finesse && canUseDexForDmg && dexterity > strength) ? parseInt(dexterity) : parseInt(strength);
        }

        let increases = Bonuses['AbilityIncrease'].boost[level];

        while(increases > 0) {
            if(abilityStat >= 18) {
                abilityStat ++;
            } else {
                abilityStat += 2;
            }
            increases --;
        }

        return Math.floor((abilityStat-10) / 2);
    }

    const getAvgDmg = (crit:boolean, level:number, lastAttack?: boolean, attack?: number) => {
        const numberOfDice = applyStrikingRunes ? Bonuses['EnchantingBonuses'].striking[level] + 1 : 1;
        let dmgFromAbility = getAbilityBonus(level, 'Dmg');

        if (weaponType === 'Ranged') {
            dmgFromAbility = rangedDmgBonus === 'propulsive' ?  Math.floor(dmgFromAbility/2) : rangedDmgBonus === 'thrown' ? dmgFromAbility : 0;
        }

        let bonusDmg = getClassJson().dmg[level] + dmgFromAbility;

        if (applySneakDmg && classChoice === 'rogue') {
            bonusDmg += getClassJson().sneakDmgDiceAmount[level] * (RogueSneakDmgDice/2 + 0.5 );
        }

        if(applyPanache && classChoice === 'swashbuckler') {
            if(lastAttack && lastAttackWithFinisher) {
                bonusDmg += getClassJson().panacheBonus[level] * (SwashbucklerFinisherDmgDice/2 + 0.5)
            } else {
                bonusDmg += getClassJson().panacheBonus[level]
            }
        }

        if (rage && classChoice === 'barbarian') {
            bonusDmg += getClassJson().rage[level];
        }

        if (classChoice === 'investigator' && attack === 1 && deviseAStratagem) {
            bonusDmg += getClassJson().precisionDiceAmount[level] * (InvestigatorPrecisionDiceSize/2 + 0.5 );
        }

        if (twin && attack !== 1) {
            bonusDmg += numberOfDice;
        }

        if (backstabber) {
            bonusDmg ++;
            if (applyPlusHitRunes && Bonuses['EnchantingBonuses'].hitBonus[level] >= 3) {
                bonusDmg++;
            }
        }

        if (forceful) {
            if(attack === 2) {
                bonusDmg += numberOfDice;
            } else if (attack > 2) {
                bonusDmg += numberOfDice *2;
            }
        }

        const deadlyProgression = Bonuses['DeadlyProgression'].diceAmount[level];

        if (crit) {
            let dmg = ((fatalDiceSize === '-' ? 
            parseInt(diceSize)/2 + 0.5 : 
            parseInt(fatalDiceSize)/2 + 0.5) * numberOfDice + bonusDmg) * 2;

            if(fatalDiceSize !== '-') {
                dmg += parseInt(fatalDiceSize)/2 + 0.5;
            }

            if(deadlyDiceSize !== '-') {
                dmg += (parseInt(deadlyDiceSize)/2 + 0.5) * deadlyProgression;
            }

            return dmg;
        } else {
            return (parseInt(diceSize)/2 + 0.5) * numberOfDice + bonusDmg;
        }
    }

    const getAttackChances = (attack: number, level:number) => {
        let criticalHitChance: number = 0;
        let hitChance: number = 0;
        let missChance: number = 0;
        let criticalFailureChance: number = 0;

        let totalHitChance = getTotalHitBonus(level, attack);

        if (!ignoreMAP) {
            if (attack === 2 && !startAtMaxMAP) {
                const secondAttackMod = (classChoice === 'ranger' && classSpec === 'flurry' && markedTarget ? 
                getClassJson().flurrySecondAttack[level]
                : -5) + (agile ? 1 : 0);

                totalHitChance += secondAttackMod;
            } else if (attack > 2 || startAtMaxMAP) {
                const thirdAttackMod = (classChoice === 'ranger' && classSpec === 'flurry' && markedTarget ? 
                getClassJson().flurryThirdAttack[level]
                : -10) + (agile ? 2 : 0);

                totalHitChance += thirdAttackMod;
            }
        }

        const enemyAC = getEnemyAc(level);
        const difference:number = totalHitChance - enemyAC;

        let critRangeNum:number = parseInt(critRange);
        for(let diceResult = 1; diceResult <= 20; diceResult++) {
            if(difference + diceResult >= 10) {
                if (diceResult === 1) {
                    hitChance += 5;
                }
                else {
                    criticalHitChance += 5;
                }
            } else if (difference + diceResult >= 0) {
                if (diceResult >= critRangeNum) {
                    criticalHitChance += 5;
                } if (diceResult === 1) {
                    missChance += 5;
                }
                else {
                    hitChance += 5;
                }
            } else if (difference + diceResult >= -10) {
                if (diceResult >= critRangeNum) {
                    hitChance += 5;
                } if (diceResult === 1) {
                    criticalFailureChance += 5;
                }
                else {
                    missChance += 5;
                }
            } else {
                if (diceResult >= critRangeNum) {
                    missChance += 5;
                }
                else {
                    criticalFailureChance += 5;
                }
            }
        }

        const attackChance: AttackChance = {
            criticalHitChance,
            hitChance,
            missChance,
            criticalFailureChance
        };

        return attackChance;
    }

    const getTotalHitBonus = (level: number, attack?:number) => {
        if(ClassChoices !== undefined && getClassJson() !== undefined) {
            const classHitBonus = getClassJson().hit[level];
            let abilityBonus = getAbilityBonus(level, 'Hit');
            if ((attack === 1 && classChoice === 'investigator') && deviseAStratagem) {
                abilityBonus = getAbilityBonus(level, 'Hit', parseInt(intelligence));
            }
            const enchantmentHitBonus = applyPlusHitRunes ? Bonuses['EnchantingBonuses'].hitBonus[level] : 0;

            return classHitBonus + enchantmentHitBonus + abilityBonus + level + parseInt(hitBonus);
        }

        return 0;
    };

    const getEnemyAc = (level: number) => {
        const enemyAc = EnemyAC['ac'][level];
        return enemyAc + parseInt(amountOfExtraAc);
    };

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
                            <ClassChoice setClassChoice={setClassChoice} noLabel={true} />
                        </div>
                        {classChoice !== '-' && doesClassHaveASpec() && (
                            <div className={'halfElement'}>
                                <p className={'label'}>Choose your spec</p>                
                                <SpecChoice allowEmpty={true} setSpecChoice={setClassSpec} classId={classChoice} noLabel={true} />
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
                                    <NumberInput min={8} max={18} value={strength} setValue={setStrength} /> 
                                </div>
                                <div className={'quarterElement'}>
                                    <p className={'label'}>Dexterity</p>                
                                    <NumberInput min={8} max={18} value={dexterity} setValue={setDexterity} /> 
                                </div>
                                {classChoice === 'investigator' && (  
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Intelligence</p>                
                                        <NumberInput min={8} max={18} value={intelligence} setValue={setIntelligence} /> 
                                    </div>
                                )}
                                {classChoice === 'swashbuckler' && 
                                    <div className={'halfElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={applyPanache} setValue={(val:boolean) => {
                                                setApplyPanache(val);
                                                if(!applyPanache) {
                                                    setLastAttackWithFinisher(false);
                                                }
                                            }} label={'Panache'} id={'checkbox_panache' + id} />
                                            {applyPanache && <CheckboxButtonInput value={lastAttackWithFinisher} setValue={setLastAttackWithFinisher} label={'Last attack - finisher'} id={'checkbox_finisher' + id} />} 
                                        </div>
                                    </div>
                                }
                                {classChoice === 'rogue' && (  
                                    <div className={'halfElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput fixedWidth={80} value={applySneakDmg} setValue={setApplySneakDmg} label={'Sneak damage'} id={'checkbox_sneak_dmg' + id} />
                                            <CheckboxButtonInput fixedWidth={88} value={canUseDexForDmg} setValue={setCanUseDexForDmg} label={'Dex for damage'} id={'checkbox_dex_for_dmg' + id} />
                                        </div> 
                                    </div>
                                )}
                                { classChoice === 'investigator' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={deviseAStratagem} setValue={setDeviseAStratagem} label={'Devise a Stratagem'} id={'checkbox_devise_a_stratagem' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'ranger' && 
                                    <div className={'halfElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={markedTarget} setValue={setMarkedTarget} label={"Hunter's Edge"} id={'checkbox_hunters_edge' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'barbarian' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={rage} setValue={setRage} label={"Raging"} id={'checkbox_rage' + id} />
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
                                            <CheckboxButtonInput value={agile} setValue={setAgile} label={'Agile'} id={'checkbox_agile' + id} /> 
                                            <CheckboxButtonInput value={backstabber} setValue={setBackstabber} label={'Backstabber'} id={'checkbox_backstabber' + id} /> 
                                            <CheckboxButtonInput value={finesse} setValue={setFinesse} label={'Finesse'} id={'checkbox_finesse' + id} /> 
                                            <CheckboxButtonInput value={forceful} setValue={setForceful} label={'Forceful'} id={'checkbox_forceful' + id} /> 
                                            <CheckboxButtonInput value={twin} setValue={setTwin} label={'Twin'} id={'checkbox_twin' + id} /> 
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
                            <div className={'elementContainer'}>
                                <div className={'halfElement'}>
                                    <p className={'label'}>Hit runes (+1, +2, +3)</p>   
                                    <CheckboxInput value={applyPlusHitRunes} setValue={setApplyPlusHitRunes} />
                                </div>
                                <div className={'halfElement'}>
                                    <p className={'label'}>Striking runes</p>   
                                    <CheckboxInput value={applyStrikingRunes} setValue={setApplyStrikingRunes} />
                                </div>
                            </div>
                        </div>
                        <div className={'labelElement'}>
                            <p className={'labelHeader'}>Attacks and extra</p>   
                        </div>
                        <div className={'elementWrapper'}>
                            <div className={'elementContainer'}>
                                <div className={'halfElement'} >
                                    <p className={'label'}>Attacks in the round</p>                
                                    <NumberInput min={1} max={10} value={amountOfAttacks} setValue={setAmountOfAttacks} /> 
                                </div>
                                <div className={'twoFifthElement'}>
                                    <p className={'label'}>Bonus to hit</p>  
                                    <NumberInput min={-20} max={20} value={hitBonus} setValue={setHitBonus} /> 
                                 </div>
                            </div>
                            <div className={'elementContainer'}>
                                <div className={'twoFifthElement'}>
                                    <p className={'label'}>Max MAP</p>  
                                    <CheckboxInput value={startAtMaxMAP} setValue={(val:boolean) => {
                                        setStartAtMaxMAP(val)
                                        if (val) {
                                            setIgnoreMAP(false);
                                        }
                                    }} />
                                </div>
                                <div className={'twoFifthElement'}>
                                    <p className={'label'}>Ignore MAP</p>  
                                    <CheckboxInput value={ignoreMAP} setValue={(val:boolean) => {
                                        setIgnoreMAP(val)
                                        if (val) {
                                            setStartAtMaxMAP(false);
                                        }
                                    }} />
                                </div>
                                <div className={'halfElement'} >
                                    <p className={'label'}>Enemy AC bonus mod</p>                
                                    <NumberInput min={-20} max={20} value={amountOfExtraAc} setValue={setAmountOfExtraAc} /> 
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