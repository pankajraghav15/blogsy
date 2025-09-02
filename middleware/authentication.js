const { validateToken } = require("../services/authentication");
const User = require("../models/user");

function checkForAuthenticationCookie(cookieName){
    return async (req,res, next)=>{
        const tokenCookieValue = req.cookies[cookieName];




        if (!tokenCookieValue){
           return  next();
        }

        

        try {
            const userPayLoad = validateToken(tokenCookieValue);
            const user = await User.findById(userPayLoad._id);
            if (user) {
                req.user = user;
            }
            
        } catch (error) {  
            console.error("Invalid token:", error.message);

        }

        next();
    };
}



module.exports = checkForAuthenticationCookie;
