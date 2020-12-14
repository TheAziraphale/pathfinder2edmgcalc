//import React from 'react';
import ClassChoices from '../jsons/ClassChoices.json';
import Bonuses from '../jsons/Bonuses.json';
import PropertyRunes from '../jsons/PropertyRunes.json';
import { PCState } from './PCClass';

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

const getExtraDamageFromPropertyRunes = (level:number, crit:boolean, firstPropRune?: string, secondPropRune?: string, thirdPropRune?: string) => {
    const enchantingBonus = Bonuses['EnchantingBonuses'].hitBonus[level];
    let extraDmg = 0;
    if(enchantingBonus >= 1 && (firstPropRune !== undefined && firstPropRune !== '-') ) {
        extraDmg += getBonusDamageFromSpecificRune(firstPropRune, crit);
    }

    if(enchantingBonus >= 2 && (secondPropRune !== undefined && secondPropRune !== '-') ) {
        extraDmg += getBonusDamageFromSpecificRune(secondPropRune, crit);
    }

    if(enchantingBonus >= 3 && (thirdPropRune !== undefined && thirdPropRune !== '-') ) {
        extraDmg += getBonusDamageFromSpecificRune(thirdPropRune, crit);
    }

    return extraDmg;
}

export const getAvgDmg = (currentPCState: PCState, crit:boolean, level:number, lastAttack?: boolean, attack?: number, 
    firstPropRune?: string, secondPropRune?: string, thirdPropRune?: string) => {
    const classJson = getClassJson(currentPCState.classChoice, currentPCState.classSpec);
    const numberOfDice = currentPCState.applyStrikingRunes ? Bonuses['EnchantingBonuses'].striking[level] + 1 : 1;
    let dmgFromAbility = getAbilityBonus(level, getDamageStat(currentPCState.weaponTraits.finesse, currentPCState.canUseDexForDmg, currentPCState.stats.dexterity, currentPCState.stats.strength));

    if (currentPCState.weaponType === 'Ranged') {
        dmgFromAbility = currentPCState.rangedDmgBonus === 'propulsive' ?  Math.floor(dmgFromAbility/2) : currentPCState.rangedDmgBonus === 'thrown' ? dmgFromAbility : 0;
    }

    let bonusDmg = classJson.dmg[level] + dmgFromAbility;

    if (currentPCState.applySneakDmg && currentPCState.classChoice === 'rogue') {
        bonusDmg += classJson.sneakDmgDiceAmount[level] * (RogueSneakDmgDice/2 + 0.5 );
    }

    if(currentPCState.applyPanache && currentPCState.classChoice === 'swashbuckler') {
        if(lastAttack && currentPCState.lastAttackWithFinisher) {
            bonusDmg += classJson.panacheBonus[level] * (SwashbucklerFinisherDmgDice/2 + 0.5)
        } else {
            bonusDmg += classJson.panacheBonus[level]
        }
    }

    if (currentPCState.rage && currentPCState.classChoice === 'barbarian') {
        bonusDmg += classJson.rage[level];
    }

    if (currentPCState.classChoice === 'investigator' && attack === 1 && currentPCState.deviseAStratagem) {
        bonusDmg += classJson.precisionDiceAmount[level] * (InvestigatorPrecisionDiceSize/2 + 0.5 );
    }

    if (currentPCState.weaponTraits.twin && attack !== 1) {
        bonusDmg += numberOfDice;
    }

    if (currentPCState.weaponTraits.backstabber) {
        bonusDmg ++;
        if (currentPCState.applyPlusHitRunes && Bonuses['EnchantingBonuses'].hitBonus[level] >= 3) {
            bonusDmg++;
        }
    }

    if (currentPCState.weaponTraits.forceful) {
        if(attack === 2) {
            bonusDmg += numberOfDice;
        } else if (attack > 2) {
            bonusDmg += numberOfDice *2;
        }
    }
    
    if (currentPCState.classChoice === 'ranger' && currentPCState.classSpec === 'precision' && currentPCState.markedTarget) {
        if(attack === 1) {
            bonusDmg += classJson.precision1AttackDice[level] * (RangerPrecisionDiceSize/2 + 0.5);
        } else if(attack === 2) {
            bonusDmg += classJson.precision2AttackDice[level] * (RangerPrecisionDiceSize/2 + 0.5);
        } else if(attack === 3) {
            bonusDmg += classJson.precision3AttackDice[level] * (RangerPrecisionDiceSize/2 + 0.5);
        }
    }

    bonusDmg += currentPCState.dmgBonus;

    const deadlyProgression = Bonuses['DeadlyProgression'].diceAmount[level];
  
    if (crit) {
        let dmg = ((currentPCState.weaponDices.fatalDiceSize === '-' ? 
        parseInt(currentPCState.weaponDices.diceSize)/2 + 0.5 : 
        parseInt(currentPCState.weaponDices.fatalDiceSize)/2 + 0.5) * numberOfDice + bonusDmg) * 2;

        if(currentPCState.weaponDices.fatalDiceSize !== '-') {
            dmg += parseInt(currentPCState.weaponDices.fatalDiceSize)/2 + 0.5;
        }

        if(currentPCState.weaponDices.deadlyDiceSize !== '-') {
            dmg += (parseInt(currentPCState.weaponDices.deadlyDiceSize)/2 + 0.5) * deadlyProgression;
        }

        dmg += getExtraDamageFromPropertyRunes(level, crit, firstPropRune, secondPropRune, thirdPropRune);
        return dmg;
    } else {
        bonusDmg += getExtraDamageFromPropertyRunes(level, crit, firstPropRune, secondPropRune, thirdPropRune);
        return (parseInt(currentPCState.weaponDices.diceSize)/2 + 0.5) * numberOfDice + bonusDmg;
    }
}

