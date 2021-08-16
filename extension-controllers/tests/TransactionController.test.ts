import { stub } from 'sinon';
import TransactionController from '../src/transaction/TransactionController';

const globalAny: any = global;

const mockFlags: { [key: string]: any } = {
  estimateGas: null,
};

jest.mock('eth-query', () =>
  jest.fn().mockImplementation(() => {
    return {
      estimateGas: (_transaction: any, callback: any) => {
        if (mockFlags.estimateGas) {
          callback(new Error(mockFlags.estimateGas));
          return;
        }
        callback(undefined, '0x0');
      },
      gasPrice: (callback: any) => {
        callback(undefined, '0x0');
      },
      getBlockByNumber: (_blocknumber: any, _fetchTxs: boolean, callback: any) => {
        callback(undefined, { gasLimit: '0x0' });
      },
      getCode: (_to: any, callback: any) => {
        callback(undefined, '0x0');
      },
      getTransactionByHash: (_hash: any, callback: any) => {
        callback(undefined, { blockNumber: '0x1' });
      },
      getTransactionCount: (_from: any, _to: any, callback: any) => {
        callback(undefined, '0x0');
      },
      sendRawTransaction: (_transaction: any, callback: any) => {
        callback(undefined, '1337');
      },
    };
  }),
);

function mockFetch(data: any) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => data,
      ok: true,
    }),
  );
}

function mockFetchs(data: any) {
  return jest.fn().mockImplementation((key) =>
    Promise.resolve({
      json: () => data[key],
      ok: true,
    }),
  );
}

const HttpProvider = require('ethjs-provider-http');

const MOCK_PRFERENCES = { state: { selectedAddress: 'foo' } };
const PROVIDER = new HttpProvider('https://ropsten.infura.io/v3/341eacb578dd44a1a049cbc5f6fd4035');
const MAINNET_PROVIDER = new HttpProvider('https://mainnet.infura.io/v3/341eacb578dd44a1a049cbc5f6fd4035');
const MOCK_NETWORK = {
  provider: PROVIDER,
  state: { network: '3', provider: { type: 'ropsten' } },
  subscribe: () => {
    /* eslint-disable-line no-empty */
  },
};
const MOCK_MAINNET_NETWORK = {
  provider: MAINNET_PROVIDER,
  state: { network: '1', provider: { type: 'mainnet' } },
  subscribe: () => {
    /* eslint-disable-line no-empty */
  },
};

const ETH_TRANSACTIONS = [
  {
    blockNumber: '4535101',
    confirmations: '10',
    contractAddress: '',
    cumulativeGasUsed: '120607',
    from: '0xe46abaf75cfbff815c0b7ffed6f02b0760ea27f1',
    gas: '335208',
    gasPrice: '10000000000',
    gasUsed: '21000',
    hash: '0xa9d17df83756011ea63e1f0ca50a6627df7cac9806809e36680fcf4e88cb9dae',
    input: '0x',
    isError: '0',
    nonce: '9',
    timeStamp: '1543596286',
    to: '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207',
    transactionIndex: '2',
    txreceipt_status: '1',
    value: '100000000000000000',
  },
  {
    blockNumber: '4535108',
    confirmations: '3',
    contractAddress: '',
    cumulativeGasUsed: '693910',
    from: '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207',
    gas: '335208',
    gasPrice: '20000000000',
    gasUsed: '21000',
    hash: '0x342e9d73e10004af41d04973339fc7219dbadcbb5629730cfe65e9f9cb15ff92',
    input: '0x',
    isError: '0',
    nonce: '0',
    timeStamp: '1543596378',
    to: '0xb2d191b6fe03c5b8a1ab249cfe88c37553357a23',
    transactionIndex: '12',
    txreceipt_status: '1',
    value: '50000000000000000',
  },
  {
    blockNumber: '4535105',
    confirmations: '4',
    contractAddress: '',
    cumulativeGasUsed: '693910',
    from: '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207',
    gas: '335208',
    gasPrice: '20000000000',
    gasUsed: '21000',
    hash: '0x342e9d73e10004af41d04973339fc7219dbadcbb5629730cfe65e9f9cb15ff91',
    input: '0x',
    isError: '0',
    nonce: '1',
    timeStamp: '1543596356',
    transactionIndex: '13',
    txreceipt_status: '1',
    value: '50000000000000000',
  },
  {
    blockNumber: '4535106',
    confirmations: '4',
    contractAddress: '',
    cumulativeGasUsed: '693910',
    from: '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207',
    gas: '335208',
    gasPrice: '20000000000',
    gasUsed: '21000',
    hash: '0x342e9d73e10004af41d04973139fc7219dbadcbb5629730cfe65e9f9cb15ff91',
    input: '0x11',
    isError: '0',
    nonce: '1',
    timeStamp: '1543596356',
    to: '0xb2d191b6fe03c5b8a1ab249cfe88c37553357a23',
    transactionIndex: '13',
    txreceipt_status: '1',
    value: '50000000000000000',
  },
];

