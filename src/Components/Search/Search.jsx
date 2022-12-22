import React, { useEffect } from 'react'
import { Link, } from 'react-router-dom';
import Loading from '../Loading/Loading';
import './Search.css'
import { useContext } from 'react';
import { ApiData } from '../../Context/ApiStore';
import $ from 'jquery'

export default function Search() {
    let { searchList, CheckingSearch } = useContext(ApiData);
    useEffect(() => {
        if (CheckingSearch?.length) {
            $('#search').fadeIn(500)
        }
        else {
            $('#search').fadeOut(500)
        }
    }, [CheckingSearch])

    return <>
        <div id='search' className="container-fluid pt-5  search">
            <div className="row">
                <h2 className='mt-2'>Search Result</h2>
                {searchList?.length > 0 ? searchList?.filter((movie) => movie?.media_type === 'movie' || movie?.media_type === 'tv').filter(movie => movie?.poster_path !== null).map((movie, index) =>
                    <div onClick={() => $('#search').fadeOut(1000)} key={index} className='col-md-2 mb-3'>
                        <Link to={`/movie-details/${movie.id}/${movie.media_type}`}>
                            <div>
                                <img className='img-fluid' src={`https://image.tmdb.org/t/p/w500` + movie.poster_path} alt="" />
                            </div>
                        </Link>
                    </div>
                ) : <Loading />}
            </div>
        </div>

    </>
}