import { ConnectButton } from "@rainbow-me/rainbowkit"
import { FaGithub } from "react-icons/fa"
import Image from "next/image"

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-semibold">tsender</h1>
      </div>

      <div className="flex items-center space-x-4">
        <a
          href="https://github.com/samparke/ts-tsender-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded hover:bg-gray-100"
          aria-label="View source on GitHub"
        >
          <FaGithub size={24} />
        </a>
        <ConnectButton />
      </div>
    </header>
  )
}