import { useContext } from 'react';
import { SecurityContext } from '@/context/SecurityContext';

export function useSecurity() {
  return useContext(SecurityContext);
}