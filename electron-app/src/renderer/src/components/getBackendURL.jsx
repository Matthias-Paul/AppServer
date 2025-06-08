const getBackendURL = () => {
  const ip = import.meta.env.VITE_BACKEND_IP;
  const port = import.meta.env.VITE_BACKEND_PORT;

  if (!ip || !port) {
    console.warn('Missing VITE_BACKEND_IP or VITE_BACKEND_PORT in env');
    return 'http://localhost:3000'; // fallback
  }

  return `http://${ip}:${port}`;
};

export default getBackendURL;
