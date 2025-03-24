const argon2 = require("argon2");
const userModel = require("../models/userModel");

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User Not Found");
    }
    const passwordVerfiy =await argon2.verify(user.password, password);
    if (!passwordVerfiy) {
      return res.status(401).send("Invalid Password");
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

//Register Callback
const registerController = async (req, res) => {
  try {
    const {name, email, password} = req.body;
   
    const IsExist = await userModel.findOne({ email });
    if (IsExist) {
      return res.status(400).send("User Already Exist");
    }
    const hashedPassword = await argon2.hash(password);
    console.log("data",hashedPassword);
    const newUser = new userModel({
      name,
      email,
      password:  hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};

module.exports = { loginController, registerController };
