
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const handleUserSignin = (req, res) => {
    return res.render("signin");
};

const handleUserSignup = (req, res) => {
    return res.render("signup");
};

const handleUserSiginAuth = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        const user = await User.findOne({email});
        return res.cookie("token", token).render("userHome", {user});

    } catch (error) {
        return res.render("signin", {
            error: "Incorrect email or password",
        });

    }
};


const handleUserLogout = (req, res) => {
    res.clearCookie("token").redirect("/");
};

const handleCreateUser = async (req, res) => {
    try {
        const { firstName, lastName, gender, email, password } = req.body;
        const profileImageURL = req.file?`/uploads/${req.file.filename}`:"/images/default.png";
        await User.create({
            firstName,
            lastName,
            gender,
            email,
            password,
            profileImageURL,

        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send("Something went wrong");
    }
    

    return res.redirect("/");

};

const handleViewUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user){
            return res.status(404).send("User not found")

        }
        return res.render("viewProfile", { user });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Sever error")
        
    }
  
};

const handleEditUserForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send("user not found");
        return res.render ("editUserProfile", { user } );
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
};

const handleUpdateUserById = async (req, res) => {
    try {
        const updateData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gender: req.body.gender,            
        }

        if (req.file) {
            updateData.profileImageURL = `/uploads/${req.file.filename}`;
        }

        if (req.body.password && req.body.confirmPassword){
            if (req.body.password !== req.body.confirmPassword) {
                return res.status(400).send("passwords do not match");                
            }

            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new:true, runValidators:true }
        );
        if (!updatedUser) return res.status(404).send("User not found");

        return res.redirect(`/user/${updatedUser.id}`);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
    }
};





module.exports = {
    handleUserSignin,
    handleUserSignup,
    handleUserSiginAuth,
    handleUserLogout,
    handleCreateUser,
    handleViewUserProfile,
    handleEditUserForm,
    handleUpdateUserById,
   
};