import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ReportList from './pages/ReportList'
import ReportCreate from './pages/ReportCreate'
import ReportDetail from './pages/ReportDetail'
import Settings from './pages/Settings'
import AccountInfo from './pages/AccountInfo'
import Security from './pages/Security'
import Success from './pages/Success'
import NotFound from './pages/NotFound'
import Faq from './pages/Faq'
import TerminalMap from './pages/TerminalMap'
import ForgotPassword from './pages/ForgotPassword'
import ReportEdit from './pages/ReportEdit'
import ForgotPasswordReset from './pages/ForgotPasswordReset'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="reports" element={<ReportList />} />
        <Route path="reports/create" element={<ReportCreate />} />
        <Route path="reports/:id" element={<ReportDetail />} />
        <Route path="settings" element={<Settings />} />
        <Route path="settings/account" element={<AccountInfo />} />
        <Route path="settings/security" element={<Security />} />
        <Route path="success" element={<Success />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/terminal-map" element={<TerminalMap />} />
        <Route path="/reports/edit/:id" element={<ReportEdit />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password/reset" element={<ForgotPasswordReset />} />

      </Route>
    </Routes>
  )
}
