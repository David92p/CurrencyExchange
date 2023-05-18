import { useEffect, useState } from "react";

import CurrencyExchange from "./components/CurrencyExchange";
import Chart from "./components/Chart";
import Wallet from "./components/Wallet";

import { RiExchangeLine } from "react-icons/ri";

const API = "api.frankfurter.app";

const App = () => {
  // array-state di valute nella select
  const [currencies, setCurrencies] = useState(null);
  const [state, setState] = useState({
    leftAmount: 0,
    rightAmount: 0,
    leftCurrency: "EUR",
    rightCurrency: "USD",
  });
  //obj-state restituito dopo conversione
  const [conversion, setConversion] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);

  //effect iniziale setCurrencies array
  useEffect(() => {
    fetch(`https://${API}/currencies`)
      .then((resp) => resp.json())
      .then((data) => {
        setCurrencies(data);
      });
  }, []);

  useEffect(() => {
    fetch(`https://${API}/latest?from=${state.leftCurrency}`)
      .then((response) => {
        const data = response.json();
        return data;
      })
      .then((response) => {
        setConversion(response);
      });
  }, [state]);

  useEffect(() => {
    fetch(
      `https://${API}/2023-05-11..2023-05-18?base=${state.leftCurrency}&to=${state.rightCurrency}`
    )
      .then((response) => {
        const data = response.json();
        return data;
      })
      .then((response) => {
        console.log(response);
        const values = [];
        for (let conversion of Object.values(response.rates)) {
          for (let value of Object.values(conversion)) {
            values.push(value);
          }
        }
        setTimeSeries({
          period: Object.keys(response.rates),
          values: values,
          trend: "Weekly",
        });
      });
  }, [state.leftCurrency, state.rightCurrency]);

  // handle change currency
  const handleCurrencyChange = (e, converter) => {
    converter
      ? setState((prevState) => {
          return { ...prevState, leftCurrency: e.target.value };
        })
      : setState((prevState) => {
          return { ...prevState, rightCurrency: e.target.value };
        });
  };

  // handle change amount
  const handleAmountChange = (e) => {
    setState((prevState) => {
      return {
        ...prevState,
        leftAmount: e.target.value,
      };
    });
  };

  // func di conversione da valuta sx a valuta dx di leftAmount
  const converter = async (currencyFrom, currencyTo) => {
    const response = await fetch(
      `https://${API}/latest?amount=${state.leftAmount}&from=${currencyFrom}&to=${currencyTo}`
    );
    const data = await response.json();

    setState((prevState) => {
      return {
        ...prevState,
        rightAmount: data.rates[state.rightCurrency],
      };
    });
    setConversion(data);
  };
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className="container-app">
      <div className="container-header">
        <h1>TITOLO</h1>
      </div>
      <div className="container-main">
        <div className="container-data">
          {timeSeries && (
            <Chart
              {...timeSeries}
              leftCurrency={state.leftCurrency}
              rightCurrency={state.rightCurrency}
            />
          )}
          {conversion && <Wallet {...conversion} />}
        </div>
        <div className="container-currency-exchange">
          <div className="currency-exchange">
            {currencies && (
              <CurrencyExchange
                converter={true}
                options={currencies}
                currency={state.leftCurrency}
                amount={state.leftAmount}
                handleCurrencyChange={handleCurrencyChange}
                handleAmountChange={handleAmountChange}
              />
            )}
          </div>
          <div className="container-btn-converter">
            {(state.leftAmount || state.rightAmount) >= 1 ? (
              <button
                className="btn-converter"
                style={{
                  background: "rgba(23, 177, 105)",
                  height: "100%",
                  width: "100%",
                  border: "none",
                  transitionProperty: "height, width, border",
                  transitionDuration: "1s",
                }}
                onClick={() =>
                  converter(state.leftCurrency, state.rightCurrency)
                }
              >
                Convert{" "}
                <RiExchangeLine style={{ height: "50px", width: "50px" }} />
              </button>
            ) : (
              <button
                className="btn-converter"
                style={{
                  background: "#6eeeb0",
                  height: "50%",
                  width: "80%",
                  border: "none",
                  transitionProperty: "height, width, border",
                  transitionDuration: "1s",
                  cursor: "not-allowed",
                }}
              >
                Convert{" "}
                <RiExchangeLine
                  style={{
                    height: "50px",
                    width: "50px",
                  }}
                />
              </button>
            )}
          </div>
          <div className="currency-exchange">
            {currencies && (
              <CurrencyExchange
                disabled={state.disabled}
                converter={false}
                options={currencies}
                currency={state.rightCurrency}
                amount={state.rightAmount}
                handleCurrencyChange={handleCurrencyChange}
                handleAmountChange={handleAmountChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
