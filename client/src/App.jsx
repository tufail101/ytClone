
import { createBrowserRouter, Route, RouterProvider } from 'react-router'
import './App.css'
import Login from './components/loging/Login'
import { createRoutesFromElements } from 'react-router'
import Layout from './Layout'
import Home from './components/Home/Home'
import SearchResult from './components/pages/SearchResult'
import WatchPage from './components/pages/WatchPage'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout/>}>
        <Route path='' element = {<Home/>}/>
        <Route path='/search' element = {<SearchResult/>}/>
        <Route path='/watch/:id' element = {<WatchPage/>}/>
      </Route>
    )
  )

  return (
    <>
    {/* <Login/> */}
    <RouterProvider router={router}/>
    </>
  )
}

export default App
