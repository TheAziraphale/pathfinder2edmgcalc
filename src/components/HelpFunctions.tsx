//import React from 'react';
import ClassChoices from '../jsons/ClassChoices.json';
import Bonuses from '../jsons/Bonuses.json';
import PropertyRunes from '../jsons/PropertyRunes.json';
import { PCState } from './PCClass';
import { Weapon, WeaponRunes } from './WeaponState';
import { AttackSelection } from './AttacksChoice';

export const getTotalHitBonus = (level: number, 
        classChoice: string, 
        classSpec: string, 
        applyPlusHitRunes: boolean,
        hitBonus: number,
        hitAbilityBonus: number,
    ) => {
    if(ClassChoices !== undefined && getClassJson(classChoice, classSpec) !== undefined) {
        const classHitBonus = getClassJson(classChoice, classSpec).hit[level];
        const enchantmentHitBonus = applyPlusHitRunes ? Bonuses['EnchantingBonuses'].hitBonus[level] : 0;
        return classHitBonus + enchantmentHitBonus + hitAbilityBonus + level + hitBonus;
    }

    return 0;
};

export const getClassJson = (classChoice: string, classSpec: string) => {
    if (classChoice === 'barbarian') {
        return ClassChoices[classChoice][classSpec];
    } else if (classChoice === 'ranger') {
        return ClassChoices[classChoice][classSpec];
    }

    return ClassChoices[classChoice];
};

export const getAbilityBonus = (level: number, stat: number) => {
    let abilityStat = stat;
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
};

export const getDamageStat = (finesse: boolean, canUseDexForDmg: boolean, dexterity: number, strength: number) => {
    return (finesse && canUseDexForDmg && dexterity > strength) ? dexterity : strength;
}

export const getHitStat = (finesse: boolean, dexterity: number, strength: number, weaponType: string) => {
    return (finesse && dexterity > strength) || weaponType === 'Ranged' ?  dexterity : strength;
}

const RangerPrecisionDiceSize = 8;
const RogueSneakDmgDice = 6;
const SwashbucklerFinisherDmgDice = 6;
const InvestigatorPrecisionDiceSize = 6;

const getBonusDamageFromSpecificRune = (runeName: string, crit:boolean) => {
    const propRune: any = PropertyRunes['PropertyRunes'][runeName];

    if (propRune !== undefined) {
        if (crit) {
            return propRune.critDiceAmount * (propRune.critDiceSize / 2 + 0.5) + propRune.extraCritDmgDiceAmount * (propRune.extraCritDmgDiceSize / 2 + 0.5);
        } else {
            return propRune.hitDiceAmount * (propRune.hitDiceSize / 2 + 0.5)
        }
    }

    return 0;
}

export const getExtraDamageFromPropertyRunes = (level:number, crit:boolean, runes?: WeaponRunes) => {
    const enchantingBonus = Bonuses['EnchantingBonuses'].hitBonus[level];
    let extraDmg = 0;
    if(enchantingBonus >= 1 && (runes !== undefined && runes.firstPropRune !== '-') ) {
        extraDmg += getBonusDamageFromSpecificRune(runes.firstPropRune, crit);
    }

    if(enchantingBonus >= 2 && (runes !== undefined && runes.secondPropRune !== '-') ) {
        extraDmg += getBonusDamageFromSpecificRune(runes.secondPropRune, crit);
    }

    if(enchantingBonus >= 3 && (runes !== undefined && runes.thirdPropRune !== '-') ) {
        extraDmg += getBonusDamageFromSpecificRune(runes.thirdPropRune, crit);
    }

    return extraDmg;
}

export const getDmgFromAbility = (currentPCState: PCState, weapon: Weapon, level: number ) => {
    let dmgFromAbility = getAbilityBonus(level, getDamageStat(weapon.traits.finesse, currentPCState.canUseDexForDmg, currentPCState.stats.dexterity, currentPCState.stats.strength));

    if (weapon.type === 'Ranged') {
        dmgFromAbility = weapon.rangedDmgBonus === 'propulsive' ?  Math.floor(dmgFromAbility/2) : weapon.rangedDmgBonus === 'thrown' ? dmgFromAbility : 0;
    }

    return dmgFromAbility;
}

