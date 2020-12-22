import { Button } from '@material-ui/core';
import React, { useCallback, useRef, useState } from 'react';
import './App.css';
import DMGGraph, { GraphElement } from './components/DMGGraph';
import EnemyACMod from './components/EnemyACAndSaveMod';
import PCClass from './components/PCClass';
import FlatList from 'flatlist-react';
import Modal from './components/Modal';
import PopoutIcon from './data/PopoutIcon.png';

const STARTING_COLOR_ARRAY = ['blue', 'red', 'green', 'yellow', 'purple', 'brown', 'teal', 'pink', 'orange']

interface PCElement {
  id: number;
  startColor: string;
}

const App: React.FC = () => {
  const graphDatas = useRef<GraphElement[]>([])
  const [, forceUpdate] = React.useState({});
  const [pcs, setPCs] = useState<PCElement[]>([{
    id: 0,
    startColor: STARTING_COLOR_ARRAY[0],
  }]);
  const [enemyAcMod, setEnemyAcMod] = useState('0');
  const [enemySaveMod, setEnemySaveMod] = useState('0');
  const [acJson, setACJson] = useState<any[]>([]);
  const [saveJson, setSaveJson] = useState<any[]>([]);
  const [currentHighestId, setCurrentHighestId] = useState<number>(1);
  const [graphIsInPortal, setGraphIsInPortal] = useState<boolean>(false);

  const removePC = (id:number) => {
    setPCs(pcs.filter((pcElement:PCElement) => pcElement.id !== id));
  }

  const updateHeadGraph = useCallback((newGraphElement: GraphElement) => {
    let newArray = graphDatas.current.filter((element) => element.id !== newGraphElement.id);
    graphDatas.current = [...newArray, newGraphElement];
    forceUpdate({});
  }, [graphDatas])

  const renderPCClass = (person, idx) => {
    return <PCClass
      key={person.id + '_' + idx}
      id={person.id} 
      color={person.startColor} 
      setGraphData={(data:any) => {
        updateHeadGraph({id: person.id, data: data});
      }}
      enemyAcMod={enemyAcMod}
      enemySaveMod={enemySaveMod}
      acJson={acJson}
      saveJson={saveJson}
      removeMe={(id:number) => removePC(id)}
    />;
  }

  const createNewPC = (id: number) => { 
    const color = STARTING_COLOR_ARRAY.length > id ? STARTING_COLOR_ARRAY[id] : '#' + Math.floor(Math.random()*16777215).toString(16);
    setCurrentHighestId(id > currentHighestId ? id : currentHighestId + 1);
    setPCs([...pcs, {id, startColor:color}])
  }

  return (
    <div className={'classWrapper'}>
      <Modal graphIsInPortal={graphIsInPortal} onClose={() => {setGraphIsInPortal(false)}}
      children={
        <div style={{ margin: 'auto', width: 880, marginBottom: 30}} className={'classWrapper'}>
          <DMGGraph reset={graphIsInPortal} graphElement={graphDatas.current} enemyAcMod={enemyAcMod} acJson={acJson} enemySaveMod={enemySaveMod} saveJson={saveJson} />
        </div>
      } />
      { !graphIsInPortal && <DMGGraph graphElement={graphDatas.current} enemyAcMod={enemyAcMod} acJson={acJson} enemySaveMod={enemySaveMod} saveJson={saveJson} />}
      <div className={'portalButton'}>
        <Button onClick={() => {setGraphIsInPortal(!graphIsInPortal)}}>
          <img className={'popoutImage'} src={PopoutIcon} alt={''} />
          { /*graphIsInPortal ? 'Close popup window' : 'Pop out graph' */}
        </Button>
      </div>
      <EnemyACMod min={-20} max={20} acMod={enemyAcMod} setACMod={setEnemyAcMod} setACJson={setACJson} saveMod={enemySaveMod} setSaveMod={setEnemySaveMod} setSaveJson={setSaveJson} />
      <div key={'group_pc_elements2'} className={'dmgCalcGroup'}>
        <FlatList 
            list={pcs}
            renderItem={renderPCClass}
            renderWhenEmpty={() => <div>List is empty!</div>}
        />
        {pcs && pcs.length < 6 && (
          <div className={'addPCClassWrapper'}>
              <div className={'addPCClassButtonContainer'}>
                <Button style={{minHeight: 0, minWidth: 0, height: 40, width: 40,  borderRadius: 20, fontSize:40, padding: 0, margin: 0,
                  color: 'white', backgroundColor: 'rgb(25, 180, 25)'}} className={'addPCClassButton'} variant="contained" 
                  onClick={() => { createNewPC(currentHighestId) }}>
                    {'+'}
                </Button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;