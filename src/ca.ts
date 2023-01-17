import { pipe } from 'fp-ts/function';
import * as o from 'fp-ts/Option';
import fs from 'fs';
import { ca } from './cert';
import { debug } from './debug';

export const getCA = () =>
  pipe(
    o.fromNullable(process.env.NODE_EXTRA_CA_CERTS),
    o.chain((r) => o.tryCatch(() => fs.readFileSync(r))),
    o.map((r) => {
      debug(
        'Augmenting NODE_EXTRA_CA_CERTS: %s',
        process.env.NODE_EXTRA_CA_CERTS
      );
      return `${ca}\n${r}`;
    }),
    o.getOrElse(() => ca)
  );
