import React from 'react';
import SignUp from './components/Signup';
import SignIn from './components/Signin';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import EditGame from './components/EditGame'
import EditQuestion from './components/EditQuestion';
import ViewGames from './components/ViewGames';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App () {
  const [token, setToken] = React.useState(null);
  // console.log(token);
  // const [page, setPage] = React.useState('signup');

  // store token in localStorage, reload the page still get the token
  function manageTokenSet (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }
  // use useEffect, to avoid infinite loop, which make sure store the token one time while reloading the page
  React.useEffect(() => {
    // if token exists, store the token in localstorage
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  return (
    <>
    <main>
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<IsLogout><div>homepage</div></IsLogout>}/> */}
      <Route path="/" element={<HomePage />}/>
      <Route path="/signup" element={<SignUp onSuccess={manageTokenSet} />} />
      <Route path="/signin" element={<SignIn onSuccess={manageTokenSet} />} />
      <Route path="/dashboard" element={<Dashboard token={token} />} />
      <Route path='/editgame/:quizId' element={<EditGame token={token} />}/>
      <Route path='/editgame/:quizId/:questionId' element={<EditQuestion token={token}/>}/>
      <Route path='/play/:sessionId' element={<ViewGames token={token}/>}/>
      {/* confusion: this page is to show result or view games */}
    </Routes>
  </BrowserRouter>

    </main>

    </>

  );
}

export default App;
