import axios from "axios";
import {appurl} from "../../main";

export default {
    name: "UserMethod",

    Register(editedItem) {
        return axios.post(appurl + '/api/user',editedItem, {
            headers:{
                Authorization:null
            }
        })
    },
}