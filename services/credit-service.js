const bcrypt = require("bcrypt");
const db = require("../database/db");
const ApiError = require("../exceptions/api-error");
const tokenService = require("./token-service");

class CreditService {
  async getAllCredits() {
    const credits = await db.query(`select *
                                        from money_offer;`);
    return credits[0];
  }

  async createCredit(refreshToken, amount, percent, period, description) {
    const tokenData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!tokenData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    await db.query(
      `insert into money_offer (amount, percent, period_date, description, user_id)
             values (?, ?, ?, ?, ?);`,
      [amount, percent, period, description, tokenFromDb.user_id]
    );

    const newCredit = await db.query(`select * from money_offer where user_id=?`, [tokenFromDb.user_id])
    return newCredit[0][0];
  }

  async deleteCredit(refreshToken, credit_id) {
    const tokenData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!tokenData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const deletedCredit = await db.query(
      `select *
             from money_offer
             where id = $1`,
      [credit_id]
    );
    if (!deletedCredit[0][0])
      throw ApiError.BadRequest("Нет такого id кредита.");
    await db.query(
      `delete
             from money_offer
             where id = ?;`,
      [credit_id]
    );
    return deletedCredit[0][0];
  }
  async getUserCredits(user_id) {
    const credits = await db.query(`select *
                                        from money_offer where user_id=?`, [user_id]);
    return credits[0];
  }
  async getCreditById(credit_id) {
    const credits = await db.query(`select *
                                        from money_offer where id=?`, [credit_id]);
    return credits[0][0];
  }
}

module.exports = new CreditService();
