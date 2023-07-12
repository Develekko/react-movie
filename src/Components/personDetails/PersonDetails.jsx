/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../Loading/Loading'
import Notfound from '../Notfound/Notfound'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, EffectCreative } from "swiper"
import 'swiper/css';
import 'swiper/css/bundle'
import './PersonDetails.css'
import { Helmet } from "react-helmet";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { ListContext } from '../../Context/ListContext.js'

export default function PersonDetails() {
  const { id } = useParams()
  const [idError, setIdError] = useState('');
  const imgPath = 'https://image.tmdb.org/t/p/w500';
  const [Details, setDetails] = useState([]);
  const [External, setExternal] = useState([]);
  const [Images, setImages] = useState([]);
  const [Credits, setCredits] = useState([]);
  let { itemList, setItemList } = useContext(ListContext)
  async function getItemDetails() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US`).catch(error => {
      setIdError(error.response.status)
    })
    setDetails(data)
  }
  async function getExternal() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/person/${id}/external_ids?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US`).catch(error => {
      setIdError(error.response.status)
    })
    setExternal(data)
  }
  async function getImages() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/person/${id}/images?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US`).catch(error => {
      setIdError(error.response.status)
    })
    setImages(data)
  }
  async function getCredits() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US`).catch(error => {
      setIdError(error.response.status)
    })
    setCredits(data.cast)
  }
  function setFav(movie) {
    if (itemList.some(x => x.id === movie.id)) {
        itemList.splice(itemList.findIndex(x => x.id === movie.id), 1)
        let x = [...itemList]
        localStorage.setItem("userList", JSON.stringify(x))
        setItemList(x)
    }
    else {
        itemList.push(movie);
        let x = [...itemList]
        localStorage.setItem("userList", JSON.stringify(x))
        setItemList(x)
    }
}
  useEffect(() => {
    getItemDetails()
    getExternal()
    getImages()
    getCredits()
  }, [])

  return <>
    <Helmet>
      <title>{Details.name}</title>
    </Helmet>
    {idError === 404 ? <Notfound /> : Details.length !== 0 ? <><div className="container pt-5">
      <div className="row">
        <div className="col-md-4">
          <Swiper
            effect={"creative"}
            creativeEffect={{
              prev: {
                shadow: true,
                translate: [0, 0, -400],
              },
              next: {
                translate: ["100%", 0, 0],
              },
            }}
            grabCursor={true}
            loop={false}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            keyboard={{
              enabled: true,
            }}
            modules={[Autoplay, Keyboard, EffectCreative]}
            className="mySwiper"
          >
            {Images.profiles ? Images.profiles.filter(img => img.logo_path !== null).map((img, index) => <SwiperSlide key={index}><img className='img-fluid user-select-none' src={imgPath + img.file_path} alt="" /></SwiperSlide>) : null}
          </Swiper>
          <ul className='d-flex justify-content-center py-2 align-items-center'>
            {External?.facebook_id ? <li className='me-2 rounded-circle social-facebook'><a href={'https://www.facebook.com/' + External.facebook_id} target="_blank" rel="noreferrer"><i className="fs-4 fa-brands fa-facebook-f"></i></a></li> : null}
            {External?.twitter_id ? <li className='me-2 rounded-circle social-twitter'><a href={'https://www.twitter.com/' + External.twitter_id} target="_blank" rel="noreferrer"><i className="fs-4 fa-brands fa-twitter"></i></a></li> : null}
            {External?.instagram_id ? <li className='me-2 rounded-circle social-instagram'><a href={'https://www.instagram.com/' + External.instagram_id} target="_blank" rel="noreferrer"><i className="fs-4 fa-brands fa-instagram"></i></a></li> : null}
            {External?.wikidata_id ? <li className='me-2 rounded-circle social-wiki'><a href={'https://www.wikidata.org/wiki/' + External.wikidata_id} target="_blank" rel="noreferrer"><i className="fs-4 fa-brands fa-wikipedia-w"></i></a></li> : null}

          </ul>
          <span className="badge bg-black p-2 px-2 mx-1 mt-2">{Details.known_for_department}</span>
          <span className="badge bg-black p-2 px-2 mx-1 mt-2">{Details.birthday}</span>
        </div>
        <div className="col-md-8">
          <h1 className='text-center mt-3'>{Details.title ? Details.title : Details.name}</h1>
          <h4><span className="badge bg-success p-2 px-2 mx-1 mt-2">{Details.status}</span></h4>
          <p className='mt-3'>{Details.biography}</p>
          <hr />
          <div className="row">
            <div className="col-md-12">
              <h6>Place Of Birth: {Details.place_of_birth}</h6>
              {Details.vote_average ? <h6>vote Average: {Details.vote_average}</h6> : null}
              {Details.vote_count ? <h6>vote Count: {Details.vote_count}</h6> : null}
              {Details.popularity ? <h6>Popularity: {Details.popularity}</h6> : null}
              <hr />
              {Details.production_companies ? <h6>Production: <span title='Company'>{Details.production_companies[0].name}</span> <span title='Country'> ({Details.production_companies[0].origin_country})</span></h6> : null}
            </div>
          </div>
        </div>
      </div>

      {Credits.length > 0 ? <div className="my-5 similar">
      <h2 className='h1 text-center wow animate__animated animate__fadeInDown '>Actor Movies</h2>
        <hr />
        <div className='container text-center'>
          {Credits ? <><Swiper
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 30,
              },
            }}
            centeredSlides={false}
            grabCursor={true}
            loop={false}
            loopFillGroupWithBlank={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            keyboard={{
              enabled: true,
            }}
            modules={[Autoplay, Keyboard]}
            className="mySwiper user-select-none"
          >
            {Credits.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide onClick={() => window.scrollTo(0, 0)} key={index}><Link to={`/movie-details/${movie.id}/${movie.media_type}`}>
            <Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}>
            <div className="position-relative cardOverParent"><img className='img-fluid' src={imgPath + movie.poster_path} title={movie.name} alt={movie.name} /><div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault();e.stopPropagation() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div></div>
            </Tooltip>
            </Link></SwiperSlide>)}
          </Swiper></> : null}
        </div>
        <hr />
      </div> : null}


    </div></> : <Loading />}

  </>
}
