const creditService = require("../services/credit-service");

class CreditsController {
    async getCreditsList(req, res, next) {
        try {
            const credits = await creditService.getAllCredits();
            return res.json(credits);
        } catch (error) {
            next(error);
        }
    }
    async createCredit(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const { amount, percent, period, description } = req.body;
            const credit = await creditService.createCredit(refreshToken, amount, percent, period, description);
            return res.json(credit);
        } catch (error) {
            next(error);
        }
    }
    async deleteCredit(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const { credit_id } = req.body;
            const credit = await creditService.deleteCredit(refreshToken, credit_id);
            return res.json(credit);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CreditsController();
