import pathRegexp from 'path-to-regexp';
import request from 'umi-request';
import { v4 } from 'uuid';
import type { Route } from '@/models/connect';
import type { NavigationProps } from '@/models/usermenu';
import type { MenuDataItem } from '@ant-design/pro-layout';
import moment from 'moment';
import type { FormInstance, UploadFile } from 'antd';
import { message } from 'antd';
import { desEncryKey, numCheck } from '@/config/app';
import CryptoJs from 'crypto-js';
import type { CommonTableListParams } from '@/services/data';
import type { RegionOptionsProps } from '@/components/RegionCascader';
import { commonPageExtraHeight } from '@/config/common';
// import request from '@/utils/request';

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/** 处理功能导航数据 */
export const handleNavigation = (menuList: MenuDataItem) => {
  let arr: NavigationProps[] = [];
  menuList.forEach((item: { navigation: any; path: any; children: MenuDataItem }) => {
    if (item?.navigation) {
      arr.push({ ...item.navigation, href: item.path });
    } else if (item?.children) {
      arr = arr.concat(handleNavigation(item.children));
    }
  });
  return arr;
};

/** 处理空数据 */
export const handleParamsFilterNull = (obj: { [key: string]: any }) => {
  const val = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] || obj[key] === 0 || obj[key] === false) {
      val[key] = obj[key];
    }
  });
  return val;
};

/** jkenv的获取 */
export const getJKENV = (str: string) => {
  // @ts-ignore
  if (window?.JK_ENV) {
    // @ts-ignore
    return window.JK_ENV[str];
  }
  return '';
};

/** 匹配对应问候语 */
export const greetLabel = () => {
  const now = new Date();
  const hours = now.getHours();
  if (hours < 6) {
    return { greet: '凌晨好', id: 6 };
  }
  if (hours < 9) {
    return { greet: '早安', id: 9 };
  }
  if (hours < 12) {
    return { greet: '上午好', id: 12 };
  }
  if (hours < 14) {
    return { greet: '中午好', id: 14 };
  }
  if (hours < 17) {
    return { greet: '下午好', id: 17 };
  }
  if (hours < 19) {
    return { greet: '傍晚好', id: 19 };
  }
  if (hours < 22) {
    return { greet: '晚上好', id: 22 };
  }
  return { greet: '夜里好', id: 24 };
};

/** 获取hash 新版本 */
export const getHash = async () => {
  // 在 js 中请求这个页面不会更新页面
  const response = await request(`${window.location.protocol}//${window.location.host}/`, {
    method: 'get',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    errorHandler: (error: { response: Response }): Response => error.response,
  });
  if (response?.status && response?.status !== 200) {
    // 加载界面报错不做更新提示
    return '';
  }
  // 返回的是字符串，需要转换为 html
  const el = document.createElement('html');
  el.innerHTML = response;

  // 拿到 hash
  const newHashSrc = el
    .getElementsByTagName('body')[0]
    .getElementsByTagName('script')[0]
    .src.split('/');
  const newHash = newHashSrc[newHashSrc.length - 1].split('.')[1];
  // console.log('newHash', newHash);
  return newHash;
};

/** 获取当前hash */
export const getCurrentHash = () => {
  // 当前版本的 hash
  const currentHashSrc = document
    .getElementsByTagName('body')[0]
    .getElementsByTagName('script')[0]
    .src.split('/');
  const currentHash = currentHashSrc[currentHashSrc.length - 1].split('.')[1];
  // console.log('currentHash', currentHash);
  return currentHash;
};

// 获取菜单权限
export const getMunuAuth = () => {
  const authStr = localStorage.getItem('menuAuth') || '';
  const authority = authStr ? JSON.parse(authStr) : '';
  if(Array.isArray(authority)) {
    return authority;
  }
  return [];
};

// 设置菜单权限
export const setAuthStorage = (auth: string[]) => {
  localStorage.setItem('menuAuth', JSON.stringify(auth || []));
};

export const removeAuthStorage = () => {
  window.localStorage.removeItem('menuAuth');
}

// 列表接口返回的数据类型
export type InterfaceResultData = {
  page?: number;
  pageSize?: number;
  pageCount?: number;
  totalCount?: number;
  data?: any[];
  hasPrevPages?: boolean;
  hasNextPages?: boolean;
};

// antd table 列表的数据类型
export type TableFormatDataType = {
  current?: number;
  pageSize?: number;
  total?: number;
  data?: any[];
};

/**
 * 将接口获取到的数据结果转成table所需要的数据格式
 * @res --接口返回的列表数据
 * @isAddUniqueId --是否添加uid作为列表数据唯一标识
 * */
