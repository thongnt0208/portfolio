import { Suspense, lazy } from 'react';
import './App.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Lazy load components
const Navbar = lazy(() => import('./components/Navbar'));
const HomeScreen = lazy(() => import('./layouts/HomeScreen'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  AOS.init();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <HomeScreen />
      <Footer />
    </Suspense>
  );
}

export default App;