/**
 * Deployment detection and auto-reload
 * Checks for new deployments and reloads the page automatically
 */

export function initDeploymentCheck() {
  if (typeof window === 'undefined') return;

  // Store the initial deployment ID
  const getDeploymentId = async () => {
    try {
      const response = await fetch('/_next/static/BUILD_ID', {
        cache: 'no-store',
      });
      return await response.text();
    } catch {
      return null;
    }
  };

  let lastBuildId: string | null = null;

  const checkForNewDeployment = async () => {
    try {
      const currentBuildId = await getDeploymentId();
      
      if (lastBuildId && currentBuildId && lastBuildId !== currentBuildId) {
        console.log('🚀 New deployment detected! Reloading...');
        // Reload the page to get the new version
        window.location.reload();
        return;
      }

      if (!lastBuildId) {
        lastBuildId = currentBuildId;
      }
    } catch (error) {
      console.error('Error checking for deployment:', error);
    }
  };

  // Check every 30 seconds for new deployments
  const intervalId = setInterval(checkForNewDeployment, 30000);

  // Also check when the page regains focus
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', checkForNewDeployment);
  }

  return () => {
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('focus', checkForNewDeployment);
    }
  };
}