const TOKEN_TRANSACTIONS = [
  {
    type: 'TokenTransfer',
    id: '0x0084a97e014600008101ba45dd64e71e',
    attributes: {
      blockCreationTime: 1570440625,
      cursor: '0x0084a97e014600008101ba45dd64e71e',
      decimals: 18,
      globalRank: [8694142, 326, 0],
      symbol: 'DAI',
      transactionGasLimit: '600632',
      transactionGasPrice: '9000000000',
      transactionGasUsed: '570632',
      value: '0',
    },
    relationships: {
      contractMessage: {
        data: {
          type: 'ContractMessage',
          id: 'msg:0xd8397138bb93d56e50d01e92a9eae99ebd3ae28844acdaa4663976a5501116cf:4',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084a97e014600008101ba45dd64e71e/contractMessage',
        },
      },
      from: {
        data: {
          type: 'Account',
          id: '0xdfa6edae2ec0cf1d4a60542422724a48195a5071',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084a97e014600008101ba45dd64e71e/from',
        },
      },
      logEntry: {
        data: {
          type: 'LogEntry',
          id: 'log:0xd8397138bb93d56e50d01e92a9eae99ebd3ae28844acdaa4663976a5501116cf:0',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084a97e014600008101ba45dd64e71e/logEntry',
        },
      },
      originator: {
        data: {
          type: 'Account',
          id: '0x925488c7cd7e5eb3441885c6c1dfdbea875e08f7',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084a97e014600008101ba45dd64e71e/originator',
        },
      },
      to: {
        data: {
          type: 'Account',
          id: '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084a97e014600008101ba45dd64e71e/to',
        },
      },
      token: {
        data: {
          type: 'Token',
          id: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084a97e014600008101ba45dd64e71e/token',
        },
      },
      transaction: {
        data: {
          type: 'Transaction',
          id: '0xd8397138bb93d56e50d01e92a9eae99ebd3ae28844acdaa4663976a5501116cf',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084a97e014600008101ba45dd64e71e/transaction',
        },
      },
    },
    links: {
      self: 'https://api.aleth.io/v1/token-transfers/0x0084a97e014600008101ba45dd64e71e',
    },
  },
  {
    type: 'TokenTransfer',
    id: '0x0084707c004d000181011ceb2f8b8308',
    attributes: {
      blockCreationTime: 1570244087,
      cursor: '0x0084707c004d000181011ceb2f8b8308',
      decimals: 18,
      globalRank: [8679548, 77, 1],
      symbol: 'DAI',
      transactionGasLimit: '993379',
      transactionGasPrice: '1440000000',
      transactionGasUsed: '647253',
      value: '0',
    },
    relationships: {
      contractMessage: {
        data: {
          type: 'ContractMessage',
          id: 'msg:0xc0016b89b3b525b30d73f242653b0d80ec3ebf285376dff5bb52cef3261498b2:5',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084707c004d000181011ceb2f8b8308/contractMessage',
        },
      },
      from: {
        data: {
          type: 'Account',
          id: '0xdfa6edae2ec0cf1d4a60542422724a48195a5071',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084707c004d000181011ceb2f8b8308/from',
        },
      },
      logEntry: {
        data: {
          type: 'LogEntry',
          id: 'log:0xc0016b89b3b525b30d73f242653b0d80ec3ebf285376dff5bb52cef3261498b2:1',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084707c004d000181011ceb2f8b8308/logEntry',
        },
      },
      originator: {
        data: {
          type: 'Account',
          id: '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084707c004d000181011ceb2f8b8308/originator',
        },
      },
      to: {
        data: {
          type: 'Account',
          id: '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084707c004d000181011ceb2f8b8308/to',
        },
      },
      token: {
        data: {
          type: 'Token',
          id: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084707c004d000181011ceb2f8b8308/token',
        },
      },
      transaction: {
        data: {
          type: 'Transaction',
          id: '0xc0016b89b3b525b30d73f242653b0d80ec3ebf285376dff5bb52cef3261498b2',
        },
        links: {
          related: 'https://api.aleth.io/v1/token-transfers/0x0084707c004d000181011ceb2f8b8308/transaction',
        },
      },
    },
    links: {
      self: 'https://api.aleth.io/v1/token-transfers/0x0084707c004d000181011ceb2f8b8308',
    },
  },
];

