// import React from "react";

// import { useEffect, useState } from "react";

const CurrencyExchange = ({
  converter,
  options,
  currency,
  amount,
  handleCurrencyChange,
  handleAmountChange,
}) => {
  //console.log(`la conversione è ${conversion}`);
  return (
    <>
      <label>
        {converter
          ? "Choose the currency and the amount to convert"
          : "Choose the currency to receive"}
      </label>
      <div>
        <select
          name="currency"
          value={currency}
          onChange={(e) => handleCurrencyChange(e, converter)}
        >
          {Object.keys(options).map((key) => {
            return (
              <option value={key} key={key}>
                {options[key]}
              </option>
            );
          })}
        </select>
        {converter ? (
          <input
            type="number"
            min={1}
            max={1000000}
            step="1"
            value={amount}
            onChange={handleAmountChange}
          />
        ) : (
          <input
            disabled
            type="number"
            min={1}
            max={1000000}
            step="1"
            value={amount}
          />
        )}
      </div>
    </>
  );
};

export default CurrencyExchange;
