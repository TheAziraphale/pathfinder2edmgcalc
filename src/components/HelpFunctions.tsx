//import React from 'react';
import Classes from '../jsons/Classes.json';
import Bonuses from '../jsons/Bonuses.json';
import PropertyRunes from '../jsons/PropertyRunes.json';
import { PCState } from './PCClass';
import { Weapon, WeaponRunes } from './WeaponState';
import { AttackSelection } from './AttacksChoice';
import { Form } from './FormChoices';
import { Cantrip } from './CantripChoice';

const getClosestDruidForm = (level:number, druidForms: Form[]) => {
    let currentForm: Form = undefined;

    if (druidForms && druidForms.length === 10) {
        return druidForms[Math.max(Math.floor((level - 1) / 2),0)]
    }

    return currentForm;
}

export const getTotalHitBonus = (level: number, 
        classChoice: string, 
        classSpec: string, 
        applyPlusHitRunes: boolean,
        hitBonus: number,
        hitAbilityBonus: number,
        druidForms?: Form[],
    ) => {

    if(Classes !== undefined && getClassJson(classChoice, classSpec) !== undefined) {
        const classHitBonus = getClassJson(classChoice, classSpec).hit[level];
        const enchantmentHitBonus = applyPlusHitRunes ? Bonuses['EnchantingBonuses'].hitBonus[level] : 0;
        const totalHitChance = classHitBonus + enchantmentHitBonus + hitAbilityBonus + level + hitBonus;

        if (classChoice === 'druid') {
            const highestAccessedForm = getClosestDruidForm(level, druidForms);

            if (highestAccessedForm && !highestAccessedForm.wildMorph) {
                if ((highestAccessedForm.attackModifier) < (totalHitChance + 2)) {
                    return totalHitChance + 2;
                } else {
                    return highestAccessedForm.attackModifier;
                }
            }
        } 

        return totalHitChance;
    }

    return 0;
};

