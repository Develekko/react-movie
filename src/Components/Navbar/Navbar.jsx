import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { ApiData } from '../../Context/ApiStore';
import './Navbar.css'
import $ from 'jquery';
import { useEffect } from 'react';
import Logo from '../../favicon.png';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { MovieGenres, TvGenres } from '../MoviesCategory/movieGenres.js';
import { Box, Menu} from "@mui/material";
import { useState } from 'react';


export default function Navbar({ userData, logOut }) {
  useEffect(() => {
    $('nav .navbar-toggler').on('click', function () {
      $('nav').toggleClass('bg-dark')
    })

  }, [])
  $('.nav-link').on('click', function () {
    $('#search').fadeOut(1000)
    $('.navbar-collapse').removeClass('show')
    $('nav').removeClass('bg-dark')
  });
  let { setSearchList, setCheckSearching } = useContext(ApiData);
  const navbar = document.querySelector('nav');
  window.onscroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('nav-active');
    } else {
      navbar.classList.remove('nav-active');
    }
  };
  async function getSearch(term) {
    let { data } = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US&query=${term}&include_adult=false`);
    setSearchList(data.results);
  }

  const [MovieMenu, setMovieMenu] = useState(null);
  const [TVMenu, setTVMenu] = useState(null);
  

  const handleOpenMovieMenu = (e) => {setMovieMenu(e.currentTarget);};
  const handleCloseMovieMenu = () => {setMovieMenu(null)};
  
  const handleOpenTVMenu = (e) => {setTVMenu(e.currentTarget);};
  const handleCloseTVMenu = () => {setTVMenu(null)};

  return <>
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top user-select-none" onClick={()=>{
   const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);
     if(!isMobile) {
      setMovieMenu(null)
      setTVMenu(null)
  }
    }} >
      <div className="container-fluid">
        <Link onClick={() => $('#search').fadeOut(1000)} className="navbar-brand" to="/"><img width={40} src={Logo} alt="logo" /></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>

        <li className="nav-item"  onMouseEnter={()=>{setTVMenu(null)}}>            
            <Link onMouseEnter={handleOpenMovieMenu}  className="nav-link form-font cursor-pointer" aria-current="page"
              to="/movies">Movies <i className="fa-solid fa-caret-down"></i></Link>
            <Menu  id="menu-appbar" anchorEl={MovieMenu} sx={{ width: '400px',top:'50px',height:'100%',left:{xs:'0px',md:'100px'},zIndex:3,'& .MuiPopover-paper': {
            left: '16px!important',top:'0!important',background:'transparent'}, '& .MuiList-root': {padding: '0px'}}} onClose={handleCloseMovieMenu} open={Boolean(MovieMenu)}>
              <Box onMouseLeave={handleCloseMovieMenu}  className="row bg-dark p-3 rounded-3">
               {MovieGenres.map(x=>{
                return <div  key={x.id} className="col-6">
                <Link onClick={()=>{window.scrollTo(0, 0);setMovieMenu(null); $('#search').fadeOut(500)}} to={`/movie/${x.name}`}><p className="p-1 rounded nav-cat-filter ps-2">{x.display}</p></Link>
                </div>
               })}
          
              </Box>
            </Menu>
        </li>

            <li className="nav-item" onMouseEnter={()=>{setMovieMenu(null)}} >          
            <Link onMouseEnter={handleOpenTVMenu}  className="nav-link form-font cursor-pointer" aria-current="page"
              to="/tv-shows">TvShows <i className="fa-solid fa-caret-down"></i></Link>
            <Menu  id="menu-appbar" anchorEl={TVMenu} sx={{ width: '420px',top:'50px',left:{xs:'0',md:'100px'},zIndex:3,'& .MuiPopover-paper': {
            left: '16px!important',top:'0!important',background:'transparent'}, '& .MuiList-root': {
            padding: '0px'}}} onClose={handleCloseTVMenu} open={Boolean(TVMenu)}>
              <Box onMouseLeave={handleCloseTVMenu}  className="row bg-dark p-3 rounded">
               {TvGenres.map(x=>{
                return <div  key={x.id} className="col-6">
                <Link onClick={()=>{window.scrollTo(0, 0);setTVMenu(null); $('#search').fadeOut(500)}} to={`/tv/${x.name}`}><p className="p-1 rounded nav-cat-filter ps-2">{x.display}</p></Link>
                </div>
               })}
          
              </Box>
            </Menu>
  
            </li>


            <li className="nav-item">
              <Link className="nav-link" to="/person">People</Link>
            </li>
              <li className="nav-item">
                <Link className="nav-link" to="/mylist">My List</Link>
              </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item d-flex flex-row-reverse">
              <div className="searchBox">

                <input id='searchInput' type="search" className='form-control rounded-pill' placeholder='Search...' onInput={(e) => { setCheckSearching(e.currentTarget.value) }} onChange={(e) => { getSearch(e.target.value) }} />
                <button className="searchButton" href="#">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </li><li className="nav-item d-flex flex-row-reverse">
            <Tooltip title="GitHub" placement="bottom" TransitionComponent={Zoom} arrow componentsProps={{tooltip: {sx:{bgcolor: 'common.black','& .MuiTooltip-arrow': {
          color: 'common.black',
        }}}}}>
                <a className="nav-link" target={'_blank'} href="https://github.com/Develekko" rel="noreferrer"><i className='fa-brands fa-github'></i></a>
                </Tooltip>
              </li>
            {userData ? <><li className="nav-item d-flex align-items-center">
                Welcome <span className=' ms-2 username fw-bold'> {userData.name}</span>
              </li><li className="nav-item">
                <span onClick={logOut} className="nav-link logout">Logout</span>
              </li></> : <><li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li><li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li></>}
          </ul>
        </div>
      </div>
    </nav>
  </>
}
