/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export let ApiData = createContext([]);

export function ApiDataProvider(props) {
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
  const [searchList, setSearchList] = useState(null);
  const [CheckingSearch, setCheckSearching] = useState("");
  async function getTrendingAll() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/4/discover/movie?vote_average.gte=7.8&with_original_language=en&without_genres=16&api_key=f1aca93e54807386df3f6972a5c33b50`
    );
    setTrendingAll(data.results);
  }
  async function getTrendingMovies() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=f1aca93e54807386df3f6972a5c33b50&page=${currentPage}`
    );
    setTrendingMovies(data.results);
  }
  async function getTrendingTv() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/tv/day?api_key=f1aca93e54807386df3f6972a5c33b50&page=${currentPage}`
    );
    setTrendingTv(data.results);
  }
  async function getTrendingPersons() {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/person/day?api_key=f1aca93e54807386df3f6972a5c33b50&page=${currentPage}`
    );
    setTrendingPeople(data.results);
  }
  async function getCurrentTrend(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/${
        currentPop ? currentPop : "movie"
      }/day?api_key=f1aca93e54807386df3f6972a5c33b50`
    );
    setcurrentTrend(data.results);
  }
  async function getPopularMovies(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/${
        currentPop ? currentPop : "movie"
      }/popular?api_key=f1aca93e54807386df3f6972a5c33b50`
    );
    setcurrentPopular(data.results);
  }
  async function getTopRated(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/3/${
        currentPop ? currentPop : "movie"
      }/top_rated?api_key=f1aca93e54807386df3f6972a5c33b50`
    );
    settopRated(data.results);
  }
  async function getComedy(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/4/discover/${
        currentPop ? currentPop : "movie"
      }?vote_average.gte=7.5&with_original_language=en&with_genres=35&without_genres=16&api_key=f1aca93e54807386df3f6972a5c33b50`
    );
    setComedy(data.results);
  }
  async function getAnime(currentPop) {
    let { data } = await axios.get(
      `https://api.themoviedb.org/4/discover/${
        currentPop ? currentPop : "movie"
      }?&with_genres=16&with_keywords=210024|287501&api_key=f1aca93e54807386df3f6972a5c33b50`
    );
    setAnime(data.results);
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
  }, [currentPage]);
  return (
    <ApiData.Provider
      value={{
        TrendingAll,
        trendingMovies,
        trendingTv,
        trendingPeople,
        getPage,
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
