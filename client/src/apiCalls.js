import axios from "axios";
const baseUrl = "https://socialappbackend-2wht.onrender.com/api"

export const loginCall =async(userCredential,dispatch)=>{
    dispatch({type:"LOGIN_START"});
    try{
        const res= await axios.post(baseUrl+"/auth/login",userCredential);
        dispatch({type: "LOGIN_SUCCESS", payload: res.data});
    }catch(err){
        dispatch({type: "LOGIN_FAILURE", payload: err});
    }
};