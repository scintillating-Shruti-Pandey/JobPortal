import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('nestwork_user')) || null,
  token: localStorage.getItem('nestwork_token') || null,
  isAuthenticated: !!localStorage.getItem('nestwork_token'),
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      localStorage.setItem('nestwork_token', action.payload.token);
      localStorage.setItem('nestwork_user', JSON.stringify(action.payload.user));
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false, error: null };
    case 'LOGOUT':
      localStorage.removeItem('nestwork_token');
      localStorage.removeItem('nestwork_user');
      return { ...state, user: null, token: null, isAuthenticated: false };
    case 'UPDATE_USER':
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem('nestwork_user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR': return { ...state, error: null };
    default: return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Handle Google OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    if (token && userId) {
      localStorage.setItem('nestwork_token', token);
      authAPI.getMe().then((res) => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user: res.data.user } });
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await authAPI.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Login failed' });
      return { success: false, error: err.response?.data?.message };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { data } = await authAPI.register(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return { success: true };
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Registration failed' });
      return { success: false, error: err.response?.data?.message };
    }
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch (e) {}
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => dispatch({ type: 'UPDATE_USER', payload: userData });
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
