import axios from "axios";
import{appurl} from "../../main";

export default {
    name: "ProductMethods",

    GetAllProducts() {
        return axios.get(appurl+'/api/product', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
    },

    CreateProduct(editedItem){
        return axios.post(appurl+'/api/product', editedItem,{
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
    },

    UpdateProduct(id, editedItem){
        return axios.put(appurl+ '/api/product/' + id, editedItem,{
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
    },

    DeleteProduct(id){
        return axios.delete(appurl+'/api/product/' + id,{
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token'),
            },
        })
    }
}
