import React from 'react';
import Header from './Header';

interface NavbarProps {
  currentHash: string;
}

export default function Navbar({ currentHash }: NavbarProps) {
  return <Header currentHash={currentHash} />;
}
