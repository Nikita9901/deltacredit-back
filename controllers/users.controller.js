const userService = require("../services/user-service");

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
      next(err)
    }
  }

  // async getUser(req, res) {
  //   const id = req.params.id;
  //   const user = await db.query(
  //     `select *
  //            from users
  //            where users.id_user = $1`,
  //     [id]
  //   );
  //   res.json(user.rows[0]);
  // }

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
      console.log(req.cookies.refreshToken, '-----------------------------------------------------------')
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

  // async updateUser(req, res) {
  //   const { id, name, surname } = req.body;
  //   const user = await db.query(
  //     `update person set name=$1, surname=$2 where id=$3 returning *`,
  //     [name, surname, id]
  //   );
  //   res.json(user.rows);
  // }
  // async deleteUser(req, res) {
  //   const id = req.params.id;
  //   const user = await db.query(`delete from person where person.id = $1`, [
  //     id,
  //   ]);
  //   res.json(user.rows);
  // }
}

module.exports = new UserController();
