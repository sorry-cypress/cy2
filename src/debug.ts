import { debug as _debug } from 'debug';
export const debug = _debug('cy2');
export const debugNet = _debug('cy2-net');
export const getDebugNet = (name: string) => _debug(`cy2-net:${name}`);
