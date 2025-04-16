import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wujo.app',
  appName: 'Wujo App',
  webDir: 'public',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    Permissions: {
      camera: 'granted',
      microphone: 'granted',
      location: 'granted',
    },
  },
}

export default config;
