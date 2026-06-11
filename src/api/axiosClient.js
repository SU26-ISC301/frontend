import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

axiosClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    if (typeof config.headers?.delete === 'function') {
      config.headers.delete('Content-Type');
    } else if (config.headers) {
      delete config.headers['Content-Type'];
    }
  }

  let token = null;
  const roleToken = config.headers?.['X-Role-Token'] || (config.headers?.get && config.headers.get('X-Role-Token'));
  if (roleToken) {
    if (roleToken === 'vendor') {
      token = localStorage.getItem('vendorAccessToken') || sessionStorage.getItem('vendorAccessToken') || localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    } else if (roleToken === 'admin') {
      token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken') || localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    } else if (roleToken === 'buyer') {
      token = localStorage.getItem('buyerAccessToken') || sessionStorage.getItem('buyerAccessToken') || localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
    
    if (typeof config.headers?.delete === 'function') {
      config.headers.delete('X-Role-Token');
    } else if (config.headers) {
      delete config.headers['X-Role-Token'];
    }
  }

  if (!token) {
    const path = window.location.pathname;
    if (path.startsWith('/vendor') || path.startsWith('/seller')) {
      token = localStorage.getItem('vendorAccessToken') || sessionStorage.getItem('vendorAccessToken') || localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    } else if (path.startsWith('/quantri') || path.startsWith('/admin')) {
      token = localStorage.getItem('adminAccessToken') || sessionStorage.getItem('adminAccessToken') || localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    } else {
      token = localStorage.getItem('buyerAccessToken') || sessionStorage.getItem('buyerAccessToken') || localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  let deviceToken = localStorage.getItem('deviceToken');
  if (!deviceToken) {
    deviceToken = 'dev-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('deviceToken', deviceToken);
  }
  config.headers['X-Device-Token'] = deviceToken;

  return config;
});

export default axiosClient
