import Hero from './sections/Hero';
import Categories from './sections/Categories';
import Coaches from './sections/Coaches';
import Schedule from './sections/Schedule';
import Registration from './sections/Registration';
import Gallery from './sections/Gallery';
import News from './sections/News';
import Contact from './sections/Contact';
import About from './sections/About';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <Coaches />
        <Schedule />
        <Registration />
        <Gallery />
        <News />
        <Contact />
        <About />
      </main>
      <Footer />
    </>
  );
}