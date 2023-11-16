import {Context, createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Queue} from "../dataStructure/Queue";

interface LocationProps {
  children: ReactNode;
}

interface ContextData {
  queue: Queue,
  currentLocations: Location[],
  changeCurrentLocations: () => void;
  clear: () => void;
}

export type Location = [number, number];

const initValue: [number, number] = [0, 0];
const initQueue = new Queue(initValue);

const LocationContext = createContext({
  queue: initQueue,
  currentLocations: initQueue.getCurrentQueue(),
  changeCurrentLocations: (locations: Location | Location[]) => {
  },
  clear: () => {},
});

function isLocationArray(loc: Location | Location[]): loc is Location[] {
  if (!loc[0]) return false;
  return loc[0].hasOwnProperty('length');
}

export const LocationProvider = ({children}: LocationProps) => {
  const [queue, setQueue] = useState(initQueue);
  const [locations, setCurrentLocations] = useState(initQueue.getCurrentQueue());

  const changeCurrentLocations = (locations: Location | Location[]) => {
    if (isLocationArray(locations)) {
      setCurrentLocations(locations);
    } else {
      setCurrentLocations([locations]);
    }
  }

  const clear = () => {
    setQueue(initQueue);
    setCurrentLocations(initQueue.getCurrentQueue());
  }

  return <LocationContext.Provider
      value={{queue, currentLocations: locations, changeCurrentLocations, clear}}>{children}</LocationContext.Provider>
}

export const useLocationContext = () => {
  return useContext(LocationContext);
}