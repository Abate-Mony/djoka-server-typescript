import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  InterserverError,
  UnauthenticatedError,
} from "../errors/customErrors.js";
import { MiddlewareFn } from "../interfaces/expresstype.js";
// import User from "../models/userModel.js";
import { setCookies } from "../utils/cookieUtils.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
// import { transporter } from "../utils/sendMailUtils.js";
import {
  Accountant,
  Admin,
  Driver,
  Parent,
  Principal,
  Student,
  Teacher,
  User,
} from "../models/baseUserModel.js";
import { createJWT, sanitizeUser } from "../utils/tokenUtils.js";

export const login: MiddlewareFn = async (req, res) => {
  // Destructure email and password from the request body
  const { email, password } = req.body;

  // Find the user in the database by email
  const user = await User.findOne({ email: email });

  // Check if user exists and if the provided password matches the stored hashed password
  const isValidUser = user && (await comparePassword(password, user.password));

  // If user does not exist or password does not match, throw an UnauthenticatedError
  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");

  // Create a JWT token containing the user's ID and role
  const token = createJWT({ userId: user._id, role: user.role });

  // Define cookie expiration time as one day
  const oneDay: number = 1000 * 60 * 60 * 24;

  // Set the JWT token as an HTTP-only cookie and respond with user details
  res
    .cookie("token", token, setCookies(oneDay)) // Set cookie with token and expiration time
    .status(StatusCodes.OK) // Set HTTP status to 200 OK
    .json({
      msg: "user logged in", // Send success message
      token, // Send JWT token in response body
      user: sanitizeUser(user), // Send sanitized user details in response body
    });
};
// this controller helps to create user in the app
export const register: MiddlewareFn = async (req, res) => {
  // Check if this is the first account being created
  const isFirstAccount = (await User.countDocuments()) === 0; // Let the first user in our system be the admin

  // Destructure role from request body and get the remaining user data
  const { role: userRole, ...userData } = req.body;

  // Set role to "admin" if this is the first account, otherwise use the provided role
  const role = isFirstAccount ? "admin" : userRole;
  const hashedPassword = await hashPassword(req.body.password);
  delete userData["password"];
  userData["password"] = hashedPassword;
  try {
    let newUser;

    // Create a new user based on the specified role
    switch (role) {
      case "student":
        newUser = new Student(userData);
        break;
      case "teacher":
        newUser = new Teacher(userData);
        break;
      case "admin":
        newUser = new Admin(userData);
        break;
      case "parent":
        newUser = new Parent(userData);
        break;
      case "accountant":
        newUser = new Accountant(userData);
        break;
      case "principal":
        newUser = new Principal(userData);
        break;
      case "driver":
        newUser = new Driver(userData);
        break;
      default:
        throw new BadRequestError("invalid user role"); // Throw error if the role is invalid
    }

    // Save the new user to the database
    const user = await newUser.save();
   
    // Create a JWT token for the new user
    const token = createJWT({
      userId: newUser._id,
      role,
    });

    // Respond with the created token and sanitized user details
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.log("this is there error: ", error);
    // Handle errors during user creation
    throw new InterserverError(
      "something went wrong when creating your account please try again later"
    );
  }
};
// for the main time we are not validating the user using otp sent to thier mail we do that in v1.0.1

// export const verifiedUser: MiddlewareFn = async (req, res) => {
//   const { email, otp } = req.body;
//   if (!email || !otp)
//     throw new BadRequestError("oops email or otp is required");
//   // Find the user by email
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw new BadRequestError(" Invalid email OR OTP.");
//   }
//   console.log("user with otp", user.otp.value);

//   // Check if OTP matches and is not expired
//   if (!user.otp.value || user.otp.value != otp) {
//     throw new BadRequestError("otp doesnot match");
//   }
//   if (dayjs(user.otp.expiresAt).diff(new Date(), "hour") > 0) {
//     throw new BadRequestError("oops opt expired");
//   }
//   // OTP verification successful, update user's verified flag
//   user.isVerified = true;
//   user.otp.value = undefined; // Remove OTP from user object
//   await user.save();

//   // User verified successfully, send response
//   // res.json({ message: "Account verified successfully!" });

//   const token = createJWT({
//     userId: user.userId,
//     role: user.role,
//   });
//   const oneDay: number = 1000 * 60 * 60 * 24;
//   res.cookie("token", token, setCookies(oneDay));
//   res.status(StatusCodes.OK).json({ msg: "user logged in", token });
// };
// since we are building a secure application we handle the user logout functionality here
export const logout: MiddlewareFn = (_, res) => {
  res.cookie("token", "logout", setCookies());
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
