import axios from "axios";
type bookingdltProps= {
    booking_id: number
}
const cancelBookings= async ({booking_id}: bookingdltProps)=> {
    try{
        const data = await axios.patch(
            `https://chalao.pythonanywhere.com/api/cancel-booking/${booking_id}`
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        return("Error has arrived check console for more details")
    }
}
export default cancelBookings ;