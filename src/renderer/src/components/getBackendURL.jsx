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

    // Fallback: try to fetch from backend API
    try {
      const response = await fetch('http://localhost:5000/api/config');
      if (response.ok) {
        cachedConfig = await response.json();
        if (cachedConfig && cachedConfig.backendIP) {
          console.log('Got config from backend API:', cachedConfig);
          return `http://${cachedConfig.backendIP}:${cachedConfig.backendPort}`;
        }
      }
    } catch (fetchError) {
      console.log('Backend API not available, using localhost fallback');
    }

    // Final fallback: try the old file method (for development)
    try {
      const response = await fetch('/src/assets/config.json');
      if (response.ok) {
        cachedConfig = await response.json();
        if (cachedConfig && cachedConfig.backendIP) {
          console.log('Got config from file:', cachedConfig);
          return `http://${cachedConfig.backendIP}:${cachedConfig.backendPort}`;
        }
      }
    } catch (fileError) {
      console.log('Config file not available');
    }

  } catch (error) {
    console.error('Could not load config:', error);
  }

  console.log('Using localhost fallback');
  return 'http://localhost:5000';
};

export default getBackendURL;
