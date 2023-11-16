import {ChildNode} from "../../App";
import * as d3 from 'd3';
import {useEffect, useRef, useState} from "react";
import Tree, {RawNodeDatum} from "react-d3-tree";
import {useCenteredTree} from "../../hooks/useCenteredTree";

interface Props {
  tree: RawNodeDatum | RawNodeDatum[] | undefined;
  visualize: boolean;
  treePath: RawNodeDatum | RawNodeDatum[] | undefined;
}

const width = 300;
const height = 300;

const renderRectSvgNode = ({nodeDatum, toggleNode}: any) => (
    <g>
      <rect width="20" fill={`${nodeDatum.attributes?.isPath ? 'blue' : 'orange'}`} height="20" x="-10"
            onClick={toggleNode}/>
      <text fill="black" strokeWidth="1" x="20">
        {nodeDatum.name}
      </text>
    </g>
);



export default function TreeVisualization({tree, visualize, treePath}: Props) {
  console.log(tree, treePath)
  const svgRef = useRef<SVGSVGElement>(null);
  // const [treeData, setTreeData] = useState(buildTree(tree)[0]);
  const [dimensions, translate, containerRef] = useCenteredTree();

  return <div id="treeWrapper" style={{width: '100vw', height: '30vh', border: '1px solid black'}} ref={containerRef}>
    <Tree data={visualize ? treePath : tree}
          dimensions={dimensions}
          translate={translate}
          renderCustomNodeElement={renderRectSvgNode}
          zoom={0.25}
          zoomable={true}/>
  </div>
}


interface ITree {
  name: string;
  children?: ITree[];
  attributes: Record<string, boolean>;
}

// function changeTree(tree: ChildNode[]) {
//   const results: ITree = {} as ITree;
//   for (const node of tree) {
//     const {name, parent} = node;
//     if (!parent.length) { // 가장 최상위 노드
//       results.name = name;
//     } else {
//
//     }
//   }
// }
//
// function isMyParent(tree: ITree, node: ChildNode){
//
// }

export function buildTree(data: ChildNode[]) {
  let map: any = {}; // 이름을 기준으로 노드를 매핑하기 위한 객체 생성
  let tree: any = [];

  // 데이터를 이름을 기준으로 매핑
  data.forEach(function (item) {
    map[item.name] = {name: item.name, children: []};
  });

  // 부모-자식 관계를 기반으로 트리 구축
  data.forEach(function (item) {
    const node = map[item.name];

    // 부모가 있는 경우 자식으로 추가
    if (item.parent.length) {
      const parentNode = map[item.parent];
      parentNode.children.push(node);
    } else {
      // 부모가 없는 경우 루트 노드로 추가
      tree.push(node);
    }
  });

  return tree;
}

export function findPath(tree: [ITree], targetName: string) {
  let path: string[] = [];

  function dfs(node: ITree, currentPath: string[]) {
    currentPath.push(node.name);

    if (node.name === targetName) {
      // 찾은 경우 경로 저장 후 종료
      path = currentPath.slice();
      return;
    }

    // 자식 노드에 대해 재귀 호출
    if (node.children) {
      for (const child of node.children) {
        dfs(child, currentPath);
      }
    }
    // 경로에서 현재 노드 제거 (부모 노드로 이동)
    currentPath.pop();
  }

  // 루트에서 시작
  for (const root of tree) {
    dfs(root, []);
  }

  return path;
}

export function addAttributes(tree: [ITree], path: string[], newAttribute: Record<string, boolean>): any {
  function dfs(node: ITree) {
    // 현재 노드의 이름이 targetNames 배열에 포함되어 있다면
    if (path.includes(node.name)) {
      // attributes 속성 추가
      node.attributes = newAttribute;
    }

    // 자식 노드에 대해 재귀 호출
    if (node.children) {
      for (const child of node.children) {
        dfs(child);
      }
    }
  }

  // 모든 루트 노드에 대해 시작
  for (const root of tree) {
    dfs(root);
  }

  return {...tree};
}