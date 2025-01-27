import axios from "axios";
const getSingleBooking= async (id: number)=> {
    try{
        const data = await axios.get(
            `https://chalao.pythonanywhere.com/api/booking/verify-booking/${id}`
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        return("Error has arrived check console for more details")
    }
    
}
export default getSingleBooking;