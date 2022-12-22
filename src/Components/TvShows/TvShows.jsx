/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, useLocation } from 'react-router-dom';
import { ApiData } from '../../Context/ApiStore';
import { ListContext } from '../../Context/ListContext';
import Loading from '../Loading/Loading';
import css from '../Movies/Movies.module.css'
import { Helmet } from "react-helmet";

export default function Movies() {
    let { itemList, setItemList } = useContext(ListContext)
    let { trendingTv, getPage } = useContext(ApiData)
    const handlePageClick = async (e) => {
        let currentPage = e.selected + 1
        getPage(currentPage)
    }
    let location = useLocation();
    useEffect(() => {
        getPage(1)
    }, [location.pathname])

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
            <title>Tv Shows</title>
        </Helmet>
        <div className="container pt-5 animate__animated animate__fadeIn">
            <div className="row">
                {trendingTv.length > 0 ? <div className="col-md-4 d-flex align-items-center">
                    <div className={css.trending}>
                        <h5 className='mt-5'>Trending TV Shows to watch now</h5>
                        <p className="text-muted">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                    </div>
                </div> : null}
                {trendingTv.length > 0 ? trendingTv.filter(tv => tv.poster_path !== null).map((tv, index) =>
                    <div key={index} className='col-md-2 mb-3'>
                        <Link to={`/movie-details/${tv.id}/${tv.media_type}`}>
                            <div className='position-relative cardOverParent'>
                                <img className='img-fluid' src={`https://image.tmdb.org/t/p/w500` + tv.poster_path} alt="" />
                                <div className='cardOverlay'><i onClick={(e) => { setFav(tv); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === tv.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : null)}></i> </div>
                            </div>
                        </Link>
                    </div>
                ) : <Loading />}
            </div>
            <ReactPaginate
                previousLabel={'< previous'}
                nextLabel={'next >'}
                breakLabel={'...'}
                pageCount={1000}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link bg-dark'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link bg-dark'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link bg-dark'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link bg-dark'}
                activeClassName={'active'}
            />
        </div>
    </>
}
