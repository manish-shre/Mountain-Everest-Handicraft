/**
 * Admin menu, in plain language. `websitePath` opens the matching part of the public site.
 * `instant` pages save immediately (no "Save changes" needed).
 */
export const ADMIN_GROUPS = [
  {
    label: null,
    pages: [
      { id: 'overview', label: 'Home', icon: 'home', title: 'Namaste! Welcome back', description: 'Here’s what’s happening on your website and quick ways to update it.' },
    ],
  },
  {
    label: 'Inbox',
    pages: [
      { id: 'messages', label: 'Messages', icon: 'mail', title: 'Messages', description: 'Messages people sent you from the contact form. Reply by email or WhatsApp.', instant: true },
      { id: 'reviews', label: 'Customer reviews', icon: 'star', title: 'Customer reviews', description: 'Customers’ reviews appear on your website only after you approve them.', instant: true, websitePath: '/reviews' },
    ],
  },
  {
    label: 'Homepage',
    pages: [
      { id: 'hero', label: 'Top banner', icon: 'banner', title: 'Top banner', description: 'The large photo slider visitors see first. You can have up to 3 slides.', websitePath: '/' },
      { id: 'about', label: 'About / Founder', icon: 'user', title: 'About / Founder', description: 'Your story and photo, shown right below the banner.', websitePath: '/our-craft' },
      { id: 'categories', label: 'Categories', icon: 'grid', title: 'Categories', description: 'The four collection cards (gold, silver, statues, crafts).', websitePath: '/collection' },
      { id: 'products', label: 'Products', icon: 'cube', title: 'Products', description: 'Add, edit, price and reorder the products shown on your homepage.', websitePath: '/products' },
      { id: 'customOrders', label: 'Custom orders', icon: 'sparkles', title: 'Custom orders', description: 'The dark banner that invites visitors to order a custom design.', websitePath: '/products' },
      { id: 'process', label: 'How we work', icon: 'pencil', title: 'How we work', description: 'The four steps explaining how your pieces are made.', websitePath: '/process' },
      { id: 'gallery', label: 'Gallery', icon: 'photo', title: 'Gallery', description: 'Photos of events and new products, shown as a slider (up to 15).', websitePath: '/gallery' },
      { id: 'testimonials', label: 'Reviews section', icon: 'chat', title: 'Reviews section', description: 'The title and text around the customer reviews on your homepage.', websitePath: '/reviews' },
    ],
  },
  {
    label: 'Contact information',
    pages: [
      { id: 'phonesSocial', label: 'Phone & social media', icon: 'phone', title: 'Phone numbers & social media', description: 'Your phone numbers, WhatsApp, Viber, Facebook, TikTok and other links.', websitePath: '/contact' },
      { id: 'contact', label: 'Address & map', icon: 'location', title: 'Email, address & map', description: 'Your email, shop address and the Google Map on the contact section.', websitePath: '/contact' },
    ],
  },
  {
    label: 'Site settings',
    pages: [
      { id: 'logo', label: 'Logo', icon: 'globe', title: 'Logo', description: 'The logo in the top-left corner of every page.', websitePath: '/' },
      { id: 'footer', label: 'Footer', icon: 'layout', title: 'Footer', description: 'The dark area at the very bottom of your website.', websitePath: '/contact' },
    ],
  },
]

export const ADMIN_PAGES = ADMIN_GROUPS.flatMap((g) => g.pages)
export const adminPageById = (id) => ADMIN_PAGES.find((p) => p.id === id)
