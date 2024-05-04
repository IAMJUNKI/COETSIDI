const express = require('express');
const authHandlers = require('./handlers');

const authRouter = express.Router();

const {passport} = require('./helpers')

authRouter.use(passport.initialize());
authRouter.use(passport.session());


//passport processess the auth
// authRouter.post("/login",
// passport.authenticate("local", { failureRedirect : "/"}),
// (req, res) => {
// 	res.redirect("/main");
// }
// );

//passport middleware verifies the user credentials
authRouter.post("/login", function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
         return next(err)
        } else if (!user){
            return res.status(401).send(info.message)  //message on why the login couldn't be executed
        }else{
            req.logIn(user, function (err) {
                if (err) {
                    return next(err)
                }
                else{
                    return res.redirect('/main')
                }
            });
        }
    })(req, res, next);
});
// authRouter.post('/login', authHandlers.loginUserHandler);
// authRouter.post('/register', authHandlers.registerUserHandler);
// authRouter.post('/logout', authHandlers.logoutUserHandler);
// authRouter.get('/check-auth', authHandlers.checkAuthHandler);

		
module.exports = authRouter;
