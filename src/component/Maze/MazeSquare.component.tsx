import styles from './MazeSquare.module.css'
import {useLocationContext} from "../../context/locationContext";

type MazeSquare = {
  data: string;
  column: number;
  row: number;
  path?: string[];
  visualize?: boolean;
}

export default function MazeSquare({data, row, column, visualize, path}: MazeSquare) {
  const {queue, currentLocations} = useLocationContext();

  console.log(visualize, path);
  return <td
      className={`${styles.square} ${data !== '0' ? styles.road : styles.wall}`}>
    {!visualize && isInSquare(currentLocations, row, column) && '⭐️'}
    {visualize && isPath(path!, row, column) && '🌟'}
  </td>
}

function isInSquare(locations: [number, number][], row: number, column: number) {
  for (const location of locations) {
    // if (row !== location[0] + 1) return false;
    // if (column !== location[1] + 1) return false;
    if (row === location[0] + 1 && column === location[1] + 1) return true;
  }
  return false;
}

function isPath(path: string[], row: number, column: number) {
  console.log(path)
  return path.includes(`${column} ${row}`);
}