const ETH_TX_HISTORY_DATA = {
  message: 'OK',
  result: ETH_TRANSACTIONS,
  status: '1',
};

const ETH_TX_HISTORY_DATA_FROM_BLOCK = {
  message: 'OK',
  result: [ETH_TRANSACTIONS[0], ETH_TRANSACTIONS[1]],
  status: '1',
};

const TOKEN_TX_HISTORY_DATA = {
  data: TOKEN_TRANSACTIONS,
};

const TOKEN_TX_HISTORY_DATA_FROM_BLOCK = {
  data: [TOKEN_TRANSACTIONS[0]],
};

const MOCK_FETCH_TX_HISTORY_DATA_OK = {
  'https://api.aleth.io/v1/token-transfers?filter[to]=0x6bf137f335ea1b8f193b8f6ea92561a60d23a207': TOKEN_TX_HISTORY_DATA,
  'https://api.aleth.io/v1/token-transfers?filter[to]=0x6bf137f335ea1b8f193b8f6ea92561a60d23a207&page[prev]=0x003e7ffff00000000000000000000000': TOKEN_TX_HISTORY_DATA_FROM_BLOCK,
  'https://api.etherscan.io/api?module=account&action=txlist&address=0x6bf137f335ea1b8f193b8f6ea92561a60d23a207&tag=latest&page=1': ETH_TX_HISTORY_DATA,
  'https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=0x6bf137f335ea1b8f193b8f6ea92561a60d23a207&tag=latest&page=1': ETH_TX_HISTORY_DATA,
  'https://api.etherscan.io/api?module=account&action=txlist&address=0x6bf137f335ea1b8f193b8f6ea92561a60d23a207&tag=latest&page=1&startBlock=999': ETH_TX_HISTORY_DATA_FROM_BLOCK,
};

const MOCK_FETCH_TX_HISTORY_DATA_ERROR = {
  status: '0',
};

