import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../api/supabaseClient';

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<{ user?: any; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionUser = localStorage.getItem('user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (fetchError) {
      return { error: '아이디를 틀렸어요. 방귀를먹으세요' };
    }

    if (user.password !== password) {
      return { error: '비밀번호를 틀렸어요. 반성하며 춤을 추세요' };
    }

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return { user };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