export const getClassBonusDmg = (currentPCState: PCState, level: number, lastAttack?: boolean, attack?: number ) => {
    const classJson = getClassJson(currentPCState.classChoice, currentPCState.classSpec);
    let classBonusDmg = 0;

    if (currentPCState.applySneakDmg && currentPCState.classChoice === 'rogue') {
        classBonusDmg += classJson.sneakDmgDiceAmount[level] * (RogueSneakDmgDice/2 + 0.5 );
    }

    if(currentPCState.applyPanache && currentPCState.classChoice === 'swashbuckler') {
        if(lastAttack && currentPCState.lastAttackWithFinisher) {
            classBonusDmg += classJson.panacheBonus[level] * (SwashbucklerFinisherDmgDice/2 + 0.5)
        } else {
            classBonusDmg += classJson.panacheBonus[level]
        }
    }

    if (currentPCState.rage && currentPCState.classChoice === 'barbarian') {
        classBonusDmg += classJson.rage[level];
    }

    if (currentPCState.classChoice === 'investigator' && attack === 1 && currentPCState.deviseAStratagem) {
        classBonusDmg += classJson.precisionDiceAmount[level] * (InvestigatorPrecisionDiceSize/2 + 0.5 );
    }
    
    if (currentPCState.classChoice === 'ranger' && currentPCState.classSpec === 'precision' && currentPCState.markedTarget) {
        if(attack === 1) {
            classBonusDmg += classJson.precision1AttackDice[level] * (RangerPrecisionDiceSize/2 + 0.5);
        } else if(attack === 2) {
            classBonusDmg += classJson.precision2AttackDice[level] * (RangerPrecisionDiceSize/2 + 0.5);
        } else if(attack === 3) {
            classBonusDmg += classJson.precision3AttackDice[level] * (RangerPrecisionDiceSize/2 + 0.5);
        }
    }

    return classBonusDmg;
}

export const getDmgFromWeaponTraits = (weapon: Weapon, level: number, attack?: number ) => {
    const numberOfDice = weapon.runes.striking ? Bonuses['EnchantingBonuses'].striking[level] + 1 : 1;
    let weaponBonusDmg = 0;
    if (weapon.traits.twin && attack !== 1) {
        weaponBonusDmg += numberOfDice;
    }

    if (weapon.traits.backstabber) {
        weaponBonusDmg ++;
        if (weapon.runes.hit && Bonuses['EnchantingBonuses'].hitBonus[level] >= 3) {
            weaponBonusDmg++;
        }
    }

    if (weapon.traits.forceful) {
        if(attack === 2) {
            weaponBonusDmg += numberOfDice;
        } else if (attack > 2) {
            weaponBonusDmg += numberOfDice *2;
        }
    }
    
    return weaponBonusDmg;
}

export const getClassDmg = (currentPCState: PCState, level: number) => {
    const classJson = getClassJson(currentPCState.classChoice, currentPCState.classSpec);
    return classJson.dmg[level]
}

