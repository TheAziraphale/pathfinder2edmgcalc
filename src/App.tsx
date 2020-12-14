import React, { useCallback, useState } from 'react';
import './App.css';
import DMGGraph from './components/DMGGraph';
import EnemyACMod from './components/EnemyACMod';
import PCClass from './components/PCClass';

const App = () => {
  const [graphData0, setGraphData0] = useState([{}]);
  const [graphData1, setGraphData1] = useState([{}]);
  const [graphData2, setGraphData2] = useState([{}]);
  const [graphData3, setGraphData3] = useState([{}]);
  const [enemyAcMod, setEnemyAcMod] = useState('0');
  const [acJson, setACJson] = useState<any[]>([]);

  const combinedArray = useCallback(() => {
    return [...graphData0, ...graphData1, ...graphData2, ...graphData3];
  },[graphData0, graphData1, graphData2, graphData3])

  return (
    <div className={'classWrapper'}>
      <DMGGraph data={combinedArray()} enemyAcMod={enemyAcMod} acJson={acJson} />
      <EnemyACMod min={-20} max={20} value={enemyAcMod} setValue={setEnemyAcMod} setACJson={setACJson} />
      <div className={'dmgCalcRow'}>
        <PCClass id={"0"} color={'blue'} enemyAcMod={enemyAcMod} setGraphData={setGraphData0} acJson={acJson} />
        <PCClass id={"1"} color={'red'} enemyAcMod={enemyAcMod} setGraphData={setGraphData1} acJson={acJson} />
      </div>
      <div className={'dmgCalcRow'}>
        <PCClass id={"2"} color={'green'} enemyAcMod={enemyAcMod} setGraphData={setGraphData2} acJson={acJson} />
        <PCClass id={"3"} color={'yellow'} enemyAcMod={enemyAcMod} setGraphData={setGraphData3} acJson={acJson} />
      </div>
    </div>
  );
}

export default App;