/** @format */

import React, { createContext, useState, useEffect } from "react";

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [user, setUser] = useState("hech narsa bolmaydi");
  const [exchangeRates, setExchangeRates] = useState({});
  const [transactions, setTransactions] = useState(() => {
    try {
      const savedTransactions = localStorage.getItem("transactions");
      return savedTransactions ? JSON.parse(savedTransactions) : [];
    } catch (error) {
      console.error("Error parsing transactions from localStorage:", error);
      return [];
    }
  });

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  const [netBalance, setNetBalance] = useState(() => {
    try {
      const savedNetBalance = localStorage.getItem("netBalance");
      return savedNetBalance ? parseFloat(savedNetBalance) : 0;
    } catch (error) {
      console.error("Error parsing netBalance from localStorage:", error);
      return 0;
    }
  });

  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  const selectedCurrensyEdit = (curr) => {
    setSelectedCurrency(curr);
  };

  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
    }

    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/c6e5e93640c2951a11e84f3a/latest/USD",
        );
        const data = await response.json();
        setExchangeRates(data.conversion_rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };
    fetchExchangeRates();
  }, [transactions]);

  const addNetBalance = (transaction) => {
    let updatedNetBalance = netBalance;

    if (transaction.category === "Daromad") {
      setTotalIncome((prevTransaction) => prevTransaction + transaction.amount);
      updatedNetBalance += transaction.amount;
    } else if (transaction.category === "Xarajatlar") {
      updatedNetBalance -= transaction.amount;
    }

    setNetBalance(updatedNetBalance);

    try {
      localStorage.setItem("netBalance", updatedNetBalance.toString());
    } catch (error) {
      console.error("Error saving netBalance to localStorage:", error);
    }
  };

  const convertToBaseCurrency = (amount, currency) => {
    const rate = exchangeRates[currency];
    return rate ? amount / rate : amount;
  };

  const addTransaction = (transaction) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);

    try {
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
    }

    addNetBalance(transaction);
  };

  const addExpence = (transaction) => {
    setTotalExpense((prevTransaction) => prevTransaction + transaction.amount);
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);

    try {
      localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
    }

    addNetBalance(transaction);
  };

  return (
    <WalletContext.Provider
      value={{
        convertToBaseCurrency,
        user,
        setUser,
        transactions,
        setTransactions,
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
