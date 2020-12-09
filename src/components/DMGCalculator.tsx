import React, { useCallback, useEffect, useState } from 'react';
import DiceChoice from './DiceChoice';
import NumberInput from './NumberInput';
import CheckboxInput from './CheckboxInput';
import CheckboxButtonInput from './CheckboxButtonInput';
import ClassChoice, { SpecChoice } from './ClassChoice';
import './DMGCalculator.css';
import ClassChoices from '../jsons/ClassChoices.json';
import EnemyAC from '../jsons/EnemyAC.json';
import Bonuses from '../jsons/Bonuses.json';
import { Paper } from '@material-ui/core';

interface AttackChance {
    criticalHitChance: number;
    hitChance: number;
    missChance: number;
    criticalFailureChance: number;
}

interface Props {
    setGraphData: (data:any[]) => void;
    id: string;
    color: string;
}

const RangerPrecisionDiceSize = 8;
const RogueSneakDmgDice = 6;
const SwashbucklerFinisherDmgDice = 6;
const InvestigatorPrecisionDiceSize = 6;

const DMGCalculator = (props: Props) => {
    const { setGraphData, id, color } = props;

    const [classChoice, setClassChoice] = useState<string>('-');
    const [classSpec, setClassSpec] = useState<string>('-');
    const [amountOfAttacks, setAmountOfAttacks] = useState('1');
    const [amountOfExtraAc, setAmountOfExtraAc] = useState('0');
    const [diceSize, setDiceSize] = useState('4');
    const [deadlyDiceSize, setDeadlyDiceSize] = useState('-');
    const [fatalDiceSize, setFatalDiceSize] = useState('-');
    const [critRange, setCritRange] = useState('20');
    const [agile, setAgile] = useState(false);
    const [backstabber, setBackstabber] = useState(false);
    const [forceful, setForceful] = useState(false);
    const [twin, setTwin] = useState(false);
    const [startAtMaxMAP, setStartAtMaxMAP] = useState(false);
    const [ignoreMAP, setIgnoreMAP] = useState(false);
    const [ranged, setRanged] = useState(false);
    const [rangedDmgBonus, setRangedDmgBonus] = useState<string>('-');
    const [hitStat, setHitStat] = useState('18');
    const [dmgStat, setDmgStat] = useState('18');
    const [intStat, setIntStat] = useState('18');
    const [applyPlusHitRunes, setApplyPlusHitRunes] = useState(true);
    const [applyStrikingRunes, setApplyStrikingRunes] = useState(true);
    const [applySneakDmg, setApplySneakDmg] = useState(false);
    const [applyPanache, setApplyPanache] = useState(false);
    const [markedTarget, setMarkedTarget] = useState(false);
    const [rage, setRage] = useState(false);
    const [deviseAStratagem, setDeviseAStratagem] = useState(false);
    const [lastAttackWithFinisher, setLastAttackWithFinisher] = useState(false);

    useEffect(() => {
        setApplySneakDmg(classChoice === 'rogue');
        setApplyPanache(classChoice === 'swashbuckler');
        setLastAttackWithFinisher(classChoice === 'rogue');
        setMarkedTarget(classChoice === 'ranger');
        setRage(classChoice === 'barbarian');
        setDeviseAStratagem(classChoice === 'investigator');
        setIntStat('18');

        if ((classChoice !== 'barbarian' && classChoice !== 'ranger')) {
            setClassSpec('-');
        }
    }, [classChoice])

    useEffect(() => {
        if(classChoice === '-') {
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
        ranged, 
        rangedDmgBonus,
        dmgStat,
        hitStat,
        intStat,
        applySneakDmg,
        applyPanache,
        lastAttackWithFinisher,
        backstabber,
        forceful,
        twin,
        rage,
        markedTarget,
        deviseAStratagem,
        applyPlusHitRunes,
        applyStrikingRunes
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
            abilityStat = overrideStat !== undefined ? overrideStat : parseInt(hitStat);
        } else {
            abilityStat = overrideStat !== undefined ? overrideStat : parseInt(dmgStat);
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

        if (ranged) {
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
                abilityBonus = getAbilityBonus(level, 'Hit', parseInt(intStat));
            }
            const enchantmentHitBonus = applyPlusHitRunes ? Bonuses['EnchantingBonuses'].hitBonus[level] : 0;

            return classHitBonus + enchantmentHitBonus + abilityBonus + level;
        }

        return 0;
    };

    const getEnemyAc = (level: number) => {
        const enemyAc = EnemyAC['ac'][level];
        return enemyAc + parseInt(amountOfExtraAc);
    };

    return (
        <div className={'wrapper'}>
            <Paper className={'innerWrapper'}>
                <div style={{backgroundColor: color, width: 80, height: 15}} />
                <NumberInput min={0} max={10} value={amountOfAttacks} setValue={setAmountOfAttacks} label={'Number of attacks:'} />
                <NumberInput min={-20} max={20} value={amountOfExtraAc} setValue={setAmountOfExtraAc} label={'Enemy AC bonus mod:'} />
                <ClassChoice name={'Class:'} setClassChoice={(val: string) => { 
                    setClassChoice(val);
                    if (val === 'barbarian') {
                        setClassSpec("animal");
                    } else if (val === 'ranger') {
                        setClassSpec("flurry");
                    }
                }} />
                <div className={'classInfoWrapper'}>
                    {(classChoice === 'barbarian') && (
                        <SpecChoice name={'Instinct: '} setSpecChoice={setClassSpec} classId={classChoice} />
                    )}
                    {(classChoice === 'ranger') && (
                        <SpecChoice name={"Hunter's Edge: "} setSpecChoice={setClassSpec} classId={classChoice} />
                    )}
                    {classChoice === 'rogue' && 
                        <CheckboxInput value={applySneakDmg} setValue={setApplySneakDmg} label={'Apply sneak damage:'} />
                    }
                    { classChoice === 'investigator' && 
                        <div>
                            <NumberInput min={8} max={18} value={intStat} setValue={setIntStat} label={'Int ability score (at lvl 1):'} /> 
                            <CheckboxInput value={deviseAStratagem} setValue={setDeviseAStratagem} label={"Devise a Stragagem (once):"} />
                        </div>
                    }
                    {classChoice === 'swashbuckler' && 
                        <div>
                            <CheckboxInput value={applyPanache} setValue={(val:boolean) => {
                                setApplyPanache(val);
                                if(!applyPanache) {
                                    setLastAttackWithFinisher(false);
                                }
                            }} label={'Apply panache:'} />
                            {applyPanache && <CheckboxInput value={lastAttackWithFinisher} setValue={setLastAttackWithFinisher} label={'Last attack with finisher:'} />}
                        </div>
                    }
                    {classChoice === 'ranger' && <CheckboxInput value={markedTarget} setValue={setMarkedTarget} label={"Apply Hunter's Edge:"} /> }
                    {classChoice === 'barbarian' && <CheckboxInput value={rage} setValue={setRage} label={"Raging:"} /> }
                </div>
                <DiceChoice name={'Weapon dice:'} startDiceValue={'4'} allowNoInput={false} setDiceValue={setDiceSize} /> 
                <DiceChoice name={'Deadly dice:'} startDiceValue={'-'} allowNoInput={true} setDiceValue={setDeadlyDiceSize} />
                <DiceChoice name={'Fatal dice:'} startDiceValue={'-'} allowNoInput={true} setDiceValue={setFatalDiceSize} />
                <NumberInput min={8} max={18} value={hitStat} setValue={setHitStat} label={'Hit ability score (at lvl 1):'} /> 
                <NumberInput min={8} max={18} value={dmgStat} setValue={setDmgStat} label={'Dmg ability score (at lvl 1):'} /> 
                <div className={'inputContainer'}>
                    <div className={'labelContainer'}>
                        <p className={'labelName'}>Weapon traits:</p>
                    </div>
                    <div className={'buttonCheckboxWrapper'}>
                        <CheckboxButtonInput value={agile} setValue={setAgile} label={'Agile'} id={'checkbox_agile' + id} /> 
                        <CheckboxButtonInput value={backstabber} setValue={setBackstabber} label={'Backstabber'} id={'checkbox_backstabber' + id} /> 
                        <CheckboxButtonInput value={forceful} setValue={setForceful} label={'Forceful'} id={'checkbox_forceful' + id} /> 
                        <CheckboxButtonInput value={twin} setValue={setTwin} label={'Twin'} id={'checkbox_twin' + id} /> 
                    </div>
                </div>
                <CheckboxInput value={startAtMaxMAP} setValue={(val:boolean) => {
                    setStartAtMaxMAP(val)
                    if (val) {
                        setIgnoreMAP(false);
                    }
                }} label={'Start at max MAP:'} />
                <CheckboxInput value={ignoreMAP} setValue={(val:boolean) => {
                    setIgnoreMAP(val)
                    if (val) {
                        setStartAtMaxMAP(false);
                    }
                }} label={'Ignore MAP:'} />
                <CheckboxInput value={ranged} setValue={(val:boolean) => {
                    setRanged(val)
                    if (!val) {
                        setRangedDmgBonus('-');
                    }
                }} label={'Ranged:'} />
                {ranged && 
                    <div className={'inputContainer'}>
                        <div className={'labelContainer'}>
                            <p className={'labelName'}>Damage bonus:</p>
                        </div>
                        <select onChange={(event) => { 
                            setRangedDmgBonus(event.target.value)
                        }}>
                            <option key={"-"} value={'-'}>
                                { "-"}
                            </option>
                            <option key={"propulsive"} value={'propulsive'}>
                                { "Propulsive"}
                            </option>
                            <option key={"thrown"} value={'thrown'}>
                                { "Thrown" }
                            </option>
                        </select>
                    </div>
                }
                <NumberInput min={2} max={20} value={critRange} setValue={setCritRange} label={'Natural crit:'} />
                <CheckboxInput value={applyPlusHitRunes} setValue={setApplyPlusHitRunes} label={"Plus runes (+1, +2, +3):"} />
                <CheckboxInput value={applyStrikingRunes} setValue={setApplyStrikingRunes} label={"Striking runes:"} />
            </Paper>
        </div>
    );
}

export default DMGCalculator;