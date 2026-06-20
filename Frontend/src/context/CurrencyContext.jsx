import React, { createContext, useState, useContext } from "react";

const CurrencyContext = createContext();

const EXCHANGE_RATES = {
  USD: 1,
  UZS: 12600,
  RUB: 90,
};

const SYMBOLS = {
  USD: "$",
  UZS: " so'm",
  RUB: "₽",
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(localStorage.getItem("volt_currency") || "USD");

  const switchCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem("volt_currency", newCurrency);
  };

  const formatPrice = (priceInUSD) => {
    if (priceInUSD === undefined || priceInUSD === null)
      return SYMBOLS[currency] === "$" ? "$0" : "0" + SYMBOLS[currency];
    const converted = Math.round(priceInUSD * EXCHANGE_RATES[currency]);
    if (currency === "UZS") return converted.toLocaleString() + SYMBOLS[currency];
    if (currency === "RUB") return converted.toLocaleString() + " " + SYMBOLS[currency];
    return SYMBOLS[currency] + converted.toLocaleString();
  };

  return (
    <CurrencyContext.Provider value={{ currency, switchCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
