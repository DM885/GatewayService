export default {
    type: "post",
    path: "/login",
    callback: async (req, res) => {
        let ret = {
            error: true,
        };
        const resp = await Rapid.publish("signIn", "signIn-response", {
            username: req.body.username ?? "",
            password: req.body.password ?? "",
            sessionID: res.locals.sessionID,
        });
        if(resp && resp.token)
        {
            resp.accessToken = resp.token;
            resp.error = false;
        }
    
        res.send(ret);
    }
};