// import { execSync } from "child_process";
// import os from "os";

// export function getLocalIPAddress() {
//   const interfaces = os.networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const iface of interfaces[name]) {
//       if (iface.family === 'IPv4' && !iface.internal) {
//         return iface.address; // e.g. 192.168.1.5
//       }
//     }
//   }
//   return '127.0.0.1';
// }



// export function getCurrentSSID() {
//   try {
//     const output = execSync('netsh wlan show interfaces').toString();
//     const match = output.match(/^\s*SSID\s*:\s(.+)$/m);
//     return match ? match[1].trim() : null;
//   } catch {
//     return null;
//   }
// }

// export function getWiFiPassword(ssid) {
//   try {
//     const output = execSync(`netsh wlan show profile name="${ssid}" key=clear`).toString();
//     const match = output.match(/Key Content\s*:\s(.+)/);
//     return match ? match[1].trim() : "Password not found";
//   } catch {
//     return "Password inaccessible";
//   }
// }

import { execSync } from 'child_process';
import os from 'os';
import sudo from 'sudo-prompt';

const sudoOptions = { name: 'Church Media Server' };

// Get local IP address
export function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Get current Wi-Fi SSID
export function getCurrentSSID() {
  try {
    const platform = os.platform();

    if (platform === 'win32') {
      const output = execSync('netsh wlan show interfaces').toString();
      const match = output.match(/^\s*SSID\s*:\s(.+)$/m);
      return match ? match[1].trim() : null;

    } else if (platform === 'darwin') {
      const output = execSync(
        '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I'
      ).toString();
      const match = output.match(/^\s*SSID:\s(.+)$/m);
      return match ? match[1].trim() : null;
    }

    return null;

  } catch (error) {
    console.error('Error getting SSID:', error.message);
    return null;
  }
}

// Get Wi-Fi password (elevated)
export function getWiFiPasswordElevated(ssid) {
  return new Promise((resolve, reject) => {
    const platform = os.platform();
    let command = '';

    if (platform === 'win32') {
      command = `netsh wlan show profile name="${ssid}" key=clear`;
    } else if (platform === 'darwin') {
      command = `security find-generic-password -D "AirPort network password" -a "${ssid}" -w`;
    } else {
      return reject('Unsupported platform');
    }

    sudo.exec(command, sudoOptions, (error, stdout) => {
      if (error) {
        console.error('Permission error:', error.message);
        return reject('Permission denied or failed');
      }

      if (platform === 'win32') {
        const match = stdout.match(/Key Content\s*:\s(.+)/);
        return resolve(match ? match[1].trim() : 'Password not found');
      } else {
        return resolve(stdout.trim() || 'Password not found');
      }
    });
  });
}

export async function getNetworkInfo() {
  const ip = getLocalIPAddress();
  const ssid = getCurrentSSID();

  if (!ssid) {
    return { ip, ssid: null, password: null };
  }

  try {
    const password = await getWiFiPasswordElevated(ssid);
    return { ip, ssid, password };
  } catch (error) {
    console.log(error)
    return { ip, ssid, password: 'Permission denied or error' };
  }
}
