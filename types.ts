// Added React import to provide access to the React namespace for type definitions
import React from 'react';

export interface ContentCard {
  title: string;
  points: string[];
  icon?: React.ReactNode;
  learnMoreUrl?: string;
}

export interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}