'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPatreon } from '@fortawesome/free-brands-svg-icons';
import { useLocalStorageValue } from '@react-hookz/web';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import { strapiUrl } from '@/lib/constants';

export interface IJWT {
  jwt: string;
  user: IUser;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  isNamePublic: boolean;
  avatar: string | null;
  isLinkPublic: boolean;
  vanityLink: string | null;
  patreonBenefits: string;
}

export interface IAuthData {
  accessToken: string | null;
  user: IUser | null;
}

export interface IUseAuth {
  authData: IAuthData | null | undefined;
  setAuthData: (data: IAuthData | null) => void;
  lastVisitedPath: string | undefined;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<IUseAuth | null>(null);

interface IAuthContextProps {
  children: ReactNode;
}
export function AuthProvider({ children }: IAuthContextProps): React.JSX.Element {
  const { value: authData, set: setAuthData } = useLocalStorageValue<IAuthData | null>('authData', {
    defaultValue: null,
  });

  const { value: lastVisitedPath, set: setLastVisitedPath } = useLocalStorageValue<string>('lastVisitedPath', {
    defaultValue: '/profile',
    initializeWithValue: false,
  });
  const router = useRouter();

  const login = async () => {
    const currentPath = window.location.pathname;
    setLastVisitedPath(currentPath);
    router.push(`${strapiUrl}/api/connect/patreon`);
  };

  const logout = () => {
    setAuthData({ accessToken: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData,
        lastVisitedPath,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function LoginButton() {
  const context = useContext(AuthContext);
  if (!context) return <Skeleton></Skeleton>;
  const { login } = context;
  return (
    <button
      className="button is-primary has-icons-left"
      onClick={() => {
        login();
      }}
    >
      <span className="icon is-small">
        <FontAwesomeIcon icon={faPatreon} className="fab fa-patreon" />
      </span>
      <span>Login</span>
    </button>
  );
}

export function LogoutButton() {
  const context = useContext(AuthContext);
  if (!context) return <></>;
  const { logout } = context;
  return (
    <button
      className="button is-secondary has-icons-left"
      onClick={() => {
        logout();
      }}
    >
      <span className="icon is-small">
        <FontAwesomeIcon icon={faRightFromBracket} className="fas fa-right-from-bracket" />
      </span>
      <span>Logout</span>
    </button>
  );
}

export function useAuth(): IUseAuth {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
