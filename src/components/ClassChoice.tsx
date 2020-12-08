import React, { useEffect, useState } from 'react';
import './DMGCalculator.css';

interface Props {
    setClassChoice: (classChoice: string) => void;
    name: string;
}

interface SpecProps {
    setSpecChoice: (classChoice: string) => void;
    classId: string;
    name: string;
}

interface ClassOption {
    name: string;
    id: string;
}

type ClassTypes = {
    [key: string]: ClassOption
}

const classChoices: ClassTypes = {
    '-': {
        id: "-",
        name: "-"
    },
    'barbarian': {
        id: "barbarian",
        name: "Barbarian"
    },
    'fighter': {
        id: "fighter",
        name: "Fighter"
    },
    'investigator': {
        id: "investigator",
        name: "Investigator"
    },
    'ranger': {
        id: "ranger",
        name: "Ranger"
    },
    'rogue': {
        id: "rogue",
        name: "Rogue"
    },
    'swashbuckler': {
        id: "swashbuckler",
        name: "Swashbuckler"
    }
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

const ClassChoice = (props: Props) => {
    const { name, setClassChoice } = props;
    const [currentClass, setCurrentClass] = useState<string>('-');
    const [hoverText, setHoverText] = useState<string>('');

    useEffect(() => {
        switch (currentClass) {
            case 'barbarian':
                setHoverText('Assumes that you are raging');
                break;
            case 'fighter':
                break;
            case 'investigator':
                setHoverText('Assumes that the first attack is with Devise a Stratagem');
                break;
            case 'ranger':
                setHoverText('Assumes that you have marked your target');
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
            <div className={'labelContainer'}>
                <p className={'labelName'}>{name}</p>
            </div>
            <select onChange={(event) => { 
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
    const { name, setSpecChoice, classId } = props;
    
    return (
        <div className={'inputContainer'}>
            <div className={'labelContainer'}>
                <p className={'labelName'}>{name}</p>
            </div>
            <select onChange={(event) => { 
                setSpecChoice(event.target.value)
            }}>
                {classId === 'barbarian' && Object.keys(barbarianSpecs).map(key => (
                    <option key={key} value={key}>
                        { barbarianSpecs[key].name }
                    </option>
                ))}
                {classId === 'ranger' && Object.keys(rangerSpecs).map(key => (
                    <option key={key} value={key}>
                        { rangerSpecs[key].name }
                    </option>
                ))}
            </select>
        </div>
    );
}

export default ClassChoice;