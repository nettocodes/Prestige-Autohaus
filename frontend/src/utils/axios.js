import axios from 'axios';

// Configurar interceptor para incluir o token em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para resposta para tratar tokens expirados
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Só fazer logout em casos específicos de token expirado/inválido
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || '';
      const isTokenError = errorMessage.toLowerCase().includes('token') && 
                          (errorMessage.includes('expirado') || 
                           errorMessage.includes('inválido') ||
                           errorMessage.includes('expired') ||
                           errorMessage.includes('invalid'));
      
      // Só fazer logout se for um erro de token da nossa própria API (localhost)
      const isOurAPI = error.config?.url?.includes('localhost') || 
                       error.config?.url?.includes('/api/') ||
                       error.config?.baseURL?.includes('localhost');
      
      if (isTokenError && isOurAPI && !error.config?.url?.includes('/login')) {
        console.warn('Token expirado detectado, fazendo logout...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Atualizar estado de autenticação
        if (typeof window !== 'undefined' && window.updateAuthState) {
          window.updateAuthState();
        }
        
        // Só redirecionar se não estiver em páginas públicas
        const publicRoutes = ['/login', '/register', '/', '/view', '/details'];
        const currentPath = window.location.pathname;
        const isPublicRoute = publicRoutes.some(route => 
          currentPath === route || currentPath.startsWith('/details/')
        );
        
        if (!isPublicRoute) {
          alert('Sua sessão expirou. Faça login novamente.');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axios;