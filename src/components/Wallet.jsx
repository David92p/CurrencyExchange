import React, { useEffect, useState } from "react";

import { SlWallet } from "react-icons/sl";
import symbols from "../assets/symbols";

const Wallet = ({ amount, base, date, rates }) => {
  // array di tutte le 30 valute
  const allCurrencies = Object.entries(rates);

  const [isLoading, setIsLoading] = useState(true);
  // randomCurrencies array con due elementi array - index 1 con 6 currencies casuali, index 2 con le restanti currencies da caricare
  const [randomCurrencies, setRandomCurrencies] = useState([]);
  // currenciesToLoad array con 6 currencies casuali di randomCurrencies[1]
  const [currenciesOnLoad, setCurrenciesOnLoad] = useState();

  // fnc che restituisce 6 indici casuali diversi di un array
  const random = (array) => {
    let randoms = [];
    while (randoms.length < 6) {
      let n = Math.floor(Math.random() * array.length);
      if (!randoms.includes(n)) {
        randoms.push(n);
      }
    }
    return randoms;
  };

  // fnc che controlla se un elemento el è presente in un elemento array -  restituisce un booleano
  const checkingCurrencies = (array, el) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i][0].toLowerCase() === el[0].toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const loadCurrencies = () => {
    setIsLoading(true);
    // array con 6 elementi casuali di allCurrencies
    let loadedCurrencies = [];
    // array con elementi rimanenti da caricare al click
    let currenciesToLoad = [];

    // ciclo per loadedCurrencies
    random(allCurrencies).forEach((elementIndex) => {
      loadedCurrencies.push(allCurrencies[elementIndex]);
    });

    // ciclo per currenciesToLoad
    allCurrencies.forEach((el) => {
      if (!checkingCurrencies(loadedCurrencies, el)) {
        currenciesToLoad.push(el);
      }
    });
    setIsLoading(false);
    return [loadedCurrencies, currenciesToLoad];
  };

  // hook al render di state base
  useEffect(() => {
    // chiamiamo la fnc random per il set delle 6 currencies casuali
    setRandomCurrencies(loadCurrencies());
    // reset di currenciesOnLoad
    setCurrenciesOnLoad();
  }, [base]);

  // fnc onClick
  const handleBtn = (remainingCurrencies) => {
    // array di currencies in caricamento
    let currenciesOnLoad = [];
    // array di currencies ancora da mandare a schermo
    let currenciesToLoad = [];
    // controllo e reset in caso di currencies tutte già visualizzate
    if (remainingCurrencies[1].length === 0) {
      setRandomCurrencies(loadCurrencies());
      setCurrenciesOnLoad();
      return;
    } else {
      // ciclo caricamento array currenciesOnLoad
      random(remainingCurrencies[1]).forEach((elementIndex) => {
        currenciesOnLoad.push(remainingCurrencies[1][elementIndex]);
      });
      // ciclo caricamento array currenciesToLoad
      remainingCurrencies[1].forEach((el) => {
        if (!checkingCurrencies(currenciesOnLoad, el)) {
          currenciesToLoad.push(el);
        }
      });
    }
    // set array da mandare a schermo al click
    setCurrenciesOnLoad(currenciesOnLoad);
    // aggiornaimo le currencies rimanenti da gestire al click
    setRandomCurrencies([remainingCurrencies[0], currenciesToLoad]);
  };

  ////////////////////////////////////////////////////////////////////////////////////////
  if (isLoading) {
    return <h1>is loading .....</h1>;
  }
  return (
    <div className="container-wallet">
      <div className="header-wallet">
        <h4>Currency Update To:</h4>
        <h2>{date}</h2>
      </div>
      <div className="main-wallet">
        <div className="container-amount">
          <SlWallet style={{ fontSize: "1.5em" }} />
          {amount + " "}
          {base}
          <img
            src={symbols[base]}
            alt={base}
            style={{ heigth: "70px", width: "70px" }}
          />
        </div>
        <div className="container-currencies">
          {currenciesOnLoad
            ? currenciesOnLoad.map((el) => {
                return (
                  <div key={el[0]} className="currency">
                    <img
                      src={symbols[el[0]]}
                      style={{ heigth: "70px", width: "70px" }}
                    />
                    <h3>
                      {el[1]} {el[0]}
                    </h3>
                  </div>
                );
              })
            : randomCurrencies[0].map((el) => {
                return (
                  <div key={el[0]} className="currency">
                    <img
                      src={symbols[el[0]]}
                      style={{ heigth: "70px", width: "70px" }}
                    />
                    <h3>
                      {el[1]} {el[0]}
                    </h3>
                  </div>
                );
              })}
        </div>
        <div className="container-btn-wallet">
          <button
            className="btn-wallet"
            onClick={() => handleBtn(randomCurrencies)}
          >
            Upload Currencies
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
