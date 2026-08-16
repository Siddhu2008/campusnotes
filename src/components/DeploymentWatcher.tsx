'use client';

import { useEffect } from 'react';
import { initDeploymentCheck } from '@/lib/deploymentCheck';

/**
 * Client-side component that monitors for new deployments
 * Automatically reloads the page when a new version is detected
 */
export function DeploymentWatcher() {
  useEffect(() => {
    const cleanup = initDeploymentCheck();
    return cleanup;
  }, []);

  return null;
}
