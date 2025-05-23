"use client"

import TextInput from "@/components/ui/InputField"
import { useState, useMemo } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants"
import {useChainId, useConfig, useAccount} from "wagmi"
import {readContract} from "@wagmi/core"
import { calculateTotal } from "@/utils"
 
export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("not address found, please use a supported chain")
            return 0
        }
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
        })
        return response as number
    }

    async function handleSubmit(){
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)
        
        
    }

    return(
        <div>
            <TextInput
            label="Token Address"
            placeholder="0x"
            value={tokenAddress}
            onChange={e => setTokenAddress(e.target.value)}
            />

<TextInput
            label="Recipients"
            placeholder="0x1234, 0x1235"
            value={recipients}
            onChange={e => setRecipients(e.target.value)}
            large={true}
            />

<TextInput
            label="Amount"
            placeholder="100, 200, 300"
            value={amounts}
            onChange={e => setAmounts(e.target.value)}
            large={true}
            />

            <button
            onClick={handleSubmit}
            className="
                bg-blue-600 
                hover:bg-blue-700 
                active:scale-95 
                text-white 
                font-semibold 
                py-2 
                px-6 
                rounded-lg 
                shadow-md 
                focus:outline-none 
                focus:ring-2 
                focus:ring-blue-300 
                transition 
                duration-200 
                ease-in-out
            "
            >
            Send tokens
            </button>
        </div>
    )
}