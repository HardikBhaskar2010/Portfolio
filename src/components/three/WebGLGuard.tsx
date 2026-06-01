import { useEffect, useState, type ReactNode } from 'react';

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wraps any <Canvas> component and renders fallback if WebGL is unavailable.
 * Corporate networks, old GPUs, and privacy browsers often disable WebGL.
 */
export function WebGLGuard({ children, fallback = null }: Props) {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isWebGLAvailable());
  }, []);

  return supported ? <>{children}</> : <>{fallback}</>;
}
