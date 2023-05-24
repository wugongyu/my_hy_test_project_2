import React, { useReducer } from 'react';
import type { ContextState, ContextAction} from './types';
import { CONTEXT_ACTIONS } from './types';

const initialState: ContextState = {
  tabs: [], // 标签数据
  dispatch: () => {},
};

function reducer(state: ContextState, action: ContextAction) {
  const { type, payload } = action;
  switch (type) {
    case CONTEXT_ACTIONS.UPDATE_TABS: {
      return { ...state, tabs: payload };
    }
    default:
      return { ...state };
  }
}

const context = React.createContext(initialState);

function provider(props: any) {
  const { children } = props;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, dispatch] = useReducer(reducer, initialState);
  state.dispatch = dispatch;
  return <context.Provider value={state}>{children} </context.Provider>;
}

export { context, provider };
