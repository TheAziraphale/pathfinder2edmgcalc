import React, { useCallback, useState } from 'react';
import './App.css';
import DMGGraph from './components/DMGGraph';
import EnemyACMod from './components/EnemyACAndSaveMod';
import PCClass from './components/PCClass';

const App = () => {
  const [graphData0, setGraphData0] = useState([{}]);
  const [graphData1, setGraphData1] = useState([{}]);
  const [graphData2, setGraphData2] = useState([{}]);
  const [graphData3, setGraphData3] = useState([{}]);
  const [enemyAcMod, setEnemyAcMod] = useState('0');
  const [enemySaveMod, setEnemySaveMod] = useState('0');
  const [acJson, setACJson] = useState<any[]>([]);
  const [saveJson, setSaveJson] = useState<any[]>([]);

  const combinedArray = useCallback(() => {
    return [...graphData0, ...graphData1, ...graphData2, ...graphData3];
  },[graphData0, graphData1, graphData2, graphData3])

  return (
    <div className={'classWrapper'}>
      <DMGGraph data={combinedArray()} enemyAcMod={enemyAcMod} acJson={acJson} enemySaveMod={enemySaveMod} saveJson={saveJson} />
      <EnemyACMod min={-20} max={20} acMod={enemyAcMod} setACMod={setEnemyAcMod} setACJson={setACJson} saveMod={enemySaveMod} setSaveMod={setEnemySaveMod} setSaveJson={setSaveJson} />
      <div className={'dmgCalcRow'}>
        <PCClass id={"0"} color={'blue'} enemyAcMod={enemyAcMod} enemySaveMod={enemySaveMod} setGraphData={setGraphData0} acJson={acJson} saveJson={saveJson} />
        <PCClass id={"1"} color={'red'} enemyAcMod={enemyAcMod} enemySaveMod={enemySaveMod} setGraphData={setGraphData1} acJson={acJson} saveJson={saveJson} />
      </div>
      <div className={'dmgCalcRow'}>
        <PCClass id={"2"} color={'green'} enemyAcMod={enemyAcMod} enemySaveMod={enemySaveMod} setGraphData={setGraphData2} acJson={acJson} saveJson={saveJson} />
        <PCClass id={"3"} color={'yellow'} enemyAcMod={enemyAcMod} enemySaveMod={enemySaveMod} setGraphData={setGraphData3} acJson={acJson} saveJson={saveJson} />
      </div>
    </div>
  );
}

export default App;