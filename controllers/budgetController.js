const BudgetModel = require("../models/budgetModel");

const budgetController = {
    addBudget: async(req, res) => {
        const{userId,type, amount}= req.body;
       try {
         const budget = new BudgetModel({userId,type,amount});
         await budget.save();
         res.status(201).json({message: "Budget added successfully"});
        
       } catch (error) {
         console.log(error);
         res.status(500).json(error);
       }
    },

    getBudget: async(req, res) => {
      const userId =req.params.id;
        try {
         const budgets = await BudgetModel.find({userId: userId});
         res.json(budgets);
       } catch (error) {
         console.log(error);
         res.status(500).json(error);
       }
    }
};

module.exports = budgetController;