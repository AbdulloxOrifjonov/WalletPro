/** @format */

import React, { useContext, useState, useEffect } from "react";
import { WalletContext } from "../context/WalletProvider";

const HomePage = () => {
  const {
    transactions,
    addTransaction,
    exchangeRates,
    netBalance,
    addNetBalance,
    addExpence,
    convertToBaseCurrency,
    selectedCurrency,
    setSelectedCurrency,
    setTransactions,
  } = useContext(WalletContext);

  const [filtered, setFiltered] = useState(false);
  const [filterTransaction, setFilterTransaction] = useState("");

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Daromad");
  const [description, setDescription] = useState("");
  const [convertedBalance, setConvertedBalance] = useState(netBalance);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedCurrency !== "USD" && exchangeRates[selectedCurrency]) {
      const convertedAmount = convertToBaseCurrency(netBalance, selectedCurrency);
      setConvertedBalance(convertedAmount);
    } else {
      setConvertedBalance(netBalance);
    }
  }, [selectedCurrency, exchangeRates, netBalance, convertToBaseCurrency]);

  const handleAddTransaction = () => {
    const newTransaction = {
      amount: parseFloat(amount),
      category,
      description,
      selectedCurrency,
      date: new Date().toISOString(), // Using the date as a unique identifier
      transactionId: new Date().toISOString(), // Adding a unique ID for the transaction
    };

    if (newTransaction.category === "Daromad") {
      addTransaction(newTransaction);
      addNetBalance(newTransaction);
    } else if (newTransaction.category === "Xarajatlar") {
      addExpence(newTransaction);
      addNetBalance(newTransaction);
    }

    setAmount("");
    setDescription("");
  };

  const handleDeleteTransaction = (transactionId) => {
    console.log(transactionId);
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.date !== transactionId,
    );
    setTransactions(updatedTransactions);
  };

  return (
    <div className="container">
      <h1 className="text-center my-5 text-primary">Welcome to Your Personal Finance Dashboard</h1>

      <div className="card p-4 mb-5 shadow-lg rounded">
        <h2 className="text-center mb-4 text-info">Add Transaction</h2>
        <div className="mb-3">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control mb-3"
          />
          <select
            onChange={(e) => setCategory(e.target.value === "" ? "Daromad" : e.target.value)}
            className="form-select mb-3"
          >
            <option value="Daromad">Income</option>
            <option value="Xarajatlar">Expenses</option>
          </select>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control mb-3"
          />
          <button className="btn btn-success w-100 py-2" onClick={handleAddTransaction}>
            Add Transaction
          </button>
        </div>
      </div>

      <div className="currency-section mt-5 mb-5">
        <h2 className="text-center mb-4 text-info">Select Currency</h2>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="form-select mb-4"
        >
          {Object.keys(exchangeRates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>

        <h3 className="text-center mb-4 text-secondary">
          Converted Balance: {convertedBalance} {selectedCurrency}
        </h3>
      </div>

      <div className="offcanvas-body">
        <h3 className="mb-4 text-center text-primary">Your Transactions</h3>


        <h6 className="mb-4 text-center text-muted">
          Filtered: {`${filtered === false ? "No Filter Applied" : "Filtered"}`}
        </h6>

        <select
          className="form-select mb-4"
          onChange={(e) => {
            setFiltered(true);
            setFilterTransaction(e.target.value);
          }}
        >
          <option value="true" disabled>
            Filter Transactions
          </option>
          <option value="Daromad">Income</option>
          <option value="Xarajatlar">Expenses</option>
          <option value="Jami">All</option>
        </select>

        {transactions.length > 0 ? (
          <ul
            className="list-group overflow-auto"
            style={{ height: "250px", marginBottom: "50px" }}
          >
            {transactions.map((transaction, index) =>
              !filterTransaction ||
              filterTransaction === "Jami" ||
              transaction.category === filterTransaction ? (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2 rounded"
                >
                  <div>
                    <strong>{transaction.category}</strong> - {transaction.amount} -{" "}
                    {transaction.description} - {transaction.selectedCurrency} - {transaction.date}
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteTransaction(transaction.date)}
                  >
                    Delete
                  </button>
                </li>
              ) : null,
            )}
          </ul>
        ) : (
          <p className="text-center text-muted">No transactions available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