interface AttackChance {
    criticalHitChance: number;
    hitChance: number;
    missChance: number;
    criticalFailureChance: number;
}

export const getAttackChances = (currentPCState: PCState, attack: number, level:number, enemyAcMod: number, acJson: any[]) => {
    const classJson = getClassJson(currentPCState.classChoice, currentPCState.classSpec);
    let criticalHitChance: number = 0;
    let hitChance: number = 0;
    let missChance: number = 0;
    let criticalFailureChance: number = 0;

    let hitAbilityBonus = getAbilityBonus(level, getHitStat(currentPCState.weaponTraits.finesse, currentPCState.stats.dexterity, currentPCState.stats.strength, currentPCState.weaponType));
    if ((attack === 1 && currentPCState.classChoice === 'investigator') && currentPCState.deviseAStratagem) {
        hitAbilityBonus = getAbilityBonus(level, currentPCState.stats.intelligence);
    }
    let totalHitChance = getTotalHitBonus(level, currentPCState.classChoice, currentPCState.classSpec, currentPCState.applyPlusHitRunes, currentPCState.hitBonus, hitAbilityBonus);

    if (!currentPCState.ignoreMAP) {
        if (attack === 2 && !currentPCState.startAtMaxMAP) {
            const secondAttackMod = (currentPCState.classChoice === 'ranger' && currentPCState.classSpec === 'flurry' && currentPCState.markedTarget ? 
            classJson.flurrySecondAttack[level]
            : -5) + (currentPCState.weaponTraits.agile ? 1 : 0);

            totalHitChance += secondAttackMod;
        } else if (attack > 2 || currentPCState.startAtMaxMAP) {
            const thirdAttackMod = (currentPCState.classChoice === 'ranger' && currentPCState.classSpec === 'flurry' && currentPCState.markedTarget ? 
            classJson.flurryThirdAttack[level]
            : -10) + (currentPCState.weaponTraits.agile ? 2 : 0);

            totalHitChance += thirdAttackMod;
        }
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
            if (diceResult >= currentPCState.critRange) {
                criticalHitChance += 5;
            } if (diceResult === 1) {
                missChance += 5;
            }
            else {
                hitChance += 5;
            }
        } else if (difference + diceResult >= -10) {
            if (diceResult >= currentPCState.critRange) {
                hitChance += 5;
            } if (diceResult === 1) {
                criticalFailureChance += 5;
            }
            else {
                missChance += 5;
            }
        } else {
            if (diceResult >= currentPCState.critRange) {
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

