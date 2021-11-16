import express from "express";
import uid from "uid-safe";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import {getTokenData} from "./helpers.js";

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

// Auth middleware
app.use((req, res, next) => {
    let token = req.headers.Authorization;
    if(token && token.includes("Bearer "))
    {
        const temp = token.split("Bearer ");
        res.locals.jwtToken = temp[1];
    }
    next();
});

// Setup routes
routes.forEach(route => app[route.type](route.path, async (req, res) => {
    if(!route.auth || await getTokenData(res.locals.jwtToken))
    {   
        route.callback(req, res);
    }else{ // Not authorized
        res.status(401).send("Unauthorized");
    }
}));

app.listen(PORT);
console.log("Listening on", PORT);