const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const db = require("../database/db");

class UserController {
  async createUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.createUser(email, password);
      if (userData) {
        res.cookie("refreshToken", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.json(userData);
      }
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.loginUser(email, password);
      if (userData) {
        res.cookie("refreshToken", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.json(userData);
      }
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await userService.getUser(id);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const idToken = (await tokenService.findToken(refreshToken)).user_id;
      const idParams = req.params.id;
      const { name, surname, phone_number, username } = req.body;
      const user = await userService.updateUser(
        name,
        surname,
        phone_number,
        username,
        idParams,
        idToken
      );
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async logoutUser(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      if (userData) {
        res.cookie("refreshToken", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.json(userData);
      }
    } catch (error) {
      next(error);
    }
  }

  // async deleteUser(req, res) {
  //   const id = req.params.id;
  //   const user = await db.query(`delete from person where person.id = $1`, [
  //     id,
  //   ]);
  //   res.json(user[0]);
  // }
}

module.exports = new UserController();