export const getClassJson = (classChoice: string, classSpec: string) => {
    if (classChoice === 'barbarian' || classChoice === 'cleric' || classChoice === 'oracle' || classChoice === 'ranger') {
        return Classes[classChoice][classSpec];
    }

    return Classes[classChoice];
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

export const getDmgFromAbility = (currentPCState: PCState, level: number, weapon?: Weapon, overrideStat?: number) => {
    let dmgFromAbility = getAbilityBonus(level, overrideStat !== undefined ? overrideStat : getDamageStat(weapon.traits.finesse, currentPCState.canUseDexForDmg, currentPCState.stats.dexterity, currentPCState.stats.strength));

    if(weapon !== undefined) {
        if (weapon.type === 'Ranged') {
            dmgFromAbility = weapon.rangedDmgBonus === 'propulsive' ?  Math.floor(dmgFromAbility/2) : weapon.rangedDmgBonus === 'thrown' ? dmgFromAbility : 0;
        }
}

    return dmgFromAbility;
}

export const getClassBonusDmg = (currentPCState: PCState, level: number, lastAttack?: boolean, attack?: number) => {
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

    if (currentPCState.classSpec === 'dragon' && currentPCState.dragonRoar && level >= 6 && attack === 1) {
        classBonusDmg += 4;
    }

    if (currentPCState.classSpec === 'gorilla' && currentPCState.gorillaPound && level >= 6 && attack === 1) {
        classBonusDmg += 3 * currentPCState.gorillaFrightened;
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

export const getPolymorphShape = (currentPCState: PCState, level: number) => {
    if (currentPCState.classChoice === 'druid') {
        const highestAccessedForm = getClosestDruidForm(level, currentPCState.druidForms);

        if (highestAccessedForm && !highestAccessedForm.wildMorph) {
            return true;
        }
    } 
    return false;
};

export const getClassDmg = (currentPCState: PCState, level: number, attack: number) => {
    if (currentPCState.classChoice === 'druid') {
        const highestAccessedForm = getClosestDruidForm(level, currentPCState.druidForms);

        if (highestAccessedForm && !highestAccessedForm.wildMorph) {
            return highestAccessedForm.damageBonus + (attack === 1 ? highestAccessedForm.primaryAttack.bonusDmg : highestAccessedForm.secondaryAttack.bonusDmg)
        }
    } 

    const classJson = getClassJson(currentPCState.classChoice, currentPCState.classSpec);
    return classJson.dmg[level]
}

const getSpellLevel = (level:number) => {
    return Math.ceil(level / 2);
}

const getEmptySpellEffect = () => {
    return {
        diceAmount: 0,
        diceSize: 0,
        extraCritDmg: 0,
        splashDmg: 0,
        abilityBoost: false,
        extraCritDmgDiceAmount: 0,
        extraCritDmgDiceSize: 0,
    };
}

const getUpgradedEffect = (normalEffect: any, heightenedEffect: any) => {
    normalEffect.diceAmount += heightenedEffect.diceAmount !== undefined ? heightenedEffect.diceAmount : normalEffect.diceAmount;
    normalEffect.diceSize = heightenedEffect.diceSize !== undefined ? heightenedEffect.diceSize : normalEffect.diceSize;
    normalEffect.extraCritDmg += heightenedEffect.extraCritDmg !== undefined ? heightenedEffect.extraCritDmg : normalEffect.extraCritDmg;
    normalEffect.splashDmg += heightenedEffect.splashDmg !== undefined ? heightenedEffect.splashDmg : normalEffect.splashDmg;
    normalEffect.abilityBoost = heightenedEffect.abilityBoost !== undefined ? heightenedEffect.abilityBoost : normalEffect.abilityBoost;
    normalEffect.extraCritDmgDiceAmount += heightenedEffect.extraCritDmgDiceAmount !== undefined ? heightenedEffect.extraCritDmgDiceAmount : normalEffect.extraCritDmgDiceAmount;
    normalEffect.extraCritDmgDiceSize = heightenedEffect.extraCritDmgDiceSize !== undefined ? heightenedEffect.extraCritDmgDiceSize : normalEffect.extraCritDmgDiceSize;
    return normalEffect
}

export const getBestCantripSpellLevel = (cantripSpell: Cantrip, level:number) => {
    let bestEffect = JSON.parse(JSON.stringify(cantripSpell.standardEffect)) ;
    let spellLevel = getSpellLevel(level);
    let heightenedEffect;

    if (spellLevel > 1) {
        heightenedEffect = cantripSpell.heightenedEffects['+1'];
        if (heightenedEffect !== undefined) {
            for (let i = spellLevel; i > 1; i--) {
                bestEffect = getUpgradedEffect(bestEffect, heightenedEffect);
            }
        } else {
            heightenedEffect = cantripSpell.heightenedEffects['+2'];
            if (heightenedEffect !== undefined && spellLevel > 2) {
                for (let i = spellLevel; i > 2; i -= 2) {
                    bestEffect = getUpgradedEffect(bestEffect, heightenedEffect);
                }
                bestEffect = getUpgradedEffect(bestEffect, heightenedEffect);
            } else {
                heightenedEffect = cantripSpell.heightenedEffects['+3'];
                if (heightenedEffect !== undefined && spellLevel > 3) {
                    for (let i = spellLevel; i > 3; i -= 3) {
                        bestEffect = getUpgradedEffect(bestEffect, heightenedEffect);
                    }
                } else {
                    heightenedEffect = cantripSpell.heightenedEffects['+4'];
                    if (heightenedEffect !== undefined && spellLevel > 4) {
                        for (let i = spellLevel; i > 4; i -= 4) {
                            bestEffect = getUpgradedEffect(bestEffect, heightenedEffect);
                        }
                    } 
                }
            }
        }
        
        if (heightenedEffect === undefined) {
            //let bestFoundHeighening = druidForms[Math.max(Math.floor((level - 1) / 2),0)]
            let foundIncrease = false
            while (spellLevel > 1 && !foundIncrease) {
                heightenedEffect = cantripSpell.heightenedEffects[spellLevel.toFixed()];
                if (heightenedEffect !== undefined) {
                    bestEffect = getUpgradedEffect(getEmptySpellEffect(), heightenedEffect);
                    foundIncrease = true;
                }
                spellLevel --;
            }
        }
    }

    return bestEffect;
}

export const getAvgSpellDmg = (currentPCState: PCState, cantrip: Cantrip, crit:boolean, level:number, targets: number, splashTargets: number) => {
    let bestEffect = getBestCantripSpellLevel(cantrip, level);
    let bonusDmg = bestEffect.abilityBoost ? getDmgFromAbility(currentPCState, level, undefined, currentPCState.stats.spellcastingStat) : 0;

    let splashBonusDmg = bestEffect.splashDmg * splashTargets;


    if (crit) {
        let dmg = ((bestEffect.diceSize/2 + 0.5) * bestEffect.diceAmount + bonusDmg) * 2;

        dmg += splashBonusDmg;
        dmg += bestEffect.extraCritDmg;

        if (bestEffect.extraCritDmgDiceAmount > 0 && bestEffect.extraCritDmgDiceSize > 0) {
            dmg += (bestEffect.extraCritDmgDiceSize/2 + 0.5) * bestEffect.extraCritDmgDiceAmount;
        }

        return dmg * targets;
    } else {
        let dmg = (bestEffect.diceSize/2 + 0.5) * bestEffect.diceAmount + bonusDmg;
        
        dmg += splashBonusDmg;
        dmg += bestEffect.extraCritDmg;

        return dmg* targets;
    }
}

export const getAvgDmg = (currentPCState: PCState, weapon: Weapon, crit:boolean, level:number, lastAttack?: boolean, attack?: number) => {

    let numberOfDice = weapon.runes.striking ? Bonuses['EnchantingBonuses'].striking[level] + 1 : 1;
    let bonusDmg:number = getDmgFromAbility(currentPCState, level, weapon);

    if (currentPCState.classSpec === 'tiger' && currentPCState.tigerSlash && level >= 6 && crit && attack === 1) {
        numberOfDice += level >= 14 ? 3 : 2;
        bonusDmg *= 2;
    }

    bonusDmg += getClassDmg(currentPCState, level, attack);
    bonusDmg += getClassBonusDmg(currentPCState, level, lastAttack, attack);
    bonusDmg += getDmgFromWeaponTraits(weapon, level, attack);
    bonusDmg += currentPCState.dmgBonus;

    const deadlyProgression = Bonuses['DeadlyProgression'].diceAmount[level];

    let currentDiceSize = weapon.dices.diceSize;
    let extraClassDmg = 0;

    if (currentPCState.classChoice === 'druid') {
        const highestAccessedForm = getClosestDruidForm(level, currentPCState.druidForms);
        if (highestAccessedForm) {
            let currentAttack = attack === 1 ? highestAccessedForm.primaryAttack : highestAccessedForm.secondaryAttack;
            if (!highestAccessedForm.wildMorph) {
                numberOfDice = currentAttack.diceAmount;
                numberOfDice += highestAccessedForm.doubleDices ? numberOfDice : highestAccessedForm.increaseBaseDiceNumber ? 1 : 0;
                let dmg = ((currentAttack.diceSize/2 + 0.5) * numberOfDice) + currentAttack.bonusDmg + highestAccessedForm.damageBonus;
                let dmgExtraHit = ((currentAttack.hitBonusDmgDice/2 + 0.5) * (highestAccessedForm.doubleDices ? currentAttack.hitBonusAmountOfDice *2 : currentAttack.hitBonusAmountOfDice));

                if (crit) {
                    let dmgExtraCrit = (currentAttack.criticalBonusDmgDice/2 + 0.5 * (highestAccessedForm.doubleDices ? currentAttack.criticalBonusAmountOfDice *2 : currentAttack.criticalBonusAmountOfDice));
                    let dmgExtraDeadly = (currentAttack.deadlyDiceSize/2 + 0.5 * ((highestAccessedForm.doubleDices ? currentAttack.deadlyAmountOfDice *2 : currentAttack.deadlyAmountOfDice)) * deadlyProgression);
                    return (dmg *2) + dmgExtraHit + dmgExtraDeadly + dmgExtraCrit;
                } else {
                    return dmg + dmgExtraHit;
                }
            } else if (highestAccessedForm) {
                currentDiceSize = currentAttack.diceSize.toFixed();
                extraClassDmg = ((currentAttack.hitBonusDmgDice/2 + 0.5) * (highestAccessedForm.doubleDices ? currentAttack.hitBonusAmountOfDice *2 : currentAttack.hitBonusAmountOfDice));
            }
        }
    } 

  
    if (crit) {
        let dmg = ((weapon.dices.fatalDiceSize === '-' ? 
        parseInt(currentDiceSize)/2 + 0.5 : 
        parseInt(weapon.dices.fatalDiceSize)/2 + 0.5) * numberOfDice + bonusDmg) * 2;

        if(weapon.dices.fatalDiceSize !== '-') {
            dmg += parseInt(weapon.dices.fatalDiceSize)/2 + 0.5;
        }

        if(weapon.dices.deadlyDiceSize !== '-') {
            dmg += (parseInt(weapon.dices.deadlyDiceSize)/2 + 0.5) * deadlyProgression;
        }

        dmg += getExtraDamageFromPropertyRunes(level, crit, weapon.runes);    
        
        dmg += extraClassDmg*2;
        return dmg;
    } else {
        bonusDmg += getExtraDamageFromPropertyRunes(level, crit, weapon.runes);
        bonusDmg += extraClassDmg;
        return (parseInt(currentDiceSize)/2 + 0.5) * numberOfDice + bonusDmg;
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
    
    if (currentPCState.classChoice === 'druid') {
        const highestAccessedForm = getClosestDruidForm(level, currentPCState.druidForms);

        if (highestAccessedForm !== undefined) {
            if (attackSelection.map === '2') {
                return highestAccessedForm.secondaryAttack.traits.includes('agile') ? -4 : -5;
            } else if (attackSelection.map === '3') {
                return highestAccessedForm.secondaryAttack.traits.includes('agile') ? -8 : -10;
            }
        }
    } 

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

const getAttackChancesInternal = (difference: number, critRange: number) => {    
    let criticalHitChance: number = 0;
    let hitChance: number = 0;
    let missChance: number = 0;
    let criticalFailureChance: number = 0;

    for(let diceResult = 1; diceResult <= 20; diceResult++) {
        if(difference + diceResult >= 10) {
            if (diceResult === 1) {
                hitChance += 5;
            }
            else {
                criticalHitChance += 5;
            }
        } else if (difference + diceResult >= 0) {
            if (diceResult >= critRange) {
                criticalHitChance += 5;
            } if (diceResult === 1) {
                missChance += 5;
            }
            else {
                hitChance += 5;
            }
        } else if (difference + diceResult >= -10) {
            if (diceResult >= critRange) {
                hitChance += 5;
            } if (diceResult === 1) {
                criticalFailureChance += 5;
            }
            else {
                missChance += 5;
            }
        } else {
            if (diceResult >= critRange) {
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

export const getEnemySaveChance = (currentPCState: PCState, level: number, enemySaveMod: number, saveJson: any[]) => {
    let saveAbilityBonus = getAbilityBonus(level, currentPCState.stats.spellcastingStat);
    let enemyTotalCheckChance = saveJson[level] + enemySaveMod;

    const spellDC = 10 + level + saveAbilityBonus + getClassJson(currentPCState.classChoice, currentPCState.classSpec)['spellDC'][level];
    const difference:number = enemyTotalCheckChance - spellDC;
    
    return getAttackChancesInternal(difference, 20);
}

export const getSpellAttackChance = (currentPCState: PCState, level: number, enemyAcMod: number, acJson: any[], spellcastingCrit: number) => {
    let hitAbilityBonus = getAbilityBonus(level, currentPCState.stats.spellcastingStat);
    let totalHitChance = getTotalHitBonus(level, currentPCState.classChoice, currentPCState.classSpec, false, currentPCState.hitBonus, hitAbilityBonus, currentPCState.druidForms);

    const enemyAC = acJson[level] + enemyAcMod;
    const difference:number = totalHitChance - enemyAC;

    return getAttackChancesInternal(difference, spellcastingCrit);
}

export const getAttackChances = (currentPCState: PCState, weapon: Weapon, attackSelection: AttackSelection, attack: number, level:number, enemyAcMod: number, acJson: any[]) => {
    let hitAbilityBonus = getAbilityBonus(level, getHitStat(weapon.traits.finesse, currentPCState.stats.dexterity, currentPCState.stats.strength, weapon.type));
    if ((attack === 1 && currentPCState.classChoice === 'investigator') && currentPCState.deviseAStratagem) {
        hitAbilityBonus = getAbilityBonus(level, currentPCState.stats.intelligence);
    }
    let totalHitChance = getTotalHitBonus(level, currentPCState.classChoice, currentPCState.classSpec, weapon.runes.hit, currentPCState.hitBonus, hitAbilityBonus, currentPCState.druidForms);

    if(!currentPCState.ignoreMAP) {
        totalHitChance += getMAP(currentPCState, level, attackSelection);
    }

    const enemyAC = acJson[level] + enemyAcMod;
    const difference:number = totalHitChance - enemyAC;
    
    return getAttackChancesInternal(difference, weapon.critRange);
}

