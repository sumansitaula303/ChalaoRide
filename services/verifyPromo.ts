import axios from "axios";

const VerifyPromo= async (promo_code: string) => {
    try{
        const data = await axios.post(
            "https://chalao.pythonanywhere.com/api/promo-codes/validate/"
            , { 
                "promo_code": promo_code
                }
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        return("Error has arrived check console for more details")
    }
    
}
export default VerifyPromo;