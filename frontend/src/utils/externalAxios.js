import axios from 'axios';

// Instância do Axios para APIs externas (sem interceptadores de autenticação)
const externalAxios = axios.create({
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor apenas para logging de erros, sem logout automático
externalAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('Erro em API externa:', error.config?.url, error.response?.status);
    return Promise.reject(error);
  }
);

export default externalAxios;