export function IsLogin() {
    
  const local = localStorage.getItem('_id') &&
    localStorage.getItem('token') &&
    localStorage.getItem('role');

  const session =  sessionStorage.getItem('_id') &&
    sessionStorage.getItem('token') &&
    sessionStorage.getItem('role');

  return local || session;
}
