import axios from "axios";
const getSingleVechile= async (id: number)=> {
    try{
        const data = await axios.get(
            `https://chalao.pythonanywhere.com/api/vehicle/${id}/`
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        return("Error has arrived check console for more details")
    }
    
}
export default getSingleVechile;