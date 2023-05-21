const transactionsService = require("../services/transactions-service")

class TransactionsController {
    async depositAmount(req, res, next) {
        try {
            const { amount, userId } = req.body;
            const user = await transactionsService.depositAmount(userId, amount)
            return res.json(user);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new TransactionsController();
