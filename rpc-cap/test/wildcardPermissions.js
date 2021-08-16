const test = require('tape');
const { CapabilitiesController } = require('../dist');

const UNAUTHORIZED_CODE = require('eth-rpc-errors').ERROR_CODES.provider.unauthorized;

test('requestPermissions on namespaced method with user approval creates permission', async (t) => {

  const ctrl = new CapabilitiesController({

    // Auto fully approve:
    requestUserApproval: (reqPerms) => Promise.resolve(reqPerms.permissions),

    restrictedMethods: {

      // Underscore suffix implies namespace:
      // This namespaced method simply returns the namespace suffix:
      'plugin_': {
        // We need to enhance this parameter to support more open-ended display:
        description: 'Permission to install plugin',
        method: (req, res, _next, end) => {
          const parts = req.method.split('_');
          const second = parts[1];
          res.result = second;
          end();
        },
      },
    },

  });

  const domain = { origin: 'login.onekey.so' };
  let req = {
    method: 'requestPermissions',
    params: [
      {
        plugin_A: {},
      },
    ],
  };

  try {
    let res = await sendRpcMethodWithResponse(ctrl, domain, req);
    req = { method: 'plugin_A' };
    res = await sendRpcMethodWithResponse(ctrl, domain, req);
    t.equal(res.result, 'A', 'returned the segment correctly.');
    t.end();

  } catch (error) {
    t.error(error, 'error should not be thrown');
    t.end();
  }
});

test('requestPermissions on twice namespaced method with user approval creates permission', async (t) => {

  const ctrl = new CapabilitiesController({

    // Auto fully approve:
    requestUserApproval: (reqPerms) => Promise.resolve(reqPerms.permissions),

    restrictedMethods: {

      'eth_plugin_': {
        description: 'Permission to install plugin',
        method: (req, res, _next, end) => {
          const parts = req.method.split('_');
          const second = parts[2];
          res.result = second;
          end();
        },
      },
    },

  });

  const domain = { origin: 'login.onekey.so' };
  let req = {
    method: 'requestPermissions',
    params: [
      {
        eth_plugin_A: {},
      },
    ],
  };

  try {
    let res = await sendRpcMethodWithResponse(ctrl, domain, req);
    req = { method: 'eth_plugin_A' };
    res = await sendRpcMethodWithResponse(ctrl, domain, req);
    t.equal(res.result, 'A', 'returned the segment correctly.');
    t.end();

  } catch (error) {
    t.error(error, 'error should not be thrown');
    t.end();
  }
});

test('requestPermissions on namespaced method ending in a wildcard with user approval creates permission', async (t) => {

  const ctrl = new CapabilitiesController({

    // Auto fully approve:
    requestUserApproval: (reqPerms) => Promise.resolve(reqPerms.permissions),

    restrictedMethods: {

      'eth_plugin_*': {
        description: 'Permission to install plugin',
        method: (req, res, _next, end) => {
          const parts = req.method.split('_');
          const second = parts[2];
          res.result = second;
          end();
        },
      },
    },

  });

  const domain = { origin: 'login.onekey.so' };
  let req = {
    method: 'requestPermissions',
    params: [
      {
        eth_plugin_A: {},
      },
    ],
  };

  try {
    let res = await sendRpcMethodWithResponse(ctrl, domain, req);
    req = { method: 'eth_plugin_A' };
    res = await sendRpcMethodWithResponse(ctrl, domain, req);
    t.equal(res.result, 'A', 'returned the segment correctly.');
    t.end();

  } catch (error) {
    t.error(error, 'error should not be thrown');
    t.end();
  }
});

test('requestPermissions on namespaced method with user approval does not permit other namespaces', async (t) => {

  const ctrl = new CapabilitiesController({

    // Auto fully approve:
    requestUserApproval: (reqPerms) => Promise.resolve(reqPerms.permissions),

    restrictedMethods: {

      // Underscore suffix implies namespace:
      // This namespaced method simply returns the namespace suffix:
      'plugin_': {
        method: (req, res, _next, end) => {
          const parts = req.method.split('_');
          const second = parts[1];
          res.result = second;
          end();
        },
      },
    },

  });

  const domain = { origin: 'login.onekey.so' };
  let req = {
    method: 'requestPermissions',
    params: [
      {
        plugin_A: {},
      },
    ],
  };

  try {
    let res = await sendRpcMethodWithResponse(ctrl, domain, req);
    req = { method: 'plugin_B' };
    res = await sendRpcMethodWithResponse(ctrl, domain, req);
    t.notOk(res, 'Should be restricted');
    t.end();

  } catch (error) {
    t.ok(error, 'error should not be thrown');
    t.equal(error.code, UNAUTHORIZED_CODE, 'Should throw auth error');
    t.end();
  }
});

async function sendRpcMethodWithResponse (ctrl, domain, req) {
  const res = {};
  return new Promise((resolve, reject) => {
    ctrl.providerMiddlewareFunction(domain, req, res, next, end);

    function next () {
      reject();
    }

    function end (reason) {
      if (reason) {
        reject(reason);
      }
      if (res.error) {
        reject(res.error);
      }

      resolve(res);
    }
  });
}
