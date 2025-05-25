# Cyfrin Updraft TSender Application

TSender/Aidropper is a full-stack dApp allowing users to connect their wallets, approve ERC20 tokens, and send them to a recipient. This project is part of the Cyfrin Updraft Full-Stack Web3 Development Crash Course.

## Course project
https://github.com/Cyfrin/ts-tsender-ui-cu

## Fleek deployment
https://harsh-nail-teeny.on-fleek.app/


## Tools used
- **Web3**: Wagmi, RainbowKit, Viem, Metamask via Synpress
- **Frontend**: Next.js Typescript 
- **Testing**: Playwright, Synpress, Vitest 
- **Deployment**: fleek.xyz

## Process
1. Connect Metamask wallet
2. Enter token address (such as the course's mock token address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512)
3. Enter recipient address (ensure you've imported the token address on both your and their Metamask accounts)
4. Enter amount you want to send in wei (it will show the conversion)
5. Send tokens
6. After signing the transactions, you'll receive a transaction confirmed message