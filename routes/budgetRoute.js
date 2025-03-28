const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.post('/add-budget', budgetController.addBudget);

router.get('/get-budget/:id', budgetController.getBudget);

router.get('/get-expense/:id', budgetController.getExpense);

module.exports = router;