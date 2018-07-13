import produce from "immer";

export default (initialState, reducers) => {
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
