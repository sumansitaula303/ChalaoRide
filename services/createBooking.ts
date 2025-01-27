import axios from "axios";
type createBookingProps= {
    vehicle: number,
    start_date: string,
    end_date: string,
    city: string,
    pickup_location: string,
    total_price: number,
    payment_method: string,
    promo_code: string
}
const createBooking= async (params: createBookingProps) => {
    try{
        console.log(params)
        const data = await axios.post(
            "https://chalao.pythonanywhere.com/api/booking/", {
                "vehicle_id": params.vehicle,
                "start_date": params.start_date,
                "end_date": params.end_date,
                "city": params.city,
                "pickup_location": params.pickup_location,
                "total_price": params.total_price,
                "payment_method": "CASH",
                "promo_code": params.promo_code
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
export default createBooking;