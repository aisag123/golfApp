import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asgolf.app',
  appName: 'AS Golf',
  webDir: '../web',
  server: {
    url: 'https://golfapp-1-o233.onrender.com',
    cleartext: false,
    androidScheme: 'https'
  }
};

export default config;
