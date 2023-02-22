const db = require("../database/db");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

class TokenService {
  generateToken(payload) {
    const activationLink = uuid.v4();
    const accessToken = jwt.sign(
      payload,
      // { id: newPerson.rows[0].id_user },
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: 30 * 60 * 1000,
      }
    );
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: 30 * 24 * 60 * 60 * 1000,
    });
    return {
      accessToken,
      refreshToken,
    };

    // res.cookie("jwt", token, { maxAge: 24 * 60 * 60, httpOnly: true });
    // console.log("user", JSON.stringify(newPerson.rows[0], null, 2));
    // console.log(token);
    // //send users details
    // return res.status(201).send(newPerson.rows[0]);
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await db.query(`select * from tokens where user_id=$1;`, [
      userId,
    ]);
    if (tokenData) {
      return await db.query(
        `update tokens set refresh_token=$1 where user_id=$2;`,
        [refreshToken, userId]
      );
    } else {
      return await db.query(
        `insert into tokens (user_id, refresh_token) values ($1, $2);`,
        [userId, refreshToken]
      );
    }
  }
}

module.exports = new TokenService();
