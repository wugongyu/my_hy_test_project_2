import type { CommonEnumsProps } from "@/services/data";
import { getGlobalEnums, getWorkFlowEnums } from "@/services/global";
import type { Effect, Reducer } from "umi";

export interface EnumsModelState {
  workFlowEnums: CommonEnumsProps[];
  globalEnums: CommonEnumsProps[];
}

export interface EnumsModelType {
  namespace: 'enums';
  state: EnumsModelState;
  effects: {
    fetchWorkFlowEnums: Effect;
    fetchGlobalEnums: Effect;
  };
  reducers: {
    saveWorkFlowEnums: Reducer<EnumsModelState>;
    saveGlobalEnums: Reducer<EnumsModelState>;
  };
  subscriptions: {};
}

export const initEnumsState = {
  workFlowEnums: [],
  globalEnums: [],
}

const EnumsModel: EnumsModelType = {
  namespace: 'enums',
  state: {
    ...initEnumsState,
  },
  effects: {
    *fetchGlobalEnums(_, { call, put }) {
      const res = yield call(getGlobalEnums);
      yield put({
        type: 'saveGlobalEnums',
        payload: res && Array.isArray(res) ? res : [],
      });
    },
    *fetchWorkFlowEnums(_, { call, put }) {
      const res = yield call(getWorkFlowEnums);
      yield put({
        type: 'saveWorkFlowEnums',
        payload: res && Array.isArray(res) ? res : [],
      });
    },
  },
  reducers: {
    saveGlobalEnums(state = initEnumsState, { payload }): EnumsModelState {
      return {
        ...state,
        globalEnums: payload,
      };
    },
    saveWorkFlowEnums(state = initEnumsState, { payload }): EnumsModelState {
      return {
        ...state,
        workFlowEnums: payload,
      };
    },
  },
  subscriptions: {

  },
};

export default EnumsModel;