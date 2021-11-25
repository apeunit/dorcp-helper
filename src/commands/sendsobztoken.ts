import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient} from '../deploy'
import { CW20 } from '../cw20-helper';
import { doriumOptions } from '../base-helper';
import 'dotenv/config'

const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class SendValueToken extends Command {
  static description = 'Send Value Token to an (human controlled) address. Do not use for sending to smart contracts.'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'recipient'}, {name: 'amount'}]

  async run() {
    const {args} = this.parse(SendValueToken);

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c  = readContractsJson();

    const value = CW20(client, doriumOptions).use(c.deployed_contracts.valuetoken);
    var transferResult = await value.transfer(account.address, args.recipient, args.amount);
    console.log(transferResult);
  }
}