describe('TransactionController', () => {
  beforeEach(() => {
    for (const key in mockFlags) {
      mockFlags[key] = null;
    }
  });

  it('should set default state', () => {
    const controller = new TransactionController();
    expect(controller.state).toEqual({ methodData: {}, transactions: [] });
  });

  it('should set default config', () => {
    const controller = new TransactionController();
    expect(controller.config).toEqual({
      interval: 5000,
      provider: undefined,
    });
  });

  it('should poll and update transaction statuses in the right interval', () => {
    return new Promise((resolve) => {
      const mock = stub(TransactionController.prototype, 'queryTransactionStatuses');
      new TransactionController({ interval: 10 });
      expect(mock.called).toBe(true);
      expect(mock.calledTwice).toBe(false);
      setTimeout(() => {
        expect(mock.calledTwice).toBe(true);
        mock.restore();
        resolve();
      }, 15);
    });
  });

  it('should clear previous interval', () => {
    const mock = stub(global, 'clearTimeout');
    const controller = new TransactionController({ interval: 1337 });
    return new Promise((resolve) => {
      setTimeout(() => {
        controller.poll(1338);
        expect(mock.called).toBe(true);
        mock.restore();
        resolve();
      }, 100);
    });
  });

  it('should not update the state if there are no updates on transaction statuses', () => {
    return new Promise((resolve) => {
      const controller = new TransactionController({ interval: 10 });
      const func = stub(controller, 'update');
      setTimeout(() => {
        expect(func.called).toBe(false);
        func.restore();
        resolve();
      }, 20);
    });
  });

  it('should throw when adding invalid transaction', () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController();
      try {
        await controller.addTransaction({ from: 'foo' } as any);
      } catch (error) {
        expect(error.message).toContain('Invalid "from" address');
        resolve();
      }
    });
  });

  it('should add a valid transaction', async () => {
    const controller = new TransactionController({ provider: PROVIDER });
    const from = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
    controller.context = {
      NetworkController: MOCK_NETWORK,
    } as any;
    controller.onComposed();
    await controller.addTransaction({
      from,
      to: from,
    });
    expect(controller.state.transactions[0].transaction.from).toBe(from);
    expect(controller.state.transactions[0].networkID).toBe(MOCK_NETWORK.state.network);
    expect(controller.state.transactions[0].status).toBe('unapproved');
  });

  it('should cancel a transaction', () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController({ provider: PROVIDER });
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      const from = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
      const { result } = await controller.addTransaction({
        from,
        to: from,
      });
      controller.cancelTransaction('foo');
      controller.hub.once(`${controller.state.transactions[0].id}:finished`, () => {
        expect(controller.state.transactions[0].transaction.from).toBe(from);
        expect(controller.state.transactions[0].status).toBe('rejected');
      });
      controller.cancelTransaction(controller.state.transactions[0].id);
      result.catch((error) => {
        expect(error.message).toContain('User rejected the transaction');
        resolve();
      });
    });
  });

  it('should wipe transactions', async () => {
    const controller = new TransactionController({ provider: PROVIDER });
    controller.wipeTransactions();
    controller.context = {
      NetworkController: MOCK_NETWORK,
    } as any;
    controller.onComposed();
    const from = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
    await controller.addTransaction({
      from,
      to: from,
    });
    controller.wipeTransactions();
    expect(controller.state.transactions).toHaveLength(0);
  });

  it('should fail to approve an invalid transaction', () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController({
        provider: PROVIDER,
        sign: () => {
          throw new Error('foo');
        },
      });
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      const from = '0xe6509775f3f3614576c0d83f8647752f87cd6659';
      const to = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
      const { result } = await controller.addTransaction({ from, to });
      result.catch((error) => {
        const { transaction, status } = controller.state.transactions[0];
        expect(transaction.from).toBe(from);
        expect(transaction.to).toBe(to);
        expect(status).toBe('failed');
        expect(error.message).toContain('foo');
        resolve();
      });
      await controller.approveTransaction(controller.state.transactions[0].id);
    });
  });

  it('should fail transaction if gas calculation fails', () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController({ provider: PROVIDER });
      const from = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      mockFlags.estimateGas = 'Uh oh';
      try {
        await controller.addTransaction({
          from,
          to: from,
        });
      } catch (error) {
        expect(error.message).toContain('Uh oh');
        resolve();
      }
    });
  });

  it('should fail if no sign method defined', () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController({
        provider: PROVIDER,
      });
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      const from = '0xe6509775f3f3614576c0d83f8647752f87cd6659';
      const to = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
      const { result } = await controller.addTransaction({ from, to });
      result.catch((error) => {
        const { transaction, status } = controller.state.transactions[0];
        expect(transaction.from).toBe(from);
        expect(transaction.to).toBe(to);
        expect(status).toBe('failed');
        expect(error.message).toContain('No sign method defined');
        resolve();
      });
      await controller.approveTransaction(controller.state.transactions[0].id);
    });
  });

  it('should approve a transaction', () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController({
        provider: PROVIDER,
        sign: async (transaction: any) => transaction,
      });
      const from = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      await controller.addTransaction({
        from,
        gas: '0x0',
        gasPrice: '0x0',
        to: from,
        value: '0x0',
      });
      controller.hub.once(`${controller.state.transactions[0].id}:finished`, () => {
        const { transaction, status } = controller.state.transactions[0];
        expect(transaction.from).toBe(from);
        expect(status).toBe('submitted');
        resolve();
      });
      controller.approveTransaction(controller.state.transactions[0].id);
    });
  });

  it('should query transaction statuses', () => {
    return new Promise((resolve) => {
      const controller = new TransactionController({
        provider: PROVIDER,
        sign: async (transaction: any) => transaction,
      });
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      controller.state.transactions.push({
        from: MOCK_PRFERENCES.state.selectedAddress,
        id: 'foo',
        networkID: '3',
        status: 'submitted',
        transactionHash: '1337',
      } as any);
      controller.state.transactions.push({} as any);

      controller.hub.once(`${controller.state.transactions[0].id}:confirmed`, () => {
        expect(controller.state.transactions[0].status).toBe('confirmed');
        resolve();
      });
      controller.queryTransactionStatuses();
    });
  });

  it('should fetch all the transactions from an address, including incoming transactions, in ropsten', async () => {
    globalAny.fetch = mockFetchs(MOCK_FETCH_TX_HISTORY_DATA_OK);
    const controller = new TransactionController({ provider: PROVIDER });
    controller.wipeTransactions();
    controller.context = {
      NetworkController: MOCK_NETWORK,
    } as any;
    controller.onComposed();
    expect(controller.state.transactions).toHaveLength(0);

    const from = '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207';
    const latestBlock = await controller.fetchAll(from);
    expect(controller.state.transactions).toHaveLength(4);
    expect(latestBlock).toBe('4535101');
    expect(controller.state.transactions[0].transaction.to).toBe(from);
  });

  it('should fetch all the transactions from an address, including incoming token transactions, in mainnet', async () => {
    globalAny.fetch = mockFetchs(MOCK_FETCH_TX_HISTORY_DATA_OK);
    const controller = new TransactionController({ provider: MAINNET_PROVIDER });
    controller.wipeTransactions();
    controller.context = {
      NetworkController: MOCK_MAINNET_NETWORK,
    } as any;
    controller.onComposed();
    expect(controller.state.transactions).toHaveLength(0);

    const from = '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207';
    const latestBlock = await controller.fetchAll(from);
    expect(controller.state.transactions).toHaveLength(6);
    expect(latestBlock).toBe('4535101');
    expect(controller.state.transactions[0].transaction.to).toBe(from);
  });

  it('should fetch all the transactions from an address, including incoming transactions, in mainnet from block', async () => {
    globalAny.fetch = mockFetchs(MOCK_FETCH_TX_HISTORY_DATA_OK);
    const controller = new TransactionController({ provider: MAINNET_PROVIDER });
    controller.wipeTransactions();
    controller.context = {
      NetworkController: MOCK_MAINNET_NETWORK,
    } as any;
    controller.onComposed();
    expect(controller.state.transactions).toHaveLength(0);

    const from = '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207';
    const latestBlock = await controller.fetchAll(from, { fromBlock: '999' });
    expect(controller.state.transactions).toHaveLength(3);
    expect(latestBlock).toBe('4535101');
    expect(controller.state.transactions[0].transaction.to).toBe(from);
  });

  it('should return', async () => {
    globalAny.fetch = mockFetch(MOCK_FETCH_TX_HISTORY_DATA_ERROR);
    const controller = new TransactionController({ provider: PROVIDER });
    controller.wipeTransactions();
    controller.context = {
      NetworkController: MOCK_NETWORK,
    } as any;
    controller.onComposed();
    expect(controller.state.transactions).toHaveLength(0);
    const from = '0x6bf137f335ea1b8f193b8f6ea92561a60d23a207';
    const result = await controller.fetchAll(from);
    expect(controller.state.transactions).toHaveLength(0);
    expect(result).toBeUndefined();
  });

  it('should handle new method data', async () => {
    const controller = new TransactionController({ provider: MOCK_MAINNET_NETWORK });
    controller.context = {
      NetworkController: MOCK_MAINNET_NETWORK,
    } as any;
    controller.onComposed();
    const registry = await controller.handleMethodData('0xf39b5b9b');
    expect(registry.parsedRegistryMethod).toEqual({
      args: [{ type: 'uint256' }, { type: 'uint256' }],
      name: 'Eth To Token Swap Input',
    });
    expect(registry.registryMethod).toEqual('ethToTokenSwapInput(uint256,uint256)');
  });

  it('should handle known method data', async () => {
    const controller = new TransactionController({ provider: MOCK_MAINNET_NETWORK });
    controller.context = {
      NetworkController: MOCK_MAINNET_NETWORK,
    } as any;
    controller.onComposed();
    const registry = await controller.handleMethodData('0xf39b5b9b');
    expect(registry.parsedRegistryMethod).toEqual({
      args: [{ type: 'uint256' }, { type: 'uint256' }],
      name: 'Eth To Token Swap Input',
    });
    const registryLookup = stub(controller, 'registryLookup' as any);
    await controller.handleMethodData('0xf39b5b9b');
    expect(registryLookup.called).toBe(false);
  });

  it('should stop a transaction', async () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController({
        provider: PROVIDER,
        sign: async (transaction: any) => transaction,
      });
      const from = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      const { result } = await controller.addTransaction({
        from,
        gas: '0x0',
        gasPrice: '0x1',
        to: from,
        value: '0x0',
      });
      result.catch((error) => {
        expect(error.message).toContain('User cancelled the transaction');
        resolve();
      });
      controller.stopTransaction(controller.state.transactions[0].id);
    });
  });

  it('should fail to stop a transaction if no sign method', async () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController({
        provider: PROVIDER,
      });
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      const from = '0xe6509775f3f3614576c0d83f8647752f87cd6659';
      const to = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
      await controller.addTransaction({ from, to });
      try {
        controller.stopTransaction('nonexistent');
        await controller.stopTransaction(controller.state.transactions[0].id);
      } catch (error) {
        expect(error.message).toContain('No sign method defined');
        resolve();
      }
    });
  });

  it('should speed up a transaction', async () => {
    return new Promise(async (resolve) => {
      const controller = new TransactionController({
        provider: PROVIDER,
        sign: async (transaction: any) => transaction,
      });
      const from = '0xc38bf1ad06ef69f0c04e29dbeb4152b4175f0a8d';
      controller.context = {
        NetworkController: MOCK_NETWORK,
      } as any;
      controller.onComposed();
      await controller.addTransaction({
        from,
        gas: '0x0',
        gasPrice: '0x50fd51da',
        to: from,
        value: '0x0',
      });
      await controller.speedUpTransaction(controller.state.transactions[0].id);

      expect(controller.state.transactions).toHaveLength(2);
      expect(controller.state.transactions[1].transaction.gasPrice).toBe('0x5916a6d6');
      resolve();
    });
  });
});
