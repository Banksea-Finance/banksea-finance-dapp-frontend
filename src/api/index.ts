import { AirdropService, DefaultService } from './service'

const API = {
  core: {
    user: {
      bindingUser(token: string, wallet: string) {
        return DefaultService.post('/blindboxes/binding', { token, wallet })
      },
      getBoundUserByWallet(wallet?: string) {
        return wallet ? DefaultService.post('/blindboxes/user', { wallet }) : undefined
      },
      getUserByToken(token?: string) {
        return token ? DefaultService.post('/blindboxes/findUserByToken', { token }) : undefined
      }
    }
  },
  airdrop: {
    findGrantVoteInfo(address: string, buildName: string) {
      return AirdropService.post('/user/vote/find', { address, buildName })
    }
  }
}

export default API
