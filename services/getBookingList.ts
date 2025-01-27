import axios from "axios";
const getBookingList= async ()=> {
    try{
        const data = await axios.get(
            "https://chalao.pythonanywhere.com/api/booking/"
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        return("Error has arrived check console for more details")
    }
    
}
export default getBookingList;