export const handleFormatTableData = (res?: InterfaceResultData, isAddUniqueId?: boolean) => {
  const handledArr = Array.isArray(res?.data)
    ? res?.data?.map((item) => ({
        ...item,
        uid: v4(),
      }))
    : [];
  const currentData = Array.isArray(res?.data) ? res?.data : [];
  const resultObj: TableFormatDataType | any = {
    current: res?.page || 1,
    pageSize: res?.pageSize || 10,
    total: res?.totalCount || 0,
    data: isAddUniqueId ? handledArr : currentData,
  };
  return resultObj;
};

export const defaultFormat = 'YYYY-MM-DD';
// date---时间， format---时间格式
// 处理详情展示页的时间值
export function handleDateInfo(params: { format?: string; date?: string | Date }) {
  const { format = defaultFormat, date } = params;
  let handledDate = '';
  if (date) {
    handledDate = moment(date).format(format);
  }
  return handledDate;
}

/**
 * 获取第一个表格的可视化高度
 * @param {*} extraHeight 额外的高度(表格底部的内容高度 Number类型,默认为commonPageExtraHeight)
 * @param {*} id 当前页面中有多个table时需要制定table的id
 */
export function getTableScroll(id: string, extraHeight: number = commonPageExtraHeight) {
  let tHeader = null;
  if (id) {
    tHeader = document.getElementById(id)
      ? document?.getElementById(id)?.getElementsByClassName('ant-table-thead')[0]
      : null;
  } else {
    // eslint-disable-next-line prefer-destructuring
    tHeader = document.getElementsByClassName('ant-table-thead')[0];
  }
  // 表格内容距离顶部的距离
  const tHeaderTop = tHeader?.getBoundingClientRect()?.top || 0;
  // 窗体高度-表格内容顶部的高度-表格内容底部的高度
  // let height = document.body.clientHeight - tHeaderTop - extraHeight
  const height = `calc(100vh - ${tHeaderTop + extraHeight}px)`;
  return height;
}

export const isImageUrlFnc = (imageUrl: string) => {
  return /\.(gif|jpg|jpeg|png|GIF|JPEG|JPG|PNG)$/.test(imageUrl);
};
/**
 * 数组根据指定属性排序（升序/降序）
 * property--属性
 * sortType--排序方式， descend --降序 ，ascend--升序
 * */

export const arrSortByProperty = (property: string, sortType: string) => {
  return (a: any, b: any) => {
    if (sortType === 'ascend') {
      // 升序
      return a[property] - b[property];
    }
    // 降序
    return b[property] - a[property];
  };
};

// 校验查询表单的商品编码
export const checkProductCode = (code?: string) => {
  if (code && (code?.toString().length >= 11 || !numCheck.pattern.test(code))) {
    message.error('商品编号需为10位字符以内的纯数字，请检查是否输入正确');
    return false;
  }
  return true;
};

/**
 * 扫描枪监听事件
 * */
export const scanTime = 30;
export const eventListenerScanCode = (
  formRef: FormInstance<any> | undefined,
  targetKey: string,
  onSearchCallBack: () => void,
) => {
  let barCode = '';
  let lastTime = 0;

  function ClearBarCode() {
    barCode = '';
    lastTime = 0;
  }

  window.addEventListener('keypress', (e) => {
    const targetEvent = e || window.event;
    const currCode = targetEvent.keyCode || targetEvent.which || targetEvent.charCode;
    const currTime = new Date().getTime();
    if (currTime - lastTime <= scanTime) {
      // 扫码枪有效输入间隔毫秒
      barCode += String.fromCharCode(currCode);
    } else if (currTime - lastTime > scanTime) {
      // 输入间隔大于scanTime毫秒，认为不是扫码枪输入内容，清空
      ClearBarCode();
    }
    lastTime = currTime;

    if (currCode === 13) {
      // 回车
      if (barCode) {
        // 扫码结果，做下一步业务处理
        formRef?.setFieldsValue({
          [targetKey]: barCode,
        });
        onSearchCallBack();
      }
      // 回车输入后清空
      ClearBarCode();
    }
  });
};

/**
 * 处理表格的查询参数
 * @params table表格返回的原参数
 * @objKeys 需将参数对象的value值作为查询值的[参数key数组]
 * @dateKeys [{key:string, valueFormat?: string, startKey?: string, endKey?: string}]需转换的日期范围参数数组
 * */
