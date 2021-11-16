// Test with Template-microservice
export default {
    type: "get",
    path: "/ping",
    auth: false,
    callback: async (req, res) => {
        let ret = {
            error: true,
        };

        const resp = await Rapid.publish("ping", "pong", {
            token: "NOT-VALID",
            sessionID: res.locals.sessionID,
        });
        if(resp)
        {
            console.log("Got something back", resp);
            resp.error = false;
        }
    
        res.send(ret);
    }
};