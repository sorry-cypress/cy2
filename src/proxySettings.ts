import fs from 'fs';
import path from 'path';

export function getProxySettings({ port }: { port: number }) {
  if (process.env.HTTP_PROXY || process.env.HTTPS_PROXY) {
    throw new Error(
      'HTTP_PROXY and HTTPS_PROXY are not supported. Please report this issue.'
    );
  }

  if (process.env.NODE_EXTRA_CA_CERTS) {
    throw new Error(
      'NODE_EXTRA_CA_CERTS is not supported. Please report this issue.'
    );
  }
  const caPath = path.resolve(__dirname, './cert/ca.crt');
  if (!fs.existsSync(caPath)) {
    throw new Error('Certificate not found. Please report this issue.');
  }
  return {
    caPath: path.resolve(__dirname, './cert/ca.crt'),
    proxyURL: `http://127.0.0.1:${port}`,
  };
}
