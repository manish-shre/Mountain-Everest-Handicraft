import Header from '../components/Header'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Categories from '../sections/Categories'
import FeaturedProducts from '../sections/FeaturedProducts'
import CustomOrders from '../sections/CustomOrders'
import Process from '../sections/Process'
import Testimonials from '../sections/Testimonials'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Categories />
        <FeaturedProducts />
        <CustomOrders />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
