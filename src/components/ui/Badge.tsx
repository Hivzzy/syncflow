import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children }) => {
  return <span>{children}</span>;
};
