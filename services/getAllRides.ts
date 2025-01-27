import axios from "axios";
const getAllRides= async ()=> {
    try{
        const data = await axios.get(
            "https://chalao.pythonanywhere.com/api/vehicle/"
          );
        //   console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        throw new Error();
    }
    
}
export default getAllRides;