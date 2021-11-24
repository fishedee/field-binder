import { createContext, useContext } from 'react';

type FieldCheckerCallback = () => Promise<boolean>;

type FieldCheckerType = {
  getNextId(): number;
  putFieldBinder(id: number, checker: FieldCheckerCallback): void;
  delFieldBinder(id: number): void;
  check(): Promise<boolean>;
};

class FieldChecker {
  private nextId: number;

  private checkerMap: Map<number, FieldCheckerCallback>;

  constructor() {
    this.nextId = 10001;
    this.checkerMap = new Map<number, FieldCheckerCallback>();
  }

  getNextId() {
    return this.nextId++;
  }

  putFieldBinder(id: number, checker: FieldCheckerCallback): void {
    if (this.checkerMap.has(id)) {
      throw new Error('已经存在checker:' + id);
    }
    this.checkerMap.set(id, checker);
  }

  delFieldBinder(id: number): void {
    this.checkerMap.delete(id);
  }

  async check(): Promise<boolean> {
    for (let [_, value] of this.checkerMap) {
      let result = await value();
      if (result == false) {
        return false;
      }
    }
    return true;
  }
}

function createFieldChecker(): FieldCheckerType {
  return new FieldChecker();
}

const FieldCheckerContext = createContext<FieldCheckerType>(
  createFieldChecker(),
);

const FieldCheckerProvider = FieldCheckerContext.Provider;

const useFieldChecker = () => {
  return useContext(FieldCheckerContext);
};

export {
  createFieldChecker,
  FieldCheckerContext,
  FieldCheckerProvider,
  useFieldChecker,
};
