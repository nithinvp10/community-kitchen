const express = require("express");
const router = express.Router();
const loginModel = require("../../models/user/login");
const cookieAuth = require("../../utils/auth");
const jwt = require("jsonwebtoken");

router.get("/login", async (req, res) => {
  if (req.cookies.user) {
    const id = jwt.verify(req.cookies.user, "sdfkjendfk");
    const findId = await loginModel.findByPk(id);
    if (findId) {
      res.redirect(`/user/${id}/dashboard`);
    } else {
      res.clearCookie("user");
      res.render("user/login", { wrong: "" });
    }
  } else {
    res.render("user/login", { wrong: "" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const checkData = await loginModel.findOne({
    where: {
      email: email,
    },
  });

  if (checkData) {
    if (password == checkData.dataValues.password) {
      const token = cookieAuth(checkData.dataValues.id);
      res.cookie("user", token, {
        expires: new Date(Date.now() + 172800 * 1000),
        secure: true,
        httpOnly: true,
      });

      res.redirect(`/user/${checkData.dataValues.id}/dashboard`);
    } else {
      res.render("user/login", { wrong: "Wrong password" });
    }
  } else {
    res.json({ err: "Email doesn't exist" });
  }
});

router.get("/signup", async (req, res) => {
  if (req.cookies.user) {
    const id = jwt.verify(req.cookies.user, "sdfkjendfk");
    const findId = await loginModel.findByPk(id);
    if (findId) {
      res.redirect(`/user/${id}/dashboard`);
    } else {
      res.clearCookie("user");
      res.render("user/signup", { exist: false });
    }
  } else {
    res.render("user/signup", { exist: false });
  }
});

router.post("/signup", async (req, res) => {
  const { name, email, password, confirm, address, pincode, phone } = req.body;

  const result = await loginModel.findOne({
    where: {
      email: email,
    },
  });

  if (result) {
    res.render("user/signup", { exist: true });
  } else {
    const storeData = await loginModel
      .create({
        email: email,
        password: password,
        name: name,
        address: address,
        pincode: pincode,
        phone: phone,
      })
      .then((data) => {
        const token = cookieAuth(data.dataValues.id);
        res.cookie("user", token, {
          expires: new Date(Date.now() + 172800 * 1000),
          secure: true,
          httpOnly: true,
        });
        console.log(data.dataValues);
        console.log("Store data successfully");
        res.redirect(`/user/${data.dataValues.id}/dashboard`);
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  }
});

router.get("/:id/dashboard", (req, res) => {
  res.render("user/dashboard");
});

router.get("/logout", (req, res) => {
  res.clearCookie("user");
  res.redirect("/user/login");
});

module.exports = router;
