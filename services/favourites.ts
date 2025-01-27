import axios from "axios";
//add to favourites
const createFavourite= async (vehicle_id : number)=> {
    try{
        const data = await axios.post(
            `https://chalao.pythonanywhere.com/api/favorite-vehicle/`, {
                "vehicle_id": vehicle_id
            }
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        throw new Error("Error has arrived check console for more details")
    }
}

//remove from favourites
const removeFavourite= async (vehicle_id : number)=> {
    console.log(vehicle_id);
    try{
        const data = await axios.delete(
            `https://chalao.pythonanywhere.com/api/favorite-vehicle/${vehicle_id}/`
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        throw new Error("Error has arrived check console for more details")
    }
}

//remove from favoutites
const favouriteList= async ()=> {
    try{
        const data = await axios.get(
            `https://chalao.pythonanywhere.com/api/favorite-vehicle/`
          );
          console.log(data.data)
          return data.data;
    }
    catch(e){
        console.log(e);
        throw new Error("Error has arrived check console for more details")
    }
}
export {createFavourite, removeFavourite, favouriteList} ;