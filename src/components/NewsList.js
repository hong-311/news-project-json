import React, { useState } from 'react';
import { SyncLoader } from "react-spinners";
import NewsItem from './NewsItem';
import styled from 'styled-components';
import usePromise from '../libs/usePromise';
import Pagination from './PageNation';
import newsApiData from '../newsApiData';
import Error from './Error';

//스타일 컴포넌트 생성
const NewsListBlock = styled.div`
box-sizing: border-box;
padding-bottom: 3rem;
width: 652px;
margin: 180px;
margin-top: 2rem;
@media screen and (max-width: 652px) {
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

`;



//뉴스 전체를 보여주는 컴포넌트
function NewsList({category}) {
    const itemsPerPage = 10; // 한 페이지에 표시할 아이템 수
    const [currentPage, setCurrentPage] = useState(1);

    //데이터 받아오기 - 로딩, 성공, 실패
    const [loading, response, error] = usePromise(() => {
        return newsApiData;
    },[category]);

    
    //로딩중
    if(loading){
      return <NewsListBlock><SyncLoader
      color="#1A73E8"
      margin={2}
      size={10}
      style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
    /></NewsListBlock>;
  }

    //값이 없을 때
    if(!response){
        return null;
    }

    //에러 발생
    if(error){
        return <NewsListBlock><Error /></NewsListBlock>;
    }

    //값이 유효할 때
    const articles = category === 'all' ? response.articles : response.articles.filter(article => article.category===category);

    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = articles.slice(startIndex, endIndex);

    return (
        <NewsListBlock>
          {/* 현재 페이지에 해당하는 기사들을 보여줌 */}
          {currentItems.map((article) => (
            <NewsItem key={article.source.id} article={article} />
          ))}
          {/* 페이지네이션 컴포넌트 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalItems={articles.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
      )}
        </NewsListBlock>
    );
}

export default NewsList;