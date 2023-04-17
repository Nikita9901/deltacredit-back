const bcrypt = require("bcrypt");
const db = require("../database/db");
const ApiError = require("../exceptions/api-error");
const tokenService = require("./token-service");

class CreditService {
    async getAllCredits() {
        const credits = await db.query(`select *
                                      from money_offer;`);
        return credits.rows;
    }
    async createCredit(refreshToken, amount, percent, period, description) {
        const tokenData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!tokenData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const newCredit = await db.query(
            `insert into money_offer (amount, percent, period, description, user_id)
             values ($1, $2, $3, $4, $5)
             returning *`,
            [amount, percent, period, description, tokenFromDb.user_id]
        );
        return newCredit.rows[0];
    }
    async deleteCredit(refreshToken, credit_id) {
        const tokenData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!tokenData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const deletedCredit = await db.query(`select * from money_offer where id = $1`, [
            credit_id,
        ]);
        if (!deletedCredit.rows[0]) throw ApiError.BadRequest("Нет такого id кредита.")
        await db.query(`delete from money_offer where id = $1`, [
            credit_id,
          ]);
        return deletedCredit.rows[0];
    }
}

module.exports = new CreditService();
