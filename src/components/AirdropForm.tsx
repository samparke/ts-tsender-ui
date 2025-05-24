"use client"

import TextInput from "@/components/ui/InputField"
import { useState, useMemo, useEffect } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants"
import {useChainId, useConfig, useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContracts} from "wagmi"
import {readContract, waitForTransactionReceipt} from "@wagmi/core"
import { calculateTotal, formatTokenAmount } from "@/utils"
import { CgSpinner } from "react-icons/cg";
 
export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId() // reads the currently used chainId
    const config = useConfig() // gives wagmi client
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]) // each time [amounts] change, recalculate with the values in input section
    const {data: hash, isPending, error, writeContractAsync} = useWriteContract()
    const [hasEnoughTokens, setHasEnoughTokens] = useState(true)
    const {isLoading: isConfirming, isSuccess: isConfirmed, isError} = useWaitForTransactionReceipt({
        confirmations: 1,
        hash,
    })
    const {data: tokenData} = useReadContracts({
        contracts: [

            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "decimals",
            },

            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "name",
            },

            {
                abi:erc20Abi, 
                address: tokenAddress as `0x${string}`,
                functionName: "balanceOf",
                args: [account.address],
            },
        ],
    })

    

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("not address found, please use a supported chain")
            return 0
        }
        const response = await readContract(config, { // wagmi read token details
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
        })
        return response as number
    }

    async function handleSubmit(){
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const result = await getApprovedAmount(tSenderAddress)
        
        if (result < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)],
            })
            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash,
            })

            console.log("Approval confirmed:", approvalReceipt)

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
        }
    }


    function getButtonContent() {
        if (isPending)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Confirming in wallet...</span>
                </div>
            )
        if (isConfirming)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <CgSpinner className="animate-spin" size={20} />
                    <span>Waiting for transaction to be included...</span>
                </div>
            )
        if (error || isError) {
            console.log(error)
            return (
                <div className="flex items-center justify-center gap-2 w-full">
                    <span>Error, see console.</span>
                </div>
            )
        }
        if (isConfirmed) {
            return "Transaction confirmed."
        }
    }


    useEffect(() => {
        const savedTokenAddress = localStorage.getItem("tokenAddress")
        const savedRecipients = localStorage.getItem("recipients")
        const savedAmounts  =localStorage.getItem("amounts")

        if (savedTokenAddress) {
            setTokenAddress(savedTokenAddress)
        }

        if (savedRecipients) {
            setRecipients(savedRecipients)
        }

        if (savedAmounts) {
            setAmounts(savedAmounts)
        }
    }, [])

    useEffect(() => {
        if (tokenAddress && total > 0 && tokenData?.[2]?.result as number !== undefined) {
            const userBalance = tokenData?.[2].result as number;
            setHasEnoughTokens(userBalance >= total);
        } else {
            setHasEnoughTokens(true);
        }
    }, [tokenAddress, total, tokenData]);

    useEffect(() => {
        console.log(tokenData)
    }, [tokenData])


    return(
        <div className={"max-w-2xl min-w-full xl:min-w-lg w-full lg:mx-auto p-6 flex flex-col gap-6 bg-white rounded-xl ring-[4px] border-2"}>
            
            
             <div className="space-y-6"> 
                <TextInput // input box
                label="Token Address"
                placeholder="0x"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
                />

                <TextInput // input box
                label="Recipients"
                placeholder="0x1234, 0x1235"
                value={recipients}
                onChange={e => setRecipients(e.target.value)}
                large={true}
                />

                <TextInput // input box
                label="Amount (wei)"
                placeholder="100, 200, 300"
                value={amounts}
                onChange={e => setAmounts(e.target.value)}
                large={true}
                />


<div className="bg-white border border-zinc-300 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-zinc-900 mb-3">Transaction Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-zinc-600">Token Name:</span>
                            <span className="font-mono text-zinc-900">
                                {tokenData?.[1]?.result as string}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-zinc-600">Amount (wei):</span>
                            <span className="font-mono text-zinc-900">{total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-zinc-600">Amount (tokens):</span>
                            <span className="font-mono text-zinc-900"> 
                                {formatTokenAmount(total, tokenData?.[0]?.result as number)} 
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    className={`cursor-pointer flex items-center justify-center w-full py-3 rounded-[9px] text-white transition-colors font-semibold relative border bg-blue-500 hover:bg-blue-600 border-blue-500"
                        } ${!hasEnoughTokens && tokenAddress ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleSubmit}
                    disabled={isPending || (!hasEnoughTokens && tokenAddress !== "")}
                >
                    {/* Gradient */}
                    <div className="absolute w-full inset-0 bg-gradient-to-b from-white/25 via-80% to-transparent mix-blend-overlay z-10 rounded-lg" />
                    {/* Inner shadow */}
                    <div className="absolute w-full inset-0 mix-blend-overlay z-10 inner-shadow rounded-lg" />
                    {/* White inner border */}
                    <div className="absolute w-full inset-0 mix-blend-overlay z-10 border-[1.5px] border-white/20 rounded-lg" />
                    {isPending || error || isConfirming
                        ? getButtonContent()
                        : !hasEnoughTokens && tokenAddress
                            ? "Insufficient token balance"
                                : "Send Tokens"}
                </button>
            </div>
        </div>
    )
}