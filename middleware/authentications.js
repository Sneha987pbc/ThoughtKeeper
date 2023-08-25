const {validateToken} = require("../service/authentication");


function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if(!tokenCookieValue) {
            console.log("nottokencookievalue");
            return next();
        }
        else{
        try{
        const userPayload = validateToken(tokenCookieValue);
        
        console.log("userPayload",userPayload);

        req.user = userPayload;
        }catch(err){
            console.log(err);
        }
    }
      return next();
    }
}

module.exports = {
    checkForAuthenticationCookie,
}