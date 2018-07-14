import produce from "immer";

type SecondParam<T> = T extends (a: any, b: infer R) => any ? R : never;

type XMap<I> = {
  [k in keyof I]: {
    type: k;
    payload: I[k];
  }
};

// HACK https://stackoverflow.com/q/51342446/1325646
type Action<I> = XMap<I>[keyof XMap<I>];

type Reducer<S, P> = (state: S, payload: P) => void;

type Fluxify = <S, R extends { [x: string]: Reducer<S, any> }>(
  initialState: S,
  reducers: R
) => {
  actions: {
    [x in keyof R]: (
      payload: SecondParam<R[x]>
    ) => { type: x; payload: SecondParam<R[x]> }
  };
  reducer: (is: S, action: Action<R>) => S;
};

const fluxify: Fluxify = (initialState, reducers) => {
  const keys = Object.keys(reducers);
  const actionList = keys.map(type => ({
    [type]: payload => ({ type, payload })
  }));
  const actions = Object.assign({}, ...actionList);

  const reducer = (state = initialState, action) => {
    const { type, payload } = action;
    const reducer = reducers[type];
    const newState = reducer
      ? produce(state, draftState => {
          reducer(draftState, payload);
        })
      : state;
    console.log("new state", newState);
    return newState;
  };

  return { reducer, actions };
};

export default fluxify;
