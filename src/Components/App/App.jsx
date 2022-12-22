/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react'
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
import List from '../List/List'
// import { Offline, Online } from "react-detect-offline";
// import OfflineLayout from '../Offline/OfflineLayout'

export default function App() {

  let { userData, setUserData } = useContext(AuthContext);
  function saveUserData() {
    let encodedToken = localStorage.getItem("userToken");
    let decodedToken = jwtDecode(encodedToken);
    setUserData(decodedToken);
  }
  useEffect(() => {
    if (localStorage.getItem("userToken") !== null) {
      saveUserData();
    }
  }, []);
  function logOut() {
    localStorage.removeItem("userToken");
    setUserData(null);
    return <Navigate to="/login" />;
  }

  function ProtectedRoute({ children }) {
    if (userData) {
      return children
    }
    else {
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
        { path: 'movie-details/:id/:media_type', element: <ProtectedRoute><ItemDetails /></ProtectedRoute> },
        { path: 'person/:id', element: <ProtectedRoute><PersonDetails /></ProtectedRoute> },
        { path: 'mylist', element: <ProtectedRoute><List /></ProtectedRoute> },
        { path: 'login', element: <Login saveUserData={saveUserData} /> },
        { path: 'register', element: <Register /> },
        { path: '*', element: <ProtectedRoute><Notfound /></ProtectedRoute> }
      ]
    }
  ])
  return <>
    <RouterProvider router={router} />
  </>
}