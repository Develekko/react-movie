import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import Search from '../Search/Search'

export default function Main({userData,logOut}) {
  return <>
  <Navbar logOut={logOut} userData={userData}/>
  <Search/>
  <Outlet/>
  </>
}