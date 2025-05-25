"use client"


import HomeContent from "@/components/HomeContent";
import {useAccount} from "wagmi"

export default function Home() {
  const {isConnected} = useAccount()
  return (
   <div className='py-10'>
    {isConnected? (
      <div className="text-white">
        <HomeContent/>
      </div>
      ) : (
      <div className="text-white">
        Please connect wallet...
      </div>
      ) 
    }
    </div>
  );
}
