import jwt from "jsonwebtoken";
import mysql from "mysql";
import rapid from "@ovcina/rapidriver";

const SECRET = process.env.SECRET ?? `3(?<,t2mZxj$5JT47naQFTXwqNWP#W>'*Kr!X!(_M3N.u8v}%N/JYGHC.Zwq.!v-`;  // JWT secret
export const host = process.env.riverUrl ?? `amqp://localhost`;  // RabbitMQ url

/**
 * Returns the token payload if its valid, otherwise it returns false.
 * @param String token
 * @returns Promise<false|TokenData>
 */
export async function getTokenData(token)
{
    return new Promise(resolve => jwt.verify(token, SECRET, (err, data) => resolve(err ? false : data)));
}

let connection;
if(process.env.mysqlHost)
{
    connection = mysql.createConnection({
        host     : process.env.mysqlHost,
        user     : process.env.mysqlUser,
        password : process.env.mysqlPass,
        database : 'db'
    });
    connection.connect();
}

/**
 * Runs a SQL query on the DB.
 * @param string stmt
 * @param ?string[] WHERE
 * @returns results[]|false
 */
export async function query(stmt, WHERE = []) {
    return new Promise(r => connection.query(stmt, WHERE, (err, results) => r(err ? false : results)));
}

/**
 * Handles the subcribers for the Rapiddriver library.
 */
export class Rapid {
    static _listeners = {};
    static _promises = {};

    /**
     * Sends a @sendEvent event to the RabitMQ and waits for the given @event response.
     * @param string sendEvent 
     * @param string event 
     * @param {*} data 
     * @returns Promise<RetData|false>
     */
    static publish(sendEvent, event, data)
    {
        return new Promise(r => {
            if(!this._listeners[event])
            {
                this._listeners[event] = 1;
                rapid.subscribe(host, [{
                    river: "gateway-listener", 
                    event, 
                    work: msg => this._resolvePromise(event, msg.sessionID, msg)
                }]);
            }
            this._addPromise(event, data.sessionID, r);

            rapid.publish(host, sendEvent, data);
        });
    }

    /**
     * Adds a promise for a given event and session.
     * @param string event 
     * @param string sessionID 
     * @param {*} promiseFunc 
     */
    static _addPromise(event, sessionID, promiseFunc)
    {
        const key = `${event}_${sessionID}`;
        if(this._promises[key])
        {
            this._promises[key](false);
        }
        this._promises[key] = promiseFunc;
    }

    /**
     * Resolves a promise for a given event and session.
     * @param string event 
     * @param string sessionID 
     * @param {*} data 
     */
    static _resolvePromise(event, sessionID, data)
    {
        const promise = this._promises[`${event}_${sessionID}`];
        if(promise)
        {
            promise(data);
        }
    }
}