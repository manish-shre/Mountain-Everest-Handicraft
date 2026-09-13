import { emptySocial } from '../lib/social'

const U = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80`
const MEDIA = (file) =>
  `https://ewwzzsbaicqbaadxfgkx.supabase.co/storage/v1/object/public/media/${file}`

/**
 * Default site content — used when Supabase is unavailable or not configured.
 * Mirrors the live content from mteveresthandicraft.com (snapshot 2026-05-30).
 * The live site itself is edited from /admin and stored in Supabase.
 */
export const defaultContent = {
  logo: '/images/logo.png',
  hero: {
    autoplaySeconds: 6,
    slides: [
      {
        id: 'slide-1',
        image: MEDIA('1779730463290-xohvyl62zps.jpg'),
        imageAlt: 'Handcrafted gold and silver artisan work',
        overline: 'Living History Preserved in Pure Gold & Silver',
        title: 'Mount Everest Handicraft',
        subtitle:
          'Our gold and silver jewelry is handcrafted by master artisans in Nepal, keeping ancient traditions alive. Every unique piece brings the rich history of the Kathmandu Valley directly to you.',
        ctaPrimary: 'Shop Collection',
        ctaSecondary: 'Custom Order',
      },
    ],
  },
  about: {
    image: MEDIA('1779606532088-xlgn18yz8j8.jpeg'),
    imageAlt: 'Nepali artisan at work',
    overline: 'Meet The Founder',
    title: 'Karna Bahadur Bishwakarma',
    paragraphs: [
      'Founded by Karna Bahadur Bishwakarma, our brand is built on a lifetime of dedication to traditional handicraft work. Carrying forward generations of Himalayan artistry, he personally ensures that every piece of gold and silver jewelry honors the sacred traditions and raw beauty of Nepal.',
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
        image: MEDIA('1779816261985-ajswl120gk7.jpg'),
        fallbackImage: '/images/category-statues.svg',
        href: '#',
        accent: 'gold',
      },
      {
        id: 'cat-4',
        title: 'Cultural Handicrafts',
        description:
          "Decorative bowls, singing bowls, bells, and ceremonial items that celebrate Nepal's cultural and spiritual heritage.",
        image: MEDIA('1779816431229-ol7opm85a7a.jpg'),
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
        image: MEDIA('1780145401984-7zwhmmkylmw.png'),
        price: 'Price on request',
      },
      {
        id: 'prod-2',
        name: 'Silver Singing Bowl',
        description:
          'Hand-hammered Tibetan-style singing bowl. Perfect for meditation and sound healing.',
        image: MEDIA('1779612068012-ror8vtrbk5j.png'),
        price: 'Price on request',
      },
      {
        id: 'prod-3',
        name: 'Buddha Statue — Bronze & Gold',
        description:
          'Sacred Buddha figure with gold leaf detailing. Cast using lost-wax technique.',
        image: MEDIA('1779612073493-u0jlhseo6c.png'),
        price: 'Price on request',
      },
      {
        id: 'prod-4',
        name: 'Filigree Silver Earrings',
        description:
          'Delicate silver filigree earrings, a signature style of Nepali silversmiths.',
        image: MEDIA('1779612090661-u0do90fi0bd.png'),
        price: 'Price on request',
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
  gallery: {
    overline: 'Moments & New Arrivals',
    title: 'Gallery',
    subtitle: 'Events, life in our workshop, and our newest handcrafted pieces.',
    // Photos are uploaded in Admin → Gallery. The section is hidden while this list is empty.
    items: [],
  },
  testimonials: {
    overline: 'What Our Customers Say',
    title: 'Testimonials',
    subtitle:
      'Reviews from local and international customers who cherish our handcrafted pieces.',
    // Reviews themselves come from customers via the review form (Admin → Reviews approves them).
    cta: 'Share Your Experience',
    emptyText: 'Bought one of our handcrafted pieces? Be the first to share your experience.',
  },
  contact: {
    overline: 'Get in Touch',
    title: 'Contact & Visit',
    subtitle:
      'Reach out for inquiries, custom orders, or to visit our workshop in Kathmandu.',
    phones: [
      { id: 'phone-1', label: 'Mobile', number: '+977 9851448533' },
      { id: 'phone-2', label: '', number: '' },
      { id: 'phone-3', label: '', number: '' },
    ],
    email: 'Karna.bdr.bishwakarma@gmail.com',
    address: 'Kathmandu, Nepal',
    whatsappLabel: 'Contact on WhatsApp',
    viberLabel: 'Chat on Viber',
    // Location for the embedded map (address, plus code or "lat,lng") and the share link for "Get Directions".
    mapLocation: 'P855+GXG Bagemuda, चन्द्रमान सिंह मार्ग, Kathmandu, Bagmati Province 44600',
    mapLink: 'https://maps.app.goo.gl/sq7JTR6tygorkou16',
    mapTitle: 'Visit Our Workshop',
    directionsLabel: 'Get Directions',
  },
  social: emptySocial(),
  footer: {
    brandName: 'Mount Everest',
    brandAccent: 'Gold & Silver',
    description:
      'Handcrafted gold and silver jewelry, religious statues, and cultural metal crafts from Kathmandu, Nepal.',
    tagline: 'Handmade in Nepal 🇳🇵',
    quickLinksTitle: 'Quick Links',
    socialTitle: 'Follow Us',
    contactTitle: 'Contact',
    copyright: 'Mount Everest Gold Silver Handicraft',
  },
}

export default defaultContent
