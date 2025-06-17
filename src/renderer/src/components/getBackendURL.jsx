let cachedConfig = null;

const getBackendURL = async () => {
  if (cachedConfig) {
    return `http://${cachedConfig.backendIP}:${cachedConfig.backendPort}`;
  }

  try {
    const response = await fetch('/src/assets/config.json');
    cachedConfig = await response.json();
    // cachedConfig = window.electronAPI.getConfig();
    if (cachedConfig) {
      return `http://${cachedConfig.backendIP}:${cachedConfig.backendPort}`;
    }
  } catch (error) {
    console.error('Could not load config.json:', error);
  }
  return 'http://localhost:5000';

  // const ip = import.meta.env.VITE_BACKEND_IP;
  // const port = import.meta.env.VITE_BACKEND_PORT;

  // console.log(`IP is ${ip} and the port is ${port}`)

  // if (!ip || !port) {
  //   console.warn('Missing VITE_BACKEND_IP or VITE_BACKEND_PORT in env');
  //   return 'http://localhost:3000'; // fallback
  // }

  // return `http://${ip}:${port}`;
};

export default getBackendURL;
