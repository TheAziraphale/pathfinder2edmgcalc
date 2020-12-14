import React, { useEffect, useState } from 'react';
import './Components.css';

export interface AttackSelection {
    hand: string;
    map: string;   
}

interface Props {
    setAttackSelections: (value: AttackSelection []) => void;
    attackSelections: AttackSelection [];
    alwaysMaxMap: boolean;
    ignoreMap: boolean;
    haveOffHand: boolean;
}

const AttacksChoice = (props: Props) => {
    const { setAttackSelections, attackSelections, alwaysMaxMap, ignoreMap, haveOffHand } = props;
    const [hideAllChoices, setHideAllChoices] = useState<boolean>(false);

    useEffect(() => {
        let hide = false;
        if(alwaysMaxMap || ignoreMap) {
            if (!haveOffHand || (!haveOffHand && attackSelections.length === 1)) {
                hide = true;
            }
        }

        setHideAllChoices(hide);
    }, [attackSelections, alwaysMaxMap, ignoreMap, haveOffHand])
    
    if (hideAllChoices) {
        return null;
    }
    
    return (
        <div>
            <div className={'attackChoiceContainer'}>
                <div className={'oneSixthElement'}>
                    <div className={'labelContainer'}>
                        <p className={'labelName'}>{'Attack'}</p>
                        {attackSelections.map((attack, index) => {
                            if(index < 5) {
                                return(<p key={'attack_' + index} className={'numberListLabel'}>{(index + 1) + '#'}</p>)
                            } else 
                                return null;
                        })}
                    </div>
                </div>
                {haveOffHand && 
                    <div className={'oneSixthElement'}>
                        <div>
                            <p className={'labelName'}>{'Hand'}</p>
                            {attackSelections.map((attack, index) => {
                                if(index < 5) {
                                    return( <select key={'hand_' + index} defaultValue={attack.hand} onChange={(event) => { 
                                        attackSelections[index].hand = event.target.value;
                                        setAttackSelections(attackSelections);
                                    }}>
                                        <option key={'main_' + index} value={'main'}> {'Main'} </option>
                                        <option key={'offhand_' + index} value={'off'}> {'Off'} </option>
                                    </select>)
                                } else
                                    return null;
                            })}
                        </div>
                    </div>}
                {!alwaysMaxMap && !ignoreMap &&
                    <div className={'oneSixthElement'}>
                        <div>
                            <p className={'labelName'}>{'MAP'}</p>
                            {attackSelections.map((attack, index) => {
                                if(index < 5) {
                                    return( <select key={'map_' + index} defaultValue={attack.map} onChange={(event) => { 
                                        attackSelections[index].map = event.target.value;
                                        setAttackSelections(attackSelections);
                                    }}>
                                        <option key={'1_' + index} value={'1'}> {'1st'} </option>
                                        <option key={'2_' + index} value={'2'}> {'2nd'} </option>
                                        <option key={'3_' + index} value={'3'}> {'3rd'} </option>
                                    </select>)
                                } else
                                    return null;
                            })}
                        </div>
                    </div>
                }
                {attackSelections.length >= 6 && 
                    <div className={'oneSixthElement'}>
                        <div className={'labelContainer'}>
                            <p className={'labelName'}>{'Attack'}</p>
                            {attackSelections.map((attack, index) => {
                                if(index >= 5) {
                                    return(<p key={'attack_2_' + index} className={'numberListLabel'}>{(index + 1) + '#'}</p>)
                                } else 
                                    return null;
                            })}
                        </div>
                    </div>
                }
                {attackSelections.length >= 6 && 
                    <div className={'oneSixthElement'}>
                        <div>
                            <p className={'labelName'}>{'Hand'}</p>
                            {attackSelections.map((attack, index) => {
                                if(index >= 5) {
                                    return( <select key={'hand_2_' + index} defaultValue={attack.hand} onChange={(event) => { 
                                        attackSelections[index].hand = event.target.value;
                                        setAttackSelections(attackSelections);
                                    }}>
                                        <option key={'main_' + index} value={'main'}> {'Main'} </option>
                                        <option key={'off_' + index} value={'off'}> {'Off'} </option>
                                    </select>)
                                } else
                                    return null;
                            })}
                        </div>
                    </div>
                }
                {attackSelections.length >= 6 && !alwaysMaxMap && !ignoreMap &&
                    <div className={'oneSixthElement'}>
                        <div>
                            <p className={'labelName'}>{'MAP'}</p>
                            {attackSelections.map((attack, index) => {
                                if(index >= 5) {
                                    return( <select key={'map_2_' + index} defaultValue={attack.map} onChange={(event) => { 
                                        attackSelections[index].map = event.target.value;
                                        setAttackSelections(attackSelections);
                                    }}>
                                        <option key={'1_' + index} value={'1'}> {'1st'} </option>
                                        <option key={'2_' + index} value={'2'}> {'2nd'} </option>
                                        <option key={'3_' + index} value={'3'}> {'3rd'} </option>
                                    </select>)
                                } else
                                    return null;
                            })}
                        </div>
                    </div>
                }
                </div>
        </div>
    );
}

export default AttacksChoice;

/*
            <select className={'inputNumberSmall'} defaultValue={startDiceValue} onChange={(event) => { 
                setDiceValue(event.target.value)
            }}>
                {allowNoInput && <option> {'-'} </option>}
                <option> {'4'} </option>
                <option> {'6'} </option>
                <option> {'8'} </option>
                <option> {'10'} </option>
                <option> {'12'} </option>
            </select>
            */