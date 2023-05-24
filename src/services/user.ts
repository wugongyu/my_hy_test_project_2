import { request, requestWithToken } from '@/utils/request';

export async function query(): Promise<any> {
  return request('/yapi/users');
}

export async function queryNotices(): Promise<any> {
  return request('/yapi/notices');
}

/** 获取验证码之前先获取ticket */
export async function getTicketBeforeCapcha(params: { userSecret: string}) {
  return request('/api/permission/v1/clients/ticket', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 根据登陆用户名获取短信验证码
export async function getCaptchaByUsername(params: { userName: string }) {
  return requestWithToken('/api/permission/v1/short-messages/send', {
    method: 'POST',
    data: params,
  });
}

// 内网用户账号短信验证码登陆/mgmt/v1/accounts/captcha-login
export async function innerNetUserLogin(params: { userSecret: string}) {
  return requestWithToken('/api/permission/v1/accounts/captcha-login', {
    method: 'POST',
    data: params,
  });
}

// 查询用户登录信息
export async function getUserInfo(token: string) {
  return request('/api/permission/v1/accounts/rights/query', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}