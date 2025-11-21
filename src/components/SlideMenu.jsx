import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaTicketAlt, FaCog, FaUser, FaLock, FaSignOutAlt, FaQuestionCircle, FaBus} from 'react-icons/fa';


export default function SlideMenu({open, onClose}){
  return (
    <div aria-hidden={!open}>
      {open && <div className='fixed inset-0 z-40' onClick={onClose}/>}
      <motion.aside initial={{x:300}} animate={{x: open?0:300}} transition={{type:'spring'}} className='fixed right-0 top-0 z-50 h-full slide-menu bg-white shadow-lg p-6'>
        <button onClick={onClose} className='text-slate-500 mb-4'>Fechar</button>
        <nav className='flex flex-col gap-3 text-slate-700'>
        <Link to="/reports" onClick={onClose} className="slide-item flex items-center gap-2">
        <FaTicketAlt className="w-4 h-4"/> Seus Tickets
        </Link>
        <Link to="/settings" onClick={onClose} className="slide-item flex items-center gap-2">
          <FaCog className="w-4 h-4"/> Configurações
        </Link>
        <Link to="/settings/account" onClick={onClose} className="slide-item flex items-center gap-2">
          <FaUser className="w-4 h-4"/> Minha Conta
        </Link>
        <Link to="/settings/security" onClick={onClose} className="slide-item flex items-center gap-2">
          <FaLock className="w-4 h-4"/> Segurança
        </Link>

        {/* Nova aba de Perguntas Frequentes */}
        <Link to="/faq" onClick={onClose} className="slide-item flex items-center gap-2">
          <FaQuestionCircle className="w-4 h-4"/> Perguntas Frequentes
        </Link>

        <a href="https://www.rodoviariadecampinas.com.br/?gad_source=1&gad_campaignid=22494395160&gbraid=0AAAAA-LtzN6rshNI_kQYYwXJoLqTXWWTX&gclid=CjwKCAjw3tzHBhBREiwAlMJoUhVY11GlIh5yH3l9uatBlBt5G--DcUC7pxYiExxnnAOKJk9YP8BVJBoCvVAQAvD_BwE" onClick={onClose} target="_blank" rel="noopener noreferrer" className="slide-item flex items-center gap-2">
          <FaBus className="w-4 h-4"/> Passagens
        </a>

        <Link to="/login" onClick={onClose} className='text-red-600 mt-4 slide-item flex items-center gap-2'>
          <FaSignOutAlt className="w-4 h-4"/> Sair
        </Link>

        </nav>
      </motion.aside>
    </div>
  )
}
