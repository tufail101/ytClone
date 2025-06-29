import React from 'react'
import MenuBar from './components/Header/MenuBar'
import { Outlet } from 'react-router'
import SearchBar from './components/Header/SearchBar'

export default function Layout() {
  return (
    <>
    <SearchBar/>
    <Outlet/>
    <MenuBar/>
    </>
  )
}
