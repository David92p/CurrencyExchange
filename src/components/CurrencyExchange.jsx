import React from 'react'

import { useEffect, useState } from 'react'

const CurrencyExchange = () => {

  const API = 'api.frankfurter.app';

  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState([])
  // const [currencyGive, setCurrencyGive] = useState("");
  // const [currencyReceive, setCurrencyReceive] = useState("")

  useEffect(()=> {
    try {
      fetch(`https://${API}/currencies`)
      .then(resp => resp.json())
      .then((data) => {
      //(`10 GBP = ${data.rates.USD} USD`);
      for (let currency of Object.keys(data)){
        setCurrencies(prev => [...prev, currency])
      }
  });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false)
  }, [])

  if(isLoading){
    return <h4>is loading</h4>
  }
  return (
    <div className='currency-exchange'>
      <div className='i-have'>
        <label htmlFor="i-have">Choose the currency to give</label>
        <select name="i-have" id="i-have">
          <option>Please Secect Currency</option>
          {
            currencies.map(currency => {
              return (
                <option value={currency} key={currency}>{currency}</option>
              )
            })
          }
        </select>
      </div>
      <div className='i-want'>

      </div>
    </div>
  )
}

export default CurrencyExchange
