const bcrypt = require("bcrypt");
const db = require("../database/db");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const userService = require("../services/user-service");

class UserController {
  async createUser(req, res) {
    try {
      const { username, email, password } = req.body;
      console.log(await db.query(`select * from users;`));
      const userData = await userService.createUser(email, username, password);
      if (userData) {
        res.cookie("refreshToken", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: true,
        });
        return res.json(userData);
      }
    } catch (error) {
      return res.status(401).send("Authentication failed");
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const userFind = await db.query(
        `select *
                 from users
                 where email = $1;`,
        [email]
      );
      const user = userFind.rows[0];
      if (user) {
        const isSame = await bcrypt.compare(password, user.password);

        if (isSame) {
          let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: 24 * 60 * 60 * 1000,
          });
          res.cookie("jwt", token, {
            maxAge: 24 * 60 * 60,
            httpOnly: true,
          });
          console.log("user", JSON.stringify(user, null, 2));
          console.log(token);
          //send user data
          return res.status(201).send(user);
        } else {
          return res.status(401).send("Authentication failed");
        }
      } else {
        console.log("No user found");
        return res.status(401).send("Authentication failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getUsers(req, res) {
    const users = await db.query("select * from users");
    res.json(users.rows);
  }

  async getUser(req, res) {
    const id = req.params.id;
    const user = await db.query(
      `select *
             from users
             where users.id_user = $1`,
      [id]
    );
    res.json(user.rows[0]);
  }

  async logoutUser(req, res) {
    try {
    } catch (error) {}
  }

  async activateUser(req, res) {
    try {
    } catch (error) {}
  }

  async refreshToken(req, res) {
    try {
    } catch (error) {}
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
