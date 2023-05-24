import { request } from '@/utils/request';

// 查询登陆用户的菜单权限
export async function getUserMenuAuth(params: any, token: string) {
  return request('/api/permission/v1/work/auths/query', {
    params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset-UTF-8',
      Authorization: `Bearer ${token}`,
    },
  });
}