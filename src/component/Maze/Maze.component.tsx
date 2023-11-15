import styles from './Maze.module.css'
import MazeRow from "./MazeRow.component";
import {useEffect} from "react";
import {useLocationContext} from "../../context/locationContext";

type MazeProps = {
  visualize?: boolean;
  maze: string[][];
  path?: string[];
}

export default function Maze({maze, visualize, path}: MazeProps) {

  return <table className={styles.maze}>
    <tbody>
    {maze.map((m, idx) => <MazeRow key={`${idx}`} rowData={m} row={idx + 1} visualize={visualize} path={path} />)}
    </tbody>
  </table>
}