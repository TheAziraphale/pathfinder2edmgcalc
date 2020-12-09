import React, { useCallback, useState } from 'react';
// import DMGCalculator from './components/DMGCalculator'
import './App.css';
import DMGGraph from './components/DMGGraph';
import PCClass from './components/PCClass';

const App = () => {
  const [graphData0, setGraphData0] = useState([{}]);
  const [graphData1, setGraphData1] = useState([{}]);
  const [graphData2, setGraphData2] = useState([{}]);
  const [graphData3, setGraphData3] = useState([{}]);

  const combinedArray = useCallback(() => {
    return [...graphData0, ...graphData1, ...graphData2, ...graphData3];
  },[graphData0, graphData1, graphData2, graphData3])

  return (
    <div className={'classWrapper'}>
      <DMGGraph data={combinedArray()} />
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
        <PCClass id={"0"} color={'blue'} setGraphData={(data:any[]) => {
          setGraphData0(data);
        }} />
        <PCClass id={"1"} color={'red'} setGraphData={(data:any[]) => {
          setGraphData1(data);
        }} />
      </div>
      <div className={'dmgCalcRow'}>
        <PCClass id={"2"} color={'green'} setGraphData={(data:any[]) => {
          setGraphData2(data);
        }} />
        <PCClass id={"3"} color={'yellow'} setGraphData={(data:any[]) => {
          setGraphData3(data);
        }} />
      </div>
    </div>
  );
}

export default App;