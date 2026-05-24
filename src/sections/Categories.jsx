import SectionHeader from '../components/SectionHeader'
import CategoryCard from '../components/CategoryCard'
import { useContent } from '../context/ContentContext'

export default function Categories() {
  const { content } = useContent()
  const section = content.categories

  return (
    <section id="categories" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          overline={section.overline}
          title={section.title}
          subtitle={section.subtitle}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {section.items?.map((cat) => (
            <CategoryCard key={cat.id || cat.title} {...cat} fallbackImage={cat.fallbackImage} />
          ))}
        </div>
      </div>
    </section>
  )
}
