import React, { createContext, useContext, useEffect, useState } from 'react';

type RouterContextType = {
  currentPath: string;
  navigate: (path: string) => void;
};

const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Normalize pathname to strip trailing slashes unless it's '/'
  const normalize = (p: string) => {
    if (!p || p === '') return '/';
    const cleaned = p.split('?')[0].split('#')[0];
    if (cleaned.length > 1 && cleaned.endsWith('/')) {
      return cleaned.slice(0, -1);
    }
    return cleaned || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(() => {
    return normalize(window.location.pathname);
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalize(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const norm = normalize(path);
    if (norm !== currentPath) {
      window.history.pushState({}, '', norm);
      setCurrentPath(norm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);

export const Link: React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ href, className = '', children, onClick }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (onClick) onClick();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
