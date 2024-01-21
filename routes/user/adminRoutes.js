const express = require("express");
const router = express.Router();

const cookieAuth = require("../../utils/auth");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const cloudinaryConfig = require("../../config/cloudinary.config");

//models
const productModel = require("../../models/admin/product");
const feedbackModel=require('../../models/admin/feedback');
const userModel=require('../../models/user/login');
const adminLogin = require("../../models/admin/login");
const orderModel=require('../../models/user/order');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//GET admin signup
router.get("/signup", async (req, res) => {
  /* This code block is checking if there is already an existing admin account in the database. */
  const result = await adminLogin.count();
  if (result == 1) {
    res.redirect("/admin/login");
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

//admin login route
router.get("/login", async (req, res) => {
  if (req.cookies.admin) {
    const tokenId = jwt.verify(req.cookies.admin, "sdfkjendfk");
    const findAdmin = await adminLogin.findByPk(tokenId);

    if (findAdmin) {
      res.redirect("/admin/dashboard");
    } else {
      res.clearCookie("admin");
      res.render("admin/login", { error: false });
    }
  } else {
    res.render("admin/login", { error: false });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const findEmail = await adminLogin.findOne({
    where: {
      email: email,
      password: password,
    },
  });
  if (findEmail) {
    const token = cookieAuth(findEmail.dataValues.id);
    res.cookie("admin", token, {
      expires: new Date(Date.now() + 172800 * 1000),
      secure: true,
      httpOnly: true,
    });
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin/login", { error: true });
  }
});

router.get("/dashboard", async (req, res) => {
  if (req.cookies.admin) {
    const tokenId = jwt.verify(req.cookies.admin, "sdfkjendfk");
    const findAdmin = await adminLogin.findByPk(tokenId);

    if (findAdmin) {
      // res.redirect('/admin/dashboard');
      const allProducts = await productModel.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.render("admin/dashboard", { products: allProducts });
    } else {
      res.clearCookie("admin");
      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/login");
  }
});

router.get("/dashboard/addproduct", async (req, res) => {
  if (req.cookies.admin) {
    const tokenId = jwt.verify(req.cookies.admin, "sdfkjendfk");
    const findAdmin = await adminLogin.findByPk(tokenId);

    if (findAdmin) {
      // res.redirect('/admin/dashboard');
      res.render("admin/addproduct");
    } else {
      res.clearCookie("admin");
      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/login");
  }
});

router.post(
  "/dashboard/addproduct",
  upload.single("file"),
  async (req, res) => {
    const { name, description, price,ingredients } = req.body;
    const fileBuffer = req.file.buffer.toString("base64");
    const fileUpload = await cloudinaryConfig.uploader.upload(
      `data:image/png;base64,${fileBuffer}`,
      {
        folder: "/upload",
        public_id: Date.now() + "-" + req.file.originalname,
        encoding: "base64",
      }
    );

    const addproduct = await productModel
      .create({
        name: name,
        description: description,
        price: price,
        ingredients:ingredients,
        image: fileUpload.secure_url,
      })
      .then(() => {
        res.redirect("/admin/dashboard");
      })
      .catch((err) => {
        res.json({ err: err.message });
      });
  }
);


router.get("/dashboard/product/delete/:id", async (req, res) => {
  const { id } = req.params;

  const findProduct = await productModel.findByPk(id);

  if (findProduct) {
    findProduct.destroy().then(() => {
      res.redirect("/admin/dashboard");
    });
  } else {
    res.redirect("/admin/dashboard");
  }
});


router.get('/feedback',async(req,res)=>{
  if (req.cookies.admin) {
    const tokenId = jwt.verify(req.cookies.admin, "sdfkjendfk");
    const findAdmin = await adminLogin.findByPk(tokenId);

    if (findAdmin) {
      const feedback=await feedbackModel.findAll({})
      res.render("admin/feedback",{feedback:feedback});
    } else {
      res.clearCookie("admin");
      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/login");
  }
})

router.get('/users',async(req,res)=>{
  if (req.cookies.admin) {
    const tokenId = jwt.verify(req.cookies.admin, "sdfkjendfk");
    const findAdmin = await adminLogin.findByPk(tokenId);

    if (findAdmin) {
      const users=await userModel.findAll({});
      res.render("admin/users",{users:users});
    } else {
      res.clearCookie("admin");
      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/login");
  }
})

router.get('/orders',async(req,res)=>{
  if (req.cookies.admin) {
    const tokenId = jwt.verify(req.cookies.admin, "sdfkjendfk");
    const findAdmin = await adminLogin.findByPk(tokenId);

    if (findAdmin) {
      const orders=await orderModel.findAll({});
      res.render("admin/order",{orders:orders});
    } else {
      res.clearCookie("admin");
      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/login");
  }
})

router.get('/orders/:order',async(req,res)=>{
  const {order}=req.params
  if (req.cookies.admin) {
    const tokenId = jwt.verify(req.cookies.admin, "sdfkjendfk");
    const findAdmin = await adminLogin.findByPk(tokenId);
    const findOrder=await orderModel.findOne({
      where:{
        id:order
      }
    });

    if (findAdmin) {
     
      res.render("admin/updatestatus",{order:findOrder.dataValues});
    } else {
      res.clearCookie("admin");
      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/login");
  }
})





router.get("/logout", (req, res) => {
  res.clearCookie("admin");
  res.redirect("/admin/login");
});

module.exports = router;
