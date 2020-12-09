import React, { useCallback, useState } from 'react';
// import DMGCalculator from './components/DMGCalculator'
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

  const combinedArray = useCallback(() => {
    return [...graphData0, ...graphData1, ...graphData2, ...graphData3];
  },[graphData0, graphData1, graphData2, graphData3])

  return (
    <div className={'classWrapper'}>
      <DMGGraph data={combinedArray()} enemyAcMod={enemyAcMod} />
      <EnemyACMod min={-20} max={20} value={enemyAcMod} setValue={setEnemyAcMod} />
      {
        /*
      <div className={'dmgCalcRow'}>
        <DMGCalculator setGraphData={(data:any[]) => {
          setGraphData0(data);
        }} id={'0'} color={'blue'} />
        <DMGCalculator setGraphData={(data:any[]) => {
          setGraphData1(data);
        }} id={'1'} color={'red'} />
      </div>
      <div className={'dmgCalcRow'}>
        <DMGCalculator setGraphData={(data:any[]) => {
          setGraphData2(data);
        }} id={'2'} color={'green'} />
        <DMGCalculator setGraphData={(data:any[]) => {
          setGraphData3(data);
        }} id={'3'} color={'yellow'} />
      </div>
        */
      }
      <div className={'dmgCalcRow'}>
        <PCClass id={"0"} color={'blue'} enemyAcMod={enemyAcMod} setGraphData={setGraphData0} />
        <PCClass id={"1"} color={'red'} enemyAcMod={enemyAcMod} setGraphData={setGraphData1} />
      </div>
      <div className={'dmgCalcRow'}>
        <PCClass id={"2"} color={'green'} enemyAcMod={enemyAcMod} setGraphData={setGraphData2} />
        <PCClass id={"3"} color={'yellow'} enemyAcMod={enemyAcMod} setGraphData={setGraphData3} />
      </div>
    </div>
  );
}

export default App;