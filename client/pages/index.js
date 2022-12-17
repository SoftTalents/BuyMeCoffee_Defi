import BuyMeCoffee from '../utils/BuyMeCoffee.json'
import { ethers } from 'ethers'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const contractAddress = BuyMeCoffee.address
  const contractABI = BuyMeCoffee.abi

  // Component state
  const [currentAccount, setCurrentAccount] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [memos, setMemos] = useState([])

  const onNameChange = (event) => {
    setName(event.target.value)
  }

  const onMessageChange = (event) => {
    setMessage(event.target.value)
  }

  const isWalletConnected = async () => {
    try {
      const { ethereum } = window
      const accounts = await ethereum.request({method: 'eth_accounts'})
      console.log(`accounts: ${accounts}`)

      if (accounts.length > 0) {
        const account = accounts[0]
        console.log(`wallet is connected! ${account}`)
      } else {
        console.log(`make sure Metamask is connected`)
      }
    } catch (error) {
      console.log(`error: ${error}`)
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window

      if (!ethereum) {
        console.log(`please install Metamask`)
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      })

      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(`error: ${error}`)
    }
  }

  const buyCoffee = async () => {
    try {
      const {ethereum} = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, 'any')
        const signer = provider.getSigner()
        const buyMeCoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        console.log('buying coffee...')
        const coffeeTxn = await buyMeCoffee.buyCoffee(
          name ? name : 'Aaron',
          message ? message : 'Enjoy your coffee :)',
          {value: ethers.utils.parseEther('0.001')}
        )

        await coffeeTxn.wait()

        console.log(`Coffee purchased! transaction: ${coffeeTxn.hash}`)

        // clear the form fields
        setName('')
        setMessage('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getMemos = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const buyMeCoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        console.log('fetching memos from the blockchain...')
        const memos = await buyMeCoffee.getMemos()
        console.log('fetched!')
        setMemos(memos)
      } else {
        console.log(`Metamask is not connected`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let buyMeCoffee
    isWalletConnected()
    getMemos()

    const onNewMemo = (from, timestamp, name, message) => {
      console.log(`Memo received: ${from}`)
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        }
      ])
    }

    const { ethereum } = window
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, 'any')
      const signer = provider.getSigner()
      buyMeCoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      )
      buyMeCoffee.on('NewMemo', onNewMemo)
    }

    return () => {
      if (buyMeCoffee) {
        buyMeCoffee.off('NewMemo', onNewMemo)
      }
    }
  }, [])

  return (
    <div className = {styles.container}>
      <Head>
        <title>Buy CryptoHero a coffee!</title>
        <meta name='description' content='Tipping site' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className = {styles.main}>
        <h1 className = {styles.title}>
          Buy CryptoHero a coffee!
        </h1>
        {currentAccount ? (
          <div>
            <form>
              <div className="formgroup">
                <label>
                  Name
                </label>
                <br/>
                <input id='name' type='text' placeholder='Your name here...' onChange={onNameChange} />
              </div>
              <br/>
              <div className='formgroup'>
                <label>
                  Send CryptoHero a message
                </label>
                <br/>
                <textarea
                  rows = {3}
                  placeholder='Enjoy your coffee!'
                  id='message'
                  onChange = {onMessageChange}
                  required
                ></textarea>
              </div>
              <div>
                <button type='button' onClick={buyCoffee}>Send 0.001 ETH to buy coffee for CryptoHero</button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect your wallet</button>
        )}
      </main>
      { currentAccount && (<h1>Memos received</h1>) }
      { currentAccount && (memos.map((memo, idx) => {
        return (
          <div key = {idx} style = {{border: '2px solid', borderRadius: '5px', padding: '5px', margin: '5px'}}>
            <p style={{fontWeight: 'bold'}}>{memo.message}</p>
            <p>From: {memo.name} at {memo.timestamp.toString()}</p>
          </div>
        )
      }))}
      <footer className={styles.footer}>
        Created by CryptoHero for Educational purpose
      </footer>
    </div>
  )
}
