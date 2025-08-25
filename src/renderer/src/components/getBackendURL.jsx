let cachedConfig = null;

const getBackendURL = async () => {
  if (cachedConfig) {
    return `http://${cachedConfig.backendIP}:${cachedConfig.backendPort}`;
  }

  try {
    // Try to get config from Electron API first
    if (window.electronAPI && window.electronAPI.getConfig) {
      cachedConfig = await window.electronAPI.getConfig();
      if (cachedConfig && cachedConfig.backendIP) {
        console.log('Got config from Electron IPC:', cachedConfig);
        return `http://${cachedConfig.backendIP}:${cachedConfig.backendPort}`;
      }
    }

    // Fallback: try localhost on port 7001
    console.log('Using localhost fallback on port 7001');
    return 'http://localhost:7001';

  } catch (error) {
    console.error('Could not load config:', error);
    return 'http://localhost:7001';
  }
};

export default getBackendURL;
