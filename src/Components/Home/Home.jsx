/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiData } from '../../Context/ApiStore'
import Loading from '../Loading/Loading'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCreative, Keyboard } from "swiper"
import 'swiper/css';
import 'swiper/css/bundle'
import { ListContext } from '../../Context/ListContext';
import { Helmet } from "react-helmet";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { Skeleton } from '@mui/material';
export default function Home() {

  const [TrendingBtn, setTrendingBtn] = useState(true)
  const [UpComingBtn, setUpComingBtn] = useState(true)
  const [PopularBtn, setPopularBtn] = useState(true)
  const [TopRatedBtn, setTopRatedBtn] = useState(true)
  const [HorrorBtn, setHorrorBtn] = useState(true)
  const [ComedyBtn, setComedyBtn] = useState(true)
  const [AnimeBtn, setAnimeBtn] = useState(true)
  let { TrendingAll, getCurrentTrend, currentTrend, currentPopular, getPopularMovies, topRated, getTopRated, getComedy, comedy,horror,getHorror, anime, getAnime,upComing, getUpComing} = useContext(ApiData);
  let { itemList, setItemList } = useContext(ListContext)
  let navigate = useNavigate()
  const imgPath = 'https://image.tmdb.org/t/p/w500';
  useEffect(() => {
    getPopularMovies('movie')
    if (localStorage.getItem("userList") != null) {
      setItemList(JSON.parse(localStorage.getItem("userList")))
    }
  }, [])

  function Watch(movie) {
    navigate(`/movie-details/${movie.id}/${movie?.title ? 'movie' : 'tv'}`)
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
  return <>
    <Helmet>
      <title>D Movies</title>
    </Helmet>
    {TrendingAll?.length > 0 ? <><Swiper
      slidesPerView={1}
      centeredSlides={false}
      loop={true}
      grabCursor={true}
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
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      keyboard={{
        enabled: true,
      }}
      modules={[Keyboard, Autoplay, EffectCreative]}
      className="mySwiper"
    >
      {TrendingAll?.filter(img => img.backdrop_path !== null).map((movie, index) => <SwiperSlide key={index}>
        <div
          id='Home'
          className='container-fluid p-0 cover position-relative animate__animated animate__fadeIn'
          style={{ background: `linear-gradient(to right, rgba(6, 6, 6,0.5) 40%, transparent 100%), url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")` }}>

          <div className='ps-3 cover-Display col-12 col-sm-12 col-md-5 d-flex flex-column justify-content-center'>
            <h2 className='fw-bold animate__animated animate__fadeInDown'>{movie?.title ? movie.title : movie.name}</h2>
            <span className='px-2 my-2'>{new Date(movie?.release_date || movie?.first_air_date).getFullYear()}</span>
            <p className='animate__animated animate__flipInX'>{movie.overview}</p>
            <div className="d-flex">
              <button onClick={() => Watch(movie)} className='me-2 btn  text-white border border-1 border-secondary bg-black d-flex align-items-center justify-content-center mt-3 animate__animated animate__fadeInUp'><i className="fa-solid fa-arrow-right-to-bracket fs-5 me-2"></i> Watch</button>
              <button onClick={() => setFav(movie)} className='btn  text-white border border-1 border-secondary bg-black d-flex align-items-center justify-content-center mt-3 animate__animated animate__fadeInUp'><i className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__heartBeat' : null)}></i> {itemList?.filter(x => x.id === movie.id).length > 0 ? 'Remove From List' : 'Add To List'}</button>

            </div>
          </div>

        </div>
      </SwiperSlide>)}
    </Swiper></> : <Loading />}


    <div className="castDisplay container-fluid pt-2 animate__animated animate__fadeIn">
      <div className='d-flex justify-content-between align-items-center'>
        {currentTrend ? <h4 className='my-2'>Trending {currentTrend[0]?.name === undefined ? "Movies" : "Shows"}</h4> : null}
        <div id='HomeBtns'>
          <button onClick={() => { getCurrentTrend('movie'); setTrendingBtn(true) }} className={'btn me-2 slider-btn ' + (TrendingBtn ? 'active' : '')}>Movies</button>
          <button onClick={() => { getCurrentTrend('tv'); setTrendingBtn(false) }} className={'btn me-2 slider-btn  ' + (TrendingBtn ? '' : 'active')}>Tv Shows</button>
        </div>
      </div>
      {currentTrend.length > 0 ? <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        autoplay={{
          delay: 4000,
          disableOnInteraction: true,
        }}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard, Autoplay]}
        className="mySwiper"
      >
        {currentTrend.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Link to={`/movie-details/${movie.id}/${currentTrend[0].name ? 'tv' : 'movie'}`}>
          <Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}>
          <div>
          <img loading="lazy"  className='img-fluid' src={imgPath + movie.poster_path} title={movie?.name || movie?.title} alt={movie?.name || movie?.title} />
          <div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i></div>
         </div>
          </Tooltip>
        </Link>
        </SwiperSlide>)}
      </Swiper></> : 
      <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard, Autoplay]}
        className="mySwiper"
      >
        {[...Array(20)].map((_, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"402px",width:"268px",backgroundColor:"rgba(255,255,255,0.11)"}} />
        </SwiperSlide>)}
      </Swiper></> 
       }
    </div>

    <div className="castDisplay container-fluid pt-2 animate__animated animate__fadeIn">
      <div className='d-flex justify-content-between align-items-center'>
        {currentPopular ? <h4 className='my-2'>Popular {currentPopular[0]?.name === undefined ? "Movies" : "Shows"}</h4> : null}
        <div id='HomeBtns'>
          <button onClick={() => { getPopularMovies('movie'); setPopularBtn(true) }} className={'btn me-2 slider-btn ' + (PopularBtn ? 'active' : '')}>Movies</button>
          <button onClick={() => { getPopularMovies('tv'); setPopularBtn(false) }} className={'btn me-2 slider-btn  ' + (PopularBtn ? '' : 'active')}>Tv Shows</button>
        </div>
      </div>
      {currentPopular.length > 0 ? <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard]}
        className="mySwiper"
      >
        {currentPopular.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Link to={`/movie-details/${movie.id}/${currentPopular[0].name ? 'tv' : 'movie'}`}>
        <Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}><div>
        <img loading="lazy"  className='img-fluid' src={imgPath + movie.poster_path} title={movie?.name || movie?.title} alt={movie?.name || movie?.title} />
        <div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i></div>
        </div></Tooltip>
        </Link></SwiperSlide>)}
      </Swiper></> :   <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard]}
        className="mySwiper"
      >
        {[...Array(20)].map((_, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"402px",width:"268px",backgroundColor:"rgba(255,255,255,0.11)"}} />
        </SwiperSlide>)}
      </Swiper></> }
    </div>

    <div className="castDisplay container-fluid pt-2 animate__animated animate__fadeIn">
      <div className='d-flex justify-content-between align-items-center'>
        {upComing ? <h4 className='my-2'>Up Coming {upComing[0]?.name === undefined ? "Movies" : "Shows"}</h4> : null}
        <div id='HomeBtns'>
          <button onClick={() => { getUpComing('movie'); setUpComingBtn(true) }} className={'btn me-2 slider-btn ' + (UpComingBtn ? 'active' : '')}>Movies</button>
          <button onClick={() => { getUpComing('tv'); setUpComingBtn(false) }} className={'btn me-2 slider-btn  ' + (UpComingBtn ? '' : 'active')}>Tv Shows</button>
        </div>
      </div>
      {upComing.length > 0 ? <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard]}
        className="mySwiper"
      >
        {upComing.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide className='position-relative cardOverParent' key={index}><Link to={`/movie-details/${movie.id}/${upComing[0].name ? 'tv' : 'movie'}`}><Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}><div><img loading="lazy"  className='img-fluid' src={imgPath + movie.poster_path} title={movie?.name || movie?.title} alt={movie?.name || movie?.title} /><div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div></div></Tooltip></Link></SwiperSlide>)}
      </Swiper></> :   <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard, Autoplay]}
        className="mySwiper"
      >
        {[...Array(20)].map((_, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"402px",width:"268px",backgroundColor:"rgba(255,255,255,0.11)"}} />
        </SwiperSlide>)}
      </Swiper></> }
    </div>

    <div className="castDisplay container-fluid pt-2 animate__animated animate__fadeIn">
      <div className='d-flex justify-content-between align-items-center'>
        {topRated ? <h4 className='my-2'>Top Rated {topRated[0]?.name === undefined ? "Movies" : "Shows"}</h4> : null}
        <div id='HomeBtns'>
          <button onClick={() => { getTopRated('movie'); setTopRatedBtn(true) }} className={'btn me-2 slider-btn ' + (TopRatedBtn ? 'active' : '')}>Movies</button>
          <button onClick={() => { getTopRated('tv'); setTopRatedBtn(false) }} className={'btn me-2 slider-btn  ' + (TopRatedBtn ? '' : 'active')}>Tv Shows</button>
        </div>
      </div>
      {topRated.length > 0 ? <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard]}
        className="mySwiper"
      >
        {topRated.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide className='position-relative cardOverParent' key={index}><Link to={`/movie-details/${movie.id}/${topRated[0].name ? 'tv' : 'movie'}`}><Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}><div><img loading="lazy"  className='img-fluid' src={imgPath + movie.poster_path} title={movie?.name || movie?.title} alt={movie?.name || movie?.title} /><div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div></div></Tooltip></Link></SwiperSlide>)}
      </Swiper></> :   <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard, Autoplay]}
        className="mySwiper"
      >
        {[...Array(20)].map((_, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"402px",width:"268px",backgroundColor:"rgba(255,255,255,0.11)"}} />
        </SwiperSlide>)}
      </Swiper></> }
    </div>

    <div className="castDisplay container-fluid pt-2 animate__animated animate__fadeIn">
      <div className='d-flex justify-content-between align-items-center'>
        {horror ? <h4 className='my-2'>Horror {horror[0]?.name === undefined ? "Movies" : "Shows"}</h4> : null}
        <div id='HomeBtns'>
          <button onClick={() => { getHorror('movie'); setHorrorBtn(true) }} className={'btn me-2 slider-btn ' + (HorrorBtn ? 'active' : '')}>Movies</button>
          <button onClick={() => { getHorror('tv'); setHorrorBtn(false) }} className={'btn me-2 slider-btn  ' + (HorrorBtn ? '' : 'active')}>Tv Shows</button>
        </div>
      </div>
      {horror.length > 0 ? <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard]}
        className="mySwiper"
      >
        {horror.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide className='position-relative cardOverParent' key={index}><Link to={`/movie-details/${movie.id}/${horror[0].name ? 'tv' : 'movie'}`}><Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}><div><img loading="lazy"  className='img-fluid' src={imgPath + movie.poster_path} title={movie?.name || movie?.title} alt={movie?.name || movie?.title} /><div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div></div></Tooltip></Link></SwiperSlide>)}
      </Swiper></> :   <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard, Autoplay]}
        className="mySwiper"
      >
        {[...Array(20)].map((_, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"402px",width:"268px",backgroundColor:"rgba(255,255,255,0.11)"}} />
        </SwiperSlide>)}
      </Swiper></> }
    </div>

    <div className="castDisplay container-fluid pt-2 animate__animated animate__fadeIn">
      <div className='d-flex justify-content-between align-items-center'>
        {comedy ? <h4 className='my-2'>Comedy {comedy[0]?.name === undefined ? "Movies" : "Shows"}</h4> : null}
        <div id='HomeBtns'>
          <button onClick={() => { getComedy('movie'); setComedyBtn(true) }} className={'btn me-2 slider-btn ' + (ComedyBtn ? 'active' : '')}>Movies</button>
          <button onClick={() => { getComedy('tv'); setComedyBtn(false) }} className={'btn me-2 slider-btn  ' + (ComedyBtn ? '' : 'active')}>Tv Shows</button>
        </div>
      </div>
      {comedy.length > 0 ? <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard]}
        className="mySwiper"
      >
        {comedy.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide className='position-relative cardOverParent' key={index}><Link to={`/movie-details/${movie.id}/${comedy[0].name ? 'tv' : 'movie'}`}><Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}><div><img loading="lazy"  className='img-fluid' src={imgPath + movie.poster_path} title={movie?.name || movie?.title} alt={movie?.name || movie?.title} /><div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div></div></Tooltip></Link></SwiperSlide>)}
      </Swiper></> :   <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard, Autoplay]}
        className="mySwiper"
      >
        {[...Array(20)].map((_, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"402px",width:"268px",backgroundColor:"rgba(255,255,255,0.11)"}} />
        </SwiperSlide>)}
      </Swiper></> }
    </div>

    <div className="castDisplay container-fluid pt-2 animate__animated animate__fadeIn">
      <div className='d-flex justify-content-between align-items-center'>
        {anime ? <h4 className='my-2'>Anime {anime[0]?.name === undefined ? "Movies" : "Shows"}</h4> : null}
        <div id='HomeBtns'>
          <button onClick={() => { getAnime('movie'); setAnimeBtn(true) }} className={'btn me-2 slider-btn ' + (AnimeBtn ? 'active' : '')}>Movies</button>
          <button onClick={() => { getAnime('tv'); setAnimeBtn(false) }} className={'btn me-2 slider-btn  ' + (AnimeBtn ? '' : 'active')}>Tv Shows</button>
        </div>
      </div>
      {anime.length > 0 ? <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard]}
        className="mySwiper"
      >
        {anime.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide className='position-relative cardOverParent' key={index}><Link to={`/movie-details/${movie.id}/${anime[0].name ? 'tv' : 'movie'}`}><Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}><div><img loading="lazy"  className='img-fluid' src={imgPath + movie.poster_path} title={movie?.name || movie?.title} alt={movie?.name || movie?.title} /><div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div></div></Tooltip></Link></SwiperSlide>)}
      </Swiper></> :   <><Swiper
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 8,
          },
        }}
        centeredSlides={false}
        grabCursor={true}
        keyboard={{
          enabled: true,
        }}
        modules={[Keyboard, Autoplay]}
        className="mySwiper"
      >
        {[...Array(20)].map((_, index) => <SwiperSlide className='position-relative cardOverParent' key={index}>
        <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"402px",width:"268px",backgroundColor:"rgba(255,255,255,0.11)"}} />
        </SwiperSlide>)}
      </Swiper></> }
    </div>
  </>
}
