export const enc = (s: string, e: 'base64' = 'base64') =>
  Buffer.from(s, e).toString();
