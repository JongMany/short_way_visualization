import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import './App.css';
import Maze from "./component/Maze/Maze.component";
import {LocationProvider, useLocationContext, Location} from "./context/locationContext";
import TreeVisualization, {addAttributes, buildTree, findPath} from "./component/Tree/Tree.component";
import {useNavigate} from "react-router-dom";

const initMaze = `1 1 0 0 1 0 0 0 0 1
0 1 1 1 1 1 0 1 1 0
0 1 1 1 1 1 0 1 1 0
0 1 1 1 1 1 0 1 1 0
0 0 0 0 0 1 1 1 1 1`;

export interface ChildNode {
  name: string;
  parent: string;
}

// const initMaze = `1 1 1
// 1 1 1
// 1 1 1`;

function App() {
  const [mazeString, setMazeString] = useState(initMaze);
  const [maze, setMaze] = useState<string[][]>([]);
  // const queue = new Queue([0, 0]);
  const {queue, changeCurrentLocations, clear} = useLocationContext();
  const [refresh, setRefresh] = useState(false);
  const [locs, setLocs] = useState<[number, number][]>([]);
  const [finish, setFinish] = useState(false);
  const [tree, setTree] = useState<ChildNode[]>([
    {name: '1 1', parent: ''},
  ]);
  const [treeData, setTreeData] = useState(buildTree(tree)[0]);
  const [treePath, setTreePath] = useState<any[]>([]);
  const [visualize, setVisualize] = useState(false);
  // 경로를 찾기 위함
  const [path, setPath] = useState<string[]>([]);

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

  const refreshPage = () => {
    window.location.reload();
  }

  // textarea에 값을 입력받는 핸들러 - 1은 길, 0은 벽
  const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMazeString(e.target.value);
  }

  // 다음 큐를 구하기
  const nextClickHandler = () => {
    // 상(-2, -1) 좌(-1, -2) 하(0, -1) 우(-1, 0)
    // 상(-1, 0) 좌(0, -1) 하(1, 0) 우(0, 1)
    if (finish) {
      // 경로 시각화
      const treeData = buildTree(tree);
      const path = findPath(treeData, `${maze[0].length} ${maze.length}`)
      const treePath = addAttributes(treeData, path, {isPath: true})[0];
      setTreePath(treePath);
      setPath(path);
      setVisualize(true);
      return;
    }
    if (!maze[0]) return;
    const prevList = queue.nextStep();
    const goalState = checkGoalIn(prevList, maze);
    if (goalState.isGoalIn) {
      queue.push(goalState.loc);
      const {loc, prevLoc} = goalState;
      setTree(prev => ([...prev, {parent: `${prevLoc[1] + 1} ${prevLoc[0] + 1}`, name: `${loc[1] + 1} ${loc[0] + 1}`}]))
      setFinish(true);
    } else {
      for (const loc of prevList) { // 부모
        const row = loc[0];
        const column = loc[1];
        const nextSearchList = getList(maze, row, column);
        for (const pos of nextSearchList) { // 자식
          !queue.isVisited(pos) && setTree(prev => ([...prev, {
            name: `${pos[1] + 1} ${pos[0] + 1}`,
            parent: `${column + 1} ${row + 1}`
          }]))
          queue.push([pos[0], pos[1]]);
        }
      }
    }
    const currentQueue = queue.getCurrentQueue();
    changeCurrentLocations(currentQueue);
  }

  console.log(treePath)
  return (
      <div className="App">
        <textarea id="maze" rows={20} cols={30} value={mazeString} onChange={changeHandler}/>
        <button onClick={clickHandler}>Build a Maze</button>
        <button onClick={refreshPage}>새로고침</button>
        <div>
          <Maze maze={maze} visualize={visualize} path={path}/>
          <button onClick={nextClickHandler}>Go 1 step</button>
        </div>
        <TreeVisualization tree={buildTree(tree)[0]} visualize={visualize} treePath={treePath}/>
        <p>{visualize && `경로는 총 ${path?.length} step을 거쳐야 합니다.`}</p>
      </div>
  );
}

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

type GoalInState = { isGoalIn: true, loc: Location, prevLoc: Location } | { isGoalIn: false }

function checkGoalIn(searchList: Location[], maze: string[][]): GoalInState {
  const rowNum = maze.length - 1;
  const columnNum = maze[0].length - 1;

  for (const loc of searchList) {
    const row = loc[0];
    const column = loc[1];
    const nextSearchList = getList(maze, row, column);

    for (const pos of nextSearchList) {
      if (pos[0] === rowNum && pos[1] === columnNum) {
        return {
          isGoalIn: true,
          prevLoc: loc,
          loc: pos,
        };
      }
    }
  }

  return {
    isGoalIn: false,
  }
}

export default App;