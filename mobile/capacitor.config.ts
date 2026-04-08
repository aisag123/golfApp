import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asgolf.app',
  appName: 'AS Golf',
  webDir: '../web',
  server: {
    url: 'https://golfapp-fv7m.onrender.com',
    cleartext: false,
    androidScheme: 'https'
  }
};

export default config;
