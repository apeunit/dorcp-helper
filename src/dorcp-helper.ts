import { ExecuteResult, InstantiateResult, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/stargate";
import { toBase64, toUtf8 } from '@cosmjs/encoding';

interface DORCPInstance {
    readonly contractAddress: string

    // actions
    instantiate: (txSigner: string, codeId: number) => Promise<InstantiateResult>
    create: (txSigner: string, id: string, description:string, proposer: string, validators: string[], cw20_whitelist: string[], funds: Coin) => Promise<ExecuteResult>
    topup: (txSigner: string, cw20Address: string, id: string, amountCW20: string) => Promise<ExecuteResult>
    status: (id: string) => Promise<any>
    list: () => Promise<any>
    approve: (txSigner: string, id: string) => Promise<ExecuteResult>
    refund: (txSigner: string, id: string) => Promise<ExecuteResult>
  }

interface DORCPContract {
    use: (contractAddress: string) => DORCPInstance
}

export async function InstantiateDORCP(senderAddress: string, client: SigningCosmWasmClient, codeId: number) {
    const instantiateData = await client.instantiate(
        senderAddress,
        codeId,
        {},
        'instantiate() of the Rust smart contract'
    );
    return instantiateData
}

export const DORCP = (client: SigningCosmWasmClient): DORCPContract => {
    const use = (contractAddress: string): DORCPInstance => {
        const create = async (senderAddress: string, id: string, description: string, proposer: string, validators: string[], cw20_whitelist: string[], funds: Coin): Promise<ExecuteResult> => {
            const createMsg = {
                create: {
                    "id": id,
                    "description": description,
                    "validators": validators,
                    "proposer": proposer,
                    "source": "unused",
                    "cw20_whitelist": cw20_whitelist,
                }
            }
            const result = await client.execute(senderAddress, contractAddress, createMsg, "DORCP.create()", [funds])
            return result
        }

        const topup = async (senderAddress: string, cw20Address: string, id: string, amountCW20: string): Promise<ExecuteResult> => {
            // does not actually call the DORCP Escrow contract - this calls the
            // CW20 contract to send CW20 tokens to the Escrow contract, with a
            // message to the Escrow contract that it is for a particular escrow
            // id.
            const topup = {top_up: {id: id}}
            const topupBin = toBase64(toUtf8(JSON.stringify(topup)))
            const result = await client.execute(senderAddress, cw20Address, {send: {contract: contractAddress, amount: amountCW20, msg: topupBin}});
            return result
        }

        const status = async(id: string): Promise<any> => {
            const result = await client.queryContractSmart(contractAddress, {details: {id: id}})
            return result
        }

        const list = async(): Promise<any> => {
            const result = await client.queryContractSmart(contractAddress, {list: {}})
            return result
        }

        const approve = async (senderAddress: string, id: string): Promise<ExecuteResult> => {
            const result = await client.execute(senderAddress, contractAddress, {approve: {"id": id}});
            return result;
        }
        const refund = async (senderAddress: string, id: string): Promise <ExecuteResult> => {
            const result = await client.execute(senderAddress, contractAddress, {refund: {"id": id}});
            return result
        }
        return {
            contractAddress,
            instantiate,
            create,
            topup,
            status,
            list,
            approve,
            refund,
        };
    }
    return {use};
}