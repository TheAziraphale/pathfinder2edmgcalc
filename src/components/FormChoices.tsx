import { capitalize } from '@material-ui/core';
import Classes from '../jsons/Classes.json';
import React, { useEffect, useState } from 'react';
import './Components.css';

interface Props {
    setFormChoices: (formChoices: Form[]) => void;
}

export interface FormAttack {
    diceSize: number;
    diceAmount: number,
    traits: string[];
    bonusDmg: number;
    hitBonusDmgDice?: number;
    hitBonusAmountOfDice?: number;
    criticalBonusDmgDice?: number,
    criticalBonusAmountOfDice?: number;
    deadlyDiceSize?: number;
    deadlyAmountOfDice?: number;
}

export interface Form {
    formName: string;
    shapesName: string;
    level: number;
    primaryAttack: FormAttack;
    secondaryAttack: FormAttack;
    attackModifier: number;
    damageBonus: number;
    doubleDices: boolean;
    increaseBaseDiceNumber: number;
    wildMorph: boolean;
}

interface FormProps {
    setForm: (formChoice: Form) => void;
    level: number;
}

const FormChoices = (props: Props) => {
    const { setFormChoices } = props;
    const [formLevel1] = useState<Form>(getFormChoice(1, 'wildmorph', 'claws', 'claws'));
    const [formLevel3, setFormLevel3] = useState<Form>();
    const [formLevel5, setFormLevel5] = useState<Form>();
    const [formLevel7, setFormLevel7] = useState<Form>();
    const [formLevel9, setFormLevel9] = useState<Form>();
    const [formLevel11, setFormLevel11] = useState<Form>();
    const [formLevel13, setFormLevel13] = useState<Form>();
    const [formLevel15, setFormLevel15] = useState<Form>();
    const [formLevel17, setFormLevel17] = useState<Form>();
    const [formLevel19, setFormLevel19] = useState<Form>();
    const [currentForms, setCurrentForms] = useState<Form[]>([]);
    
    useEffect(() => {
        const forms = [];
        forms.push(formLevel1);
        forms.push(formLevel3);
        forms.push(formLevel5);
        forms.push(formLevel7);
        forms.push(formLevel9);
        forms.push(formLevel11);
        forms.push(formLevel13);
        forms.push(formLevel15);
        forms.push(formLevel17);
        forms.push(formLevel19);
        setCurrentForms(forms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formLevel1, formLevel3, formLevel5, formLevel7, formLevel9, formLevel11, formLevel13, formLevel15, formLevel17, formLevel19])

    useEffect(() => {
        setFormChoices(currentForms)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentForms])
    
    return (
    <div className={'elementWrapper'}>
        <div className={'elementContainer'}>  
            <div className={'oneEightElement'}>
                <p className={'label'}>Level</p> 
            </div>
            <div className={'formElementContainer'}>
                <p className={'label'}>Form</p> 
            </div>
            <div className={'formElementContainer'}>
                <p className={'label'}>Shape</p> 
            </div>
            <div className={'formElementContainer'}>
                <p className={'label'}>1# Attack</p> 
            </div>
            <div className={'formElementContainer'}>
                <p className={'label'}>2+# Attack</p> 
            </div>
        </div>
        <FormChoice level={3} setForm={setFormLevel3}/>
        <FormChoice level={5} setForm={setFormLevel5}/>
        <FormChoice level={7} setForm={setFormLevel7}/>
        <FormChoice level={9} setForm={setFormLevel9}/>
        <FormChoice level={11} setForm={setFormLevel11}/>
        <FormChoice level={13} setForm={setFormLevel13}/>
        <FormChoice level={15} setForm={setFormLevel15}/>
        <FormChoice level={17} setForm={setFormLevel17}/>
        <FormChoice level={19} setForm={setFormLevel19}/>
    </div>
    );
}

const getFormAttack = (level: number, formName: string, attackName: string, shapeName?: string) => {
    let diceSize = 0;
    let diceAmount = 0;
    const traits = [];
    let bonusDmg = 0;
    let hitBonusDmgDice = 0;
    let hitBonusAmountOfDice = 0;
    let criticalBonusDmgDice = 0;
    let criticalBonusAmountOfDice = 0;
    let deadlyDiceSize = 0;
    let deadlyAmountOfDice = 0;
    
    let attackEntry:any = {};

    if (formName === 'wildmorph') {
        attackEntry = Classes['druid']['forms'][formName][getHighestLevelForm(formName, level).toString()][attackName];
    } else if (shapeName !== undefined && Classes['druid']['forms'][formName]['shapes'][shapeName] !== undefined) {
        attackEntry = Classes['druid']['forms'][formName]['shapes'][shapeName][attackName];
    }

    if (attackEntry === undefined) {
        attackEntry = {};
    }

    Object.keys(attackEntry).forEach((entry) => {
        switch (entry.toLocaleString()) {
            case 'diceSize': 
                diceSize = attackEntry[entry];
            break;
            case 'diceAmount': 
                diceAmount = attackEntry[entry];
            break;
            case 'traits': 
                attackEntry[entry].forEach((trait) => {
                    traits.push(trait);
                });
            break;
            case 'bonusDmg': 
                bonusDmg = attackEntry[entry];
            break;
            case 'hitBonusDmgDice': 
                hitBonusDmgDice = attackEntry[entry];
            break;
            case 'hitBonusAmountOfDice': 
                hitBonusAmountOfDice = attackEntry[entry];
            break;
            case 'criticalBonusDmgDice': 
                criticalBonusDmgDice = attackEntry[entry];
            break;
            case 'criticalBonusAmountOfDice': 
                criticalBonusAmountOfDice = attackEntry[entry];
            break;
            case 'deadlyDiceSize': 
                deadlyDiceSize = attackEntry[entry];
            break;
            case 'deadlyAmountOfDice': 
                deadlyAmountOfDice = attackEntry[entry];
            break;
        }
    });

    const formAttack = {
        diceSize: diceSize,
        diceAmount: diceAmount,
        traits: traits,
        bonusDmg: bonusDmg,
        hitBonusDmgDice: hitBonusDmgDice,
        hitBonusAmountOfDice: hitBonusAmountOfDice,
        criticalBonusDmgDice: criticalBonusDmgDice,
        criticalBonusAmountOfDice: criticalBonusAmountOfDice,
        deadlyDiceSize: deadlyDiceSize,
        deadlyAmountOfDice: deadlyAmountOfDice
    }

    return formAttack;
}


const getHighestLevelForm = (formName:string, level: number) => { 
    let highestLevelFound = 1;
    Object.keys(Classes['druid']['forms'][formName]).forEach((entry) => {
        const parsedEntry = parseInt(entry);
        if (!isNaN(parsedEntry) && parsedEntry >= highestLevelFound && parsedEntry <= level ) {
            highestLevelFound = parsedEntry;
        }
    });
    return highestLevelFound;
}

const getFormChoice = (level: number, formName: string, primaryAttack: string, secondaryAttack: string, shapeName?: string) => {
    const primaryFormAttack = getFormAttack(level, formName, primaryAttack, shapeName);
    const secondFormAttack = getFormAttack(level, formName, secondaryAttack, shapeName);
    let attackModifier = 0;
    let damageBonus = 0;
    let doubleDices = false;
    let increaseBaseDiceNumber = 0;
    let wildMorph = formName === 'wildmorph';

    if (!wildMorph && shapeName !== undefined) {
        const highestLevelFound = getHighestLevelForm(formName, level);
        Object.keys(Classes['druid']['forms'][formName][highestLevelFound.toLocaleString()]).forEach((entry) => {    
            switch (entry.toLocaleString()) {
                case 'attackModifier' : 
                    attackModifier = Classes['druid']['forms'][formName][highestLevelFound.toLocaleString()][entry];
                break;
                case 'damageBonus' : 
                    damageBonus = Classes['druid']['forms'][formName][highestLevelFound.toLocaleString()][entry];
                break;
                case 'doubleDices' : 
                    doubleDices = Classes['druid']['forms'][formName][highestLevelFound.toLocaleString()][entry];
                break;
                case 'increaseBaseDiceNumber' : 
                    increaseBaseDiceNumber = Classes['druid']['forms'][formName][highestLevelFound.toLocaleString()][entry];
                break;
            }
        });
    }

    const form:Form = {
        formName: formName,
        shapesName: shapeName ? shapeName : '',
        level: level,
        primaryAttack: primaryFormAttack,
        secondaryAttack: secondFormAttack,
        attackModifier: attackModifier,
        damageBonus: damageBonus,
        doubleDices: doubleDices,
        increaseBaseDiceNumber: increaseBaseDiceNumber,
        wildMorph: wildMorph,
    };

    return form;
};

export const FormChoice = (props: FormProps) => {
    const { setForm, level } = props;
    const [currentFormName, setCurrentFormName] = useState<string>('wildmorph');
    const [currentShapesName, setCurrentShapesName] = useState<string>();
    const [currentPrimaryAttack, setCurrentPrimaryAttack] = useState<string>();
    const [currentSecondaryAttack, setCurrentSecondaryAttack] = useState<string>();
    const [update, forceUpdate] = React.useState({});

    useEffect(() => {
        if (currentPrimaryAttack !== undefined) {
            const newForm = getFormChoice(level, currentFormName, currentPrimaryAttack, currentSecondaryAttack, currentShapesName);
            setForm(newForm);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFormName, currentShapesName, currentPrimaryAttack, currentSecondaryAttack, update]);

    useEffect(() => {
        setCurrentShapesName(undefined);
        setCurrentPrimaryAttack(undefined);
        setCurrentSecondaryAttack(undefined);
    }, [currentFormName]);

    useEffect(() => {
        setCurrentPrimaryAttack(undefined);
        setCurrentSecondaryAttack(undefined);
    }, [currentShapesName]);

    useEffect(() => {
        if (currentPrimaryAttack === undefined || (currentFormName === 'wildmorph' && level < 10)) {
            setCurrentSecondaryAttack(currentPrimaryAttack);
        }
    }, [currentFormName, currentPrimaryAttack, level]);

    const getAttackChoices = (formName: string, shapeName: string, level: number, primary: boolean) => {
        const attacksName:string[] = [];
    
        if(formName !== 'wildmorph' && shapeName !== undefined && Classes['druid']['forms'][formName]['shapes'][shapeName] !== undefined) {
            Object.keys(Classes['druid']['forms'][formName]['shapes'][shapeName]).forEach((attackName) => {
               attacksName.push(attackName);
            });
        } else if (formName === 'wildmorph') {
            const highestLevelFound = getHighestLevelForm(formName, level);

            if (primary || Classes['druid']['forms'][formName][highestLevelFound.toString()]['numberOfAvailableAttacks'] >= 2) {
                Object.keys(Classes['druid']['forms'][formName][highestLevelFound.toString()]).forEach((entry) => {
                    if (entry !== 'numberOfAvailableAttacks') {
                        attacksName.push(entry);
                    }
                });
            }
        }

        if (primary && currentSecondaryAttack === undefined && attacksName.length > 0) {
            setCurrentSecondaryAttack(attacksName[0])
        }

        if (primary && currentPrimaryAttack === undefined && attacksName.length > 0) {
            setCurrentPrimaryAttack(attacksName[0])
        }
        
        return attacksName
    }; 

    const getIsAgile = (formName: string, shapesName: string, level: number, attackName:string) => {
        if (currentFormName === 'wildmorph') {
            const highestLevelFound = getHighestLevelForm(formName, level);
            const attack = Classes['druid']['forms'][formName][highestLevelFound.toString()][attackName];
            if (attack !== undefined && attack['traits'] !== undefined) {
                return attack['traits'].includes('agile');
            }

        } else if (shapesName !== undefined) {
            const shape = Classes['druid']['forms'][formName]['shapes'][shapesName];

            if (shape !== undefined && shape[attackName]['traits'] !== undefined) {
                return shape[attackName]['traits'].includes('agile');
            }
        }

        return false;
    }
    
    const getFormChoiceShapes = (formName: string) => {
        const shapesName:string[] = [];

        if(formName !== 'wildmorph') {
            Object.keys(Classes['druid']['forms'][formName]['shapes']).forEach((shapeName) => {
                shapesName.push(shapeName);
            });
        }

        if (currentShapesName === undefined && shapesName.length > 0) {
            setCurrentShapesName(shapesName[0]);
        }
        return shapesName
    }; 
    
    
    const getFormChoiceNames = (level: number) => {
        const formNames:string[] = [];
    
        Object.keys(Classes['druid']['forms']).forEach((formName) => {
            if(Classes['druid']['forms'][formName]['accessLevel'] <= level) {
                formNames.push(formName);
            }
        })
    
        return formNames
    }; 

    return (
        <div className={'elementContainer'}>
            <div className={'oneEightElement'}>
                <p className={'label formLevelLabel'}>{level + '#:'}</p>
            </div>
            <div className={'formElementContainer'} >
                <div className={'inputContainer'}>
                    <select  style={{width: 77}} onChange={(event) => { 
                        setCurrentFormName(event.target.value)
                    }}>
                    {
                        getFormChoiceNames(level).map((name, index) => {
                            return (
                                <option key={name + '_' + index} value={name}>
                                    { capitalize(name).replace('_', ' ') }
                                </option>
                            )
                        })
                    }
                    </select>
                </div>
            </div>
            <div className={'formElementContainer'} >
                <div className={'inputContainer'}>
                    <select  style={{width: 77}} onChange={(event) => { 
                        setCurrentShapesName(event.target.value)
                        forceUpdate({});
                    }}>
                    {
                        getFormChoiceShapes(currentFormName).map((name, index) => {
                            return (
                                <option key={name + '_' + index} value={name}>
                                    { capitalize(name).replace('_', ' ') }
                                </option>
                            )
                        })
                    }
                    </select>
                </div>
            </div>
            <div className={'formElementContainer'} >
                <div className={'inputContainer'}>
                    <select  style={{width: 77}} value={currentPrimaryAttack} onChange={(event) => { 
                        setCurrentPrimaryAttack(event.target.value);
                    }}>
                    {
                        getAttackChoices(currentFormName, currentShapesName, level, true).map((name, index) => {
                            return (
                                <option key={name + '_' + index} value={name}>
                                    { capitalize(name).replace('_', ' ') + (getIsAgile(currentFormName, currentShapesName, level, name) ? ' (agile)' : '') }
                                </option>
                            )
                        })
                    }
                    </select>
                </div>
            </div>
            <div className={'formElementContainer'} >
                <div className={'inputContainer'}>
                    <select style={{width: 77}} value={currentSecondaryAttack} onChange={(event) => { 
                        setCurrentSecondaryAttack(event.target.value);
                    }}>
                        {
                            getAttackChoices(currentFormName, currentShapesName, level, false).map((name, index) => {
                                return (
                                    <option key={name + '_' + index + '_2'} value={name}>
                                        { capitalize(name).replace('_', ' ')  + (getIsAgile(currentFormName, currentShapesName, level, name) ? ' (agile)' : '')}
                                    </option>
                                )
                            })
                        }
                        {
                            currentSecondaryAttack && getAttackChoices(currentFormName, currentShapesName, level, false).length === 0 &&
                                <option key={currentSecondaryAttack + '_0_2'} value={currentSecondaryAttack}>
                                    { capitalize(currentSecondaryAttack).replace('_', ' ')  + (getIsAgile(currentFormName, currentShapesName, level, currentSecondaryAttack) ? ' (agile)' : '')}
                                </option>
                        }
                    </select>
                </div>
            </div>
        </div>
    )
}

export default FormChoices;