/** @format */

import React, { createContext, useState, useEffect } from "react";

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [user, setUser] = useState("hech narsa bolmaydi");
  const [exchangeRates, setExchangeRates] = useState({});
  const [transactions, setTransactions] = useState([]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const selectedCurrensyEdit = (curr) => {
    setSelectedCurrency(curr);
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/c6e5e93640c2951a11e84f3a/latest/USD",
        );
        const data = await response.json();
        setExchangeRates(data.conversion_rates); 
        console.log(exchangeRates.conversion_rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };
    fetchExchangeRates();
  }, []); 

  const addNetBalance = (transaction) => {
    if (transaction.category === "Daromad") {
      setTotalIncome((prevTransaction) => prevTransaction + transaction.amount);
      setNetBalance((prevBalance) => prevBalance + transaction.amount);
    } else if (transaction.category === "Xarajatlar") {
      setNetBalance((prevBalance) => prevBalance - transaction.amount); // Xarajatlar uchun balansni kamaytirish
    }
  };

  const convertToBaseCurrency = (amount, currency) => {
    const rate = exchangeRates[currency]; 
    return rate ? amount / rate : amount; 
  };

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const addExpence = (transaction) => {
    setTotalExpense((prevTransaction) => prevTransaction + transaction.amount);
    setTransactions([...transactions, transaction]);
  };

  return (
    <WalletContext.Provider
      value={{
        convertToBaseCurrency,
        user,
        setUser,
        transactions,
        addTransaction,
        exchangeRates,
        totalIncome,
        totalExpense,
        netBalance,
        setTotalIncome,
        setTotalExpense,
        setNetBalance,
        addNetBalance,
        addExpence,
        selectedCurrency,
        setSelectedCurrency,
        selectedCurrensyEdit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
