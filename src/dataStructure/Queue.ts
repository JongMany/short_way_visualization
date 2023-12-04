type Location = [number, number];
// 경로 저장 및 계산용 자료구조
export class Queue {
  private isIn: Set<Location> = new Set(); // 이미 갔던 루트
  private queue: Location[];  // 새로 들어온 큐
  private prevQueue: Location[] = []; // 이전 스텝의 큐들

  constructor(loc: Location) {
    this.queue = [];
    this.isIn.add(loc);
    this.prevQueue.push(loc);
    this.queue.push(loc);
  }

  push(loc: Location) {
    if(!this.isVisited(loc)) {
      this.queue.push(loc);
      this.isIn.add(loc);
    }
  }

  nextStep(){
    const result = this.queue;
    this.prevQueue = this.queue;
    this.queue = [];
    return result;
  }

  pop() {
    if(this.queue.length) {
      return this.queue.shift();
    }
  }

  isVisited(loc: Location) {
    const isIn = Array.from(this.isIn);
    for (const pos of isIn) {
      if(loc[0] === pos[0] && loc[1] === pos[1]) {
        return true;
      }
    }
    return false;
  }

  getPreviousQueue() {
    return this.prevQueue;
  }

  getCurrentQueue() {
    return this.queue;
  }
}