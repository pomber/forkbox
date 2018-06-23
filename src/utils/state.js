import React from "react";

export class State extends React.Component {
  state = { ...this.props.init };

  componentDidMount() {
    this.props.didMount &&
      this.props.didMount(this.state, (s, se) => this.setState(s, se));
  }

  componentWillUnmount() {
    this.props.willUnmount &&
      this.props.willUnmount(this.state, (s, se) => this.setState(s, se));
  }

  render() {
    const setState = (s, se) => this.setState(s, se);
    const deferredSetState = (s, se) =>
      ReactDOM.unstable_deferredUpdates(() => this.setState(s, se));

    const state = this.props.map
      ? this.props.map(this.state, setState, deferredSetState)
      : this.state;

    return this.props.children(state, setState, deferredSetState);
  }
}

export const Toggle = ({ startOn, children }) => (
  <State
    init={{ on: startOn }}
    map={(s, ss) => ({ on: s.on, toggle: () => ss(ps => ({ on: !ps.on })) })}
  >
    {children}
  </State>
);

export class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error, info) {
    if (this.props.when(error)) {
      this.setState({ hasError: true });
    } else {
      throw error;
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.catch();
    }
    return this.props.children;
  }
}
