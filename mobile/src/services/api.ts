// ============================================
// API Configuration
// ============================================
// IMPORTANT: Update this IP address to match your backend server
// 
// Find your machine's IP address:
// macOS: run `ifconfig | grep "inet " | grep -v 127.0.0.1`
// Linux: run `hostname -I | awk '{print $1}'`
// Windows: run `ipconfig` and look for IPv4 Address
//
// Common values:
// - For physical device on WiFi: http://192.168.1.9:4000
// - For Android emulator: http://10.0.2.2:4000
// - For iOS simulator: http://localhost:4000
//
export const BASE_URL = 'http://192.168.1.9:4000';

async function request(path: string, body: any) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || res.statusText || 'API request failed');
    }

    return res.json();
  } catch (err: any) {
    console.error(`API Error [${path}]:`, err.message);
    throw err;
  }
}

export function registerTokenApi(token: string, platform?: string) {
  return request('/api/register-token', { token, platform });
}

export function sendNotificationApi(payload: { token?: string; title: string; body?: string; image?: string; data?: any; }) {
  return request('/api/send-notification', payload);
}

export function sendToAllApi(payload: { title: string; body?: string; image?: string; data?: any }) {
  return request('/api/send-to-all', payload);
}

export function unregisterTokenApi(token: string) {
  return request('/api/unregister-token', { token });
}
