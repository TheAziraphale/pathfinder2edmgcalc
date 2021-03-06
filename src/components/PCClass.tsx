import React, { useCallback, useEffect, useState } from 'react';
import 'rc-color-picker/assets/index.css';
import ClassChoice, { SpecChoice } from './ClassChoice';
import FormChoices, { Form } from './FormChoices';
import { Button, Paper } from '@material-ui/core';
import './PCClass.css';
import NumberInput from './NumberInput';
import CheckboxButtonInput from './CheckboxButtonInput';
import { 
    getClassJson, 
    getAvgDmg, 
    getAvgSpellDmg,
    AttackChance,
    getDmgFromAbility, 
    getClassDmg, 
    getClassBonusDmg, 
    getDmgFromWeaponTraits, 
    getExtraDamageFromPropertyRunes,
    getMAP,
    getTotalHitBonus,
    getAbilityBonus,
    getHitStat,
    getPolymorphShape,
    getSpellAttackChance,
    getEnemySaveChance,
    getAttackChances,
    getBestCantripSpellLevel
} from './HelpFunctions';
import AttackChoices, { AttackSelection } from './AttacksChoice';
import { HuePicker   } from 'react-color';
import WeaponState, { Weapon, WeaponDices, WeaponRunes, WeaponTraits } from './WeaponState';
import CantripChoice, { Cantrip } from './CantripChoice';

interface Props {
    id: number;
    color: string;
    setGraphData: (data:any[]) => void;
    acJson: any[];
    saveJson: any[];
    enemyAcMod?: string;
    enemySaveMod?: string;
    removeMe?: (id:number) => void
}

interface Stats {
    strength: number;
    dexterity: number;
    intelligence: number;
    spellcastingStat: number;
}

export interface AttackSummary {
    weapon: Weapon;
    attackSelection: AttackSelection;
    attackChances: AttackChance;
    totalHit: number;
    totalDmg: number;
    extraRuneDmg: number;
    abilityBonusDmg: number;
    abilityBonusHit: number;
    classDmg: number;
    classHit: number;
    classBonusDmg: number;
    weaponTraitBonusDmg: number;
    untypedBonusDmg: number;
    avgDmgThisAttack: number;
    spellDC: number;
}

export interface PCState {
    classChoice: string;
    classSpec: string;
    stats: Stats;
    mainHand: Weapon;
    offHand?: Weapon;
    startAtMaxMAP: boolean;
    ignoreMAP: boolean;
    hitBonus: number;
    dmgBonus: number;
    spellcastingCrit: number;
    spellCastingTargetAmount: number;
    spellCastingSplashTargetAmount: number;
    canUseDexForDmg: boolean;
    applySneakDmg: boolean;
    applyPanache: boolean;
    markedTarget: boolean;
    rage: boolean;
    deviseAStratagem: boolean;
    retributiveStrike: boolean;
    attackOfOpportunity: boolean;
    lastAttackWithFinisher: boolean;
    tigerSlash: boolean;
    craneFlutter: boolean;
    dragonRoar: boolean;
    wolfDrag: boolean;
    gorillaPound: boolean;
    gorillaFrightened: number;
    stumblingFeint: boolean;
    druidForms: Form[];
    amountOfAttacks: number;
    attackSelections: AttackSelection[];
}

const SwashbucklerFinisherDmgDice = 6;

