import CurrencyExchange from "./components/CurrencyExchange";
import Chart from "./components/Chart";
import Wallet from "./components/Wallet";
import { useEffect, useState } from "react";

const App = () => {
  const API = "api.frankfurter.app";

  const [currencies, setCurrencies] = useState(null);
  const [state, setState] = useState({
    leftAmount: 1,
    rightAmount: 1,
    leftCurrency: "EUR",
    rightCurrency: "USD",
  });
  const [convert, setConvert] = useState("");

  const handleCurrencyChange = (e, selector) => {
    if (selector === "from") {
      setState((prevState) => {
        return { ...prevState, leftCurrency: e.target.value };
      });
    }
    if (selector === "to") {
      setState((prevState) => {
        return { ...prevState, rightCurrency: e.target.value };
      });
    }
  };

  const handleAmountChange = (e, selector) => {
    if (selector === "from") {
      setState((prevState) => {
        return {
          ...prevState,
          leftAmount: e.target.value,
          rightAmount: convert,
        };
      });
    }
    if (selector === "to") {
      setState((prevState) => {
        return {
          ...prevState,
          rightAmount: e.target.value,
          leftAmount: convert,
        };
      });
    }
  };

  useEffect(() => {
    fetch(`https://${API}/currencies`)
      .then((resp) => resp.json())
      .then((data) => {
        setCurrencies(data);
      });
  }, []);

  const converter = async (
    amount = 1,
    currencyFrom = "EUR",
    currencyTo = "USD"
  ) => {
    const response = await fetch(
      `https://${API}/latest?amount=${amount}&from=${currencyFrom}&to=${currencyTo}`
    );
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    converter();
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////////////////
  console.log(state);
  return (
    <div className="container-app">
      <h1 className="title">Currency Exchange</h1>
      <div className="container-main">
        <div className="container-data">
          <Chart />
          <Wallet />
        </div>
        <div className="container-currency-exchange">
          <div className="currency-exchange">
            {/* <label htmlFor="toGive">Choose the currency to give</label> */}

            {currencies && (
              <CurrencyExchange
                options={currencies}
                currency={state.leftCurrency}
                amount={state.leftAmount}
                handleAmountChange={(e) => handleAmountChange(e, "from")}
                handleCurrencyChange={(e) => handleCurrencyChange(e, "from")}
              />
            )}
          </div>
          <div className="currency-exchange">
            {/* <label htmlFor="">Choose the currency to receive</label> */}
            {currencies && (
              <CurrencyExchange
                options={currencies}
                currency={state.rightCurrency}
                amount={state.rightAmount}
                handleCurrencyChange={(e) => handleCurrencyChange(e, "to")}
                handleAmountChange={(e) => handleAmountChange(e, "to")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
