import axios from 'axios';

const API_KEY = '79417d53054d24d2503697a83a54b32b';
const BASE_URL = 'https://www.kobis.or.kr/kobisopenapi/webservice/rest'; // HTTP에서 HTTPS로 변경

export const searchMovies = async (movieNm: string, itemPerPage: number = 50) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/searchMovieList.json`, {
      params: {
        key: API_KEY,
        movieNm: movieNm,
        itemPerPage: itemPerPage, // 페이지당 아이템 수 설정
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie list:', error);
    throw error;
  }
};

export const getMovieInfo = async (movieCd: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/searchMovieInfo.json`, {
      params: {
        key: API_KEY,
        movieCd: movieCd,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie info:', error);
    throw error;
  }
};
