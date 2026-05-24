/** @deprecated Use useContent() or defaultContent — kept for compatibility */
import { defaultContent } from './defaultContent'

export const images = {
  logo: defaultContent.logo,
  hero: defaultContent.hero.image,
  about: defaultContent.about.image,
  categoryGold: defaultContent.categories.items[0]?.image,
  categorySilver: defaultContent.categories.items[1]?.image,
  categoryStatues: defaultContent.categories.items[2]?.image,
  categoryCrafts: defaultContent.categories.items[3]?.image,
  productGoldPendant: defaultContent.products.items[0]?.image,
  productSingingBowl: defaultContent.products.items[1]?.image,
  productBuddha: defaultContent.products.items[2]?.image,
  productSilverEarrings: defaultContent.products.items[3]?.image,
}

export default images
