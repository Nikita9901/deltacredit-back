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
             where email = $1;`,
      [data.email]
    );
    if (userFind.rows[0]) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${data.email} уже существует.`
      );
    }

    const newPerson = await db.query(
      `insert into users (email, password_hash)
             values ($1, $2)
             returning *`,
      [data.email, data.password]
    );
    // const activationLink = uuid.v4();
    // await mailService.sendActivationMail(
    //   email,
    //   activationLink
    // );

    const userData = new userDto(newPerson.rows[0]);
    const tokens = tokenService.generateToken({ ...userData });
    await tokenService.saveToken(userData.id, tokens.refreshToken);
    return { ...tokens, user: newPerson.rows[0] };
  }

  async loginUser(email, password) {
    const userFind = await db.query(
      `select *
             from users
             where email = $1;`,
      [email]
    );
    const user = userFind.rows[0];
    if (userFind.rows[0]) {
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
             where id = $1`,
      [tokenFromDb.user_id]
    );
    const userData = new userDto(user.rows[0]);
    const tokens = tokenService.generateToken({ ...userData });
    await tokenService.saveToken(userData.id, tokens.refreshToken);
    return { ...tokens, user: user.rows[0] };
  }

  async getAllUsers() {
    const users = await db.query(`select *
                                      from users;`);
    return users.rows;
  }

  async getUser(id) {
    const user = await db.query(`select *
                                     from users
                                     where id = ${id}`);
    if (!user.rows[0])
      throw ApiError.BadRequest("Нет такого пользователя.");
    return user.rows[0];
  }

  async updateUser(
    name,
    surname,
    phone_number,
    username,
    idParams,
    idToken
  ) {
    if (idParams.toString() !== idToken.toString())
      throw ApiError.BadRequest("Нет прав доступа");
    const user = await db.query(
      `update users
       set name=$1,
           surname=$2,
           phone_number=$3,
           username=$4
           where id = $5
       returning *`,
      [name, surname, phone_number, username, idToken]
    );
    if (!user.rows[0])
      throw ApiError.BadRequest("Нет такого пользователя.");
    // console.log(user.rows[0])
    return user.rows[0];
  }

  async activate(activationLink) {
    const user = await db.query(`select *
                                     from users
                                     where activation_link = ${activationLink}`);
    if (!user.rows[0])
      throw ApiError.BadRequest("Неправильная ссылка активации.");
    await db.query(`update users
                        set isActivated= true
                        where activation_link = ${activationLink}`);
  }
}

module.exports = new UserService();
