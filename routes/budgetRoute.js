const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.post('/add-budget', budgetController.addBudget);

router.get('/get-budget/:id', budgetController.getBudget);

module.exports = router;