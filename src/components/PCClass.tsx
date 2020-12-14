import React, { useCallback, useEffect, useState } from 'react';
import 'rc-color-picker/assets/index.css';
import ClassChoice, { SpecChoice } from './ClassChoice';
import { Button, Paper } from '@material-ui/core';
import './PCClass.css';
import NumberInput from './NumberInput';
import CheckboxButtonInput from './CheckboxButtonInput';
import { getClassJson, getAvgDmg } from './HelpFunctions';
import { getAttackChances } from './HelpFunctions';
import AttackChoices, { AttackSelection } from './AttacksChoice';
import { HuePicker   } from 'react-color';
import WeaponState, { Weapon, WeaponDices, WeaponRunes, WeaponTraits } from './WeaponState';

interface Props {
    id: string;
    color: string;
    setGraphData: (data:any[]) => void;
    acJson: any[];
    enemyAcMod?: string;
}

interface Stats {
    strength: number;
    dexterity: number;
    intelligence: number;
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
    canUseDexForDmg: boolean;
    applySneakDmg: boolean;
    applyPanache: boolean;
    markedTarget: boolean;
    rage: boolean;
    deviseAStratagem: boolean;
    retributiveStrike: boolean;
    attackOfOpportunity: boolean;
    lastAttackWithFinisher: boolean;
    amountOfAttacks: number;
    attackSelections: AttackSelection[];
}

const SwashbucklerFinisherDmgDice = 6;

const PCClass = (props: Props) => {
    const { id, color, setGraphData, enemyAcMod, acJson } = props;
    const [currentPCState, setCurrentPCState] = useState<PCState>();
    const [update, forceUpdate] = React.useState({});
    const [classChoice, setClassChoice] = useState<string>('-');
    const [classSpec, setClassSpec] = useState<string>('-');
    const [strength, setStrength] = useState<number>(18);
    const [dexterity, setDexterity] = useState<number>(18);
    const [intelligence, setIntelligence] = useState<number>(18);
    const [amountOfAttacks, setAmountOfAttacks] = useState<number>(1);
    const [hitBonus, setHitBonus] = useState<number>(0);
    const [dmgBonus, setDmgBonus] = useState<number>(0);
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
    const [currentColor, setCurrentColor] = useState<string>(color);
    const [showHuePicker, setShowHuePicker] = useState<boolean>(false);

    const createBaseWeapon = () => {
        const weaponDices: WeaponDices = {
            diceSize: '4',
            deadlyDiceSize: '-',
            fatalDiceSize: '-'
        };
        const weaponTraits: WeaponTraits = {
            agile: false, 
            backstabber: false,
            finesse: false,
            forceful: false,
            twin: false
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
            type: 'Melee',
            rangedDmgBonus: '-',
            critRange: 20
        };

        return weapon;
    }

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
            intelligence
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
            canUseDexForDmg,
            applySneakDmg,
            applyPanache,
            markedTarget,
            rage,
            deviseAStratagem,
            retributiveStrike,
            attackOfOpportunity,
            lastAttackWithFinisher,
            amountOfAttacks,
            attackSelections,
        })
    }, [
        classChoice, classSpec, strength, dexterity, intelligence, mainHand, offHand, startAtMaxMAP, ignoreMAP, hitBonus,  dmgBonus, 
        canUseDexForDmg, applySneakDmg, applyPanache,  markedTarget, rage,  deviseAStratagem, retributiveStrike, attackOfOpportunity, 
        lastAttackWithFinisher, amountOfAttacks, enemyAcMod, acJson, currentColor, attackSelections, update
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
        setRetributiveStrike(false);
        setAttackOfOpportunity(false);
        setStrength(18);
        setDexterity(18);
        setIntelligence(18);
        setCanUseDexForDmg(false);
        setMainHand(createBaseWeapon());
        setStartAtMaxMAP(false);
        setIgnoreMAP(false);
        setHitBonus(0);
        setDmgBonus(0);
        setAmountOfAttacks(1);
        setAttackSelections([createBaseAttackSelection(1)]);
    }, [classChoice]);

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

    const getDamageChart = () => {
        let level = 1;

        const attackData: any[] = [];

        while(level < 21) {
            let totalAmountOfDmg = 0;
            for(let attack = 1; attack <= amountOfAttacks; attack++) {
                let attackSelection = attackSelections[attack - 1];
                let weaponToAttackWith = attackSelections[attack - 1].hand === 'main' ? mainHand : offHand;

                const attackChances = getAttackChances(currentPCState, weaponToAttackWith, attackSelection, attack, level, parseInt(enemyAcMod), acJson);
                const lastAttack = attack === amountOfAttacks;
                totalAmountOfDmg += (attackChances.hitChance / 100) * getAvgDmg(currentPCState, weaponToAttackWith, false, level, lastAttack, attack);
                totalAmountOfDmg += (attackChances.criticalHitChance / 100) * getAvgDmg(currentPCState, weaponToAttackWith, true, level, lastAttack, attack);

                if (attack === 1 && ((classChoice === 'champion' && retributiveStrike) || (classChoice === 'fighter' && attackOfOpportunity))) {
                    /* Symbolizes a free extra attack with reaction */
                    totalAmountOfDmg *= 2;
                }

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
                borderColor: currentColor,
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
                                { classChoice === 'champion' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.retributiveStrike} setValue={setRetributiveStrike} label={'Retributive Strike'} id={'checkbox_retributive_strike' + id} />
                                        </div>  
                                    </div>
                                }
                                { classChoice === 'fighter' && 
                                    <div className={'quarterElement'}>
                                        <p className={'label'}>Abilities</p>
                                        <div className={'buttonCheckboxWrapper'}>
                                            <CheckboxButtonInput value={currentPCState.attackOfOpportunity} setValue={setAttackOfOpportunity} label={'Attack of Opportunity'} id={'checkbox_attack_of_opportunity_fighter' + id} />
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
                        <WeaponState weapon={mainHand} label={offHand === undefined ? 'Weapon' : 'Main hand'} setWeapon={setMainHand} pcId={id + '_mainHand'} />
                        {offHand !== undefined ? (
                            <WeaponState buttonCommand={() => { setOffHand(undefined) }} weapon={offHand} label={'Off hand'} setWeapon={setOffHand} pcId={id + '_offHand'} />
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
                            <AttackChoices setAttackSelections={(value: AttackSelection[]) => {
                                setAttackSelections(value);
                                forceUpdate({});
                            }}  haveOffHand={offHand !== undefined} attackSelections={attackSelections} ignoreMap={ignoreMAP} alwaysMaxMap={startAtMaxMAP} />
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