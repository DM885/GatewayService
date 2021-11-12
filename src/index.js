import express from "express";
import uid from "uid-safe";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";

const PORT = 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session ID middleware
app.use(async (req, res, next) => {
    let token = req.cookies.session;
    if(!token)
    {
        token = await uid(18);
        res.cookie('session', token, {maxAge: 900000, httpOnly: true});
    }
    res.locals.sessionID = token;
    next();
});

// Setup routes
routes.forEach(route => app[route.type](route.path, route.callback));

app.listen(PORT);
console.log("Listening on", PORT);