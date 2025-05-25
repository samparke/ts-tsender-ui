"use client"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"

export default function Header() {
    return (
        <nav className="px-8 py-4.5 border-b-[1px] border-black flex flex-row justify-between items-center bg-gray-800 xl:min-h-[77px]">
            <div className="flex items-center gap-2.5 md:gap-6">
                <a href="/" className="flex items-center gap-1 text-zinc-800">
                    <Image src="/airdropper-logo.png" alt="TSender" width={50} height={50} />
                    <h1 className="font-bold text-white text-2xl px-3 hidden md:block">Airdropper</h1>
                </a>
                <a
                    href="https://github.com/samparke/ts-tsender-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-white hover:bg-gray-300"
                    aria-label="View source on GitHub"
                >
                    <FaGithub className="h-5 w-5 text-black" />
                </a>
            </div>
            <h3 className="italic text-left hidden text-zinc-200 lg:block">
            Distribute tokens, instantly. 🪂
            </h3>
            <div className="flex items-center gap-4">
                <ConnectButton />
            </div>
        </nav>
    )
}