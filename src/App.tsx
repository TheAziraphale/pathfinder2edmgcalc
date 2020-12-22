import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import './App.css';
import DMGGraph, { GraphElement } from './components/DMGGraph';
import EnemyACMod from './components/EnemyACAndSaveMod';
import PCClass from './components/PCClass';
import FlatList from 'flatlist-react';

const STARTING_COLOR_ARRAY = ['blue', 'red', 'green', 'yellow', 'purple', 'brown', 'teal', 'pink', 'orange']

interface PCElement {
  id: number;
  startColor: string;
}

const App = () => {
  const [graphDatas, setGraphDatas] = useState<GraphElement[]>([]);
  const [pcs, setPCs] = useState<PCElement[]>([{
    id: 0,
    startColor: 'blue',
  }]);
  const [enemyAcMod, setEnemyAcMod] = useState('0');
  const [enemySaveMod, setEnemySaveMod] = useState('0');
  const [acJson, setACJson] = useState<any[]>([]);
  const [saveJson, setSaveJson] = useState<any[]>([]);
  const [currentHighestId, setCurrentHighestId] = useState<number>(1);

  const removePC = (id:number) => {
    setPCs(pcs.filter((pcElement:PCElement) => pcElement.id !== id));
  }

  const setNewGraph = (data:any, id:number) => { 
    let newArray:GraphElement[] = graphDatas.filter((graphData:GraphElement) => graphData.id !== id);
    console.log(id, data);
    newArray.push({id, data});
    setGraphDatas(newArray);
   }

  const renderPCClass = (person, idx) => {
    return <PCClass
      key={person.id}
      id={person.id} 
      color={person.startColor} 
      setGraphData={(data:any) => {
        console.log("here");
        setNewGraph(data, person.id)}} 
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
      <DMGGraph graphElement={graphDatas} enemyAcMod={enemyAcMod} acJson={acJson} enemySaveMod={enemySaveMod} saveJson={saveJson} />
      <EnemyACMod min={-20} max={20} acMod={enemyAcMod} setACMod={setEnemyAcMod} setACJson={setACJson} saveMod={enemySaveMod} setSaveMod={setEnemySaveMod} setSaveJson={setSaveJson} />
      <div key={'group_pc_elements2'} className={'dmgCalcGroup'}>
        <FlatList 
            list={pcs}
            renderItem={renderPCClass}
            renderWhenEmpty={() => <div>List is empty!</div>}
        />
        <div className={'addPCClassWrapper'}>
            <div className={'addPCClassButtonContainer'}>
              <Button style={{minHeight: 0, minWidth: 0, height: 40, width: 40,  borderRadius: 20, fontSize:40, padding: 0, margin: 0,
                color: 'white', backgroundColor: 'rgb(25, 180, 25)'}} className={'addPCClassButton'} variant="contained" 
                onClick={() => { createNewPC(currentHighestId) }}>
                  {'+'}
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;