import { useState, useEffect } from 'react'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  const [currentPage, setCurrentPage] = useState('/')

  useEffect(() => {
    // Handle hash-based routing
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.slice(1) || '/')
    }

    handleHashChange() // Set initial page
    window.addEventListener('hashchange', handleHashChange)

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Render the appropriate page based on current route
  if (currentPage === '/about') {
    return <About />
  }

  return <Home />
}

export default App
