import { useEffect, useState } from "react";

import CurrencyExchange from "./components/CurrencyExchange";
import Chart from "./components/Chart";
import Wallet from "./components/Wallet";

import { RiExchangeLine } from "react-icons/ri";

const API = "api.frankfurter.app";

const App = () => {
  // array-state di valute nella select
  const [currencies, setCurrencies] = useState(null);
  // obj state utilizzato da currency exchange component
  const [state, setState] = useState({
    leftAmount: 0,
    rightAmount: 0,
    leftCurrency: "EUR",
    rightCurrency: "USD",
  });
  //obj-state restituito dopo conversione
  const [conversion, setConversion] = useState(null);
  // obj-state contenente i dati da usare nel chart component
  const [timeSeries, setTimeSeries] = useState(null);

  //effect iniziale setCurrencies array
  useEffect(() => {
    fetch(`https://${API}/currencies`)
      .then((resp) => resp.json())
      .then((data) => {
        setCurrencies(data);
      });
  }, []);

  //effect iniziale setConversion - conversioni in tutte le valute da leftCurrency - utilizzato nel wallet
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

  // effect iniziale su chart component con parametro settimanale
  useEffect(() => {
    getDataCurrencyExchange(getTimePeriodHandle("Weekly"));
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

  const getDataCurrencyExchange = (data) => {
    fetch(
      `https://${API}/${data.yearStart}-${data.monthStart}-${data.dayStart}..${data.yearEnd}-${data.monthEnd}-${data.dayEnd}?base=${state.leftCurrency}&to=${state.rightCurrency}`
    )
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        const values = [];
        for (let conversion of Object.values(response.rates)) {
          for (let value of Object.values(conversion)) {
            values.push(value);
          }
        }
        setTimeSeries((prev) => {
          return {
            ...prev,
            period: Object.keys(response.rates),
            values: values,
            trend: data.trend,
          };
        });
      });
  };

  // la funzione restituisci la fascia temporale richiesta (weekly, monthly, quarterly) a partire dalla data attuale
  const getTimePeriodHandle = (period) => {
    const currentDay = new Date(); // data attuale
    const milliSecondsDays = 86400000; // millisecondi giornalieri
    const currentMilliseconds = currentDay.getTime(); // millisecondi ad oggi

    let endDate = []; // giorno - mese - anno
    let starDate = []; // giorno - mese - anno
    let milliSecondsStart;
    if (period === "Weekly") {
      milliSecondsStart = milliSecondsDays * 7;
    }
    if (period === "Monthly") {
      milliSecondsStart = milliSecondsDays * 30;
    }
    if (period === "Quarterly") {
      milliSecondsStart = milliSecondsDays * 90;
    }

    const startMilliseconds = currentMilliseconds - milliSecondsStart; // millisecondi di inizio
    const startDate = new Date(startMilliseconds); // data di inizio
    const startDay =
      startDate.getDate() <= 9
        ? "0" + startDate.getDate()
        : startDate.getDate().toString(); // giorno di inizio
    const startMonth =
      startDate.getMonth() + 1 <= 9
        ? "0" + (startDate.getMonth() + 1)
        : (startDate.getMonth() + 1).toString(); // mese di inizio
    const startYear = startDate.getFullYear().toString(); // anno di inizio
    const endDay =
      currentDay.getDate() <= 9
        ? "0" + currentDay.getDate()
        : currentDay.getDate().toString(); // giorno di fine
    const endMonth =
      currentDay.getMonth() + 1 <= 9
        ? "0" + (currentDay.getMonth() + 1)
        : (currentDay.getMonth() + 1).toString(); // mese di fine
    const endYear = currentDay.getFullYear().toString(); // anno di fine

    starDate.push(startDay, startMonth, startYear);
    endDate.push(endDay, endMonth, endYear);

    // obj finale utilizzato per stabilire le date utili da passare
    const data = {
      dayEnd: endDate[0],
      monthEnd: endDate[1],
      yearEnd: endDate[2],
      dayStart: starDate[0],
      monthStart: starDate[1],
      yearStart: starDate[2],
      trend: period,
    };

    return data;
  };

  // func per conversione da currency sx a currency dx di leftAmount
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
      <div className="header">Currency Exchange App</div>
      <div className="container-main">
        <div className="container-data">
          {timeSeries && (
            <Chart
              {...timeSeries}
              leftCurrency={state.leftCurrency}
              rightCurrency={state.rightCurrency}
              getData={getDataCurrencyExchange}
              dataTime={getTimePeriodHandle}
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
