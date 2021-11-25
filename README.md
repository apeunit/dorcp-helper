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
  transactionHash: 'FB04DE429ACBB99DC24586454C56114AC54C9E682625A03BAD6ABAD99E449D8D'
}
{
  ...more details
}
CW20 (Value) Instantiated {
  contractAddress: 'wasm1suhgf5svhu4usrurvxzlgn54ksxmn8glszahxx',
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: '38D9725BE9998E685681F474E7B06FD251472399801B7D3B4A81AB4C1362C855'
}
CW20 (Sobz) Instantiated {
  contractAddress: 'wasm1yyca08xqdgvjz0psg56z67ejh9xms6l49ntww0',
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: '52643337FE75E24F02EF11101A7077E60CB3BF2A9CEB02ECD1678A94EDB9B7A2'
}
DORCP Instantiated {
  contractAddress: 'wasm1aakfpghcanxtc45gpqlx8j3rq0zcpyf4duy76f',
  logs: [ { msg_index: 0, log: '', events: [Array] } ],
  transactionHash: '07210B80EB1B0C26CBE3FC765734619F5383275139378005A331932F378CF1A0'
}
DORNEX: Telling It About Value/SoBz Tokens
{
  ...more details
}
contracts2 {
  contracts: {
    cw20: {
      codeId: 1,
      transactionHash: 'D04DF8FC67327F80612A908B9034064E21E3E02303A5942039A760302FA9130C'
    },
    dorcp: {
      codeId: 2,
      transactionHash: 'C6C51CB704FD9EAF63266885F9C45C34DBEA1D0BC3C9BE4469D25FBB0E8EAB5A'
    },
    dornex: {
      codeId: 3,
      transactionHash: 'AB8D3EA3287B568BC094B4453E1D9A36E84534107723D74DBE73CD3684BA6B94'
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
Now you can create a Proposal, fund it with Value tokens, and approve/reject them.
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
# Commands
<!-- commands -->
* [`dorcp approve [FILE]`](#dorcp-approve-file)
* [`dorcp create [ID] [DESCRIPTION]`](#dorcp-create-id-description)
* [`dorcp deploy`](#dorcp-deploy)
* [`dorcp help [COMMAND]`](#dorcp-help-command)
* [`dorcp list [FILE]`](#dorcp-list-file)
* [`dorcp refund [ID]`](#dorcp-refund-id)
* [`dorcp status [ID]`](#dorcp-status-id)
* [`dorcp exchange [AMOUNT]`](#dorcp-exchange-id-amount)
* [`dorcp topup [ID] [AMOUNT]`](#dorcp-topup-id-amount)

## `dorcp approve [FILE]`

describe the command here

```
USAGE
  $ dorcp approve [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/approve.ts](https://github.com/randomshinichi/dorcpcli/blob/v0.0.0/src/commands/approve.ts)_

## `dorcp create [ID] [DESCRIPTION]`

Create a new DORium Community Proposal

```
USAGE
  $ dorcp create [ID] [DESCRIPTION]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/create.ts](https://github.com/randomshinichi/dorcpcli/blob/v0.0.0/src/commands/create.ts)_

## `dorcp deploy`

Uploads WASM smart contract binaries to the blockchain and instantiates a CW20 Value, SoBz, and DORCP instance. Details are pulled from the .env file.

```
USAGE
  $ dorcp deploy

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/deploy.ts](https://github.com/randomshinichi/dorcpcli/blob/v0.0.0/src/commands/deploy.ts)_

## `dorcp help [COMMAND]`

display help for dorcp

```
USAGE
  $ dorcp help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

## `dorcp list [FILE]`

describe the command here

```
USAGE
  $ dorcp list [FILE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/list.ts](https://github.com/randomshinichi/dorcpcli/blob/v0.0.0/src/commands/list.ts)_

## `dorcp refund [ID]`

describe the command here

```
USAGE
  $ dorcp refund [ID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/refund.ts](https://github.com/randomshinichi/dorcpcli/blob/v0.0.0/src/commands/refund.ts)_

## `dorcp status [ID]`

describe the command here

```
USAGE
  $ dorcp status [ID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/status.ts](https://github.com/randomshinichi/dorcpcli/blob/v0.0.0/src/commands/status.ts)_

## `dorcp exchange [AMOUNT]`

Send Value Token to DORNEX, getting SoBz token in return

```
USAGE
  $ dorcp exchange [AMOUNT]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/exchange.ts](https://github.com/randomshinichi/dorcpcli/blob/v0.0.0/src/commands/exchange.ts)_

## `dorcp topup [ID] [AMOUNT]`

send some CW20 tokens to a DORium Community Proposal

```
USAGE
  $ dorcp topup [ID] [AMOUNT]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/topup.ts](https://github.com/randomshinichi/dorcpcli/blob/v0.0.0/src/commands/topup.ts)_
<!-- commandsstop -->
