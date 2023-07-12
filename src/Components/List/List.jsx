/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { ListContext } from '../../Context/ListContext';
import { Helmet } from "react-helmet";

export default function List() {
    let { itemList, setItemList } = useContext(ListContext)


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
        if (localStorage.getItem("userList") != null) {
            setItemList(JSON.parse(localStorage.getItem("userList")))
        }
    }, [])

    return <>
        <Helmet>
            <title>My List ❤️</title>
        </Helmet>
        <div className="container pt-5 animate__animated animate__fadeIn">
            <div className="row">

                {itemList?.length > 0 ? itemList?.filter((movie) => movie.poster_path !== null).reverse().map((movie, index) =>
                    <div key={index} className='col-md-2 mb-3'>
                        <Link to={`/movie-details/${movie.id}/${movie.title ? 'movie' : 'tv'}`}>
                            <div className='position-relative cardOverParent'>
                                <img className='img-fluid' src={`https://image.tmdb.org/t/p/w500` + movie.poster_path} alt="" />
                                <div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div>
                            </div>
                        </Link>
                    </div>
                ) : <div className='text-center mt-5'>
                    <h1>Your List Is Empty!</h1>
                </div>}
            </div>
        </div>
    </>
}