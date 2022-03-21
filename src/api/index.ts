import { AirdropService } from './service'

const API = {
  airdrop: {
    getUserInfo(wallet: string) {
      return AirdropService.post('/user/find', { wallet })
    },
    getDiscordUser(token: string) {
      return AirdropService.post('/user/discord/find', { token })
    },
    bindDiscord(data: { token: string; wallet: string }) {
      return AirdropService.post('/user/discord/binding', data)
    },
    getUserVoteInfo(data: { address: string; buildName: string }) {
      return AirdropService.post('/user/vote/find', data)
    },
    registerVote(data: { buildName: string; message: string; signature: string; wallet: string; address: string }) {
      return AirdropService.post('/user/vote/binding', data)
    }
  }
}

export default API
