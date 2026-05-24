const U = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`

/** Default site content — used when Supabase is unavailable or not configured. */
export const defaultContent = {
  logo: '/images/logo.png',
  hero: {
    image: U('1610375461246-83df859d849d', 1920),
    imageAlt: 'Handcrafted gold and silver artisan work',
    overline: 'Handmade in Kathmandu, Nepal',
    title: 'Handcrafted Gold & Silver Art from the Heart of Nepal',
    subtitle:
      'Each piece is forged by skilled artisans using centuries-old techniques. Discover jewelry, religious statues, and cultural metal crafts that carry the soul of the Himalayas.',
    ctaPrimary: 'Shop Collection',
    ctaSecondary: 'Custom Order',
  },
  about: {
    image: U('1558618666-fcd25c85cd64', 800),
    imageAlt: 'Nepali artisan at work',
    overline: 'About the Craft',
    title: 'Centuries of Tradition, One Piece at a Time',
    paragraphs: [
      'In the heart of Kathmandu, generations of artisans have perfected the art of metalwork — transforming gold and silver into jewelry, religious statues, and cultural treasures. Our craftsmen use techniques passed down through families, combining reverence for tradition with an eye for detail.',
      'Every piece from Mount Everest Gold Silver Handicraft is made by hand: from design and carving to casting and polishing. We work with local families and cooperatives, ensuring fair wages and preserving Nepal\'s rich craft heritage for the world to cherish.',
    ],
    tagline: 'Handmade in Nepal — with pride and care.',
  },
  categories: {
    overline: 'Explore',
    title: 'Product Categories',
    subtitle:
      'Browse our handcrafted gold and silver collections, from fine jewelry to sacred and cultural pieces.',
    items: [
      {
        id: 'cat-1',
        title: 'Gold Jewelry',
        description:
          'Elegant necklaces, bracelets, earrings, and rings crafted in pure and alloyed gold, inspired by Nepali and Tibetan designs.',
        image: U('1611107683227-e9060eccd846', 600),
        fallbackImage: '/images/category-gold.svg',
        href: '#',
        accent: 'gold',
      },
      {
        id: 'cat-2',
        title: 'Silver Jewelry',
        description:
          'Timeless silver pieces — from traditional filigree to contemporary styles — all handmade by our artisans in Kathmandu.',
        image: U('1585053736987-f817dc225fc5', 600),
        fallbackImage: '/images/category-silver.svg',
        href: '#',
        accent: 'silver',
      },
      {
        id: 'cat-3',
        title: 'Religious Statues',
        description:
          'Sacred Buddha, Hindu deities, and ritual objects cast and finished by hand for temples, altars, and collectors.',
        image: U('1548013146-72479768bada', 600),
        fallbackImage: '/images/category-statues.svg',
        href: '#',
        accent: 'gold',
      },
      {
        id: 'cat-4',
        title: 'Cultural Handicrafts',
        description:
          "Decorative bowls, singing bowls, bells, and ceremonial items that celebrate Nepal's cultural and spiritual heritage.",
        image: U('1610375461246-83df859d849d', 600),
        fallbackImage: '/images/category-crafts.svg',
        href: '#',
        accent: 'silver',
      },
    ],
  },
  products: {
    overline: 'Curated Selection',
    title: 'Featured Products',
    subtitle:
      'A selection of our most sought-after handcrafted pieces. Each item can be customized or made to order.',
    items: [
      {
        id: 'prod-1',
        name: 'Traditional Gold Pendant',
        description:
          'Hand-carved pendant inspired by traditional Nepali motifs. 22K gold, made to order.',
        image: U('1611107683227-e9060eccd846', 500),
        price: 'Price on request',
        showRequestPrice: true,
      },
      {
        id: 'prod-2',
        name: 'Silver Singing Bowl',
        description:
          'Hand-hammered Tibetan-style singing bowl. Perfect for meditation and sound healing.',
        image: U('1506126613408-eca07ce68773', 500),
        price: 'Price on request',
        showRequestPrice: true,
      },
      {
        id: 'prod-3',
        name: 'Buddha Statue — Bronze & Gold',
        description:
          'Sacred Buddha figure with gold leaf detailing. Cast using lost-wax technique.',
        image: U('1548013146-72479768bada', 500),
        price: 'Price on request',
        showRequestPrice: true,
      },
      {
        id: 'prod-4',
        name: 'Filigree Silver Earrings',
        description:
          'Delicate silver filigree earrings, a signature style of Nepali silversmiths.',
        image: U('1605100804763-247f67b3557e', 500),
        price: 'Price on request',
        showRequestPrice: true,
      },
    ],
  },
  customOrders: {
    overline: 'Bespoke Creations',
    title: 'Custom Handmade Designs',
    subtitle:
      "We accept custom orders for jewelry, religious statues, and cultural pieces. Share your vision with our artisans — from sketches to heirloom designs — and we'll bring it to life in gold or silver.",
    cta: 'Request Custom Design',
  },
  process: {
    overline: 'How We Create',
    title: 'Craftsmanship & Process',
    subtitle:
      'From design to finishing, every piece is made by hand in our workshops in Kathmandu.',
    steps: [
      {
        id: 'step-1',
        title: 'Design',
        description:
          'Sketches and consultations with our artisans. We work with your ideas and traditional motifs to create a unique design.',
      },
      {
        id: 'step-2',
        title: 'Hand Carving',
        description:
          'Master craftsmen carve wax or wood models by hand, preserving every detail before casting.',
      },
      {
        id: 'step-3',
        title: 'Metal Casting',
        description:
          'Lost-wax or sand casting in gold or silver. Each piece is poured and cooled with care.',
      },
      {
        id: 'step-4',
        title: 'Polishing & Finishing',
        description:
          'Final hand-polishing, engraving, and quality checks. Your piece is ready to cherish for generations.',
      },
    ],
  },
  testimonials: {
    overline: 'What Our Customers Say',
    title: 'Testimonials',
    subtitle:
      'Reviews from local and international customers who cherish our handcrafted pieces.',
    items: [
      {
        id: 'test-1',
        quote:
          'The Buddha statue we ordered is breathtaking. The craftsmanship and attention to detail exceeded our expectations. A true piece of art.',
        author: 'Sarah M.',
        location: 'London, UK',
        rating: 5,
      },
      {
        id: 'test-2',
        quote:
          'I have been buying silver jewelry from Mount Everest for years. Each piece tells a story. The custom earrings they made for my wedding were perfect.',
        author: 'Priya K.',
        location: 'Kathmandu, Nepal',
        rating: 5,
      },
      {
        id: 'test-3',
        quote:
          'Outstanding quality and service. The singing bowl arrived beautifully packaged and sounds incredible. Will definitely order again.',
        author: 'James L.',
        location: 'California, USA',
        rating: 5,
      },
    ],
  },
  contact: {
    overline: 'Get in Touch',
    title: 'Contact & Visit',
    subtitle:
      'Reach out for inquiries, custom orders, or to visit our workshop in Kathmandu.',
    phone: '+977 1 4XXXXXX',
    email: 'hello@mteveresthandicraft.com',
    address: 'Kathmandu, Nepal',
    whatsapp: 'https://wa.me/9771XXXXXXXX',
    mapPlaceholder: 'Map placeholder — Kathmandu, Nepal',
  },
  footer: {
    brandName: 'Mount Everest',
    brandAccent: 'Gold & Silver',
    description:
      'Handcrafted gold and silver jewelry, religious statues, and cultural metal crafts from Kathmandu, Nepal.',
    tagline: 'Handmade in Nepal 🇳🇵',
    facebook: '#',
    instagram: '#',
    copyright: 'Mount Everest Gold Silver Handicraft',
  },
}

export default defaultContent