const PCClass = (props: Props) => {
    const { id, color, setGraphData, enemyAcMod, enemySaveMod, acJson, saveJson } = props;
    const [currentPCState, setCurrentPCState] = useState<PCState>();
    const [update, forceUpdate] = React.useState({});
    const [classChoice, setClassChoice] = useState<string>('-');
    const [classSpec, setClassSpec] = useState<string>('-');
    const [cantripSpell, setCantripSpell] = useState<Cantrip>();
    const [strength, setStrength] = useState<number>(18);
    const [dexterity, setDexterity] = useState<number>(18);
    const [intelligence, setIntelligence] = useState<number>(18);
    const [spellcastingStat, setSpellcastingStat] = useState<number>(18);
    const [amountOfAttacks, setAmountOfAttacks] = useState<number>(1);
    const [hitBonus, setHitBonus] = useState<number>(0);
    const [dmgBonus, setDmgBonus] = useState<number>(0);
    const [spellcastingCrit, setSpellcastingCrit] = useState<number>(20);
    const [spellCastingTargetAmount, setSpellCastingTargetAmount] = useState<number>(1);
    const [spellCastingSplashTargetAmount, setSpellCastingSplashTargetAmount] = useState<number>(1);
    const [canUseDexForDmg, setCanUseDexForDmg] = useState<boolean>(false);
    const [startAtMaxMAP, setStartAtMaxMAP] = useState<boolean>(false);
    const [ignoreMAP, setIgnoreMAP] = useState<boolean>(false);
    const [applySneakDmg, setApplySneakDmg] = useState<boolean>(false);
    const [applyPanache, setApplyPanache] = useState<boolean>(false);
    const [markedTarget, setMarkedTarget] = useState<boolean>(false);
    const [rage, setRage] = useState<boolean>(false);
    const [deviseAStratagem, setDeviseAStratagem] = useState<boolean>(false);
    const [retributiveStrike, setRetributiveStrike] = useState<boolean>(false);
    const [attackOfOpportunity, setAttackOfOpportunity] = useState<boolean>(false);
    const [lastAttackWithFinisher, setLastAttackWithFinisher] = useState<boolean>(false);
    const [tigerSlash, setTigerSlash] = useState<boolean>(false);
    const [craneFlutter, setCraneFlutter] = useState<boolean>(false);
    const [dragonRoar, setDragonRoar] = useState<boolean>(false);
    const [wolfDrag, setWolfDrag] = useState<boolean>(false);
    const [gorillaPound, setGorillaPound] = useState<boolean>(false);
    const [gorillaFrightened, setGorillaFrightened] = useState<number>(0);
    const [stumblingFeint, setTumblingFeint] = useState<boolean>(false);
    const [druidForms, setDruidForms] = useState<Form[]>();
    const [currentColor, setCurrentColor] = useState<string>(color);
    const [showHuePicker, setShowHuePicker] = useState<boolean>(false);

    const createBaseWeapon = useCallback((customFatalDice?:string) => {
        let dice = '4';
        let deadlyDice: string = '-';  
        let fatalDice: string = customFatalDice !== undefined ? customFatalDice : '-';  
        let traits: string[] = undefined;  
        let type: string = 'Melee';
        
        if (classChoice === 'monk') {
            const monkJson = getClassJson(classChoice, classSpec);
            const monkTraits:string[] = [];
            monkJson['stances'][classSpec]['traits'].forEach((trait) => {
                monkTraits.push(trait);
            });
            dice = monkJson['stances'][classSpec]['diceSize'].toLocaleString();
            if (classSpec === 'tiger' && customFatalDice === undefined) {
                deadlyDice = monkJson['stances'][classSpec]['criticalBonusDmgDice'].toLocaleString();
            }
            traits = monkTraits;
        }

        const weaponDices: WeaponDices = {
            diceSize:dice,
            deadlyDiceSize: deadlyDice,
            fatalDiceSize: fatalDice,
        };
        const weaponTraits: WeaponTraits = {
            agile: traits !== undefined ? traits.includes('agile') : false, 
            backstabber: traits !== undefined ? traits.includes('backstabber') : false,
            finesse: traits !== undefined ? traits.includes('finesse') : false,
            forceful: traits !== undefined ? traits.includes('forceful') : false,
            twin: traits !== undefined ? traits.includes('twin') : false
        };
        const weaponRunes: WeaponRunes = {   
            hit: true,
            striking: true,
            firstPropRune: '-',
            secondPropRune: '-',
            thirdPropRune: '-'
        }
        const weapon: Weapon = {
            dices: weaponDices,
            traits: weaponTraits,
            runes: weaponRunes,
            type: type,
            rangedDmgBonus: '-',
            critRange: 20
        };

        return weapon;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classChoice, classSpec])

    const createBaseAttackSelection = (attack: number) => {
        return {hand: 'main', map: attack === 1 ? '1' : attack === 2 ? '2' : '3' };
    }

    const [mainHand, setMainHand] = useState<Weapon>(createBaseWeapon());
    const [offHand, setOffHand] = useState<Weapon>(undefined);
    const [attackSelections, setAttackSelections] = useState<AttackSelection[]>([createBaseAttackSelection(1)]);

    useEffect(() => {
        const stats: Stats = {
            strength,
            dexterity,
            intelligence,
            spellcastingStat
        };
        if (!offHand) {
            let newAttackSelections = attackSelections;
            newAttackSelections.forEach((selection) => {
                selection.hand = 'main';
            })
            setAttackSelections(newAttackSelections);
        }
        setCurrentPCState({
            classChoice, 
            classSpec,
            stats: stats,
            mainHand: mainHand,
            offHand: offHand,
            startAtMaxMAP,
            ignoreMAP,
            hitBonus,
            dmgBonus,
            spellcastingCrit,
            spellCastingTargetAmount,
            spellCastingSplashTargetAmount,
            canUseDexForDmg,
            applySneakDmg,
            applyPanache,
            markedTarget,
            rage,
            deviseAStratagem,
            retributiveStrike,
            attackOfOpportunity,
            lastAttackWithFinisher,
            tigerSlash,
            craneFlutter,
            dragonRoar,
            wolfDrag,
            gorillaPound,
            gorillaFrightened,
            stumblingFeint,
            druidForms,
            amountOfAttacks,
            attackSelections,
        });
    }, [
        classChoice, classSpec, strength, dexterity, intelligence, spellcastingStat, spellcastingCrit, spellCastingTargetAmount, spellCastingSplashTargetAmount, 
        mainHand, offHand, startAtMaxMAP, ignoreMAP, hitBonus, dmgBonus, canUseDexForDmg, applySneakDmg, applyPanache,  markedTarget, rage,  deviseAStratagem, 
        retributiveStrike, attackOfOpportunity, tigerSlash, craneFlutter, dragonRoar, wolfDrag, gorillaPound, gorillaFrightened, stumblingFeint, 
        lastAttackWithFinisher, druidForms, amountOfAttacks, enemyAcMod, enemySaveMod, acJson, saveJson, currentColor, attackSelections, update, cantripSpell
    ])

    useEffect(() => {
        if (tigerSlash) {
            setAmountOfAttacks(2);
        }
    }, [tigerSlash])

    useEffect(() => {
        if (classChoice === 'monk' && classSpec !== '') {
            setMainHand(createBaseWeapon());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classSpec, classChoice])

    const doesClassHaveASpec = useCallback(() => {
        if (classChoice === 'barbarian' || classChoice === 'oracle' || classChoice === 'cleric' ||  classChoice === 'ranger' || classChoice === 'monk') {
            return true;
        }

        return false;
    }, [classChoice])

    useEffect(() => {
        /* Reset values when classChoice is set */
        setApplySneakDmg(classChoice === 'rogue');
        setApplyPanache(classChoice === 'swashbuckler');
        setLastAttackWithFinisher(false);
        setMarkedTarget(classChoice === 'ranger');
        setRage(classChoice === 'barbarian');
        setDeviseAStratagem(classChoice === 'investigator');
        setDruidForms(undefined);
        setRetributiveStrike(false);
        setAttackOfOpportunity(false);
        setStrength(18);
        setDexterity(18);
        setIntelligence(18);
        setSpellcastingStat(18);
        setSpellcastingCrit(20);
        setSpellCastingTargetAmount(1);
        setSpellCastingSplashTargetAmount(1);
        setCanUseDexForDmg(false);
        setMainHand(createBaseWeapon());
        if (classChoice === 'monk') {
            setOffHand(undefined);
        }
        setStartAtMaxMAP(false);
        setIgnoreMAP(false);
        setHitBonus(0);
        setDmgBonus(0);
        setAmountOfAttacks(1);
        setAttackSelections([createBaseAttackSelection(1)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classChoice]);

    useEffect(() => {
        setTigerSlash(classSpec === 'tiger');
        setCraneFlutter(classSpec === 'crane');
        setDragonRoar(classSpec === 'dragon');
        setWolfDrag(classSpec === 'wolf');
        setGorillaPound(classSpec === 'gorilla');
        setGorillaFrightened(classSpec === 'gorilla' ? 1 : 0);
        setTumblingFeint(classSpec === 'stumbling');
    }, [classChoice, classSpec]);
    
    useEffect(() => {
        if(attackSelections.length !== amountOfAttacks) {
            let newAttackSelections = attackSelections;
            if(attackSelections.length > amountOfAttacks) {
                for(let attacks = amountOfAttacks; attacks < attackSelections.length; attacks++) {
                    newAttackSelections.pop();
                    if (newAttackSelections.length === 1) {
                        newAttackSelections[0].hand = 'main';
                    }
                }
            } else if(attackSelections.length < amountOfAttacks) {
                for(let selLength = attackSelections.length; selLength < amountOfAttacks; selLength++) {
                    newAttackSelections.push(createBaseAttackSelection(selLength + 1));
                }
            }
            setAttackSelections(newAttackSelections);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amountOfAttacks, attackSelections]);

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
    
    const getSpellSaveSummary = (saveChances: AttackChance, level: number, cantripSpell: Cantrip, avgDmgThisAttack: number) => {
        let saveAbilityBonus = getAbilityBonus(level, currentPCState.stats.spellcastingStat);
        const spellDC = 10 + level + saveAbilityBonus + getClassJson(currentPCState.classChoice, currentPCState.classSpec)['spellDC'][level];

        return {
            weapon: undefined,
            attackSelection: undefined,
            attackChances: saveChances,
            totalHit: undefined,
            totalDmg: avgDmgThisAttack,
            extraRuneDmg: undefined,
            abilityBonusDmg: undefined,
            abilityBonusHit: undefined,
            classDmg: undefined,
            classHit: undefined,
            classBonusDmg: undefined,
            weaponTraitBonusDmg: undefined,
            untypedBonusDmg: undefined,
            avgDmgThisAttack: avgDmgThisAttack,
            spellDC: spellDC
        }
    }

    const getSpellAttackSummary = (attackChances: AttackChance, level: number, cantripSpell: Cantrip, avgDmgThisAttack: number) => {
        let hitAbilityBonus = getAbilityBonus(level, currentPCState.stats.spellcastingStat);
        let totalHitChance = getTotalHitBonus(level, currentPCState.classChoice, currentPCState.classSpec, false, currentPCState.hitBonus, hitAbilityBonus, currentPCState.druidForms);
        
        let extraRuneDmg = 0;
        let bestCantripVersion = getBestCantripSpellLevel(cantripSpell, level);
        let abilityBonusDmg = bestCantripVersion.abilityBoost ? getDmgFromAbility(currentPCState, level, undefined, currentPCState.stats.spellcastingStat) : 0;
        let classDmg = 0;
        let classBonusDmg = 0;
        let weaponTraitBonusDmg = 0;
        let untypedBonusDmg = currentPCState.dmgBonus;

        return {
            weapon: undefined,
            attackSelection: undefined,
            attackChances: attackChances,
            totalHit: totalHitChance,
            totalDmg: getPolymorphShape(currentPCState, level) ? classDmg : extraRuneDmg + abilityBonusDmg + classDmg + classBonusDmg + weaponTraitBonusDmg + untypedBonusDmg,
            extraRuneDmg: extraRuneDmg,
            abilityBonusDmg: abilityBonusDmg,
            abilityBonusHit: hitAbilityBonus,
            classDmg: classDmg,
            classHit: getClassJson(classChoice, classSpec).hit[level],
            classBonusDmg: classBonusDmg,
            weaponTraitBonusDmg: weaponTraitBonusDmg,
            untypedBonusDmg: untypedBonusDmg,
            avgDmgThisAttack: avgDmgThisAttack,
            spellDC: undefined
        }
    }

    const getAttackSummary = (attackChances: AttackChance, level: number, weaponToAttackWith: Weapon, attackSelection: AttackSelection, attack: number, lastAttack: boolean, avgDmgThisAttack: number) => {
        const runeBonusDmg = (attackChances.hitChance / 100) * getExtraDamageFromPropertyRunes(level, false, weaponToAttackWith.runes) + 
        (attackChances.criticalHitChance / 100) * getExtraDamageFromPropertyRunes(level, true, weaponToAttackWith.runes);
        

        let hitAbilityBonus = getAbilityBonus(level, getHitStat(weaponToAttackWith.traits.finesse, currentPCState.stats.dexterity, currentPCState.stats.strength, weaponToAttackWith.type));
        if ((attack === 1 && currentPCState.classChoice === 'investigator') && currentPCState.deviseAStratagem) {
            hitAbilityBonus = getAbilityBonus(level, currentPCState.stats.intelligence);
        }
        let totalHitChance = getTotalHitBonus(level, currentPCState.classChoice, currentPCState.classSpec, weaponToAttackWith.runes.hit, currentPCState.hitBonus, hitAbilityBonus, currentPCState.druidForms);
        
        if(!currentPCState.ignoreMAP) {
            totalHitChance += getMAP(currentPCState, level, attackSelection);
        }
    
        let extraRuneDmg = runeBonusDmg;
        let abilityBonusDmg = getDmgFromAbility(currentPCState, level, weaponToAttackWith);
        let classDmg = getClassDmg(currentPCState, level, attack);
        let classBonusDmg = getClassBonusDmg(currentPCState, level, lastAttack, attack);
        let weaponTraitBonusDmg = getDmgFromWeaponTraits(weaponToAttackWith, level, attack);
        let untypedBonusDmg = currentPCState.dmgBonus;

        return {
            weapon: weaponToAttackWith,
            attackSelection: attackSelection,
            attackChances: attackChances,
            totalHit: totalHitChance,
            totalDmg: getPolymorphShape(currentPCState, level) ? classDmg : extraRuneDmg + abilityBonusDmg + classDmg + classBonusDmg + weaponTraitBonusDmg + untypedBonusDmg,
            extraRuneDmg: extraRuneDmg,
            abilityBonusDmg: abilityBonusDmg,
            abilityBonusHit: hitAbilityBonus,
            classDmg: classDmg,
            classHit: getClassJson(classChoice, classSpec).hit[level],
            classBonusDmg: classBonusDmg,
            weaponTraitBonusDmg: weaponTraitBonusDmg,
            untypedBonusDmg: untypedBonusDmg,
            avgDmgThisAttack: avgDmgThisAttack,
            spellDC: undefined
        }
    }

    const getDamageChart = () => {
        let level = 1;

        const attackData: any[] = [];
        const attacksSummary: any[] = [];

        while(level < 21) {
            let totalAmountOfDmg = 0;
            const attackSummary: AttackSummary[] = [];

            if (classChoice === 'primarySpellcaster' && cantripSpell !== undefined) {
                // console.log("inside", cantripSpell);
                if (cantripSpell.savingThrow) {
                    const saveChances = getEnemySaveChance(currentPCState, level, parseInt(enemySaveMod), saveJson);
                    
                    let fullDmg = getAvgSpellDmg(currentPCState, cantripSpell, false, level, spellCastingTargetAmount, spellCastingSplashTargetAmount)

                    /* in a hit, it's halved rounded down, meaning you will lose 0.25 dmg from each save success */
                    let thisAttackDmg = (saveChances.hitChance / 100) * (fullDmg * 0.5 - 0.25);
                    thisAttackDmg += (saveChances.missChance / 100) * fullDmg;
                    thisAttackDmg += (saveChances.criticalFailureChance / 100) * fullDmg * 2;

                    attackSummary.push(getSpellSaveSummary(saveChances, level, cantripSpell, thisAttackDmg))
                    totalAmountOfDmg += thisAttackDmg;
                    
                } else if (cantripSpell.spellAttack) {
                    const attackChances = getSpellAttackChance(currentPCState, level, parseInt(enemyAcMod), acJson, spellcastingCrit);
                    
                    let thisAttackDmg = (attackChances.hitChance / 100) * getAvgSpellDmg(currentPCState, cantripSpell, false, level, spellCastingTargetAmount, spellCastingSplashTargetAmount);
                    thisAttackDmg += (attackChances.criticalHitChance / 100) * getAvgSpellDmg(currentPCState, cantripSpell, true, level, spellCastingTargetAmount, spellCastingSplashTargetAmount);

                    attackSummary.push(getSpellAttackSummary(attackChances, level, cantripSpell, thisAttackDmg))
                    totalAmountOfDmg += thisAttackDmg;
                }
            } else {

                for(let attack = 1; attack <= amountOfAttacks; attack++) {

                    let attackSelection = attackSelections[attack - 1];
                    let weaponToAttackWith = attackSelections[attack - 1].hand === 'main' ? mainHand : offHand;
                    
                    if (level >= 6 && classSpec === 'wolf' && wolfDrag) {
                        weaponToAttackWith = createBaseWeapon('12');
                    }

                    // only used for monk stumbling stance at the moment
                    let flatFootedValue = 0;
                    if (level >= 6 && classSpec === 'stumbling' && stumblingFeint && attack <= 2) {
                        flatFootedValue = 2;
                    }

                    const attackChances = getAttackChances(currentPCState, weaponToAttackWith, attackSelection, attack, level, parseInt(enemyAcMod) - flatFootedValue, acJson);
                    const lastAttack = attack === amountOfAttacks;

                    let thisAttackDmg = (attackChances.hitChance / 100) * getAvgDmg(currentPCState, weaponToAttackWith, false, level, lastAttack, attack);
                    thisAttackDmg += (attackChances.criticalHitChance / 100) * getAvgDmg(currentPCState, weaponToAttackWith, true, level, lastAttack, attack);

                    let reactionExtraDmg = 0;
                    if (attack === 1 && ((classChoice === 'champion' && retributiveStrike) || (classChoice === 'fighter' && attackOfOpportunity))) {
                        /* Symbolizes a free extra attack with reaction */
                        reactionExtraDmg = thisAttackDmg;
                    } else if (attack === 1 && classSpec === 'crane' && craneFlutter) {
                        /* Symbolizes a free extra attack with reaction */
                        const attackFlutterChances = getAttackChances(currentPCState, weaponToAttackWith, attackSelection, attack, level, parseInt(enemyAcMod) + 2, acJson);
                        reactionExtraDmg = (attackFlutterChances.hitChance / 100) * getAvgDmg(currentPCState, weaponToAttackWith, false, level, lastAttack, attack);
                        reactionExtraDmg += (attackFlutterChances.criticalHitChance / 100) * getAvgDmg(currentPCState, weaponToAttackWith, true, level, lastAttack, attack);
                    }
                    thisAttackDmg += reactionExtraDmg;

                    let swashbucklerFinisherDmg = 0;
                    if (classChoice === 'swashbuckler' && applyPanache && lastAttackWithFinisher && lastAttack) {
                        swashbucklerFinisherDmg = ((attackChances.missChance / 100) * (SwashbucklerFinisherDmgDice/2 + 0.5) * getClassJsonInternal().panacheBonus[level]) / 2;
                    }
                    thisAttackDmg += swashbucklerFinisherDmg;

                    attackSummary.push(getAttackSummary(attackChances, level, weaponToAttackWith, attackSelection, attack, lastAttack, thisAttackDmg))

                    if (level >= 6 && attack === 2 && classSpec === 'tiger' && tigerSlash) {
                        thisAttackDmg = 0;
                    }

                    totalAmountOfDmg += thisAttackDmg;
                }
            }
            attackData.push(totalAmountOfDmg);
            attacksSummary.push(attackSummary);
            level++;
        }

        return [ 
            {
                datasets: {
                    label: (id + 1) + '# ' + (classSpec !== '-' ? Capitalize(classSpec) : '') + ' ' + Capitalize(classChoice),
                    data: attackData,
                    fill: false,
                    borderColor: currentColor,
                }, 
                attacksSummary: attacksSummary
            }
        ];
    };

    const Capitalize = (str:string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className={'pcWrapper'} key={'pc_element_' + id}>
            <Paper className={'innerPCWrapper'}>
                <div className={'labelElement'}>
                    <p className={'labelHeader'}>Class and specialization</p>   
                </div>
                <div onClick={() => { setShowHuePicker(!showHuePicker) }} className={'colorBar'} style={{backgroundColor: currentColor }} />
                {showHuePicker &&
                    <div className={'colorPickerWrapper'}>
                        <div className={'colorPicker'}>
                            <HuePicker color={currentColor} width={170} disableAlpha={true} onChange={(color) => {
                                setCurrentColor(color.hex);
                            } } />
                        </div>
                        <div className={'closeColorPicker'} onClick={() => { setShowHuePicker(false) }}></div>
                    </div>
                }
                <div className={'elementWrapper'}>
                    <div className={'elementContainer'}>
                        <div className={'halfElement'}>
                            <p className={'label'}>Choose your class</p>                
                            <ClassChoice setClassChoice={(val: string) => { 
                                setClassChoice(val);
                                if (val === 'barbarian') {
                                    setClassSpec("animal");
                                } else if (val === 'monk') {
                                    setClassSpec("custom");
                                } else if (val === 'cleric') {
                                    setClassSpec("cloistered");
                                } else if (val === 'oracle') {
                                    setClassSpec("ancestors");
                                } else if (val === 'ranger') {
                                    setClassSpec("flurry");
                                } else {
                                    setClassSpec('-');
                                }
                            }} noLabel={true} />
                        </div>
                        {classChoice !== '-' && doesClassHaveASpec() && (
                            <div className={'halfElement'}>
                                <p className={'label'}>{classChoice === 'barbarian' ? 'Choose instinct' : 
                                                        classChoice === 'monk' ? 'Choose stance' : 
                                                        classChoice === 'ranger' ? "Choose hunter's edge" : 
                                                        classChoice === 'cleric' ? "Choose doctrine" : 
                                                        classChoice === 'oracle' ? "Choose mystery" : 
                                                        'Choose spec'}</p>                
                                <SpecChoice setSpecChoice={setClassSpec} classId={currentPCState.classChoice} noLabel={true} />
                            </div>
                        )}
                    </div>
                </div>
                { classChoice === 'druid' && (
                    <div>
                        <div className={'labelElement'}>
                            <p className={'labelHeader'}>Form choices</p>   
                        </div>
                        <FormChoices setFormChoices={setDruidForms} />
                    </div>
                )}
                {classChoice !== '-' && (classSpec !== '-' || !doesClassHaveASpec()) && (
                    <div>
                        <div className={'labelElement'}>
                            <p className={'labelHeader'}>Important stats (ability scores scales with level)</p>   
                        </div>
                        <div className={'elementWrapper'}>
                            <div className={'elementContainer'}>
                                {  classChoice !== 'primarySpellcaster' &&
                                <div className={'quarterElement'} >
                                    <p className={'label'}>Strength</p>                
                                    <NumberInput min={8} max={18} value={currentPCState.stats.strength} setValue={setStrength} /> 
                                </div>
                                }
                                { classChoice !== 'primarySpellcaster' &&
                                <div className={'quarterElement'}>
                                    <p className={'label'}>Dexterity</p>                
                                    <NumberInput min={8} max={18} value={currentPCState.stats.dexterity} setValue={setDexterity} /> 
                                </div>
                                }
                                { classChoice === 'primarySpellcaster' &&
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Casting Stat</p>                
                                        <NumberInput min={8} max={18} value={currentPCState.stats.spellcastingStat} setValue={setSpellcastingStat} /> 
                                    </div>
                                }
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
                                            }} label={'Panache'} id={'checkbox_panache_' + id} />
                                            {currentPCState.applyPanache && <CheckboxButtonInput value={currentPCState.lastAttackWithFinisher} setValue={setLastAttackWithFinisher} label={'Last attack - finisher'} id={'checkbox_finisher_' + id} />} 
                                        </div>
                                    </div>
                                }
                                {classChoice === 'rogue' && (  
                                    <div className={'halfElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput fixedWidth={80} value={currentPCState.applySneakDmg} setValue={setApplySneakDmg} label={'Sneak damage'} id={'checkbox_sneak_dmg_' + id} />
                                            <CheckboxButtonInput fixedWidth={88} value={currentPCState.canUseDexForDmg} setValue={setCanUseDexForDmg} label={'Dex for damage'} id={'checkbox_dex_for_dmg_' + id} />
                                        </div> 
                                    </div>
                                )}
                                { classChoice === 'investigator' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.deviseAStratagem} setValue={setDeviseAStratagem} label={'Devise a Stratagem'} id={'checkbox_devise_a_stratagem_' + id} />
                                        </div>  
                                    </div>
                                }
                                { classChoice === 'champion' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.retributiveStrike} setValue={setRetributiveStrike} label={'Retributive Strike'} id={'checkbox_retributive_strike_' + id} />
                                        </div>  
                                    </div>
                                }
                                { classChoice === 'fighter' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.attackOfOpportunity} setValue={setAttackOfOpportunity} label={'Attack of Opportunity'} id={'checkbox_attack_of_opportunity_fighter_' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'ranger' && 
                                    <div className={'halfElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.markedTarget} setValue={setMarkedTarget} label={"Hunter's Edge"} id={'checkbox_hunters_edge_' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'barbarian' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.rage} setValue={setRage} label={"Raging"} id={'checkbox_rage_' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'monk' && classSpec === 'tiger' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.tigerSlash} setValue={setTigerSlash} label={"Tiger slash, 6th lvl"} id={'checkbox_tiger_slash_' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'monk' && classSpec === 'crane' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.craneFlutter} setValue={setCraneFlutter} label={"Crane flutter, 6th lvl"} id={'checkbox_crane_flutter_' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'monk' && classSpec === 'dragon' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.dragonRoar} setValue={setDragonRoar} label={"Dragon roar, 6th lvl"} id={'checkbox_dragon_roar_' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'monk' && classSpec === 'wolf' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.wolfDrag} setValue={setWolfDrag} label={"Wolf drag, 6th lvl"} id={'checkbox_wolf_drag_' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'monk' && classSpec === 'gorilla' && 
                                    <div className={'quarterElement'} style={{marginRight: 5}}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.gorillaPound} setValue={setGorillaPound} label={"Gorilla pound, 6th lvl"} id={'checkbox_gorilla_pound_' + id} />
                                        </div>  
                                    </div>
                                }
                                {classChoice === 'monk' && classSpec === 'gorilla' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Frightened</p>                
                                        <NumberInput min={0} max={5} value={currentPCState.gorillaFrightened} setValue={setGorillaFrightened} /> 
                                    </div>
                                }
                                {classChoice === 'monk' && classSpec === 'stumbling' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p> 
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.stumblingFeint} setValue={setTumblingFeint} label={"Sumbling feint, 6th lvl"} id={'checkbox_stumbling_feint_' + id} />
                                        </div>  
                                    </div>
                                }
                            </div>
                        </div>
                        { classChoice !== 'primarySpellcaster' &&
                            <WeaponState currentPCState={currentPCState} weapon={mainHand} label={classChoice === 'druid' ? 'Wildmorph wraps runes' : offHand === undefined ? 'Weapon' : 'Main hand'} setWeapon={setMainHand} pcId={id + '_mainHand'} />
                        }
                         {(classChoice === 'monk' && classSpec !== 'custom') || classChoice === 'druid' || classChoice === 'primarySpellcaster' ? (
                            <div></div>
                        ) : offHand !== undefined ? (
                            <WeaponState currentPCState={currentPCState} buttonCommand={() => { setOffHand(undefined) }} weapon={offHand} label={'Off hand'} setWeapon={setOffHand} pcId={id + '_offHand'} />
                        ) : (
                            <div className={'labelElement'}>
                                <div className={'elementContainer'} style={{height: 30}}>
                                    <p className={'labelHeader'}>Add second Weapon</p>
                                    <div className={'buttonContainer'}>
                                        <Button style={{minWidth: 0, padding: 0, paddingLeft: 1,  borderRadius: 10, fontSize:20,
                                        color: 'white', 
                                        paddingBottom: (offHand === undefined ? 0 : 3),  
                                        backgroundColor: (offHand === undefined ? 'rgb(25, 180, 25)' : 'rgb(255, 50, 50)')}} 
                                            fullWidth={true} className={'addbutton'} variant="contained" onClick={() => { setOffHand(createBaseWeapon())}}>{(offHand === undefined ? '+' : '-')}</Button>
                                    </div>
                                </div>
                            </div>
                        )
                        }
                        { classChoice !== 'primarySpellcaster' &&
                            <div>
                                <div className={'labelElement'}>
                                    <p className={'labelHeader'}>Attacks and extra</p>   
                                </div>
                                <div className={'elementWrapper'}>
                                    <div className={'elementContainer'}>
                                        <div className={'oneThirdElement'} style={{width: 140}} >
                                            <p className={'label'}>Number of attacks</p>                
                                            <NumberInput min={tigerSlash ? 2 : 1} max={10} value={currentPCState.amountOfAttacks} setValue={setAmountOfAttacks} /> 
                                        </div>
                                        <div className={'twoFifthElement'}>
                                            <p className={'label'}>Buffs to hit</p>  
                                            <NumberInput min={-20} max={20} value={currentPCState.hitBonus} setValue={setHitBonus} /> 
                                        </div>
                                        <div className={'oneThirdElement'}>
                                            <p className={'label'}>Buffs to damage</p>  
                                            <NumberInput min={-20} max={20} value={currentPCState.dmgBonus} setValue={setDmgBonus} /> 
                                        </div>
                                    </div>
                                    <AttackChoices setAttackSelections={(value: AttackSelection[]) => {
                                        setAttackSelections(value);
                                        forceUpdate({});
                                    }} currentPCState={currentPCState} haveOffHand={offHand !== undefined} attackSelections={attackSelections} ignoreMap={ignoreMAP} alwaysMaxMap={startAtMaxMAP} />
                                    <div className={'elementContainer'} style={{height: 25}}>
                                        <div style={{marginRight: 5}}>
                                        <CheckboxButtonInput value={currentPCState.startAtMaxMAP} setValue={(val:boolean) => {
                                                setStartAtMaxMAP(val)
                                                if (val) {
                                                    setIgnoreMAP(false);
                                                }
                                            }} label={'Always max MAP'} id={'checkbox_max_map_' + id} />
                                        </div>
                                        <div>
                                            
                                        <CheckboxButtonInput value={currentPCState.ignoreMAP} setValue={(val:boolean) => {
                                                setIgnoreMAP(val)
                                                if (val) {
                                                    setStartAtMaxMAP(false);
                                                }
                                            }} label={'Ignore MAP'} id={'checkbox_ignore_map_' + id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        { classChoice === 'primarySpellcaster' &&
                            <div>
                                <div>
                                    <div className={'labelElement'}>
                                        <p className={'labelHeader'}>Cantrip</p>   
                                    </div>
                                </div>
                                <div className={'elementWrapper'}>
                                    <div className={'elementContainer'}>
                                        <div className={'oneThirdElement'} style={{width: 140}} >
                                            <p className={'label'}>Spell</p>
                                            <CantripChoice setCantripSpell={setCantripSpell} cantripSpell={cantripSpell} />
                                        </div>
                                        <div className={'twoFifthElement'}>
                                            <p className={'label'}>Buffs to hit</p>  
                                            <NumberInput min={-20} max={20} value={currentPCState.hitBonus} setValue={setHitBonus} /> 
                                        </div>
                                        <div className={'oneThirdElement'}>
                                            <p className={'label'}>Buffs to damage</p>  
                                            <NumberInput min={-20} max={20} value={currentPCState.dmgBonus} setValue={setDmgBonus} /> 
                                        </div>
                                    </div>
                                    <div className={'elementContainer'}>
                                        {cantripSpell !== undefined && cantripSpell.spellAttack &&
                                            <div className={'oneThirdElement'}>
                                                <p className={'label'}>Crit range</p>  
                                                <NumberInput min={2} max={20} value={currentPCState.spellcastingCrit} setValue={setSpellcastingCrit} /> 
                                            </div>
                                        }
                                        {cantripSpell !== undefined && cantripSpell.targets > 1 &&
                                            <div className={'oneThirdElement'}>
                                                <p className={'label'}>Amount of targets</p>  
                                                <NumberInput min={1} max={cantripSpell.targets} value={currentPCState.spellCastingTargetAmount} setValue={setSpellCastingTargetAmount} /> 
                                            </div>
                                        }
                                        {cantripSpell !== undefined && cantripSpell.standardEffect.splashDmg > 0 &&
                                            <div className={'oneThirdElement'}>
                                                <p className={'label'}>Splash amount</p>  
                                                <NumberInput min={1} max={20} value={currentPCState.spellCastingSplashTargetAmount} setValue={setSpellCastingSplashTargetAmount} /> 
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                )}
            </Paper>
        </div>
    );
}

export default PCClass;