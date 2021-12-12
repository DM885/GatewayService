export default function (rapidManager) {
    return {
      type: "get",
      path: "/files/:filename",
      auth: false,
      callback: async (req, res) => {
        await rapidManager.publishAndSubscribe("read-file", "read-file-response", res.locals.sessionID, {
          filename: req.params.filename,
          userId: res.locals.userId,
          filetype: req.body.filetype
        }, resp => {
          res.send(resp);
        }, res.locals.userId);
      }
    };
  };
  
