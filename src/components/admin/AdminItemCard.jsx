export default function AdminItemCard({ title, children }) {
  return (
    <section className="admin-item-card">
      <h3 className="admin-item-title">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  )
}
