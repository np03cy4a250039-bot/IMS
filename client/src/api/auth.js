// auth helpers using localStorage
export function saveToken(token){ localStorage.setItem('ims_token', token); }
export function getToken(){ return localStorage.getItem('ims_token'); }
export function logout(){ localStorage.removeItem('ims_token'); }
