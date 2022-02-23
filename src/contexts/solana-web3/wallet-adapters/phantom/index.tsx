import React from 'react'
import { WalletAdapter } from '@/contexts/solana-web3'
import EventEmitter from 'eventemitter3'
import { PublicKey, Transaction } from '@solana/web3.js'
import { notify } from '@/contexts/theme/components'

type PhantomEvent = 'disconnect' | 'connect'

type PhantomRequestMethod = 'connect' | 'disconnect' | 'signTransaction' | 'signAllTransactions'

interface PhantomProvider {
  isPhantom: boolean
  publicKey?: PublicKey
  isConnected?: boolean
  autoApprove?: boolean
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  on: (event: PhantomEvent, handler: (args: any) => void) => void
  request: (method: PhantomRequestMethod, params: any) => Promise<any>
  listeners: (event: PhantomEvent) => (() => void)[]
}

export class PhantomWalletAdapter extends EventEmitter implements WalletAdapter {
  _provider?: PhantomProvider

  constructor() {
    super()
    this.connect = this.connect.bind(this)

    if ((window as any)?.solana?.isPhantom) {
      return (this._provider = (window as any).solana)
    }
  }

  get connected() {
    return this._provider?.isConnected || false
  }

  get autoApprove() {
    return this._provider?.autoApprove || false
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    if (!this._provider) {
      return transactions
    }

    return this._provider.signAllTransactions(transactions)
  }

  get publicKey() {
    return this._provider?.publicKey ?? PublicKey.default
  }

  async signTransaction(transaction: Transaction) {
    if (!this._provider) {
      return transaction
    }

    return this._provider.signTransaction(transaction)
  }

  async signAllTransaction(txs: Transaction[]) {
    if (!this._provider) {
      return txs
    }

    return this._provider.signAllTransactions(txs)
  }

  async connect() {
    const provider = this._provider

    if (!provider || !provider.isPhantom) {
      notify({
        title: 'Phantom Not Found!',
        message: (
          <p>
            Please install Phantom wallet from&nbsp;
            <a href="https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa">
              Chrome Web Store
            </a>
          </p>
        )
      })
      return Promise.reject()
    }

    return await provider.connect()
  }

  disconnect() {
    this._provider?.disconnect()
  }
}
