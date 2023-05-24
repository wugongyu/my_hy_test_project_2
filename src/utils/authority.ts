import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(): string | string[] {
  const authStr = localStorage.getItem('menuAuth') || '';
  const authority = authStr ? JSON.parse(authStr) : '';
  if(Array.isArray(authority)) {
    return authority;
  }
  return [];
}

export function setAuthority(authority: string | string[]): void {
  localStorage.setItem('menuAuth', JSON.stringify(authority || []));

  // auto reload
  reloadAuthorized();
}
