import rapid from '@ovcina/rapidriver';

export default class RiverSubscription {

  _callbacks;

  constructor(host, river, event) {
    this._callbacks = {};

    console.log(`Creating RiverSubscription with host: ${host}, river: ${river}, event: ${event}`);
    // Create subscription to river.
    rapid.subscribe(host, [{
      river: river, event: event, work: res => {
        console.log(`Received: ${JSON.stringify(res)}`);
        const msg = res;

        if (msg.session in this._callbacks) {
          // Execute the callback for the session.
          this._callbacks[msg.session](res);

          // Delete from the callbacks as this one is executed now.
          delete this._callbacks[msg.session];
        } else {
          console.warn(`No known callback function for session ${msg.session} and event ${event}.`);
        }
      }
    }]);
  }

  /**
   * Add callback function for certain session to the river subscription.
   * @param session - Session ID.
   * @param callback - Callback function to execute.
   */
  addCallback(session, callback) {
    if(this._callbacks[session])
    {
      this._callbacks[session](false);
    }
    
    this._callbacks[session] = (data) => {
      this._callbacks[session] = false;
      callback(data);
    };
  }
}
