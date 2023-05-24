/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import type { ExtendOptionsWithResponse } from 'umi-request';
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { stringify } from 'qs';
import { history } from 'umi';
import { 
  getTokenStorage, removeTokenStorage
} from './handleLoginInfo';
import { removeAuthStorage } from './utils';
 
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '登录超时',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  499: '抱歉，请求超时，错误码：499。',
  500: '平台服务出错，错误码：500。',
  502: '平台网关错误，错误码：502。',
  503: '平台服务正在维护更新中，请稍等片刻，错误码：503。',
  504: '平台网关超时，错误码：504。',
};
 
 /**
  * 异常处理程序
  */
 const errorHandler = (error: { response: Response }): Response => {
   const { response } = error;
   if (response && response.status) {
     const errorText = codeMessage[response.status] || response.statusText;
     if (response?.status === 401) {
      //  情况token与菜单权限值
      removeTokenStorage();
      removeAuthStorage();
      if (window.localStorage.getItem('used')) {
        // 判断used是否有值，没有值代表客户端是第一次加载本系统的链接，请求即使401直接跳回登陆页不报提示
        message.error(errorText || '登录超时，请重新登录！');
      }
      const queryString = stringify({
      redirect: window.location.href,
      });
      if (window.location.pathname !== '/user/login') {
        history.push(`/user/login?${queryString}`);
      }
    } else if(response?.status === 403) {
      message.error(errorText || '抱歉，你无权限查看此页面');
      history.replace('/exception/403');
    } else {
      message.error(errorText || '请求错误，请联系管理员');
    }
   } else if (!response) {
     notification.error({
       description: '您的网络发生异常，无法连接服务器',
       message: '网络异常',
     });
   }
   return response;
 };
 
 /**
  * 配置request请求时的默认参数
  */
 const request = extend({
  timeout: 2e4,
  errorHandler, // 默认错误处理
 });

 const requestConfig: Partial<ExtendOptionsWithResponse> = {
  timeout: 2e4,
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
};

// 携带token的请求
const requestWithToken = extend({
  ...requestConfig,
});


// 拦截器--添加请求头
requestWithToken.interceptors.request.use((url: any, options: any) => {
  // 判断本地storage是否有数据，如果有就得到token，并赋值给请求头
  const cToken = getTokenStorage();
  if(cToken){
  const headers = {
   Authorization: `bearer ${cToken}`
  }
    return {
      url,
      options:{...options,headers}
    }
  }
  return {
    url,
    options,
  }
});
 
 export { request, requestWithToken };
 