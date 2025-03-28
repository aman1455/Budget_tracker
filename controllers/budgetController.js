const BudgetModel = require("../models/budgetModel");
const transectionModel = require("../models/transectionModel");
const moment = require("moment");

const budgetController = {
  addBudget: async (req, res) => {
    const { userId, type, amount } = req.body;
    try {
      const budget = new BudgetModel({ userId, type, amount });
      await budget.save();
      res.status(201).json({ message: "Budget added successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  getBudget: async (req, res) => {
    const userId = req.params.id;
    try {
      const budgets = await BudgetModel.find({ userId: userId });
      res.json(budgets);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  getExpense: async (req, res) => {
    const userId = req.params.id;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); 
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7); 

    const yearStart = new Date();
    yearStart.setMonth(0, 1); 
    yearStart.setHours(0, 0, 0, 0);

    try {
        const [expensesToday, expensesWeekly, expensesYearly] = await Promise.all([
            transectionModel.find({
                userId: userId,
                type: "expense",
                createdAt: { $gte: todayStart, $lt: todayEnd }
            }),
            transectionModel.find({
                userId: userId,
                type: "expense",
                createdAt: { $gte: weekStart, $lt: weekEnd }
            }),
            transectionModel.find({
                userId: userId,
                type: "expense",
                createdAt: { $gte: yearStart }
            })
        ]);

        res.json({ 
            success: true,
            expensesToday, 
            expensesWeekly, 
            expensesYearly 
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = budgetController;