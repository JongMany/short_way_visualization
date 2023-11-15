import MazeSquare from "./MazeSquare.component";

type MazeRowProp = {
  rowData: string[];
  row: number;
  visualize?: boolean;
  path?: string[];
}

export default function MazeRow({rowData, row, visualize, path}: MazeRowProp) {
  return <tr>
    {rowData.map((data, idx) => <MazeSquare key={`${data}-${idx}`} data={data} column={idx + 1} row={row} path={path}
                                            visualize={visualize}/>)}
  </tr>
}