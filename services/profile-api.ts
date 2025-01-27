import axios from "axios";
const getProfile= async ()=> {
    try{
        const data = await axios.get(
            "https://chalao.pythonanywhere.com/api/auth/user-profile/"
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        throw new Error();
    }
    
}
export {getProfile};