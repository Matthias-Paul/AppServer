
import os from 'os';

export function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // e.g. 192.168.1.5
      }
    }
  }
  return '127.0.0.1';
}
