import rapid from '@ovcina/rapidriver';

export class RiverSubscription {

  #callbacks;

  constructor(host, river) {
    this.#callbacks = {};

    // Create subscription to river.
    rapid.subscribe(host, river, res => {
      const msg = JSON.parse(res.content.toString());

      if (msg.session in this.#callbacks) {
        // Execute the callback for the session.
        this.#callbacks[msg.session](res);

        // Delete from the callbacks as this one is executed now.
        delete this.#callbacks[msg.session];
      }
    });
  }

  /**
   * Add callback function for certain session to the river subscription.
   * @param session - Session ID.
   * @param callback - Callback function to execute.
   */
  addCallback(session, callback) {
    this.#callbacks[session] = callback;
  }
}
