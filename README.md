dorcpcli
========

manage your DORIUM network, including DORium Community Proposals and deploying the Exchange with this CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dorcpcli.svg)](https://npmjs.org/package/dorcpcli)
[![Downloads/week](https://img.shields.io/npm/dw/dorcpcli.svg)](https://npmjs.org/package/dorcpcli)
[![License](https://img.shields.io/npm/l/dorcpcli.svg)](https://github.com/randomshinichi/dorcpcli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
Start wasmd in another shell.
`cp env-example .env`
Edit the .env file, put in your mnemonic_main, point it to your wasmd node etc. Note that it already points to the ./binaries/*.wasm files. If the smart contracts are changed, you'll have to place the new binaries here and rerun deploy.
```
MNEMONIC_MAIN=""
MNEMONIC_VALIDATOR=""
RPC_ENDPOINT=http://localhost:26657
ERC20_CONTRACT=./binaries/cw20_base-v0.10.2.wasm
DORIUM_PROPOSAL_CONTRACT=./binaries/proposal.wasm
DORNEX_CONTRACT=./binaries/exchange.wasm
```
Use the `deploy` command. This does the following:
1. The CW20, DORCP (proposals) and DORNEX (exchange) contracts are uploaded to the chain.
2. Creates two instances of CW20, the Value and SoBz token, and specifies that the DORNEX instance should have minting rights. Creates an instance of the DORCP, which manages Proposals. Creates an instance of DORNEX, and tells it where the Value and SoBz token smart contract addresses are.
3. Saves context in `contracts.json`, which is needed when you run further CLI commands.

```sh-session
$ ./bin/run deploy
Uploading CW20 Contract
Uploading DORCP Contract
Uploading DORNEX Contract
DORNEX Instantiated {
  contractAddress: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl',
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: '139D7F2A17D8CC9C4EF6E128A9824EE31C2E1C2DA2177CBFC2EC65C5505C3F95'
}
{
  contractAddress: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl',
  logs: [
    {
      msg_index: 0,
      log: '',
      events: [
        {
          type: 'instantiate',
          attributes: [
            {
              key: '_contract_address',
              value: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
            },
            { key: 'code_id', value: '3' }
          ]
        },
        {
          type: 'message',
          attributes: [
            { key: 'action', value: 'instantiate' },
            { key: 'module', value: 'wasm' },
            {
              key: 'sender',
              value: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek'
            }
          ]
        },
        {
          type: 'wasm',
          attributes: [
            {
              key: '_contract_address',
              value: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
            },
            { key: 'method', value: 'instantiate' },
            { key: 'exchanged', value: '0' },
            {
              key: 'value_token_address',
              value: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek'
            },
            {
              key: 'sobz_token_address',
              value: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek'
            }
          ]
        }
      ]
    }
  ],
  transactionHash: '139D7F2A17D8CC9C4EF6E128A9824EE31C2E1C2DA2177CBFC2EC65C5505C3F95'
}
CW20 (Value) Instantiated {
  contractAddress: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx',
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: '0B01490DEB184D7BBF65472D9B232F638942C5DC46E74E4A1CA9C44EEEC51788'
}
CW20 (Sobz) Instantiated {
  contractAddress: 'wasm1yyca08xqdgvjz0psg56z67ejh9xms6l49ntww0',
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: '84B0FED3FF44511052B16C739602FBCB7483757A8FEFBD906C1BD77A9514B47B'
}
DORCP Instantiated {
  contractAddress: 'wasm1aakfpghcanxtc45gpqlx8j3rq0zcpyf4duy76f',
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: '62F431C6BCFD9725B2252D806A0A760A4320E59C378910DA428EB560B4167874'
}
DORNEX: Telling It About Value/SoBz Tokens
{
  logs: [
    {
      msg_index: 0,
      log: '',
      events: [
        {
          type: 'execute',
          attributes: [
            {
              key: '_contract_address',
              value: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
            }
          ]
        },
        {
          type: 'message',
          attributes: [
            { key: 'action', value: 'execute' },
            { key: 'module', value: 'wasm' },
            {
              key: 'sender',
              value: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek'
            }
          ]
        },
        {
          type: 'wasm',
          attributes: [
            {
              key: '_contract_address',
              value: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
            },
            { key: 'method', value: 'set_tokens' },
            {
              key: 'value_token',
              value: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx'
            },
            {
              key: 'sobz_token',
              value: 'wasm1yyca08xqdgvjz0psg56z67ejh9xms6l49ntww0'
            }
          ]
        }
      ]
    }
  ],
  transactionHash: '7F893FF96B6F685F52A62314585C012999B2F1224593E15335536844A526A2A8'
}
contracts2 {
  contracts: {
    cw20: {
      codeId: 1,
      transactionHash: '6202566B026B78A16E5DA817A705229D8ABB2C60CDEDB6B3C3B5DE3311AAB530'
    },
    dorcp: {
      codeId: 2,
      transactionHash: '0D0D2C89BB433DE587AE0D10848C3BC190DF810F27B79017E092391715B1DDDD'
    },
    dornex: {
      codeId: 3,
      transactionHash: 'D65DCA934EE3BE39A93589DFF4977B6E336D617F3CD6722EC786EE7D00956DEC'
    }
  },
  deployed_contracts: {
    valuetoken: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx',
    sobztoken: 'wasm1yyca08xqdgvjz0psg56z67ejh9xms6l49ntww0',
    dorcp: 'wasm1aakfpghcanxtc45gpqlx8j3rq0zcpyf4duy76f',
    dornex: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
  }
}
```

You can check the token balances of any address with the balance command
```sh-session
$ ./bin/run balance wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek value token balance: 3040000000000
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek sobz token balance: 0
```

Now you can create a Proposal, fund it with Value tokens, and approve/reject them.

```sh-session
$ ./bin/run create prop-1 "Plant Trees in Sahara" "https://global.dorium.apeunit.com"
{
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: 'C57B6B1F27852B9D43A7660B35B96F202BA56A3A776D91FC4428DAB366691AF3'
}


$ ./bin/run list -d
{
  escrows: [
    {
      id: 'prop-1',
      url: 'https://global.dorium.apeunit.com',
      description: 'Plant Trees in Sahara',
      validators: [ 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek' ],
      proposer: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek',
      source: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek',
      native_balance: [ { denom: 'udor', amount: '1' } ],
      cw20_balance: [],
      cw20_whitelist: [ 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx' ],
      status: { Opened: {} }
    }
  ]
}


$ ./bin/run topup prop-1 200
Calling CW20 contract wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx to send 200 tokens to prop-1
{
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: 'B1A57301C593CB5B6A07F41FFE7851701B2A52D197FA72E3F4E3672BA3D94357'
}

$ ./bin/run balance wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek value token balance: 3039999999800
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek sobz token balance: 0

$ ./bin/run list -d
{
  escrows: [
    {
      id: 'prop-1',
      url: 'https://global.dorium.apeunit.com',
      description: 'Plant Trees in Sahara',
      validators: [ 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek' ],
      proposer: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek',
      source: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek',
      native_balance: [ { denom: 'udor', amount: '1' } ],
      cw20_balance: [
        {
          address: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx',  <================== NOTICE HOW THIS HAS CHANGED
          amount: '200'
        }
      ],
      cw20_whitelist: [ 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx' ],
      status: { Opened: {} }
    }
  ]
}


$ ./bin/run approve prop-1
{
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: 'ABEDD94F38EA070F7CD0D97488591DE59864DAEF165C24A9B021778970F5F3D4'
}


$ ./bin/run list -d
{
  escrows: [
    {
      id: 'prop-1',
      url: 'https://global.dorium.apeunit.com',
      description: 'Plant Trees in Sahara',
      validators: [ 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek' ],
      proposer: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek',
      source: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek',
      native_balance: [ { denom: 'udor', amount: '1' } ],
      cw20_balance: [
        {
          address: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx',   <=========== OKAY THE TOKENS AREN'T ACTUALLY THERE ANYMORE, THE PROPOSER HAS THEM. BUT MAYBE THIS IS GOOD FOR RECORD KEEPING?
          amount: '200'
        }
      ],
      cw20_whitelist: [ 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx' ],
      status: { Completed: {} }
    }
  ]
}

$ ./bin/run balance wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek value token balance: 3040000000000
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek sobz token balance: 0
```

Once you have Value tokens, you can send them to the DORNEX smart contract to exchange them 1:1 one way only to SoBz tokens using the `exchange` command.
```sh-session
$ ./bin/run exchange 100
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek value token balance: 3039999999800
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek sobz token balance: 200
Transferring 100 value token to wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl
{
  logs: [
    {
      msg_index: 0,
      log: '',
      events: [
        {
          type: 'execute',
          attributes: [
            {
              key: '_contract_address',
              value: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx'
            },
            {
              key: '_contract_address',
              value: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
            },
            {
              key: '_contract_address',
              value: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx'
            },
            {
              key: '_contract_address',
              value: 'wasm1yyca08xqdgvjz0psg56z67ejh9xms6l49ntww0'
            }
          ]
        },
        {
          type: 'message',
          attributes: [
            { key: 'action', value: 'execute' },
            { key: 'module', value: 'wasm' },
            {
              key: 'sender',
              value: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek'
            }
          ]
        },
        {
          type: 'wasm',
          attributes: [
            {
              key: '_contract_address',
              value: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx'
            },
            { key: 'action', value: 'send' },
            {
              key: 'from',
              value: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek'
            },
            {
              key: 'to',
              value: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
            },
            { key: 'amount', value: '100' },
            {
              key: '_contract_address',
              value: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
            },
            { key: 'method', value: 'try_exchange' },
            {
              key: 'account',
              value: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek'
            },
            { key: 'exchange', value: 'msg . amount' },
            {
              key: '_contract_address',
              value: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx'
            },
            { key: 'action', value: 'burn' },
            {
              key: 'from',
              value: 'wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl'
            },
            { key: 'amount', value: '100' },
            {
              key: '_contract_address',
              value: 'wasm1yyca08xqdgvjz0psg56z67ejh9xms6l49ntww0'
            },
            { key: 'action', value: 'mint' },
            {
              key: 'to',
              value: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek'
            },
            { key: 'amount', value: '100' }
          ]
        }
      ]
    }
  ],
  transactionHash: 'E5489544E7B118F90A7161B2F18355B6E17B7A66C1521B7C1A1E1A0984CFAB6D'
}
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek value token balance: 3039999999700
wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek sobz token balance: 300
DORNEX contract wasm1hrpna9v7vs3stzyd4z3xf00676kf78zp2vp0sl has exchanged 300 value->sobz tokens total
```
As you can see from the debug info above, DORNEX takes the Value token, tells the Value token CW20 contract to burn it, then tells SoBz token CW20 contract to mint the same number of tokens and give them to the sender.

<!-- usagestop -->