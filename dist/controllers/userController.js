import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customErrors.js";
import userModel from "../models/userModel.js";
import { sanitizeUser } from "../utils/tokenUtils.js";
// import logisticModel from "../models/logisticModel.js";
// get  the current user
export const currentUser = async (req, res) => {
    const { userId } = req?.user;
    const user = await userModel.findOne({ userId });
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
    const { search } = req.query;
    const queryObject = {};
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
    const totalUsers = await userModel.countDocuments(queryObject);
    const users = await userModel.find(queryObject).limit(limit).skip(skip);
    const numberOfPage = nPages(totalUsers);
    res.status(200).json({ users, numberOfPage, limit, currentPage: page });
};
// get a unique user in the database
export const getStaticUser = async (req, res) => {
    const userId = req.params.userId;
    const user = await userModel.findOne({ userId });
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