export interface DateParamsProps {
  key: string;
  valueFormat?: string;
  startKey?: string;
  endKey?: string;
}
export const globalSearchParamsHandler = (params: {
  objKeys?: string[];
  dateKeys?: DateParamsProps[];
  dateFormat?: string;
  seachParams?: Partial<CommonTableListParams>;
}) => {
  const { objKeys = [], dateKeys = [], dateFormat = 'YYYY-MM-DD', seachParams } = params;
  if (!seachParams) return {};
  const finalHandleParams = {
    ...seachParams,
  };
  if (objKeys && objKeys?.length > 0) {
    objKeys?.forEach((k) => {
      if (seachParams[k]) {
        finalHandleParams[k] = seachParams[k]?.value || '';
      }
    });
  }
  if (dateKeys && dateKeys?.length > 0) {
    dateKeys?.forEach((item) => {
      if (seachParams[item.key] && seachParams[item.key]?.length === 2) {
        delete finalHandleParams[item.key];
        const currentStartKey = item.startKey ? item.startKey : `${item.key}Start`;
        const currentEndKey = item.endKey ? item.endKey : `${item.key}End`;
        finalHandleParams[currentStartKey] = handleDateInfo({
          format: item.valueFormat || dateFormat,
          date: seachParams[item.key][0] || '',
        });
        finalHandleParams[currentEndKey] = handleDateInfo({
          format: item.valueFormat || dateFormat,
          date: seachParams[item.key][1] || '',
        });
      }
    });
  }
  return finalHandleParams;
};

/**
 * 接口返回的附件数组 =》 图片上传组件的数组对象
 * @param uidKey--对应接口数据中的附件id key
 * @param nameKey--对应接口数据中的附件名称 key
 * @param urlKey--对应接口数据中的附件地址 key
 * @param val--附件数组
 * */
export const commonWrapImage = (params: {
  urlKey: string;
  val?: any[];
  uidKey?: string;
  nameKey?: string;
}): UploadFile<any>[] => {
  const { val, urlKey, uidKey, nameKey } = params;
  if (!val || val?.length === 0) return [];
  return val?.map((item, index) => {
    // 对文件类型进行处理
    const currentFileSuffix = ((nameKey && item[nameKey]) || '')?.split('.'); // 获取当前文件名后缀
    let currentType = 'image/jpeg';
    if (
      currentFileSuffix &&
      currentFileSuffix[1] &&
      isImageUrlFnc((nameKey && item[nameKey]) || '')
    ) {
      currentType = `image/${currentFileSuffix[1]}`; // 普通图片附件
    }
    if (currentFileSuffix && currentFileSuffix[1] === 'pdf') {
      currentType = 'application/pdf'; // pdf格式的附件
    }
    return {
      ...item,
      uid: `${uidKey ? item[uidKey] : v4()}`,
      name: `${nameKey ? item[nameKey] : `附件${index + 1}.jpeg`}`,
      status: 'done',
      url: item[urlKey] || '',
      size: 0,
      type: currentType,
    };
  });
};

/**
 * 图片数组对象 =》 接口所需的附件参数类型
 * @param uidKey--对应接口数据中的附件id key
 * @param nameKey--对应接口数据中的附件名称 key
 * @param urlKey--对应接口数据中的附件地址 key
 * @param imagesVal--图片数组
 * @param needUid --是否需要返回uid
 * */
export const commonGetImageUrlArr = (params: {
  uidKey: string;
  nameKey: string;
  urlKey: string;
  imagesVal: UploadFile<any>[];
  needUid?: boolean;
}) => {
  const { uidKey, nameKey, urlKey, imagesVal } = params;
  const imageArr: any[] = [];
  if (imagesVal?.length > 0) {
    imagesVal.forEach((item: UploadFile) => {
      let url = '';
      if (item?.response) {
        url = item?.response?.url || '';
      }
      if (url || item.url) {
        const handledObj = {
          [urlKey]: url || item.url,
          [nameKey]: item.name,
        };
        // 仅当非新上传的附件: uidKey的值 === uid， 【注】新上传的图片附件uid中包含'rc-upload'
        const finalObj = {
          [uidKey]: item?.uid?.indexOf('rc-upload') === -1 ? item.uid : item.response?.fileId,
          ...handledObj,
        };
        imageArr.push(finalObj);
      }
    });
  }
  return imageArr;
};

/**
 * des加密
 * @param val --- 加密文本
 * @param key --- 密钥
 */
