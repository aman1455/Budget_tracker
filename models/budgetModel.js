const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  type: { type: String, enum: ["daily", "weekly", "monthly"], required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, required: false, default: Date.now },
  expireAt: { type: Date, required: false, index: { expires: 0 } },
});

budgetSchema.pre("save", function (next) {
    if (this.type === "daily") {
      this.expireAt = new Date(this.startDate.getTime() + 24 * 60 * 60 * 1000); // 1 day
    } else if (this.type === "weekly") {
      this.expireAt = new Date(this.startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    } else if (this.type === "monthly") {
      this.expireAt = new Date(this.startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
    next();
  });
  

const BudgetModel = mongoose.model("Budgets", budgetSchema);
module.exports = BudgetModel;