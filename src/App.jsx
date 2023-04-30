import CurrencyExchange from "./components/CurrencyExchange"
import Chart from "./components/Chart"
import Wallet from "./components/Wallet"
import { useEffect, useState } from "react";
import axios from "axios";


const App = () => {

  const API = 'api.frankfurter.app';

  // const [currencies, setCurrencies] = useState([])
  // const [currencyGive, setCurrencyGive] = useState("");
  // const [currencyReceive, setCurrencyReceive] = useState("")

  // useEffect(()=> {
  //   fetch(`https://${API}/currencies`)
  //     .then(resp => resp.json())
  //     .then((data) => {
  //     //(`10 GBP = ${data.rates.USD} USD`);
  //     console.log(data);
  // });
  // }, [])


  return (
    <div className="container-app">
      <h1 className="title">Currency Exchange</h1>
      <div className="container-main">
        <div className="container-data">
          <Chart />
          <Wallet />
        </div>
        <CurrencyExchange />
      </div>
    </div>
  )
}

export default App