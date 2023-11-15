import React, {ChangeEvent, useMemo, useState} from 'react';
import './App.css';
import Maze from "./component/Maze/Maze.component";
import {LocationProvider, useLocationContext} from "./context/locationContext";
// import {Queue} from "./dataStructure/Queue";
// import {RouteTree} from "./dataStructure/Tree";

const initMaze = `1 1 0 0 1 0 0 0 0 1
0 1 1 1 1 1 0 1 1 0
0 1 1 1 1 1 0 1 1 0
0 1 1 1 1 1 0 1 1 0
0 0 0 0 0 1 1 1 1 1`;


// const initMaze = `1 1 1
// 1 1 1
// 1 1 1`;

function App() {
  const [mazeString, setMazeString] = useState(initMaze);
  const [maze, setMaze] = useState<string[][]>([]);
  // const queue = new Queue([0, 0]);
  const {queue, changeCurrentLocations, currentLocations} = useLocationContext();
  const [refresh, setRefresh] = useState(false);
  const [locs, setLocs] = useState<[number, number][]>([]);
  const [finish, setFinish] = useState(false);

  console.log(currentLocations, queue)
  // textArea의 값을 기반으로 미로를 만들기위한 버튼 클릭 핸들러
  const clickHandler = () => {
    const result = [];
    const rows = mazeString.split('\n');
    const columnCount = rows[0].length;
    for (const row of rows) {
      if (columnCount !== row.length) {
        alert('열 개수가 각기 다르네요. 다시 확인해주세요');
        return;
      }
      const rowData = row.split(' ');
      result.push(rowData);
    }
    setMaze(result);
  }

  // textarea에 값을 입력받는 핸들러 - 1은 길, 0은 벽
  const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMazeString(e.target.value);
  }

  // 다음 큐를 구하기
  const nextClickHandler = () => {
    // 상(-2, -1) 좌(-1, -2) 하(0, -1) 우(-1, 0)
    // 상(-1, 0) 좌(0, -1) 하(1, 0) 우(0, 1)

    const prevList = queue.nextStep();
    for (const loc of prevList) {
      const row = loc[0];
      const column = loc[1];
      const nextSearchList = getList(maze, row, column); // 상하좌우 리스트 뽑기
      const goalInState = checkGoalIn(nextSearchList, maze.length - 1, maze[0].length - 1);
      if (goalInState.isGoalIn) {
        console.log(goalInState.isGoalIn)
        queue.push(goalInState.loc);
        changeCurrentLocations(goalInState.loc);
      } else {
        for (const pos of nextSearchList) {
          queue.push([pos[0], pos[1]]);
          const currentQueue = queue.getCurrentQueue();
          changeCurrentLocations(currentQueue);
        }
      }
    }

  }

  return (
      <div className="App">
        <textarea id="maze" rows={20} cols={30} value={mazeString} onChange={changeHandler}/>
        <button onClick={clickHandler}>Build a Maze</button>
        <Maze maze={maze}/>
        <button onClick={nextClickHandler}>Go 1 step</button>
      </div>
  );
}

export default App;

// queue에 갈 수 있는 위치를 집어 넣기
function getList(maze: string[][], row: number, column: number) {
  const result: [number, number][] = [];
  if (row - 1 >= 0) {
    const top = parseInt(maze[row - 1][column]);
    if (top !== 0) {
      // queue.push([row - 1, column]);
      result.push([row - 1, column]);
    }
  }

  if (column - 1 >= 0) {
    const left = parseInt(maze[row][column - 1]);
    if (left !== 0) {
      // queue.push([row, column - 1]);
      result.push([row, column - 1]);
    }
  }

  if (row + 1 <= maze.length - 1) {
    const bottom = parseInt(maze[row + 1][column]);
    if (bottom !== 0) {
      // queue.push([row + 1, column]);
      result.push([row + 1, column]);
    }
  }

  if (column + 1 <= maze[0].length - 1) {
    const right = parseInt(maze[row][column + 1]);
    if (right) {
      // queue.push([row, column + 1]);
      result.push([row, column + 1]);
    }
  }
  return result;
}


type GoalInState = { isGoalIn: true, loc: [number, number] } | { isGoalIn: false }

function checkGoalIn(searchList: [number, number][], rowNum: number, columnNum: number): GoalInState {
  for (const pos of searchList) {
    if (pos[0] === rowNum && pos[1] === columnNum) {
      return {loc: pos, isGoalIn: true};
    }
  }
  return {isGoalIn: false};
}