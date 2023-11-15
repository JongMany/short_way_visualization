import {Context, createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Queue} from "../dataStructure/Queue";

interface LocationProps {
  children: ReactNode;
}

interface ContextData {
  queue: Queue,
  currentLocations: Location[],
  changeCurrentLocations: () => void;
}

export type Location = [number, number];

const initValue: [number, number] = [0, 0];
const queue = new Queue(initValue);

const LocationContext = createContext({
  queue: queue, currentLocations: queue.getCurrentQueue(), changeCurrentLocations: (locations: Location | Location[]) => {
  }
});

function isLocationArray(loc: Location | Location[]): loc is Location[] {
  if (!loc[0]) return false;
  return loc[0].hasOwnProperty('length');
}

export const LocationProvider = ({children}: LocationProps) => {
  const [locations, setCurrentLocations] = useState(queue.getCurrentQueue());

  const changeCurrentLocations = (locations: Location | Location[]) => {
    if (isLocationArray(locations)) {
      setCurrentLocations(locations);
    } else {
      setCurrentLocations([locations]);
    }
  }

  return <LocationContext.Provider
      value={{queue, currentLocations: locations, changeCurrentLocations}}>{children}</LocationContext.Provider>
}

export const useLocationContext = () => {
  return useContext(LocationContext);
}