export const encryptByDES = (params: { val?: string; key?: string }) => {
  const { val, key = desEncryKey } = params;
  if (!val) return '';
  const keyHex = CryptoJs.enc.Utf8.parse(key);
  const encrypted = CryptoJs.DES.encrypt(val, keyHex, {
    mode: CryptoJs.mode.ECB,
    padding: CryptoJs.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString();
};

/**
 * des解密
 * @param val --- 解密文本
 * @param key --- 密钥
 *
 */
export const decryptByDes = (params: { val?: string; key?: string }) => {
  const { val, key = desEncryKey } = params;
  if (!val) return '';
  const keyHex = CryptoJs.enc.Utf8.parse(key);
  const decrypted = CryptoJs.DES.decrypt(
    {
      ciphertext: CryptoJs.enc.Hex.parse(val),
    },
    keyHex,
    {
      mode: CryptoJs.mode.ECB,
      padding: CryptoJs.pad.Pkcs7,
    },
  );
  return decrypted.toString(CryptoJs.enc.Utf8);
};

/**
 * 密码加密，MD5加密并转小写
 * @param val --- 加密文本
 * */

export const encryptPassWordByMD5 = (params: { val?: string }) => {
  const { val = '' } = params;
  if (!val) return '';
  return CryptoJs.MD5(val)?.toString()?.toLowerCase();
};

// 电话号码/固话的格式校验
export const validatePhone = (rule: any, value: string, callback: (arg0?: string | undefined) => void) => {
  if (value) {
    if (/^1\d{10}$/.test(value) || /\d{3}-\d{8}$|\d{4}-\d{7}$/.test(value)) {
      callback();
    } else {
      callback('联系电话格式不准确');
    }
  } else {
    callback();
  }
};

/**
 * 扁平化数组转tree结构数组方法
 * */ 

export const arrayToTree = (params: { arrList: any[], parentKey: string, itemKey: string, itemTitleKey: string }) => {
  const { arrList, parentKey, itemKey, itemTitleKey } = params;
  const result: any[] = [];   // 存放结果集
  const itemMap = {};
  arrList?.forEach(item => {
    const id = item[itemKey];
    const pid = item[parentKey];
    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }
    itemMap[id] = {
      id: item[itemKey],
      label: item[itemTitleKey],
      key: item[itemKey],
      title: item[itemTitleKey],
      children: itemMap[id].children
    }
    const treeItem = itemMap[id];
    if (!pid) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }
  });
  return result;
}

/**
 * 将区域数组转为对应的属性值
 * */ 

export const handleRegionToDetailCodeName = (params: {
  regionData: RegionOptionsProps[],
  provinceKey?: string, // 省
  cityKey?: string, // 市县
  townshipKey?: string, // 区
}) => {
  const { regionData, provinceKey = 'province', cityKey = 'city', townshipKey = 'township' } = params;
  if(!(Array.isArray(regionData) && regionData?.length > 0)) return {};
  const detailObj = {
    [`${provinceKey}Code`]: (regionData[0] && regionData[0].value) || '',
    [`${provinceKey}Name`]: (regionData[0] && regionData[0].label) || '',
    [`${cityKey}Code`]: (regionData[1] && regionData[1].value) || '',
    [`${cityKey}Name`]: (regionData[1] && regionData[1].label) || '',
    [`${townshipKey}Code`]: (regionData[2] && regionData[2].value) || '',
    [`${townshipKey}Name`]: (regionData[2] && regionData[2].label) || '',
  };
  return detailObj;
};

const initRegionData: RegionOptionsProps = {
  value: '',
  label: '',
  isLeaf: false,
  children: [],
};

const handleToFormatRegionData = (recordObj: Record<string, any>, valueKey: string, findIsLeafValueKey: string) => {
  const formatRegionData = {
    ...initRegionData,
    value: recordObj[`${valueKey}Code`],
    label: recordObj[`${valueKey}Name`],
    isLeaf: (valueKey === findIsLeafValueKey) || !(recordObj[`${findIsLeafValueKey}Code`]),
  };
  return formatRegionData;

}

/**
 * 将省市区数据转为区域对象
 * */ 
export const handleDetailCodeNameToRegion = (params: {
  detailNameCodeObj: Record<string, any>,
  provinceKey?: string, // 省
  cityKey?: string, // 市县
  townshipKey?: string, // 区
}) => {
  const { detailNameCodeObj, provinceKey = 'province', cityKey = 'city', townshipKey = 'township' } = params;
  const regionValArr: RegionOptionsProps[] = [];
  if(detailNameCodeObj[`${provinceKey}Code`]) {
    // 省
    regionValArr.push(handleToFormatRegionData(detailNameCodeObj, provinceKey, cityKey));
  }
  if(detailNameCodeObj[`${cityKey}Code`]) {
    // 市县
    regionValArr.push(handleToFormatRegionData(detailNameCodeObj, cityKey, townshipKey));
  }
  if(detailNameCodeObj[`${townshipKey}Code`]) {
    // 市县
    regionValArr.push(handleToFormatRegionData(detailNameCodeObj, townshipKey, townshipKey));
  }
  return regionValArr;
};

// 去掉字符串首尾空格
export const handleStrTrim = (keys: string[], value: Record<string, any>) => {
  const obj = {...value};
  keys.forEach(k => {
    if(obj[k]) {
      obj[k] = obj[k].trim();
    }
  });
  return obj;
}
