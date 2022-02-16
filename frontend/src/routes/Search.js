// import { getDownloadURL, getStorage , ref } from "firebase/storage";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import axios from "axios"
import "../styles/Search.css"
import SearchPagination from './SearchPagination.js';
import axiosInstance from 'CustomAxios'

function Search(props){
  const BEER_URL = process.env.REACT_APP_SERVER + ':8888/v1/beer'

  // 검색한 결과 - 클릭했을때 state로 값 가져옴
  const location = useLocation();
  const searchresult = location.state   // id 배열 형식
  // console.log(searchresult)

  const [beerArr, setBeerArr] = useState([])
  const [beerAllArr, setBeerAllArr] = useState([])
  useEffect(()=>{
      // console.log(searchAll)
    console.log('클릭 결과', searchresult)
    const fetchbeerdata = async () => {
      if (searchresult) {
        const eachbeerdata = await axiosInstance.get(`${BEER_URL}?size=500`)
        eachbeerdata.data.map((eachbeer) => {
          searchresult.map((id)=>{
            if (eachbeer.beerId === id) {
              setBeerArr((name)=>[...name, eachbeer])
            }
          })  
        })
      }
    }
    fetchbeerdata();
  },[searchresult])



  // 각 검색 결과
  const [beerEndata, setBeerEndata] = useState([])
  const [beerKodata, setBeerKodata] = useState([])
  const [aromadata, setAromadata] = useState()
  const [flavordata, setFlavordata] = useState()
  const [typedata_all, setTypedata] = useState()
  const [userdata, setUserdata] = useState()


  // 검색한 값 - 엔터했을때 props로 값 가져옴
  const searchInput = props.location.searchInput
  const searchAll = props.location.searchAll
  // console.log(searchInput, searchAll)
  useEffect(()=>{
    if (searchAll) {
      console.log(searchAll)
      setBeerKodata(searchAll[0].data)
      setBeerEndata(searchAll[1].data)
      setAromadata(searchAll[2].data)
      setFlavordata(searchAll[3].data)
      setTypedata(searchAll[4].data)
      setUserdata(searchAll[5].data)
    }
  },[searchInput])
  

  // 전체 맥주 검색 결과 리스트
  const [beerIdArr_name, setBeerIdArr_name] = useState([])    // 맥주이름 결과
  const [beerIdArr_others, setBeerIdArr_others] = useState([])  // 나머지

  // 검색 결과 
  const fetchSearchResult = async () =>{
    // 맥주이름 검색
    console.log(beerKodata)
    beerKodata&&beerKodata.map(beerKo => {
      setBeerIdArr_name((id)=> [...id, beerKo.beer_id])
    })
    beerEndata&&beerEndata.map(beerEn => {
      setBeerIdArr_name((id)=> [...id, beerEn.beer_id])
    })
    // 맥주 향 검색
    if (aromadata) {
      if (Object.keys(aromadata).length !== 0) {
        const aromaName = Object.keys(aromadata)[0]  // 홉향
        const aromaIdArr = aromadata[aromaName].beers  // [2,18,...]
        aromaIdArr.map(aromaid=>{
          if (beerIdArr_others.indexOf(aromaid) === -1) {
            setBeerIdArr_others((beerid) => [...beerid, aromaid])
          }
        })
      }
    }
    // 맥주 맛 검색
    if (flavordata) {
      if (Object.keys(flavordata).length !== 0) {
        const flavorName = Object.keys(flavordata)[0]  // 단맛
        const flavorIdArr = flavordata[flavorName].beers  // [2,18,...]
        flavorIdArr.map(flavorid=>{
          if (beerIdArr_others.indexOf(flavorid) === -1) {
            setBeerIdArr_others((beerid) => [...beerid, flavorid])
          }
        })
      }
    }
    // 맥주 종류 검색
    if (typedata_all) {
      typedata_all.map((typedata)=>{
        if (Object.keys(typedata).length !== 0) {
          const typeNameArr = Object.keys(typedata)  // 골든 에일
          typeNameArr.map(typename=>{
            const typeIdArr = typedata[typename].beers
            typeIdArr.map(typeid=>{
              if (beerIdArr_others.indexOf(typeid) === -1) {
                setBeerIdArr_others((beerid) => [...beerid, typeid])
              }
            })
          })
        }
      })
    }
    // 유저해시태그 검색 - 데이터 생기면 테스트,보완 필요함
    if (userdata) {
      if (Object.keys(userdata).length !== 0) {
        const userNameArr = Object.keys(userdata)       // #asdf
        userNameArr.map(userName=>{
          const userIdArr = userdata[userName].beers   // [2,18,...]
          userIdArr.map(userid=>{
            if (beerIdArr_others.indexOf(userid) === -1) {
              setBeerIdArr_others((beerid) => [...beerid, userid])
            }
          })
        })
      }
    }
  }

  // 검색값 바뀔 때마다 검색 GET 요청 보내기
  useEffect( () => {
    if (searchInput) {fetchSearchResult()}
  }, [beerEndata, beerKodata, aromadata, flavordata, typedata_all, userdata])  
  

  const [beerNameArr, setBeerNameArr] = useState([])
  const [beerTagArr, setBeerTagArr] = useState([])
  // 검색 결과 => 맥주 아이디로 맥주 정보 불러오기
  useEffect( () => {
    // console.log('맥주이름 결과', beerIdArr_name)
    const fetchbeerdata1 = async () => {
      const eachbeerdata = await axiosInstance.get(`${BEER_URL}?size=500`)
      eachbeerdata.data.map((eachbeer) => {
        beerIdArr_name.map((id)=>{
          if (eachbeer.beerId === id) {
            setBeerNameArr((name)=>[...name, eachbeer])
          }
        })  
      })
    }
    fetchbeerdata1();
  },[beerIdArr_name, beerKodata, beerEndata])

  useEffect( () => {
    // console.log('맛향종류유저 결과', beerIdArr_others)
    const fetchbeerdata2 = async () => {
      if (beerIdArr_others.length) {
        const eachbeerdata = await axiosInstance.get(`${BEER_URL}?size=500`)
        eachbeerdata.data.map((eachbeer) => {
          beerIdArr_others.map((id)=>{
            if (eachbeer.beerId === id) {
              setBeerTagArr((name)=>[...name, eachbeer])
            }
          })  
        })
      }
    }
    fetchbeerdata2();
  },[beerIdArr_others, aromadata, flavordata, typedata_all, userdata])

  // console.log(beerArr)

  // 새로고침하면 배열 리셋
  useEffect(()=>{
    setBeerIdArr_name([])
    setBeerIdArr_others([])
    setBeerNameArr([])
    setBeerTagArr([])
  }, [location])

  // 더보기 클릭하면 배열 모두 보여줌
  // const clickMoreName = () => {
  //   setBeerNameArr(beerNameAllArr)
  // }
  // const clickMoreTag = () => {
  //   setBeerTagArr(beerTagAllArr)
  // }
  // const clickMoreClick = () => {
  //   setBeerArr(beerAllArr)
  // }

  const [currentPage, setCurrentPage] = useState(1); //현재 페이지
  const [postPerPage] = useState(8); //페이지당 개수

  //현재 페이지 가져오기
  const indexOfLastArr = currentPage * postPerPage; //1*8 = 8번 포스트
  const indexOfFirstArr = indexOfLastArr - postPerPage; //8-8 = 0번 포스트
  const currentbeerNameArr = beerNameArr.slice(indexOfFirstArr, indexOfLastArr); //0~10번까지 포스트
  const currentbeerTagArr = beerTagArr.slice(indexOfFirstArr, indexOfLastArr); //0~10번까지 포스트
  const currentbeerArr = beerArr.slice(indexOfFirstArr, indexOfLastArr); //0~10번까지 포스트

  //클릭 이벤트-페이지 바꾸기
  const paginate = pageNum => setCurrentPage(pageNum);

  return(
    <div className="search_section layout_padding_search">
      <div className="container">
        {/* 맥주 리스트 제목 */}
        <div className="heading_container heading_center">
          <h2>Result</h2>
          <h4>' {searchInput} '  검색 결과</h4>
        </div>
        
        {/* 맥주이름으로 검색했을 때 */}
        <div className="search_beer">
          {/* { beerNameArr &&  */}
          { currentbeerNameArr && 
            <h4>' {searchInput} '  검색 결과</h4> ,
            <div className='row'>
              { currentbeerNameArr.map((beer, i)=>{
                return (
                  <div className='col-sm-6 col-md-4 col-lg-3 fadein all' key={beer.beerId}>
                    {/* {console.log(beer)} */}
                    
                    <Link to={`/beer/${beer.beerId}`} style={{ textDecoration: 'none', color: 'white' }} className='detailBtn'>
                      <div className="beerlist_box">
                        <div>
                          {/* 맥주 이미지 */}
                          <div className="img-box"> 
                          {/* 여기도 기본 이미지가 필요하네용 */}
                            <img src={beer.photoPath} alt=''></img>
                          </div>

                          {/* 맥주 설명란 */}
                          <div className="beerdetail-box">

                          {/* 맥주 이름 + 자세히 버튼 */}
                          <div className='beerdetail-title'>
                            <h5>{beer.name}</h5>
                            <div>{beer.englishName}</div>
                            {/* <Link to={`/beer/${beer.beerId}`} className='detailBtn'>자세히</Link> */}
                          </div>

                          {/* 맥주 별점 */}
                          {/* <div className="star-ratings">
                            <div 
                              className="star-ratings-fill space-x-2 text-lg"
                              style={{width:`${beer.averageRate*20}%` }}
                            >
                              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                            </div>
                            <div className="star-ratings-base space-x-2 text-lg">
                              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                            </div>
                          </div> */}

                          {/* 맥주 설명 */}
                          {/* <div className='beer_volume'>
                            ALC : {beer.volume}%
                          </div> */}

                          {/* 맥주 해시태그 */}
                          {/* <div className='beer_hashtag_all'>
                            {beer.aromaHashTags.map((aroma,a) => {
                              return <div key={a} className='beer_hashtag'>#{aroma}</div>
                            })}
                          </div>
                          <div className='beer_hashtag_all'>
                            {beer.flavorHashTags.map((flavor,f) => {
                              return <div key={f} className='beer_hashtag'>#{flavor}</div>
                            })}
                          </div> */}

                          {/* 맥주 카테고리 */}
                          <div className="options">
                            <div className='options_space_between'>
                              <h6 className='beerCategory'>
                                {beer.beerType.en_main}
                              </h6>
                              { beer.beerType.ko_detail !== null
                                ? <h6 className='beerCategory'>
                                    {beer.beerType.en_detail}
                                  </h6>
                                : null }
                            </div>
                          </div>

                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )})
              }
            </div>
          }
        </div>
        <SearchPagination 
          postPerPage={postPerPage} 
          totalPosts={beerNameArr.length} 
          paginate={paginate}  />


        {/* 태그로 검색했을 때 */}
        <div className="search_beer">
          {/* {console.log(beerTagArr)} */}
          { currentbeerTagArr && 
            <h4>' #{searchInput} '  검색 결과</h4> ,
            <div className='row'>
              { beerTagArr.map((beer, i)=>{
                return (
                  <div className='col-sm-6 col-md-4 col-lg-3 fadein all' key={beer.beerId}>
                    {/* {console.log(beer)} */}
                    <Link to={`/beer/${beer.beerId}`} style={{ textDecoration: 'none', color: 'white' }} className='detailBtn'>
                      <div className="beerlist_box">
                        <div>
                          {/* 맥주 이미지 */}
                          <div className="img-box"> 
                          {/* 여기도 기본 이미지가 필요하네용 */}
                            <img src={beer.photoPath} alt=''></img>
                          </div>

                          {/* 맥주 설명란 */}
                          <div className="beerdetail-box">

                          {/* 맥주 이름 + 자세히 버튼 */}
                          <div className='beerdetail-title'>
                            <h5>{beer.name}</h5>
                            {/* <Link to={`/beer/${beer.beerId}`} className='detailBtn'>자세히</Link> */}
                          </div>


                          {/* 맥주 해시태그 */}
                          <div className='beer_hashtag_all'>
                            {beer.aromaHashTags.map((aroma,a) => {
                              return <div key={a} className='beer_hashtag'>#{aroma}</div>
                            })}
                          </div>
                          <div className='beer_hashtag_all'>
                            {beer.flavorHashTags.map((flavor,f) => {
                              return <div key={f} className='beer_hashtag'>#{flavor}</div>
                            })}
                          </div>

                          {/* 맥주 카테고리 */}
                          <div className="options">
                            <div className='options_space_between'>
                            <h6 className='beerCategory'>
                                {beer.beerType.en_main}
                              </h6>
                              <h6 className='beerCategory'>
                                {beer.beerType.en_detail}
                              </h6>
                            </div>
                          </div>

                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )})
              }
            </div>
          }
        </div>
        <SearchPagination 
          postPerPage={postPerPage} 
          totalPosts={beerTagArr.length} 
          paginate={paginate}  />
        {/* { isMoreTag &&   // 더보기 버튼
          <div>
            <div className="moreBtn btn " onClick={clickMoreTag} >More...</div>
          </div>
        } */}

        {/* 클릭해서 검색했을 때 */}
        <div className="search_beer">
          {/* {console.log(beerTagArr)} */}
          { currentbeerArr && 
            <h4>' {} '  검색 결과</h4> ,
            <div className='row'>
              { beerArr.map((beer, i)=>{
                return (
                  <div className='col-sm-6 col-md-4 col-lg-3 fadein all' key={beer.beerId}>
                    {/* {console.log(beer)} */}
                    <Link to={`/beer/${beer.beerId}`} style={{ textDecoration: 'none', color: 'white' }} className='detailBtn'>
                      <div className="beerlist_box">
                        <div>
                          {/* 맥주 이미지 */}
                          <div className="img-box"> 
                          {/* 여기도 기본 이미지가 필요하네용 */}
                            <img src={beer.photoPath} alt=''></img>
                          </div>

                          {/* 맥주 설명란 */}
                          <div className="beerdetail-box">

                          {/* 맥주 이름 + 자세히 버튼 */}
                          <div className='beerdetail-title'>
                            <h5>{beer.name}</h5>
                            {/* <Link to={`/beer/${beer.beerId}`} className='detailBtn'>자세히</Link> */}
                          </div>

                          {/* 맥주 별점 */}
                          <div className="star-ratings">
                            <div 
                              className="star-ratings-fill space-x-2 text-lg"
                              style={{width:`${beer.averageRate*20}%` }}
                            >
                              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                            </div>
                            <div className="star-ratings-base space-x-2 text-lg">
                              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                            </div>
                          </div>

                          {/* 맥주 설명 */}
                          <div className='beer_volume'>
                            ALC : {beer.volume}%
                          </div>

                          {/* 맥주 해시태그 */}
                          <div className='beer_hashtag_all'>
                            {beer.aromaHashTags.map((aroma,a) => {
                              return <div key={a} className='beer_hashtag'>#{aroma}</div>
                            })}
                          </div>
                          <div className='beer_hashtag_all'>
                            {beer.flavorHashTags.map((flavor,f) => {
                              return <div key={f} className='beer_hashtag'>#{flavor}</div>
                            })}
                          </div>

                          {/* 맥주 카테고리 */}
                          <div className="options">
                            <div className='options_space_between'>
                              <h6 className='beerCategory'>
                                {beer.beerType.en_main}
                              </h6>
                              <h6 className='beerCategory'>
                                {beer.beerType.en_detail}
                              </h6>
                            </div>
                          </div>

                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )})
              }
            </div>
          }
        </div>
        <SearchPagination 
          postPerPage={postPerPage} 
          totalPosts={beerArr.length} 
          paginate={paginate}  />
        {/* { isMoreClick &&   // 더보기 버튼
          <div>
            <div className="moreBtn btn " onClick={clickMoreClick} >More...</div>
          </div>
        } */}
      </div>
    </div>
  )
}

export default Search;

