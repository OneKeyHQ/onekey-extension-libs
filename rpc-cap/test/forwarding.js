const test = require('tape');
const { CapabilitiesController } = require('../dist');

const UNAUTHORIZED_CODE = require('eth-rpc-errors').ERROR_CODES.provider.unauthorized;
const METHOD_NOT_FOUND_CODE = require('eth-rpc-errors').ERROR_CODES.rpc.methodNotFound;

test('safe method should pass through', async (t) => {
  const WRITE_RESULT = 'impeccable result';

  const ctrl = new CapabilitiesController({
    safeMethods: ['public_read'],
    requestUserApproval: async (permsReq) => permsReq.permissions,
  }, {});

  const domain = { origin: 'login.onekey.so' };
  const req = { method: 'public_read' };
  const res = {};

  ctrl.providerMiddlewareFunction(domain, req, res, next, end);

  function next () {
    t.ok(true, 'next was called');
    t.end();
  }

  function end (reason) {
    t.error(reason, 'error thrown');
    t.equal(res.result, WRITE_RESULT);
    t.end();
  }

});

test('requesting restricted method is rejected', async (t) => {
  const WRITE_RESULT = 'impeccable result';
  const domain = { origin: 'login.onekey.so' };

  const ctrl = new CapabilitiesController({

    // safe methods never require approval,
    // are considered trivial / no risk.
    // maybe reading should be a permission, though!
    safeMethods: ['eth_read'],

    // optional prefix for internal methods
    methodPrefix: 'wallet_',

    restrictedMethods: {
      'eth_write': {
        method: (_req, res, _next, _end) => {
          res.result = WRITE_RESULT;
        },
      },
    },

    requestUserApproval: async (permsReq) => permsReq.permissions,
  },
  {
    domains: {},
  });

  const req = { method: 'eth_write' };
  const res = {};
  ctrl.providerMiddlewareFunction(domain, req, res, next, end);

  function next () {
    t.ok(false, 'next should not be called');
    t.end();
  }

  function end (reason) {
    t.ok(reason, 'error should be thrown');
    t.ok(res.error, 'should have error object');
    t.equal(reason.code, UNAUTHORIZED_CODE, `error code should be ${UNAUTHORIZED_CODE}.`);
    t.equal(res.error.code, UNAUTHORIZED_CODE, `error code should be ${UNAUTHORIZED_CODE}.`);
    t.notEqual(res.result, WRITE_RESULT, 'should not have complete result.');
    t.end();
  }

});

test('requesting unknown method is rejected', async (t) => {
  const WRITE_RESULT = 'impeccable result';
  const domain = { origin: 'login.onekey.so' };

  const ctrl = new CapabilitiesController({

    // safe methods never require approval,
    // are considered trivial / no risk.
    // maybe reading should be a permission, though!
    safeMethods: ['eth_read'],

    // optional prefix for internal methods
    methodPrefix: 'wallet_',

    restrictedMethods: {
      'eth_write': {
        method: (_req, res, _next, _end) => {
          res.result = WRITE_RESULT;
        },
      },
    },

    requestUserApproval: async (permsReq) => permsReq.permissions,
  },
  {
    domains: {},
  });

  const req = { method: 'fooBar' };
  const res = {};
  ctrl.providerMiddlewareFunction(domain, req, res, next, end);

  function next () {
    t.ok(false, 'next should not be called');
    t.end();
  }

  function end (reason) {
    t.ok(reason, 'error should be thrown');
    t.ok(res.error, 'should have error object');
    t.equal(reason.code, METHOD_NOT_FOUND_CODE, `error code should be ${METHOD_NOT_FOUND_CODE}.`);
    t.equal(res.error.code, METHOD_NOT_FOUND_CODE, `error code should be ${METHOD_NOT_FOUND_CODE}.`);
    t.notEqual(res.result, WRITE_RESULT, 'should not have complete result.');
    t.end();
  }

});

test('requesting restricted method with permission is called', async (t) => {
  const WRITE_RESULT = 'impeccable result';
  const domain = { origin: 'login.onekey.so' };

  const ctrl = new CapabilitiesController({

    // safe methods never require approval,
    // are considered trivial / no risk.
    // maybe reading should be a permission, though!
    safeMethods: ['eth_read'],

    // optional prefix for internal methods
    methodPrefix: 'wallet_',
    restrictedMethods: {
      'eth_write': {
        method: (_req, res, _next, end) => {
          res.result = WRITE_RESULT;
          return end();
        },
      },
    },
    requestUserApproval: async (permsReq) => permsReq.permissions,
  },
  {
    domains: {
      'login.onekey.so': {
        permissions: [
          {
            parentCapability: 'eth_write',
            date: '0',
          },
        ],
      },
    },
  });

  const req = { method: 'eth_write', params: ['hello!'] };
  try {
    const res = await sendRpcMethodWithResponse(ctrl, domain, req);
    t.error(res.error, 'should not have error object');
    t.equal(res.result, WRITE_RESULT, 'Write result should be assigned.');
    t.end();
  } catch (error) {
    t.error(error, 'should not throw error');
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
