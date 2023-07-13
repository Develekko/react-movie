import React, { useEffect } from 'react'
import { Link, } from 'react-router-dom';
import Loading from '../Loading/Loading';
import './Search.css'
import { useContext } from 'react';
import { ApiData } from '../../Context/ApiStore';
import $ from 'jquery'
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { ListContext } from '../../Context/ListContext.js';
export default function Search() {
    let { searchList, CheckingSearch } = useContext(ApiData);
    let { itemList, setItemList } = useContext(ListContext)
    useEffect(() => {
        if (CheckingSearch?.length) {
            $('#search').fadeIn(500)
        }
        else {
            $('#search').fadeOut(500)
        }
    }, [CheckingSearch])
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
        <div id='search' className="container-fluid pt-5  search">
            <div className="row">
                <h2 className='mt-2'>Search Result</h2>
                {searchList?.length > 0 ? searchList?.filter((movie) => movie?.media_type === 'movie' || movie?.media_type === 'tv').filter(movie => movie?.poster_path !== null).map((movie, index) =>
                    <div onClick={() => $('#search').fadeOut(1000)} key={index} className='col-md-2 mb-3'>
                    <Link to={`/movie-details/${movie.id}/${movie.media_type}`}>
                    <Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}>
                    <div className="cardOverParent position-relative">
                    <img loading="lazy" className='img-fluid' src={`https://image.tmdb.org/t/p/w500` + movie.poster_path} title={movie?.name || movie?.title} alt={movie?.name || movie?.title} />
                    <div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault();e.stopPropagation() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i></div>
                    </div>
                    </Tooltip>
                    </Link>
                    </div>
                ) : <Loading />}
            </div>
        </div>

    </>
}