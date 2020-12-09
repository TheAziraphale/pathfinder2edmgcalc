import React, { useCallback, useEffect, useState } from 'react';
import Weapons from '../jsons/Weapons.json';
import './Components.css';

interface Props {
    setWeaponChoice: (weaponChoice: Weapon) => void;
}

export interface Weapon {
    weaponDiceSize: number;
    deadlyDiceSize?: number;
    fatalDiceSize?: number;
    weaponType: string;
    category: string;
    group: string;
    traitsSupported: string[];
}

const WeaponChoice = (props: Props) => {
    const { setWeaponChoice } = props;
    const [weaponType, setWeaponType] = useState<string>('meleeWeapons');
    const [category, setCategory] = useState<string>('Simple');
    const [group, setGroup] = useState<string>();
    const [weaponName, setWeaponName] = useState<string>();

    useEffect(() => {
        if (weaponName) {
            Weapons[weaponType].forEach((entry) => {
                if(entry['name'] === weaponName) {
                    let weaponDiceSize:number = 0;
                    let deadlyDiceSize:number;
                    let fatalDiceSize:number;
                    let traitsSupported: string[] = [];

                    setWeaponChoice({
                        weaponDiceSize,
                        deadlyDiceSize,
                        fatalDiceSize,
                        weaponType,
                        category,
                        group,
                        traitsSupported,
                    });
                }
            });
        }
    }, [category, group, setWeaponChoice, weaponName, weaponType])

    const getWeaponList = useCallback(() => {
        let weaponArray = [];

        Weapons[weaponType].forEach((entry) => {
            if(entry['category'] === category && entry['group'] === group) {
                weaponArray.push(entry['name']);
            }
        });
        return weaponArray;
    },[weaponType, category, group]);

    const getGroupList = useCallback(() => {
        let weaponGroup = [];

        Weapons[weaponType].forEach((entry) => {
            if(entry['category'] === category) {
                if(!weaponGroup.includes(entry['group'])) {
                    console.log(entry['group']);
                    weaponGroup.push(entry['group'])
                }
            }
        });
        return weaponGroup;
    },[weaponType, category]);

    return (
        <div className={'inputContainer'}>
            <select style={{ marginRight: 5}} onChange={(event) => { 
                setWeaponType(event.target.value);
            }}>
                <option value={'meleeWeapons'}>Melee</option>
                <option value={'rangeWeapons'}>Ranged</option>
            </select>
            <select style={{ marginRight: 5}} onChange={(event) => { 
                setCategory(event.target.value);
            }}>
                <option value={'Simple'}>Simple</option>
                <option value={'Martial'}>Martial</option>
                <option value={'Advanced'}>Advanced</option>
            </select>
            { weaponType === 'meleeWeapons' && (
                <select style={{ marginRight: 5}} onChange={(event) => { 
                    setGroup(event.target.value);
                }}>
                    {getGroupList().map(group => {
                        <option key={group} value={group}>
                            { group }
                        </option>
                    })}
                </select>
            )}
            { weaponType === 'rangeWeapons' && (
                <select style={{ marginRight: 5}} onChange={(event) => { 
                    setGroup(event.target.value);
                }}>
                    <option value={'Bow'}>Bow</option>
                    <option value={'Dart'}>Dart</option>
                    <option value={'Sling'}>Sling</option>
                </select>
            )}
            <select onChange={(event) => { 
                setWeaponName(event.target.value)
            }}>
                {getWeaponList().map(weapon => (
                    <option key={weapon} value={weapon}>
                        { weapon }
                    </option>
                ))}
            </select>
        </div>
    );
}

export default WeaponChoice;