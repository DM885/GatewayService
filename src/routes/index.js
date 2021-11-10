import loginFunc from "./login.js";
import {routeWrapper} from "../helpers.js"; 

export default {
    "GET": {
        
    },
    "POST": {
        "/login": routeWrapper(loginFunc),
    }
};