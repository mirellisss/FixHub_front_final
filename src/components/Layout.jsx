import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import SlideMenu from './SlideMenu'
import Footer from './Footer'

export default function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Rotas onde o Navbar, SlideMenu e Footer não devem aparecer
  const noNavbarRoutes = ['/login', '/register', '/forgot-password']
  const hideNavbar = noNavbarRoutes.includes(location.pathname)

  return (
    <div
      className="
        min-h-screen flex flex-col 
        bg-gradient-to-br from-slate-50 via-white to-slate-100
        text-slate-700
      "
    >
      {/* NAVBAR */}
      {!hideNavbar && (
        <header aria-label="Barra de navegação principal">
          <Navbar onMenu={() => setOpen(true)} aria-hidden={hideNavbar} />
        </header>
      )}

      {/* SLIDE MENU */}
      {!hideNavbar && (
        <aside>
          <SlideMenu open={open} onClose={() => setOpen(false)} aria-hidden={!open} />
        </aside>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main
        role="main"
        className="
          flex-1 w-full
          px-4 py-6 
          max-w-5xl mx-auto 
          animate-fadeIn
        "
      >
        <div
          className="
            bg-white/70 backdrop-blur-xl 
            rounded-2xl shadow-md 
            p-6 border border-slate-200
            transition-all duration-300
          "
        >
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      {!hideNavbar && (
        <footer aria-label="Rodapé do sistema">
          <Footer aria-hidden={hideNavbar} />
        </footer>
      )}
    </div>
  )
}
