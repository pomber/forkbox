import produce from "immer";

type SecondParam<T> = T extends (s: any, p: infer R) => any ? R : never;

// HACK https://stackoverflow.com/q/51342446/1325646
type Action<I> = { [k in keyof I]: { name: k; value: I[k] } }[keyof I];
type ActionCreator<K, R> = R extends (s: any) => any
  ? () => { type: K; payload: SecondParam<R> }
  : (p: SecondParam<R>) => { type: K; payload: SecondParam<R> };

type Reducer<S> = (state: S, payload: any) => void;

type Fluxify = <S, R extends { [x: string]: Reducer<S> }>(
  initialState: S,
  reducers: R
) => {
  actions: { [x in keyof R]: ActionCreator<x, R[x]> };
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
    // console.log("new state", newState);
    return newState;
  };

  return { reducer, actions };
};

export default fluxify;
