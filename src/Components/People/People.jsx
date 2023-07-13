/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, useLocation } from 'react-router-dom';
import { ApiData } from '../../Context/ApiStore';
import css from '../Movies/Movies.module.css'
import { Helmet } from "react-helmet";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Skeleton } from '@mui/material';

export default function People() {
    let { getPage, trendingPeople,currentPage } = useContext(ApiData)
    const [handelCurrentPageNumber, setHandelCurrentPageNumber] = useState(1);
    const handlePageClick = async (e) => {
        window.history.pushState({}, '', `#/person?page=${e.selected + 1}`);
        let currentPage = e.selected + 1
        getPage(currentPage)
        window.scrollTo(0, 0)
    }
    let location = useLocation();
    useEffect(() => {
        const pageNumber = new URLSearchParams(location.search).get('page')
        if(pageNumber>0&&pageNumber<=500)
        {
            getPage(pageNumber)
            setHandelCurrentPageNumber(Number(pageNumber)-1)
        }else
        {
            setHandelCurrentPageNumber(0)
            getPage(1)
        }
    }, [location.pathname])
    return <>
        <Helmet>
            <title>People</title>
        </Helmet>
        <div className="container pt-5 animate__animated animate__fadeIn">
            <div className="row">
                {trendingPeople.length > 0 ? <div className="col-md-4 d-flex align-items-center">
                    <div className={css.trending}>
                        <h4 className='my-3'>Trending People to watch now</h4>
                    </div>
                </div> : <div className="col-md-4 d-flex align-items-start flex-column justify-content-center ">
                <Skeleton animation="wave" variant="text" height={10} width="20%" sx={{backgroundColor:"rgba(255,255,255,0.11)"}} />
                <Skeleton animation="wave" variant="text" width="80%" sx={{backgroundColor:"rgba(255,255,255,0.11)",margin:"10px 0px"}} />
                <Skeleton animation="wave" variant="text" height={10} width="80%" sx={{backgroundColor:"rgba(255,255,255,0.11)"}} />
                </div>}
                {trendingPeople.length > 0 ? trendingPeople.filter((img) => img.profile_path !== null).map((person, index) =>
                    <div key={index} className='col-md-2 mb-3'>
                        <Link to={`/person/${person.id}`}>
                            <div>
                            <Tooltip title={person.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}>
                                <img loading="lazy" className='img-fluid' src={`https://image.tmdb.org/t/p/w500` + person.profile_path} alt="" />
                            </Tooltip>
                            </div>
                        </Link>

                    </div>
                ) : 
                    [...Array(20)].map((_, index) =>
                    <div key={index} className='col-md-2 mb-3'>
                    <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"294px",width:"196px",backgroundColor:"rgba(255,255,255,0.11)"}} />
                    </div>) }
            </div>
            <ReactPaginate
                previousLabel={<><Tooltip title="Prev" placement="left" TransitionComponent={Zoom} arrow componentsProps={{tooltip: {sx:{bgcolor: 'common.black','& .MuiTooltip-arrow': {
          color: 'common.black',
        }}}}}><KeyboardArrowLeftIcon /></Tooltip></>}
                nextLabel={<><Tooltip title="Next" placement="right" TransitionComponent={Zoom} arrow componentsProps={{tooltip: {sx:{bgcolor: 'common.black','& .MuiTooltip-arrow': {
          color: 'common.black',
        }}}}}><KeyboardArrowRightIcon /></Tooltip></>}
                breakLabel={'...'}
                pageCount={500}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item paginate-item rounded mx-1'}
                pageLinkClassName={'page-link '}
                previousClassName={`page-item ${currentPage === 1 ? 'd-none' : null}`}
                previousLinkClassName={'page-link'}
                nextClassName={`page-item ${currentPage === 500 ? 'd-none' : null}`}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active current-active-page'}
                forcePage={handelCurrentPageNumber}
            />
        </div>
    </>
}
