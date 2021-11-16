export default {
    type: "post",
    path: "/auth/refreshtoken",
    auth: false,
    callback: async (req, res) => {
        let ret = {
            error: true,
        };
        const resp = await Rapid.publish("accessToken", "accessToken-response", {
            refreshToken: req.body.refreshToken ?? "",
            sessionID: res.locals.sessionID,
        });
        if(resp && resp.token)
        {
            resp.refreshToken = resp.token;
            resp.error = false;
        }
    
        res.send(ret);
    }
};