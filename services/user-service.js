const bcrypt = require("bcrypt");
const db = require("../database/db");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const userDto = require("../dtos/user-dto");

class UserService {
  async createUser(email, username, password) {
    const data = {
      username,
      email,
      password: await bcrypt.hash(password, 16),
    };
    const userFind = await db.query(`select * from users where email=$1;`, [
      email,
    ]);
    if (userFind.rows[0]) {
      return;
    }
    const newPerson = await db.query(
      `insert into users (username, email, password_hash) values ($1, $2, $3) returning *`,
      [data.username, data.email, data.password]
    );
    const activationLink = uuid.v4();
    await mailService.sendActivationMail(email, activationLink);
    const userData = new userDto(newPerson);
    const tokens = tokenService.generateToken({ ...userData });
    await tokenService.saveToken(userData.id, tokens.refreshToken);
    return { ...tokens, user: newPerson };
  }
}

module.exports = new UserService();
