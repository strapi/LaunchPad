'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

import { Button } from '../ui/button';

function ToggleTheme() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <span>
          <Sun className="h-5 w-5" />
          Mode claire
        </span>
      ) : (
        <span>
          <Moon className="h-5 w-5" />
          Mode sombre
        </span>
      )}
    </Button>
  );
}

export default ToggleTheme;
