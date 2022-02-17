import React from 'react';
import '../styles/Navbar.css'
import '../styles/Responsive.css'
import { Link, useHistory } from "react-router-dom"
import SearchBar from './SearchBar.js'
import { useDispatch, useSelector, useStore } from 'react-redux';


function NavBar(){

  const store = useStore((state) => state)
  const dispatch = useDispatch()
  const history = useHistory()

  // 로그인 유저 정보
  const loginUser = useSelector(state => state.userReducer).memberId
  console.log(loginUser)

  const logOut = () => {
    localStorage.removeItem("AccessToken");
    dispatch({type:"logout"})
    alert("로그아웃 되었습니다!!")
    history.push("/home")
  }

  
  return(
    
      <div className='navbar_page'>
        
        <div className="navbar_area">
          <div className="bg-box">
            {/* <img src="img/hero-bg.jpg" alt=""></img> */}
          </div>
          <header className="navbar_section">
            <div className="container">
              {/* <nav className="navbar navbar-expand-xs custom_nav-container "> */}
              <nav className="navbar custom_nav-container ">
                <div >
                  <a className="navbar-macju" href="/home">
                    <span>
                      MacJU
                    </span>
                  </a>
                </div>
                
                <div className='searchbar' style={{flexDirection: 'column'}}>
                  <SearchBar/>
                </div>

                {/* 드롭다운(토글) */}
                <div className="dropdown">
                  <button className="btn dropdown-toggle dropdownBtn" id="dropdownMenuButton1" data-toggle="dropdown" aria-expanded="false">
                  </button>
                  
                  <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
                    <li>
                      <Link className='dropdown-item' to='/home'>Home</Link>
                    </li>
                    <li>
                      <Link className='dropdown-item' to='/beer'>Beer</Link>
                    </li>
                    <li>
                      <Link className='dropdown-item' to='/post'>Posts</Link>
                    </li>
                    <div className="dropdown-divider"></div>
                    <li>
                      {console.log(store.getState().userReducer.memberId)}
                      <Link to={`/profile/${store.getState().userReducer.memberId}/post`} className="dropdown-item user_link">
                        <i className="fa fa-user" aria-hidden="true"></i>
                      </Link>
                    </li>
                    { loginUser === null?
                    <li className="order_online">
                      <Link className='dropdown-item nav_login' to='/user/login'>login</Link>
                    </li>
                    :
                    <li className="order_online">
                      <div className='dropdown-item nav_login' onClick={logOut}>Logout</div>
                    </li>
                    }
                  </ul>
                  
                </div>

              </nav>
            </div>
          </header>
        </div>
      </div>
    )
}
export default NavBar;
