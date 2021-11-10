export default async function (req, res) {
    const resp = await Rapid.publish("ping", "pong", {
        username: req.body.username ?? "",
        password: req.body.password ?? "",
        sessionID,
    });
    console.log("Got something back", resp);


    res.send({
        error: false
    });
}