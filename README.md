dorcpcli
========

manage your DORium Community Proposals with this CLI

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
```sh-session
$ npm install -g dorcpcli
$ dorcp COMMAND
running command...
$ dorcp (-v|--version|version)
dorcpcli/0.0.0 linux-x64 node-v16.10.0
$ dorcp --help [COMMAND]
USAGE
  $ dorcp COMMAND
...
```
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
* [`dorcp hello [FILE]`](#dorcp-hello-file)
* [`dorcp help [COMMAND]`](#dorcp-help-command)
