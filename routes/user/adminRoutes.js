const express = require("express");
const router = express.Router();

const cookieAuth = require("../../utils/auth");
const jwt = require("jsonwebtoken");

const adminLogin = require("../../models/admin/login");

//GET admin signup
router.get("/signup", async (req, res) => {
  /* This code block is checking if there is already an existing admin account in the database. */
  const result = await adminLogin.count();
  if (result == 1) {
    res.json({ msg: "Admin Login" });
    // res.redirect("login");
  } else {
    res.render("admin/signup", {
      emailExist: false,
      passwordError: false,
      name: "",
      email: "",
      password: "",
      confirm: "",
    });
  }
});

//POST admin signup
router.post("/signup", async (req, res) => {
  const { name, email, password, confirm } = req.body;
  if (password !== confirm) {
    res.render("admin/signup", {
      emailExist: false,
      passwordError: true,
      name: name,
      email: email,
      password: password,
      confirm: confirm,
    });
  } else {
    const data = await adminLogin
      .create({
        name: name,
        email: email,
        password: password,
      })
      .then((data) => {
        const token = cookieAuth(data.dataValues.id);
        res.cookie("admin", token, {
          expires: new Date(Date.now() + 172800 * 1000),
          secure: true,
          httpOnly: true,
        });
        // res.redirect("/admin/dashboard");
        res.json({ msg: "Admin Dashboard" });
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  }
});

module.exports = router;
