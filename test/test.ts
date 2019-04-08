import { expect, tap } from '@pushrocks/tapbundle';
import * as smartipc from '../ts/index';

import * as smartspawn from '@pushrocks/smartspawn';
import * as smartpromise from '@pushrocks/smartpromise';

let testIpc: smartipc.SmartIpc;

tap.test('should instantiate a valid instance', async () => {
  testIpc = new smartipc.SmartIpc({
    ipcSpace: 'testSmartIpc',
    type: 'server'
  });
  testIpc.start();
});

tap.test('should create a client', async tools => {
  const clientIpc = new smartipc.SmartIpc({
    ipcSpace: 'testSmartIpc',
    type: 'client'
  });
  clientIpc.sendMessage();
});

tap.test('should terminate the smartipc process', async () => {});

tap.start();
