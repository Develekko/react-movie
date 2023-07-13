/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ListContext } from '../../Context/ListContext';
import { Helmet } from "react-helmet";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import axios from 'axios';
import { MovieGenres, TvGenres } from './movieGenres.js';
import { Skeleton } from '@mui/material';

export default function MoviesCategory() {
    let { itemList, setItemList } = useContext(ListContext)
    const [Category, setCategory] = useState([])
    const [CurrentPage, setCurrentPage] = useState([])
    const [PageData, setPageData] = useState({})

    async function getCategory({catId,pageNumber}) {
        let { data } = await axios.get(
            `https://api.themoviedb.org/4/discover/${media_type}?&with_genres=${catId}&api_key=f1aca93e54807386df3f6972a5c33b50&page=${pageNumber}&include_adult=false&without_genres=${category==='Horror'?'16,35,10759':''}`);
        pageNumber>data.total_pages&&navigate('/404')
        setCategory(data)
      }


    const handlePageClick = async (e) => {
        window.history.pushState({}, '', `#/${media_type}/${PageData.name}?page=${e.selected + 1}`);
        setCurrentPage(e.selected + 1)
        getCategory({catId:PageData.id,pageNumber:e.selected + 1})
        window.scrollTo(0, 0)
    }
    const findCategory = (category,genres)=>{
        return genres.find(gen=>gen.name.toLowerCase()===category.toLowerCase())
    }
    let location = useLocation();
    const navigate = useNavigate()
    const { category, media_type } = useParams()
    useEffect(() => {
        const checkCategory=findCategory(category,media_type==='tv'?TvGenres:MovieGenres)
        if(checkCategory){
            setPageData(checkCategory)
            const pageNumber = new URLSearchParams(location.search).get('page')
            if(pageNumber>0&&pageNumber<=500)
            {
                setCurrentPage(pageNumber)
                getCategory({catId:checkCategory.id,pageNumber})
            }else
            {
                setCurrentPage(1)
                getCategory({catId:checkCategory.id,pageNumber:1})
            }
        }else
        {
            navigate('/404')
        }
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
            <title>{`${PageData.display} ${media_type==='tv'?'Shows':'Movies'}`} </title>
        </Helmet>
        <div className="container pt-5 animate__animated animate__fadeIn">
            <div className="row">
            <h2 className='h1 text-center wow animate__animated animate__fadeInDown my-3'>{PageData?.display} {media_type==='tv'?'Shows':'Movies'}</h2>
                {Category?.results?.length > 0 ? Category?.results?.filter((movie) => movie.poster_path !== null).map((movie, index) =>
                    <div key={index} className='col-md-3 mb-3'>
                        <Link to={`/movie-details/${movie.id}/${media_type}`}>
                        <Tooltip title={movie?.title || movie?.name} placement="top" followCursor TransitionComponent={Zoom} componentsProps={{tooltip: {sx: {bgcolor: 'common.black'}}}}>
                            <div className='position-relative cardOverParent'>
                                <img loading="lazy" className='img-fluid' src={`https://image.tmdb.org/t/p/w500` + movie.poster_path} alt="" />
                                <div className='cardOverlay'><i onClick={(e) => { setFav(movie); e.preventDefault() }} className={'fa-solid fa-heart fs-5 me-2 ' + (itemList?.filter(x => x.id === movie.id).length > 0 ? 'text-danger animate__animated animate__fadeIn' : 'null')}></i> </div>
                            </div>
                        </Tooltip>
                        </Link>
                    </div>
                ) : [...Array(20)].map((_, index) =>
                    <div key={index} className='col-md-3 mb-3'>
                    <Skeleton animation="wave" variant="rectangular" width="100%" sx={{height:"459px",width:"306px",backgroundColor:"rgba(255,255,255,0.11)"}} />
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
                pageCount={Category?.total_pages>500?500:Category?.total_pages}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item paginate-item rounded mx-1'}
                pageLinkClassName={'page-link '}
                previousClassName={`page-item ${CurrentPage === 1 ? 'd-none' : null}`}
                previousLinkClassName={'page-link'}
                nextClassName={`page-item ${CurrentPage === (Category?.total_pages>500?500:Category?.total_pages) ? 'd-none' : null}`}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active current-active-page'}
                forcePage={CurrentPage-1}
            />
        </div>
    </>
}