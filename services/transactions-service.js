const db = require("../database/db");
const ApiError = require("../exceptions/api-error");
const tokenService = require("./token-service");

class TransactionsService {
    async depositAmount(amount, userId) {
        console.log(amount, userId)
        await db.query(
            `insert into transactions (balance_change_amount, user_id, date)
             values (?, ?, CURRENT_DATE());`,
            [Number(amount), Number(userId)]
        );
        console.log(amount, userId)

        await db.query(
            `update users
             set wallet=wallet+?
             where id = ?`,
            [amount, userId],
        );
        const user = await db.query(
            `select *
             from users
             where id = ?`,
            [userId]
        );
        return user[0][0];
    }
}

module.exports = new TransactionsService();
