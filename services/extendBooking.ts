import axios from "axios";
type extendBookingProps= {
    bookingId: number,
    start_date: string,
    end_date: string,
    price: number,
    remarks: string
}
const ExtendBooking= async (params: extendBookingProps) => {
    try{
        console.log(params)
        const data = await axios.post(
            `https://chalao.pythonanywhere.com/api/extend-booking/${params.bookingId}`, {
                "start_date": params.start_date,
                "end_date": params.end_date,
                "price": params.price,
                "remarks": params.remarks
                }
          );
          console.log(data.data)
        //   return data.data;
    }
    catch(e){
        console.log(e);
        return("Error has arrived check console for more details")
    }
    
}
export default ExtendBooking;