import React, { useEffect } from "react";

import { SlWallet } from "react-icons/sl";
import symbols from "../assets/symbols";

const Wallet = ({ amount, base, date, rates }) => {
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
            style={{ heigth: "50px", width: "50px" }}
          />
        </div>
        <div className="container-currencies"></div>
      </div>
    </div>
  );
};

export default Wallet;
