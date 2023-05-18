const bcrypt = require("bcrypt");
const db = require("../database/db");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const userDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async createUser(email, password) {
    const data = {
      email,
      password: await bcrypt.hash(password, 16),
    };
    const userFind = await db.query(
      `select *
             from users
             where email = ?;`,
      [data.email]
    );
    if (userFind[0].length) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${data.email} уже существует.`
      );
    }

    await db.query(
      `insert into users (email, password_hash)
             values (?, ?)`,
      [data.email, data.password]
    );
      const newPerson = await db.query(
          `select *
             from users
             where email = ?;`,
          [data.email]
      );
    // const activationLink = uuid.v4();
    // await mailService.sendActivationMail(
    //   email,
    //   activationLink
    // );

    const userData = new userDto(newPerson[0][0]);
    await db.query(
        `insert into passport_details (user_id)
             values (?)`,
        [userData.id]
    );
    const tokens = tokenService.generateToken({ ...userData });
    await tokenService.saveToken(userData.id, tokens.refreshToken);
    return { ...tokens, user: newPerson[0][0] };
  }

  async loginUser(email, password) {
    const userFind = await db.query(
      `select *
             from users
             where email = ?;`,
      [email]
    );
    const user = userFind[0][0];
    if (user) {
      const isPassEquals = await bcrypt.compare(password, user.password_hash);

      if (isPassEquals) {
        const userData = new userDto(user);
        const tokens = tokenService.generateToken({ ...userData });
        await tokenService.saveToken(userData.id, tokens.refreshToken);
        return { ...tokens, user: user };
      } else {
        throw ApiError.BadRequest(`Неверный пароль.`);
      }
    } else {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} не найден.`
      );
    }
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const tokenData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!tokenData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await db.query(
      `select *
             from users
             where id = ?`,
      [tokenFromDb.user_id]
    );
    const userData = new userDto(user[0][0]);
    const tokens = tokenService.generateToken({ ...userData });
    await tokenService.saveToken(userData.id, tokens.refreshToken);
    return { ...tokens, user: user[0][0] };
  }

  async getAllUsers() {
    const users = await db.query(`select *
                                      from users;`);
    return users[0];
  }

  async getUser(id) {
    const user = await db.query(`select *
                                     from users
                                     where id = ?`, [id]);
    if (!user[0][0]) throw ApiError.BadRequest("Нет такого пользователя.");
    return user[0][0];
  }

  async updateUser(name, surname, phone_number, username, idParams, idToken) {
    if (idParams.toString() !== idToken.toString())
      throw ApiError.BadRequest("Нет прав доступа");
    const user = await db.query(
        `select *
             from users
             where id = ?`,
        [idToken]
    );
    if (!user[0][0]) throw ApiError.BadRequest("Нет такого пользователя.");
    await db.query(
      `update users
             set name=?,
                 surname=?,
                 phone_number=?,
                 username=?
             where id = ?`,
      [name, surname, phone_number, username, idToken]
    );
    // console.log(user[0][0])
    return user[0][0];
  }

  async activate(activationLink) {
    const user = await db.query(`select *
                                     from users
                                     where activation_link = ${activationLink}`);
    if (!user[0][0])
      throw ApiError.BadRequest("Неправильная ссылка активации.");
    await db.query(`update users
                        set isActivated= true
                        where activation_link = ${activationLink}`);
  }
}

module.exports = new UserService();
