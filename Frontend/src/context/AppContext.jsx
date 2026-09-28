import { createContext, useEffect } from "react";
import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';

export const AppContext =  createContext()

const AppContextProvider = (props)=>{

    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);
    
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const navigate = useNavigate();
  
    //added this func to laad the api,credit wla hahiye hai
    const loadCreditsData = async () => {
      try {

        const {data} = await axios.get(backendUrl+'/api/user/credits',{headers:{token}})
       
        if(data.success){
          setCredit(data.credits)
          setUser(data.user)
        }
        
      } catch (error) {
        console.log(error);
         toast.error(error.message);
      }
    }
  const generateImage = async (prompt) => {

    try {

      const { data } = await axios.post(
            backendUrl + "/api/image/generate-image",
            { prompt },
            {
                headers: { token }
            }
        );


    if(data.success){
      loadCreditsData();
      return data.resultImage
    }else{
      toast.error(data.message);
       loadCreditsData();
       if(data.creditBalance===0){
            navigate('/buy');
       }
    }

      
    } catch (error) {
      toast.error(error.message);
      
    }
  }



//so that userccan logout  from the accnt
    const logout = () =>{
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
    }
    




    //now we have to execute this function
    //add dependcy arr token ,wehenever token change this function execute
    useEffect(()=>{
      if(token){
        loadCreditsData()
      }

    },[token])
 

    const value = {
        user,setUser,showLogin, setShowLogin,backendUrl, token, setCredit,
         setToken, credit,loadCreditsData,logout, generateImage,
    }

  return(
    <AppContext.Provider value={value}>
     {props.children}
      <ToastContainer position="top-right"/>
    </AppContext.Provider>
   
  )
}
export default AppContextProvider