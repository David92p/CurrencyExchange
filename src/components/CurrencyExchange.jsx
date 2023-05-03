// import React from "react";

// import { useEffect, useState } from "react";

const CurrencyExchange = ({
  options,
  currency,
  amount,
  handleCurrencyChange,
  handleAmountChange,
}) => {
  return (
    <div>
      <select name="currency" value={currency} onChange={handleCurrencyChange}>
        {Object.keys(options).map((key) => {
          return (
            <option value={key} key={key}>
              {options[key]}
            </option>
          );
        })}
      </select>
      <input
        type="number"
        min="0"
        max="100000"
        step="1"
        value={amount}
        onChange={handleAmountChange}
      />
    </div>
  );
};

export default CurrencyExchange;
