import type { CustomerDepartmentItem, CustomerListItem } from "@/pages/Customer/data";
import { getCustomerDepartmentsList, getCustomerInfo } from "@/pages/Customer/service";
import type { Effect, Reducer } from "umi";

export interface TreeDataProps {
  key: string;
  title: string;
  children: TreeDataProps[];
}

export interface CustomerModelState {
  customerDepartments: CustomerDepartmentItem[];
  currentCustomerInfo?: CustomerListItem;
  departmentsTreeData: TreeDataProps[];
  treeSelectedDepartmentId?: string;
  allCustomerDepartments: CustomerDepartmentItem[]; // 所有的部门数据，包括根部门
}

export interface CustomerModelType {
  namespace: 'customer';
  state: CustomerModelState;
  effects: {
    fetchCustomerDepartments: Effect;
    fetchCustomerInfo: Effect;
  };
  reducers: {
    saveCustomerDepartments: Reducer<CustomerModelState>;
    saveCutomerInfo: Reducer<CustomerModelState>;
    saveDepartmentTreeData: Reducer<CustomerModelState>;
    saveSelectedDepartmentId: Reducer<CustomerModelState>;
    saveAllCustomerDepartments: Reducer<CustomerModelState>;
  };
  subscriptions: {};
}

export const initCustomrerState = {
  customerDepartments: [],
  departmentsTreeData: [],
  treeSelectedDepartmentId: '',
  allCustomerDepartments: [],
}

const CustomerModel: CustomerModelType = {
  namespace: 'customer',
  state: {
    ...initCustomrerState,
  },
  effects: {
    *fetchCustomerDepartments({ payload }, { call, put }) {
      const res = yield call(getCustomerDepartmentsList, payload);
      yield put({
        type: 'saveCustomerDepartments',
        payload: res && Array.isArray(res) ? res : [],
      });
    },
    *fetchCustomerInfo({ payload }, { call, put }) {
      const res = yield call(getCustomerInfo, payload);
      yield put({
        type: 'saveCutomerInfo',
        payload: res?.customerId ? res : undefined,
      });
    },
  },
  reducers: {
    saveAllCustomerDepartments(state = initCustomrerState, { payload }): CustomerModelState {
      return {
        ...state,
        allCustomerDepartments: payload,
      };
    },
    saveSelectedDepartmentId(state = initCustomrerState, { payload }): CustomerModelState {
      return {
        ...state,
        treeSelectedDepartmentId: payload,
      };
    },
    saveDepartmentTreeData(state = initCustomrerState, { payload }): CustomerModelState {
      return {
        ...state,
        departmentsTreeData: payload,
      };
    },
    saveCustomerDepartments(state = initCustomrerState, { payload }): CustomerModelState {
      return {
        ...state,
        customerDepartments: payload,
      };
    },
    saveCutomerInfo(state = initCustomrerState, { payload }): CustomerModelState {
      return {
        ...state,
        currentCustomerInfo: payload,
      };
    },
  },
  subscriptions: {

  },
};

export default CustomerModel;