import axios from 'axios';
import React from 'react'
import { useContext } from 'react';
import { Link } from 'react-router-dom'
import { ApiData } from '../../Context/ApiStore';
import './Navbar.css'
import $ from 'jquery';
import { useEffect } from 'react';
import Logo from '../../favicon.png';



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

  return <>
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top user-select-none">
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
            <li className="nav-item">
              <Link className="nav-link" to="/movies">Movies</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tv-shows">TvShows</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/person">People</Link>
            </li>
            {userData ?
              <li className="nav-item">
                <Link className="nav-link" to="/mylist">My List</Link>
              </li>
              : null}
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {userData ? <><li className="nav-item d-flex flex-row-reverse">
              <div className="searchBox">

                <input id='searchInput' type="search" className='form-control rounded-pill' placeholder='Search...' onInput={(e) => { setCheckSearching(e.currentTarget.value) }} onChange={(e) => { getSearch(e.target.value) }} />
                <button className="searchButton" href="#">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </li><li className="nav-item d-flex flex-row-reverse">
                <a className="nav-link" target={'_blank'} href="https://github.com/Develekko" rel="noreferrer"><i className='fa-brands fa-github'></i></a>
              </li><li className="nav-item d-flex align-items-center">
                Welcome <span className=' ms-2 username fw-bold'> {userData.first_name}</span>
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
