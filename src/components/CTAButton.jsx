export default function CTAButton({ children, variant = 'primary', href, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center px-6 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-300'
  const variants = {
    primary: 'bg-gold text-navy hover:bg-gold-dark shadow-soft hover:shadow-gold',
    secondary: 'bg-navy text-white hover:bg-navy-light',
    outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-navy',
    outlineLight: 'border-2 border-white text-white hover:bg-white hover:text-navy',
  }
  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
