export default function (rapidManager) {
  return {
    type: "post",
    path: "/auth/register",
    auth: false,
    callback: async (req, res) => {
      let ret = {
        error: true,
      };
      await rapidManager.publishAndSubscribe("signUp", "signUp-response", res.locals.sessionID, {
        username: req.body.username,
        password: req.body.password,
        rank: req.body.rank ?? 'customer'
      }, resp => {
        if (resp) {
          ret.error = resp.error;
          ret.session = resp.session;
        }

        res.send(ret);
      });
    }
  };
};
