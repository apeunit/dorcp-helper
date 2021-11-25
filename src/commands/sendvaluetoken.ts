import {Command, flags} from '@oclif/command'
import { readContractsJson, getWalletAndMainAccount, getSigningClient} from '../deploy'
import { CW20 } from '../cw20-helper';
import { doriumOptions } from '../base-helper';
import 'dotenv/config'

const { MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class SendSoBzToken extends Command {
  static description = 'Send SoBz Token to an (human controlled) address. Do not use for sending to smart contracts.'

  static flags = {
    help: flags.help({char: 'h'})
  }

  static args = [{name: 'recipient'}, {name: 'amount'}]

  async run() {
    const {args} = this.parse(SendSoBzToken);

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    var c  = readContractsJson();

    const sobz = CW20(client, doriumOptions).use(c.deployed_contracts.sobztoken);
    var transferResult = await sobz.transfer(account.address, args.recipient, args.amount);
    console.log(transferResult);
  }
}
