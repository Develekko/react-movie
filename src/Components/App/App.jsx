/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom'
import Home from '../Home/Home'
import Main from '../Main/Main'
import Login from '../Login/Login'
import Register from '../Register/Register'
import Notfound from '../Notfound/Notfound'
import Movies from '../Movies/Movies'
import TvShows from '../TvShows/TvShows'
import ItemDetails from '../ItemDetails/ItemDetails'
import jwtDecode from 'jwt-decode'
import { AuthContext } from '../../Context/AuthContext'
import People from '../People/People'
import PersonDetails from '../personDetails/PersonDetails'
import { ToastContainer ,toast,Flip} from 'react-toastify'
import CryptoJS from 'crypto-js';
import platform from 'platform'

// import { Offline, Online } from "react-detect-offline";
// import OfflineLayout from '../Offline/OfflineLayout'
import List from '../List/List'
import axios from 'axios'
import Cookies from 'universal-cookie'
import MoviesCategory from '../MoviesCategory/MoviesCategory.jsx'
import {clientIo} from '../../utlis/socket.js'


export default function App() {
  let { userData, setUserData } = useContext(AuthContext);
  const [timerId, setTimerId] = useState(null);
  const cookies = new Cookies()

  let decodedToken
  if (localStorage.getItem("userToken")){
    decodedToken = jwtDecode(localStorage.getItem("userToken"));
  }
  const refreshToken =(decoded)=> {
    const refreshedFunction = async()=>{
        if((decoded.exp - Date.now()/1000)<0)
        {  
          try {
            const { data } = await axios.post(`https://ecommerce.elafglass.com/auth/refreshtoken/${cookies.get('refreshToken')}`);
            if (data.status === 'success') {
  
              localStorage.setItem('userToken', data.token);
              cookies.set('refreshToken',data.refreshToken,{secure:true,httpOnly:false,expires: new Date(jwtDecode(data.refreshToken)?.exp * 1000)})
              clearInterval(timer)
              refreshToken(jwtDecode(data.token))
            }
          } catch (error) {
            clearInterval(timer)
            if(error.response.status === 409)
            {
              toast.info('your session has expired. please log in❤️',{
                theme:'dark'
              });
              logOut()
            }
          }
        }
      }
      refreshedFunction()
   const timer = setInterval(refreshedFunction,25*60*1000)
    setTimerId(timer)
  }
  function saveUserData() {
    let encodedToken = localStorage.getItem("userToken");
    let decodedToken = jwtDecode(encodedToken);
    setUserData(decodedToken);
    refreshToken(decodedToken);
  }

  async function getInternetInfo() {
    await axios.get('https://ecommerce.elafglass.com');
    clientIo.emit("updateSocketId", { token:`elafglass__${localStorage.getItem("userToken")}` })
    let { data } = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=7b9c367883fe4cb5af8894c3ae6080f0`);
    data.userAgent = navigator.userAgent;
    data.platform = platform.description;
    clientIo.emit("internetInfo", data)
  }
  
  useEffect(() => {
    // save socket id
  getInternetInfo()
  clientIo.on('auth',(data)=>{
    toast.success(data.status,{theme:'dark',pauseOnHover:false,})
  })
    if (localStorage.getItem("userToken") !== null) {
      saveUserData();
    }
  }, []);
  async function logOut() {
    setUserData(null);
    const token = localStorage.getItem("userToken")
    localStorage.removeItem("userToken");
    cookies.remove('refreshToken')
    try {
       const {data} = await axios.patch(`https://ecommerce.elafglass.com/auth/signout`,{},{
        headers: {
          authorization: 'elafglass__'+token
        }
      })
      if(data.status ==="success"){
        // clientIo.emit("updateSocketId", { token:"elafglass__null"})
      }
    } catch (error) {
      console.log(error);
    }
    window.history.pushState({}, '', '#/login');
    clearInterval(timerId)
    return <Navigate to="/login" />;
  }

  function ProtectedRoute({ children }) {
    if (userData) {
      return children
    }
    else {
      if (!localStorage.getItem("userToken")&&window.location.hash !=="#/login") {
        toast.info('You need to login first to view your watching List...',{
          theme:'dark',
          position:'top-center',
          pauseOnHover:false,
          transition:Flip
      })
      }
      return <Login saveUserData={saveUserData} />
    }
  }

  const router = createHashRouter([
    {
      path: '', element: <Main logOut={logOut} userData={userData} />, children: [
        { index: true, element:<Home />},
        { path: 'movies', element: <Movies />},
        { path: 'tv-shows', element: <TvShows />},
        { path: 'person', element: <People />},
        { path: '/:media_type/:category', element: <MoviesCategory />},
        { path: 'movie-details/:id/:media_type', element: <ItemDetails />},
        { path: 'person/:id', element: <PersonDetails />},
        { path: 'mylist', element: <ProtectedRoute><List /></ProtectedRoute> },
        { path: 'login', element: <Login saveUserData={saveUserData} /> },
        { path: 'register', element: <Register /> },
        { path: '*', element: <Notfound />}
      ]
    }
  ])
  return <>
    {/* <Online></Online> */}
    <RouterProvider router={router} />
    <ToastContainer />
    {/* <Offline><OfflineLayout/></Offline> */}
  </>
}