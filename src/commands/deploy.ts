import {Command, flags} from '@oclif/command'
import { deploy, uploadContractsSaveResult, getWalletAndMainAccount, writeContractsJson, getSigningClient } from '../deploy'

import 'dotenv/config'
const { ERC20_CONTRACT, DORIUM_PROPOSAL_CONTRACT, DORNEX_CONTRACT, MNEMONIC_MAIN, RPC_ENDPOINT } = process.env;
export default class Deploy extends Command {
  static description = 'Uploads WASM smart contract binaries to the blockchain and instantiates a CW20 Value, SoBz, and DORCP instance. Details are pulled from the .env file.'

  static flags = {
    help: flags.help({char: 'h'}),
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(Deploy)

    let {wallet, account} = await getWalletAndMainAccount(MNEMONIC_MAIN);
    const client = await getSigningClient(RPC_ENDPOINT, wallet)

    const contracts = await uploadContractsSaveResult(ERC20_CONTRACT, DORIUM_PROPOSAL_CONTRACT, DORNEX_CONTRACT, client, account.address)
    writeContractsJson(contracts)

    const contracts2 = await deploy(contracts, client, wallet, account)
    writeContractsJson(contracts2)
    console.log("contracts2", contracts2)
  }
}
