/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let ApiData = createContext([]);

export function ApiDataProvider(props) {
  const apiKey="f1aca93e54807386df3f6972a5c33b50"
  const [TrendingAll, setTrendingAll] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [trendingPeople, setTrendingPeople] = useState([]);
  const [currentPage, setcurrentPage] = useState(1);
  const [currentTrend, setcurrentTrend] = useState([]);
  const [currentPopular, setcurrentPopular] = useState([]);
  const [topRated, settopRated] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [anime, setAnime] = useState([]);
  const [horror, setHorror] = useState([]);
  const [upComing, setUpComing] = useState([]);
  const [searchList, setSearchList] = useState(null);
  const [CheckingSearch, setCheckSearching] = useState("");
  async function getTrendingAll() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/4/discover/movie?vote_average.gte=7.8&with_original_language=en&without_genres=16&api_key=${apiKey}`
    );
    setTrendingAll(data.results);
  }
  async function getTrendingMovies() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&page=${currentPage}`
    );
    setTrendingMovies(data.results);
  }
  async function getTrendingTv() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}&page=${currentPage}`
    );
    setTrendingTv(data.results);
  }
  async function getTrendingPersons() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/person/day?api_key=${apiKey}&page=${currentPage}`
    );
    setTrendingPeople(data.results);
  }
  async function getCurrentTrend(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/${
        currentPop ? currentPop : "movie"
      }/day?api_key=${apiKey}`
    );
    setcurrentTrend(data.results);
  }
  async function getPopularMovies(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/${
        currentPop ? currentPop : "movie"
      }/popular?api_key=${apiKey}`
    );
    setcurrentPopular(data.results);
  }
  async function getTopRated(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/${
        currentPop ? currentPop : "movie"
      }/top_rated?api_key=${apiKey}`
    );
    settopRated(data.results);
  }
  async function getComedy(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/4/discover/${
        currentPop ? currentPop : "movie"
      }?vote_average.gte=7.5&with_original_language=en&with_genres=35&without_genres=16&api_key=${apiKey}`
    );
    setComedy(data.results);
  }
  async function getAnime(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/4/discover/${
        currentPop ? currentPop : "movie"
      }?&with_genres=16&with_keywords=210024|287501&api_key=${apiKey}`
    );
    setAnime(data.results);
  }
  async function getHorror(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/4/discover/${currentPop ? currentPop : "movie"}?&without_genres=16,35,10759&with_genres=${currentPop==='tv'?'80,18,10765':27}&api_key=${apiKey}`
    );
    setHorror(data.results);
  }
  async function getUpComing(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/4/discover/${currentPop ? currentPop : "movie"}?api_key=${apiKey}&sort_by=primary_release_date.desc,popularity.desc&include_adult=false&region=US&${currentPop==='tv'?'first_air_date':'primary_release_date'}.gte=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}&${currentPop==='tv'?'first_air_date':'primary_release_date'}.lte=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)}`
    );
    setUpComing(data.results);
  }

  function getPage(page) {
    setcurrentPage(page);
  }
 
  useEffect(() => {
    getTrendingAll();
    getTrendingMovies();
    getTrendingPersons();
    getTrendingTv();
    getCurrentTrend();
    getPopularMovies();
    getTopRated();
    getComedy();
    getAnime();
    getHorror();
    getUpComing();
  }, [currentPage]);
  return (
    <ApiData.Provider
      value={{
        TrendingAll,
        trendingMovies,
        trendingTv,
        trendingPeople,
        getPage,
        currentPage,
        getCurrentTrend,
        currentTrend,
        currentPopular,
        getPopularMovies,
        topRated,
        getTopRated,
        getComedy,
        comedy,
        anime,
        getAnime,
        horror,
        getHorror,
        upComing,
        getUpComing,
        searchList,
        setSearchList,
        setCheckSearching,
        CheckingSearch,
      }}
    >
      {props.children}
    </ApiData.Provider>
  );
}

export default ApiDataProvider;
