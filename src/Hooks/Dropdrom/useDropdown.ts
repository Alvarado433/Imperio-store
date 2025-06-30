import { useState, useEffect, useRef } from 'react';

interface DropdownPosition {
  top: number;
  left: number;
}

export default function useDropdown<T extends HTMLElement>() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<DropdownPosition | null>(null);
  const triggerRef = useRef<T | null>(null);
  // Alterar de HTMLElement para HTMLDivElement:
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggle = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return {
    isOpen,
    toggle,
    dropdownPos,
    triggerRef,
    dropdownRef,
    setIsOpen,
  };
}
