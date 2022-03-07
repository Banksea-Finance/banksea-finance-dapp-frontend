import { Service } from './service'

const API = {
  core: {
    user: {
      bindingUser(token: string, wallet: string) {
        return Service.post('/blindboxes/binding', { token, wallet })
      },
      getBoundUserByWallet(wallet?: string) {
        return wallet ? Service.post('/blindboxes/user', { wallet }) : undefined
      },
      getUserByToken(token?: string) {
        return token ? Service.post('/blindboxes/findUserByToken', { token }) : undefined
      }
    }
  }
}

export default API
