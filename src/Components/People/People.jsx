/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, useLocation } from 'react-router-dom';
import { ApiData } from '../../Context/ApiStore';
import Loading from '../Loading/Loading';
import css from '../Movies/Movies.module.css'
import { Helmet } from "react-helmet";

export default function People() {
    let { getPage, trendingPeople } = useContext(ApiData)
    const handlePageClick = async (e) => {
        let currentPage = e.selected + 1
        getPage(currentPage)
    }
    let location = useLocation();
    useEffect(() => {
        getPage(1)
    }, [location.pathname])
    return <>
        <Helmet>
            <title>People</title>
        </Helmet>
        <div className="container pt-5 animate__animated animate__fadeIn">
            <div className="row">
                {trendingPeople.length > 0 ? <div className="col-md-4 d-flex align-items-center">
                    <div className={css.trending}>
                        <h5 className='mt-5'>Trending People to watch now</h5>
                        <p className="text-muted">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
                    </div>
                </div> : null}
                {trendingPeople.length > 0 ? trendingPeople.filter((img) => img.profile_path !== null).map((person, index) =>
                    <div key={index} className='col-md-2 mb-3'>
                        <Link to={`/person/${person.id}`}>
                            <div>
                                <img className='img-fluid' src={`https://image.tmdb.org/t/p/w500` + person.profile_path} alt="" />

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
