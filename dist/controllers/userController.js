import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customErrors.js";
// import User from "../models/User.js";
import { sanitizeUser } from "../utils/tokenUtils.js";
// import { User } from "../models/baseUser.js";
import { User } from "../models/baseUserModel.js";
export const currentUser = async (req, res) => {
    const { userId } = req?.user;
    const user = await User.findOne({ _id: userId });
    if (!user)
        throw new UnauthenticatedError(`fail to login please check your password or email address `);
    let Iuser = sanitizeUser(user);
    Iuser = {
        ...Iuser,
        fullname: Iuser.name,
    };
    res.status(StatusCodes.OK).json({ user: Iuser });
};
// get all the user in the  database
export const getAllUser = async (req, res) => {
    const { search, role } = req.query;
    const queryObject = {};
    if (role && role !== "all") {
        queryObject.role = role;
    }
    if (search) {
        const userSearch = [
            {
                firstName: { $regex: search, $options: "i" },
            },
            {
                lastName: { $regex: search, $options: "i" },
            },
        ];
        queryObject.$or = [...userSearch];
    }
    const { limit, nPages, page, skip } = req.pagination;
    const totalUsers = await User.countDocuments(queryObject);
    const users = await User.find(queryObject).limit(limit).skip(skip);
    const numberOfPage = nPages(totalUsers);
    res.status(200).json({ users, numberOfPage, limit, currentPage: page });
};
// get a unique user in the database
export const getStaticUser = async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });
    if (!user)
        // throw an error if there is no user found in the database
        throw new UnauthenticatedError(`
  couldnot found user with id ${userId}
  `);
    let Iuser = sanitizeUser(user); //removes password from user
    // console.log("this is the login user", Iuser, user);
    res.status(StatusCodes.OK).json({ user: Iuser });
};
//# sourceMappingURL=userController.js.map