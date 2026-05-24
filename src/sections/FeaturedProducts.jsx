import SectionHeader from '../components/SectionHeader'
import ProductCard from '../components/ProductCard'
import { useContent } from '../context/ContentContext'

export default function FeaturedProducts() {
  const { content } = useContent()
  const section = content.products

  return (
    <section className="py-20 md:py-28 bg-cream pattern-dots">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={section.overline}
          title={section.title}
          subtitle={section.subtitle}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {section.items?.map((product) => (
            <ProductCard key={product.id || product.name} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
