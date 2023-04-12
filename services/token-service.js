const db = require("../database/db");
const jwt = require("jsonwebtoken");

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: '10s',
      }
    );
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: '20s',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token){
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    } catch (e){
      return null;
    }
  }
  validateRefreshToken(token){
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
    } catch (e){
      return null;
    }
  }


  async saveToken(userId, refreshToken) {
    const tokenData = await db.query(`select * from tokens where user_id=$1;`, [
      userId,
    ]);
    if (tokenData.rows[0]) {
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

  async removeToken(refreshToken){
    return await db.query(`delete from tokens where refresh_token=$1`, [
      refreshToken,
    ]);
  }

  async findToken(refreshToken){
    const tokenData = await db.query(`select * from tokens where refresh_token=$1`, [refreshToken])
    console.log(tokenData.rows)
    return tokenData.rows[0];
  }
}

module.exports = new TokenService();
