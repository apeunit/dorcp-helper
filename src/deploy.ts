import * as fs from 'fs';
import { AccountData, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import {calculateFee, StdFee, GasPrice} from "@cosmjs/stargate";
import { ExecuteResult, InstantiateResult, SigningCosmWasmClient, UploadResult } from '@cosmjs/cosmwasm-stargate';
import { parseCoins } from '@cosmjs/proto-signing';
import { CW20 } from "./cw20-base-helpers";
import { DORCP, InstantiateDORCP } from './dorcp-helper';
export const doriumTxFee = calculateFee(10000000, GasPrice.fromString("0.001udor"));

export async function getWalletAndMainAccount(mnemonic: string) {
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "wasm" });
	const [account] = await wallet.getAccounts();

	return {wallet, account};
}

export async function getSigningClient(rpcEndpoint: string, wallet: DirectSecp256k1HdWallet) {
    return await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, { prefix: "wasm"});
}

export function readContractsJson() {
	var con = JSON.parse(fs.readFileSync("contracts.json").toString());
	return con
}

export function writeContractsJson(obj: any) {
	fs.writeFileSync("contracts.json", JSON.stringify(obj, null, "\t"))
}


export async function uploadContractsSaveResult(cw20WasmPath: string, dorcpWasmPath: string, client: SigningCosmWasmClient, senderAddress: string) {
	const cw20Contract = fs.readFileSync(cw20WasmPath)
 	const dorcpContract = fs.readFileSync(dorcpWasmPath);

	const con_cw20 = await client.upload(senderAddress, cw20Contract, doriumTxFee);
	console.log("CW20 Uploaded Contract", con_cw20);
	const con_dorcp = await client.upload(senderAddress, dorcpContract, doriumTxFee);
	console.log("DORCP Uploaded Contract", con_dorcp);
	const contracts = {
		"contracts": {
			cw20: {codeId: con_cw20.codeId, transactionHash: con_cw20.transactionHash},
			dorcp: {codeId: con_dorcp.codeId, transactionHash: con_dorcp.transactionHash},
		},
	}
	return contracts
}

async function instantiateValueToken(contractData: UploadResult, account: AccountData, wallet: DirectSecp256k1HdWallet, client: SigningCosmWasmClient) {
	const initMsg = {
		name: 'Dorium Value Token',
		symbol: 'TREE',
		decimals: 2,
		initial_balances: [
			{ address: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek', amount: '3040000000000' }, // number of trees in the world according to Google
		],
		mint: {
			minter: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek',
		},
	};

	const instanceData = await client.instantiate(account.address, contractData.codeId, initMsg, "instantiating the DORCP contract", doriumTxFee);
	return instanceData
}

async function instantiateSobzToken(contractData: UploadResult, account: AccountData, wallet: DirectSecp256k1HdWallet, client: SigningCosmWasmClient) {
	const initMsg = {
		name: 'Dorium Social Business Token',
		symbol: 'SOBZ',
		decimals: 2,
		initial_balances: [
			{ address: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek', amount: '10000000000' }, // whatever, we can mint more later?
		],
		mint: {
			minter: 'wasm1ryuawewrukex42yh2kpydtpdh90ex096kaajek',
		},
	};

	const instanceData = await client.instantiate(account.address, contractData.codeId, initMsg, "instantiating the DORCP contract", doriumTxFee);
	return instanceData
}

export async function deploy(con: any, client: SigningCosmWasmClient, wallet: DirectSecp256k1HdWallet, account: AccountData) {
	try {
		const inst_cw20_value = await instantiateValueToken(con.contracts.cw20, account, wallet, client);
		console.log("CW20 (Value) Instantiated", inst_cw20_value);
		const inst_cw20_sobz = await instantiateSobzToken(con.contracts.cw20, account, wallet, client);
		console.log("CW20 (Sobz) Instantiated", inst_cw20_sobz);

		const inst_dorcp = await InstantiateDORCP(account.address, client, con.contracts.dorcp.codeId)
		console.log("DORCP Instantiated", inst_dorcp);
		const output = {
			"valuetoken": inst_cw20_value.contractAddress,
			"sobztoken": inst_cw20_sobz.contractAddress,
			"dorcp": inst_dorcp.contractAddress,
		}
		con.deployed_contracts = output;
		return con
	} catch (e) {
		throw e;
	}
}

const generateRandomString = (length=6)=>Math.random().toString(20).substr(2, length)
