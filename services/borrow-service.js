const db = require("../database/db");
const ApiError = require("../exceptions/api-error");

class BorrowService {
  async getBorrowsForCredit(creditId) {
    const borrows = await db.query(
      `select *
             from borrow_request
             where money_offer_id = ?;`,
      [creditId]
    );
    return borrows[0];
  }

  async createBorrowRequest(userId, creditId, amount, percen) {
    const isAlreadyExists = await db.query(
      `select *
             from borrow_request
             where money_offer_id = ?
               and user_id = ?;`,
      [creditId, userId]
    );
    if (isAlreadyExists[0].length !== 0)
      throw ApiError.BadRequest(
        `Данный пользователь уже оставлял заявку на данный займ.`
      );
    await db.query(
      `insert into borrow_request (user_id, money_offer_id, amount, percent)
             values (?, ?, ?, ?)`,
      [userId, creditId, amount, percent]
    );
    const newBorrowRequest = await db.query(
      `select *
             from borrow_request
             where money_offer_id = ?
               and user_id = ?;`,
      [creditId, userId]
    );
    return newBorrowRequest[0][0]
  }
}

module.exports = new BorrowService();
