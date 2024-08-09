import { Suspense, lazy } from 'react';
import './App.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { jarallaxVideo } from "jarallax";
import 'jarallax/dist/jarallax.min.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './utils/SrollToTop';
import Loading from './components/Loading';


// Lazy load components
const Navbar = lazy(() => import('./components/Navbar'));
const HomeScreen = lazy(() => import('./layouts/HomeScreen'));
const Footer = lazy(() => import('./components/Footer'));
const ProjectScreen = lazy(() => import('./layouts/ProjectsScreen/ProjectScreen'));

function App() {
  jarallaxVideo();
  AOS.init();
  return (
    <Suspense fallback={<Loading/>}>

      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/projects/:id" element={<ProjectScreen></ProjectScreen>} />
          <Route path="*" element={<div style={{
            height: "100vh",
            display: "flex", justifyContent: "center", alignItems: "center"
          }}>404 Not Found</div>} />
        </Routes>
        <Footer />
      </Router>
    </Suspense>
  );
}

export default App;