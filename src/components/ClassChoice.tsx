import React, { useEffect, useState } from 'react';
import './Components.css';

interface Props {
    setClassChoice: (classChoice: string) => void;
    name?: string;
    noLabel?: boolean;
}

interface SpecProps {
    setSpecChoice: (specChoice: string) => void;
    classId: string;
    name?: string;
    noLabel?: boolean;
    allowEmpty?: boolean;
}

interface ClassOption {
    name: string;
    id: string;
}

type ClassTypes = {
    [key: string]: ClassOption
}


const onlyProficiencies = ' (only prof. & w.spec)'
const classChoices: ClassTypes = {
    '-': {
        id: "-",
        name: "-"
    },
    'primarySpellcaster': {
        id: "primarySpellcaster",
        name: "Primary Spellcaster"
    },
    'alchemist': {
        id: "alchemist",
        name: "Alchemist" + onlyProficiencies
    },
    'barbarian': {
        id: "barbarian",
        name: "Barbarian"
    },
    'bard': {
        id: "bard",
        name: "Bard" + onlyProficiencies
    },
    'champion': {
        id: "champion",
        name: "Champion"
    },
    'cleric': {
        id: "cleric",
        name: "Cleric" + onlyProficiencies
    },
    'druid': {
        id: "druid",
        name: "Druid"
    },
    'fighter': {
        id: "fighter",
        name: "Fighter"
    },
    'investigator': {
        id: "investigator",
        name: "Investigator"
    },
    'monk': {
        id: "monk",
        name: "Monk"
    },
    'oracle': {
        id: "oracle",
        name: "Oracle (curse, prof, w.spec)"
    },
    'ranger': {
        id: "ranger",
        name: "Ranger"
    },
    'rogue': {
        id: "rogue",
        name: "Rogue"
    },
    'sorcerer': {
        id: "sorcerer",
        name: "Sorcerer" + onlyProficiencies
    },
    'swashbuckler': {
        id: "swashbuckler",
        name: "Swashbuckler"
    },
    'witch': {
        id: "witch",
        name: "Witch" + onlyProficiencies
    },
    'wizard': {
        id: "wizard",
        name: "Wizard" + onlyProficiencies
    },
}

const barbarianSpecs: ClassTypes = {
    "animal": {
        id: "animalBarbarian",
        name: "Animal"
    },
    "dragon": {
        id: "dragonBarbarian",
        name: "Dragon"
    },
    "fury": {
        id: "furyBarbarian",
        name: "Fury"
    },
    "giant": {
        id: "giantBarbarian",
        name: "Giant"
    },
    "spirit": {
        id: "spiritBarbarian",
        name: "Spirit"
    },
}

const clericSpecs: ClassTypes = {
    "cloistered": {
        id: "cloisteredCleric",
        name: "Cloistered Cleric"
    },
    "warpriest": {
        id: "warpriestCleric",
        name: "Warpriest"
    },
}

const oracleSpecs: ClassTypes = {
    "ancestors": {
        id: "ancestorsOracle",
        name: "Ancestors (martialStance)"
    },
    "battle": {
        id: "battleOracle",
        name: "Battle"
    },
    "bones": {
        id: "bonesOracle",
        name: "Bones"
    },
    "cosmos": {
        id: "cosmosOracle",
        name: "Cosmos"
    },
    "flames": {
        id: "flamesOracle",
        name: "Flames"
    },
    "life": {
        id: "lifeOracle",
        name: "Life"
    },
    "lore": {
        id: "loreOracle",
        name: "Lore"
    },
    "tempest": {
        id: "tempestOracle",
        name: "Tempest"
    },
}

const rangerSpecs: ClassTypes = {
    "flurry": {
        id: "flurryRanger",
        name: "Flurry"
    },
    "precision": {
        id: "precisionRanger",
        name: "Precision"
    },
}

const monkStances: ClassTypes = {
    "custom": {
        id: "customMonk",
        name: "Custom"
    },
    "tiger": {
        id: "tigerMonk",
        name: "Tiger"
    },
    "crane": {
        id: "craneMonk",
        name: "Crane"
    },
    "dragon": {
        id: "dragonMonk",
        name: "Dragon"
    },
    "wolf": {
        id: "wolfMonk",
        name: "Wolf"
    },
    "gorilla": {
        id: "gorillaMonk",
        name: "Gorilla"
    },
    "stumbling": {
        id: "stumblingMonk",
        name: "Stumbling"
    }
}


const ClassChoice = (props: Props) => {
    const { name, setClassChoice, noLabel } = props;
    const [currentClass, setCurrentClass] = useState<string>('-');
    const [hoverText, setHoverText] = useState<string>('');

    useEffect(() => {
        switch (currentClass) {
            case 'barbarian':
                setHoverText('');
                break;
            case 'fighter':
                break;
            case 'investigator':
                setHoverText('');
                break;
            case 'ranger':
                setHoverText('');
                break;
            case 'rogue':
                setHoverText('');
                break;
            case 'swashbuckler':
                setHoverText('');
                break;
            default:
                setHoverText('');
                break;
        }
    }, [currentClass])
    
    return (
        <div className={'inputContainer'}>
            {!noLabel && (
                <div className={'labelContainer'}>
                    <p className={'labelName'}>{name}</p>
                </div>
            )}
            <select style={{maxWidth: 160}} onChange={(event) => { 
                setClassChoice(event.target.value)
                setCurrentClass(event.target.value);
            }}>
                {Object.keys(classChoices).map(key => (
                    <option key={key} value={key}>
                        { classChoices[key].name }
                    </option>
                ))}
            </select>
            { false && hoverText && (
                <img className={'exclamationImage'} style={{ color: 'red'}} src="../data/exclamationMark.png" width="21" height="21" alt={'!'} title={hoverText} />
            )}
        </div>
    );
}

export const SpecChoice = (props: SpecProps) => {
    const { name, setSpecChoice, classId, noLabel, allowEmpty } = props;
    
    return (
        <div className={'inputContainer'}>
            {!noLabel && (
                <div className={'labelContainer'}>
                    <p className={'labelName'}>{name}</p>
                </div>
            )}
            <select onChange={(event) => { 
                setSpecChoice(event.target.value)
            }}>
                {allowEmpty &&  
                    <option key={"emptyState"} value={'-'}>
                        { '-' }
                    </option>
                }
                {classId === 'barbarian' && Object.keys(barbarianSpecs).map(key => (
                    <option key={key} value={key}>
                        { barbarianSpecs[key].name }
                    </option>
                ))}
                {classId === 'cleric' && Object.keys(clericSpecs).map(key => (
                    <option key={key} value={key}>
                        { clericSpecs[key].name }
                    </option>
                ))}
                {classId === 'oracle' && Object.keys(oracleSpecs).map(key => (
                    <option key={key} value={key}>
                        { oracleSpecs[key].name }
                    </option>
                ))}
                {classId === 'ranger' && Object.keys(rangerSpecs).map(key => (
                    <option key={key} value={key}>
                        { rangerSpecs[key].name }
                    </option>
                ))}
                {classId === 'monk' && Object.keys(monkStances).map(key => (
                    <option key={key} value={key}>
                        { monkStances[key].name }
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ClassChoice;