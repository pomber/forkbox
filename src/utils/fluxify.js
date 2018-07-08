export default (initialState, reducers) => {
  const keys = Object.keys(reducers);
  const actionList = keys.map(type => ({
    [type]: payload => ({ type, payload })
  }));
  const actions = Object.assign({}, ...actionList);

  const reducer = (state = initialState, action) => {
    const { type, payload } = action;
    const reducer = reducers[type];
    return reducer ? reducer(state, payload) : state;
  };

  return { reducer, actions };
};
