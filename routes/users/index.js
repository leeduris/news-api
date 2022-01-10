const UserModel = require('../../models/users/');
const loginTokenModel = require('../../models/loginTokens');

exports.getUsers = async (req, res) => {
    try {
        const users = await UserModel.getAll()

        if (!users) {
            return res.status(400).send()
        } else {
            return res.status(200).json({
                success: true, 
                data: users
            })
        }
    } catch (err) {
        return res.status(500).send()
    }
}

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserModel.getById(id)

        if (!user) {
            return res.status(400).send()
        } else {
            return res.status(200).json({
                success: true,
                data: user
            })
        }    
    } catch (err) {
        return res.status(500).send()
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const updated = req.body

        const user = await UserModel.updateById(id, updated)

        if (!user) {
            return res.status(400).send()
        } else {
            return res.status(200).json({
                success: true,
                data: user
            })
        }
    } catch (err) {
        return res.status(500).send()
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id

        const deleted = await UserModel.deleteById(id)
        
        if (deleted.deletedCount === 0) {
            return res.status(400).send()
        } else {
            return res.status(200).json({
                success: true,
                data: deleted.deletedCount
            })
        }
    } catch (err) {
        return res.status(500).send()
    }
}

exports.logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.getByEmail(email);
        
        if (!user) {
            return res.status(401).send("Please login to view this page.");
        }

        const passwordMatch = await user.comparePassword(password);

        if (!passwordMatch) {
            return res.status(401).send("logIn: comparePassword failed");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        if (!accessToken || !refreshToken) {
            return res.status(400).send("logIn: tokens not generated");
        }

        const loginToken = {
            userId: user._id,
            accessToken,
            refreshToken,
            accessTokenExpires: new Date(new Date().getTime() + parseInt(process.env.ACCESS_TOKEN_LIFE) * 1000),
            refreshTokenExpires: new Date(new Date().getTime() + parseInt(process.env.REFRESH_TOKEN_LIFE) * 1000),
            updated: new Date(),
        }

        await loginTokenModel.create(loginToken);

        return res.status(200).json({
            success: true,
            data: {
                accessToken,
                refreshToken,
                user,
            }
        })
    } catch (err) {
        return res.status(500).send()
    }
}

exports.logOut = async (req, res) => {
    try {
        await loginTokenModel.deleteAllByUserId(req.userId);
        return res.status(200).send()
    } catch (err) {
        return res.status(500).send("Something went wrong");
    }
}

exports.signUp = async (req,res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, role } = req.body

        const user = await UserModel.getByEmail(email)

        if (user) {
            return res.status(400).send()
        } 

        const newUser = {
            firstName,
            lastName,
            email, 
            password,
            phoneNumber,
            role,
        }

        const createdUser = await UserModel.create(newUser)

        if (!createdUser) {
            return res.status(400).send() 
        } else {
            return res.status(201).json({
                success: true,
                data: createdUser
            })
        }
    } catch (err) {
        return res.status(500).send()
    }
}


exports.checkEmailExist = async (req, res) => {
    try {
        const { email } = req.body

        const user = await UserModel.getByEmail(email)

        if (user) {
            return res.status(200).json({
                success: true,
                message: 'This email is already in use'
            })
        } 

        return res.status(202).send();
    } catch (err) {
        return res.status(500).send()
    }
}

exports.resetAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        await LoginTokenDB.verifyRefreshToken(refreshToken, async (err, userId) => {
            if (err) return res.status(401).send(err);

            if (!userId) return res.status(401).send();

            const user = await UserModel.getById(userId)
            
            if (!user) return res.status(401).send();

            const accessToken = await user.generateAccessToken();
            const update = { 
                accessToken,
            }
            await loginTokenModel.updateByUserId(user._id, update);

            return res.status(200).json({
                success: true,
                data: {
                    accessToken,
                }
            })
        })
    } catch (err) {
        return res.status(500).send()
    }
}
