const borrowService = require("../services/borrow-service");

class BorrowsController {
    async getBorrowsForCredit(req, res, next) {
        try {
            const credit_id = req.params.credit_id;
            const borrows = await borrowService.getBorrowsForCredit(credit_id);
            return res.json(borrows);
        } catch (error) {
            next(error);
        }
    }

    async createBorrowRequest(req, res, next) {
        try {
            const { userId, creditId, amount, percent } = req.body;
            const borrow = await borrowService.createBorrowRequest(userId, creditId, amount, percent);
            return res.json(borrow);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new BorrowsController();
