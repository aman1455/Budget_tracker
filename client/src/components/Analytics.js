import React from "react";
import { Progress } from "antd";
const Analytics = ({ allTransection }) => {
  // category
  const categories = [
    "salary",
    "tip",
    "project",
    "food",
    "movie",
    "bills",
    "medical",
    "fee",
    "tax",
  ];

  // total transaction
  const totalTransaction = allTransection.length;
  const totalIncomeTransactions = allTransection.filter(
    (transaction) => transaction.type === "income"
  ) || [];
  const totalExpenseTransactions = allTransection.filter(
    (transaction) => transaction.type === "expense"
  ) || [];
  const totalIncomePercent =
    (totalIncomeTransactions.length / totalTransaction) * 100  || 0;
  const totalExpensePercent =
    (totalExpenseTransactions.length / totalTransaction) * 100 || 0;

  //total turnover
  const totalTurnover = allTransection.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  ) || 0;
  const totalIncomeTurnover = allTransection
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0)  || 0;

  const totalExpenseTurnover = allTransection
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0) || 0;

  const totalIncomeTurnoverPercent =
    (totalIncomeTurnover / totalTurnover) * 100 || 0;
  const totalExpenseTurnoverPercent =
    (totalExpenseTurnover / totalTurnover) * 100 || 0;
  return (
    <>
      <div className="row m-3">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              Total Transactions : {totalTransaction}
            </div>
            <div className="card-body ">
              <div className="d-flex  justify-content-between align-items-center">
              <h5 className="text-success">
                Income : {totalIncomeTransactions.length}
              </h5>
              <h5 className="text-danger">
                Expense : {totalExpenseTransactions.length}
              </h5>
              </div>         
              <div className="d-flex flex-row align-items-center">
                <Progress
                  type="circle"
                  strokeColor={{
                    "0%": "#FF6B6B",
                    "100%": "#D32F2F",
                  }}
                  style={{
                    filter: "drop-shadow(4px 4px 10px rgba(0,0,0,0.2))",
                  }}
                  className="mx-2"
                  
                  percent={totalIncomePercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={{
                    "0%": "#4CAF50",
                    "100%": "#2E7D32",
                  }}
                  className="mx-2 mt-3"
                  percent={totalExpensePercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-header rounded-2">Total TurnOver : {totalTurnover}</div>
            <div className="card-body">
              <div className="d-flex  justify-content-between align-items-center">
              <h5 className="text-success">Income : {totalIncomeTurnover}</h5>
              <h5 className="text-danger">Expense : {totalExpenseTurnover}</h5>
              </div>
              <div>
                <Progress
                  type="circle"
                  strokeColor={{
                    "0%": "#4CAF50",
                    "100%": "#2E7D32",
                  }}
                  className="mx-2"
                  percent={totalIncomeTurnoverPercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor={{
                    "0%": "#FF6B6B",
                    "100%": "#D32F2F",
                  }}
                  className="mx-2 mt-3"
                  percent={totalExpenseTurnoverPercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <h6 className="bg-[#6a5acd] p-2 text-light rounded-2" style={{backgroundColor:"#6a5acd"}}>Categorywise Income</h6>
          {categories.map((category) => {
            const amount = allTransection
              .filter(
                (transaction) =>
                  transaction.type === "income" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card mt-2">
                  <div className="card-body">
                    <h6>{category}</h6>
                    <Progress
                      percent={((amount / totalIncomeTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
        <div className="col-md-3">
          <h6 className="bg-warning p-2 text-light rounded-2">Categorywise Expense</h6>
          {categories.map((category) => {
            const amount = allTransection
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category === category
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card mt-2">
                  <div className="card-body">
                    <h6>{category}</h6>
                    <Progress
                      percent={((amount / totalExpenseTurnover) * 100).toFixed(
                        0
                      )}
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
      <div className="row mt-3 analytics"></div>
    </>
  );
};

export default Analytics;