export const getAvgDmg = (currentPCState: PCState, weapon: Weapon, crit:boolean, level:number, lastAttack?: boolean, attack?: number) => {

    const numberOfDice = weapon.runes.striking ? Bonuses['EnchantingBonuses'].striking[level] + 1 : 1;
    let bonusDmg:number = getDmgFromAbility(currentPCState, weapon, level);
    bonusDmg += getClassDmg(currentPCState, level);
    bonusDmg += getClassBonusDmg(currentPCState, level, lastAttack, attack);
    bonusDmg += getDmgFromWeaponTraits(weapon, level, attack);
    bonusDmg += currentPCState.dmgBonus;

    const deadlyProgression = Bonuses['DeadlyProgression'].diceAmount[level];
  
    if (crit) {
        let dmg = ((weapon.dices.fatalDiceSize === '-' ? 
        parseInt(weapon.dices.diceSize)/2 + 0.5 : 
        parseInt(weapon.dices.fatalDiceSize)/2 + 0.5) * numberOfDice + bonusDmg) * 2;

        if(weapon.dices.fatalDiceSize !== '-') {
            dmg += parseInt(weapon.dices.fatalDiceSize)/2 + 0.5;
        }

        if(weapon.dices.deadlyDiceSize !== '-') {
            dmg += (parseInt(weapon.dices.deadlyDiceSize)/2 + 0.5) * deadlyProgression;
        }

        dmg += getExtraDamageFromPropertyRunes(level, crit, weapon.runes);
        return dmg;
    } else {
        bonusDmg += getExtraDamageFromPropertyRunes(level, crit, weapon.runes);
        return (parseInt(weapon.dices.diceSize)/2 + 0.5) * numberOfDice + bonusDmg;
    }
}

export interface AttackChance {
    criticalHitChance: number;
    hitChance: number;
    missChance: number;
    criticalFailureChance: number;
}

export const getMAP = (currentPCState: PCState, level: number, attackSelection: AttackSelection) => {
    let mapPenalty = 0;
    const classJson = getClassJson(currentPCState.classChoice, currentPCState.classSpec);
    const weapon = attackSelection.hand === 'off' && currentPCState.offHand !== undefined ? currentPCState.offHand : currentPCState.mainHand;

    if (attackSelection.map === '2') {
        mapPenalty = (currentPCState.classChoice === 'ranger' && currentPCState.classSpec === 'flurry' && currentPCState.markedTarget ? 
        classJson.flurrySecondAttack[level]
        : -5) + ( weapon.traits.agile ? 1 : 0);
    } else if (attackSelection.map === '3') {
        mapPenalty = (currentPCState.classChoice === 'ranger' && currentPCState.classSpec === 'flurry' && currentPCState.markedTarget ? 
        classJson.flurryThirdAttack[level]
        : -10) + (weapon.traits.agile ? 2 : 0);
    }

    return mapPenalty;
}

export const getAttackChances = (currentPCState: PCState, weapon: Weapon, attackSelection: AttackSelection, attack: number, level:number, enemyAcMod: number, acJson: any[]) => {
    let criticalHitChance: number = 0;
    let hitChance: number = 0;
    let missChance: number = 0;
    let criticalFailureChance: number = 0;

    let hitAbilityBonus = getAbilityBonus(level, getHitStat(weapon.traits.finesse, currentPCState.stats.dexterity, currentPCState.stats.strength, weapon.type));
    if ((attack === 1 && currentPCState.classChoice === 'investigator') && currentPCState.deviseAStratagem) {
        hitAbilityBonus = getAbilityBonus(level, currentPCState.stats.intelligence);
    }
    let totalHitChance = getTotalHitBonus(level, currentPCState.classChoice, currentPCState.classSpec, weapon.runes.hit, currentPCState.hitBonus, hitAbilityBonus);

    if(!currentPCState.ignoreMAP) {
        totalHitChance += getMAP(currentPCState, level, attackSelection);
    }

    const enemyAC = acJson[level] + enemyAcMod;
    const difference:number = totalHitChance - enemyAC;

    for(let diceResult = 1; diceResult <= 20; diceResult++) {
        if(difference + diceResult >= 10) {
            if (diceResult === 1) {
                hitChance += 5;
            }
            else {
                criticalHitChance += 5;
            }
        } else if (difference + diceResult >= 0) {
            if (diceResult >= weapon.critRange) {
                criticalHitChance += 5;
            } if (diceResult === 1) {
                missChance += 5;
            }
            else {
                hitChance += 5;
            }
        } else if (difference + diceResult >= -10) {
            if (diceResult >= weapon.critRange) {
                hitChance += 5;
            } if (diceResult === 1) {
                criticalFailureChance += 5;
            }
            else {
                missChance += 5;
            }
        } else {
            if (diceResult >= weapon.critRange) {
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

