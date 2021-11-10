import rapid from "@ovcina/rapidriver";
import express from "express";
import {Rapid, host} from "./helpers.js";

const PORT = 8080;
const app = express();
const sessionID = 10;

app.use(express.urlencoded({ extended: true }));

app.post('/login', async (req, res) => {
    let ret = {
        error: true,
    };
    const resp = await Rapid.publish("ping", "pong", {
        username: req.body.username ?? "",
        password: req.body.password ?? "",
        sessionID,
    });
    if(resp)
    {
        console.log("Got something back", resp);
        resp.error = false;
    }

    res.send(ret);
});

app.listen(PORT);
console.log("Listening on", PORT);