export default function (rapidManager) {
    return {
      type: 'get',
      path: '/jobs',
      auth: true,
      callback: async (req, res) => {
        let ret = {
          error: true,
        };
        await rapidManager.publishAndSubscribe('job-history', 'job-history-response', res.locals.sessionID, {
          userID: res.locals.userId,
        }, resp => {
            
          if (resp && resp.token) {
            ret.error = false;
            ret.data = resp.data;
          }
  
          res.send(ret);
        }, res.locals.userId);
      }
    };
  };
  