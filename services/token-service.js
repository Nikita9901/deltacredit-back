const db = require("../database/db");
const jwt = require("jsonwebtoken");

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET_KEY,
      {
        expiresIn: '30m',
      }
    );
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: '30d',
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
    const tokenData = await db.query(`select * from tokens where user_id=?;`, [
      userId,
    ]);
    if (tokenData[0][0]) {
      return await db.query(
        `update tokens set refresh_token=? where user_id=?;`,
        [refreshToken, userId]
      );
    } else {
      return await db.query(
        `insert into tokens (user_id, refresh_token) values (?, ?);`,
        [userId, refreshToken]
      );
    }
  }

  async removeToken(refreshToken){
    return await db.query(`delete from tokens where refresh_token=?`, [
      refreshToken,
    ]);
  }

  async findToken(refreshToken){
    const tokenData = await db.query(`select * from tokens where refresh_token=?`, [refreshToken])
    return tokenData[0][0];
  }
}

module.exports = new TokenService();
