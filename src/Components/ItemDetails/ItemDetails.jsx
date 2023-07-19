/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loading from '../Loading/Loading'
import Notfound from '../Notfound/Notfound'
import './ItemDetails.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, EffectFlip } from "swiper"
import 'swiper/css';
import 'swiper/css/bundle'
import { WOW } from 'wowjs'
import $ from 'jquery'
import { ListContext } from '../../Context/ListContext'
import { useContext } from 'react'
import { Helmet } from "react-helmet";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

export default function ItemDetails() {
  let { itemList, setItemList } = useContext(ListContext)
  const wow = new WOW({ live: false });
  wow.init()
  const { id, media_type } = useParams()
  const [idError, setIdError] = useState('');
  const imgPath = 'https://image.tmdb.org/t/p/w500';
  const [Details, setDetails] = useState([]);
  const [similar, setsimilar] = useState([])
  const [credit, setcredit] = useState([])
  const [SeasonDetails, setSeasonDetails] = useState([])
  const [TvId, setTvId] = useState('')
  const [TvSeason, setTvSeason] = useState(1)
  const [TvEpisode, setTvEpisode] = useState(1)
  const [Trailer, setTrailer] = useState('')
  const [playTrailer, setplayTrailer] = useState(false)
  async function getItemDetails() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US`).catch(error => {
      setIdError(error.response.status)
    })
    setDetails(data)
  }
  async function getMovieCredits() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=f1aca93e54807386df3f6972a5c33b50`)
    setcredit(data.cast)
  }
  async function getSimilar() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}/recommendations?api_key=f1aca93e54807386df3f6972a5c33b50`)
    setsimilar(data.results)
  }
  async function getExternalId() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US`)
    setTvId(data.imdb_id)
  }
  async function getSeasonDetails() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${TvSeason}?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US`)
    setSeasonDetails(data.episodes)
  }
  async function getTrailer() {
    let { data } = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=f1aca93e54807386df3f6972a5c33b50&language=en-US`)
    setTrailer(data.results.filter(trailer => trailer.type === 'Trailer')[0].key)
  }
  function timeConvert(time) {
    var num = time;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "hr " + rminutes + "min";
  }
  function showTrailer() {
    setplayTrailer(true)
    $('#trailer iframe').removeClass('animate__fadeOutDown')
    $('#trailer').fadeIn(500)
  }
  function hideTrailer() {
    setplayTrailer(false)
    $('#trailer iframe').addClass('animate__fadeOutDown')
    $('#trailer').fadeOut(500)
    $('#trailer iframe').attr('src', $('#trailer iframe').attr('src'));
  }
  const loadDisqus = (id) => {
    window.disqus_config = function() {
      this.page.url = `https://develekko.github.io/react-movie/#/movie-details/${id}/${media_type}`;
      this.page.identifier = id;
    };
  
    const script = document.createElement('script');
    script.src = 'https://https-develekko-github-io-react-movie-1.disqus.com/embed.js';
    script.setAttribute('data-timestamp', +new Date());
    document.body.appendChild(script);
  };
  useEffect(() => {
    getItemDetails()
    getMovieCredits()
    getExternalId()
    getSeasonDetails()
    getTrailer()
    getSimilar()
    loadDisqus(id);
  }, [TvSeason, playTrailer, id])
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
      <title>{Details?.title || Details?.name}</title>
      <meta name="description" content={Details.overview} />
      <meta property="og:title" content={Details?.title || Details?.name} />
      <meta property="og:description" content={Details.overview} />
      <meta property="og:image" content={`https://image.tmdb.org/t/p/original${Details.backdrop_path}`} />
    </Helmet>
    <div className="overflow-x-hidden">
      {Trailer ? <div onClick={hideTrailer} id='trailer'>
        <div className='trailer-body d-flex justify-content-center align-items-center'>
          <iframe width="1014" height="578" className="drop-shadow-2xl animate__animated animate__fadeInDown"
            src={`https://www.youtube.com/embed/${Trailer}?autoplay=${playTrailer ? '1' : '0'}`} frameBorder="0" allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true" allow="autoplay; encrypted-media;fullscreen;"
            title={Details?.title || Details?.name}></iframe>
        </div>
      </div> : null}


      {idError === 404 ? <Notfound /> : Details.length !== 0 ? <>
        <div style={{ backgroundImage: `linear-gradient(to right, rgba(6, 6, 6,0.5) 40%, transparent 100%), url("https://image.tmdb.org/t/p/original${Details.backdrop_path}")` }} className="container-fluid p-0 cover position-relative  animate__animated animate__fadeIn">
          <div className='cover-Display ps-3 col-12 col-sm-12 col-md-5 d-flex flex-column justify-content-center'>
            <div className='d-flex justify-content-between  align-items-center w-100 mb-3'>
              <div>
                <h2 className='fw-bold animate__animated animate__fadeInLeft'>{Details.title ? Details.title : Details.name}</h2>
                {Details.name ? <><span className='fw-bold'>{Details.number_of_seasons}</span> SS <span className='fw-bold'>{Details.number_of_episodes}</span> Episodes</> : null}
              </div>
              <div className='animate__animated animate__flipInX'>
                {Details.genres?.map((gen, index) =><Link  onClick={()=>window.scrollTo(0, 0)} to={`/${media_type}/${gen.name.replace(/\s/g, "")}`}><span className='badge me-2 p-2 bg-black mt-2 ' key={index}>{gen.name}</span></Link> )}
              </div>
            </div>
            <p className='animate__animated animate__flipInX'>{Details.overview}</p>
            <div className='row animate__animated animate__fadeInDown'>
              <div className="col-6 p-2">
                <span className='text-white-50 fw-bold'>Duration : </span>{timeConvert(Details?.runtime || Details?.episode_run_time || "?")}
              </div>
              <div className="col-6 p-2">
                <span className='text-white-50 fw-bold'>Status : </span>{Details.status}
              </div>
              <div className="col-6 p-2">
                <span className='text-white-50 fw-bold'>Released</span> {Details?.first_air_date || Details?.release_date}
              </div>
              <div className="col-6 p-2">
                <span className='text-white-50 fw-bold'>Languages : </span> {Details.spoken_languages.map((lang, index) => <span key={index}>{(index ? " , " : "") + lang.name} </span>)}
              </div>
              <div className="col-6 p-2">
                <span className='text-white-50 fw-bold'>Countries : </span> {Details.production_countries.map((country, index) => <span key={index}>{(index ? " , " : "") + country.name} </span>)}
              </div>
              {Details?.created_by?.length ? <>
                <div className="col-6 p-2">
                  <span className='text-white-50 fw-bold'>Director</span> {Details.created_by.map((director, index) => <span key={index}>{(index ? " , " : "") + director.name} </span>)}
                </div>
              </> : null}
            </div>
            <div className="d-flex">
              <button onClick={showTrailer} className='btn me-2 trailer-btn d-flex align-items-center justify-content-center mt-3 animate__animated animate__fadeInUp'><i className="fa-brands fa-youtube fs-3 me-2"></i> TRAILER</button>
              <button onClick={() => setFav(Details)} className='btn  text-white bg-black d-flex align-items-center justify-content-center mt-3 animate__animated animate__fadeInUp'><i className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === Details.id).length > 0 ? 'text-danger animate__animated animate__heartBeat' : null)}></i> {itemList?.filter(x => x.id === Details.id).length > 0 ? 'Remove From List' : 'Add To List'}</button>
            </div>
          </div>
          <div className="cursorlay translate-middle"><span onClick={() => {
            const El = document.getElementById('show').offsetTop;
            window.scrollTo(0, El - 55);
          }} className="cursorDown"></span></div>
        </div>
        <div id='show' className="row px-0">
          {Details.seasons ? <div className="col-md-2 bg-black season-display pe-0">
            {SeasonDetails.map((season, index) => <p onClick={() => {
              setTvEpisode(season.episode_number)
              const El = document.getElementById('show').offsetTop;
              window.scrollTo(0, El - 55);
            }} className='text-truncate p-2' key={index}>S{TvSeason}: E{season.episode_number} <span className='text-white-50'>{season.name}</span></p>)}
          </div> : null}
          <div className={Details.seasons ? 'col-md-10 ps-0 user-select-none' : 'bg-black'}>
            {/* <iframe allow="fullscreen" frameBorder="0" allowFullScreen={true} webkitallowfullscreen="true" mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true" src={Details.title ? `https://www.2embed.to/embed/imdb/movie?id=${Details.imdb_id}` : `https://www.2embed.to/embed/imdb/tv?id=${TvId}&s=${TvSeason}&e=${TvEpisode}`} className="w-100 vh-100" title={Details.title ? Details.title : Details.name} /> */}
            <iframe frameBorder="0" allowFullScreen="allowfullscreen" webkitallowfullscreen="true" mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true" src={Details.title ? `https://vidsrc.me/embed/${Details.imdb_id}/color-F10000` : `https://vidsrc.me/embed/${TvId}/${TvSeason}-${TvEpisode}/color-F10000`} className="w-100 vh-100" title={Details.title ? Details.title : Details.name} />
          </div>
        </div>
        <div className='container text-center'>
          {Details.seasons ? <><Swiper
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
            className="mySwiper"
          >
            {Details.seasons.filter(season => season.name !== "Specials").map((season, index) => <SwiperSlide className='seasonShow' onClick={() => {
              setTvSeason(season.season_number)
              getSeasonDetails()
              const El = document.getElementById('show').offsetTop;
              window.scrollTo(0, El - 55);
            }} key={index}><img className='img-fluid' src={imgPath + season.poster_path} title={season.name} alt="" />
              <h5 className='bg-black text-center'>{season.name}</h5></SwiperSlide>)}
          </Swiper></> : null}
        </div>
        <div className="container pt-5">
          <div className="row">
            <div className="col-md-4 user-select-none wow animate__animated animate__fadeInUp ">
              <a href={Details.homepage} target='_blank' rel="noreferrer"><img className='img-fluid mt-3' src={imgPath + Details.poster_path} alt="" /></a>
              <h6 className='text-center'>{Details.genres ? Details.genres.map((gen, index) => <Link onClick={()=>window.scrollTo(0, 0)} to={`/${media_type}/${gen.name.replace(/\s/g, "")}`}><span key={index} className="badge bg-black p-2 px-2 mx-1 mt-2">{gen.name}</span></Link>) : null}</h6>
            </div>
            <div className="col-md-8">
              <h1 className='text-center mt-3'>{Details.title ? Details.title : Details.name}</h1>
              <h4 className='text-center'><span className="badge bg-success p-2 px-2 mx-1 mt-2">{Details?.tagline}</span></h4>
              <hr />
              <div className="row">
                <div className="col-md-5">
                  <h6>Release Date: {Details.release_date ? Details.release_date : Details.last_air_date}</h6>
                  {Details.vote_average ? <h6>vote Average: {Details.vote_average}</h6> : null}
                  {Details.vote_count ? <h6>vote Count: {Details.vote_count}</h6> : null}
                  {Details.popularity ? <h6>Popularity: {Details.popularity}</h6> : null}
                  <hr />
                  {Details.production_companies?.length ? <h6 className='fw-bold text-success'>production Companies</h6> : null}
                  {Details.production_companies?.map((proComp, index) => <span key={index}>{(index ? " , " : "") + proComp.name} </span>)}
                </div>
                <div className="col-md-7 wow animate__animated animate__flipInY animate__delay-1s user-select-none ">
                  <Swiper
                    effect={"flip"}
                    grabCursor={true}
                    loop={true}
                    modules={[EffectFlip]}
                    className="mySwiper"
                  >
                    {Details.production_companies ? Details.production_companies.filter(img => img.logo_path !== null).map((img, index) => <SwiperSlide key={index}><img className='img-fluid' src={imgPath + img.logo_path} alt="" /></SwiperSlide>) : null}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
          <div className='my-5 castDisplay'>
            <h2 className='h1 text-center wow animate__animated animate__fadeInDown '>Cast</h2>
            <hr />
            {credit.length > 0 ? <><Swiper
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
              className="mySwiper"
            >
              {credit.filter((img) => img.profile_path !== null).map((cast, index) => <SwiperSlide key={index}><Link to={`/person/${cast.id}/`}><img className='img-fluid' src={imgPath + cast.profile_path} title={cast.name} alt="" /><h6 className='text-center bg-black text-truncate p-1'>{cast.name}</h6></Link></SwiperSlide>)}
            </Swiper></> : null}
            <hr />
          </div>

          {similar.length > 0 ? <div className="my-5 similar">
            <h2 className='h1 text-center wow animate__animated animate__fadeInDown '>Similar {media_type === 'tv' ? 'Shows' : 'Movies'}</h2>
            <hr />
            <div className='container text-center'>
              {similar ? <><Swiper
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
                {similar.filter(img => img.poster_path !== null).map((movie, index) => <SwiperSlide onClick={() => window.scrollTo(0, 0)} key={index}><Link to={`/movie-details/${movie.id}/${media_type}`}><Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}> <div className='position-relative cardOverParent'><img className='img-fluid' src={imgPath + movie.poster_path} title={movie.name} alt={movie.name} /><div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault();e.stopPropagation() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div></div></Tooltip></Link></SwiperSlide>)}
              </Swiper></> : null}
            </div>
            <hr />
          </div> : null}

        </div>
        <div id="disqus_thread"></div>
        <script id="dsq-count-scr" src="//https-develekko-github-io-react-movie-1.disqus.com/count.js" async></script>
    
      </> : <Loading />}

    </div>
  </>
}
