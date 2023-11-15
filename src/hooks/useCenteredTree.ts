import {useCallback, useState} from "react";

export const useCenteredTree = (defaultTranslate = {x: 0, y: 0}) => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const [dimensions, setDimensions] = useState<{ width: number, height: number }>();
  const containerRef = useCallback((containerElem: HTMLDivElement) => {
    if (containerElem !== null) {
      const {width, height} = containerElem.getBoundingClientRect();
      setDimensions({width, height});
      setTranslate({x: 0, y: height /2});
    }
  }, []);
  return [dimensions, translate, containerRef] as const;
};