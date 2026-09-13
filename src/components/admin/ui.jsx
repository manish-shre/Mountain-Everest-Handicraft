import AdminField from './AdminField'
import AdminIcon from './AdminIcon'

/** A white card grouping related fields, with a plain-language title and explanation. */
export function Section({ title, description, children, actions }) {
  return (
    <section className="admin-card p-5 sm:p-6">
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-slate-500 leading-relaxed">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  )
}

const CALLOUT_STYLES = {
  info: { box: 'bg-blue-50 border-blue-200 text-blue-900', icon: 'info', iconColor: 'text-blue-600' },
  tip: { box: 'bg-amber-50 border-amber-200 text-amber-900', icon: 'lightbulb', iconColor: 'text-amber-600' },
  warning: { box: 'bg-red-50 border-red-200 text-red-900', icon: 'warning', iconColor: 'text-red-600' },
  success: { box: 'bg-emerald-50 border-emerald-200 text-emerald-900', icon: 'checkCircle', iconColor: 'text-emerald-600' },
}

export function Callout({ tone = 'info', title, children, action }) {
  const s = CALLOUT_STYLES[tone]
  return (
    <div className={`flex gap-3 rounded-xl border p-4 ${s.box}`} role={tone === 'warning' ? 'alert' : undefined}>
      <AdminIcon name={s.icon} className={`w-5 h-5 shrink-0 mt-0.5 ${s.iconColor}`} />
      <div className="flex-1 text-sm leading-relaxed">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        {children}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  )
}

/** The small heading / title / introduction trio that most homepage sections share. */
export function SectionTextFields({ value = {}, onChange, introRows = 3, titleHint }) {
  return (
    <>
      <AdminField
        label="Title"
        hint={titleHint}
        value={value.title}
        onChange={(v) => onChange('title', v)}
      />
      <AdminField
        label="Small heading"
        hint="The short gold text shown just above the title."
        value={value.overline}
        onChange={(v) => onChange('overline', v)}
      />
      <AdminField
        label="Introduction"
        type="textarea"
        rows={introRows}
        hint="A sentence or two under the title."
        value={value.subtitle}
        onChange={(v) => onChange('subtitle', v)}
      />
    </>
  )
}

export function IconButton({ icon, label, onClick, disabled, tone = 'default' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-4 focus-visible:ring-navy/15 ${
        tone === 'danger'
          ? 'border-red-200 text-red-600 hover:bg-red-50'
          : 'border-slate-200 text-slate-600 hover:bg-slate-100'
      }`}
    >
      <AdminIcon name={icon} className="w-4 h-4" />
    </button>
  )
}

/**
 * A list item that folds away: a tidy summary row (thumbnail, name, detail) that opens to show its fields.
 */
export function CollapsibleCard({ id, open, onToggle, thumbnail, number, title, subtitle, children, onMoveUp, onMoveDown, onRemove, removeLabel = 'Remove' }) {
  const panelId = `panel-${id}`
  return (
    <div className={`rounded-xl border bg-white transition-shadow ${open ? 'border-navy/30 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
      {/* On phones the move/remove buttons sit on their own row so the name has room. */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full sm:w-auto sm:flex-1 min-w-0 items-center gap-3 text-left rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-navy/15"
        >
          {thumbnail !== undefined ? (
            <span className="w-14 h-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              {thumbnail ? <img src={thumbnail} alt="" className="w-full h-full object-cover" /> : <AdminIcon name="photo" className="w-6 h-6 text-slate-400" />}
            </span>
          ) : (
            <span className="w-9 h-9 shrink-0 rounded-full bg-navy/5 text-navy font-semibold flex items-center justify-center">{number}</span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-slate-900 truncate">{title}</span>
            {subtitle && <span className="block text-sm text-slate-500 truncate">{subtitle}</span>}
          </span>
          <span className={`hidden sm:inline-flex items-center gap-1 text-sm font-medium ${open ? 'text-navy' : 'text-slate-500'}`}>
            {open ? 'Close' : 'Edit'}
          </span>
          <AdminIcon name="down" className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {(onMoveUp || onMoveDown || onRemove) && (
          <div className="flex items-center justify-end gap-1.5 shrink-0 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
            {onMoveUp && <IconButton icon="up" label="Move up" onClick={onMoveUp} disabled={!onMoveUp.enabled} />}
            {onMoveDown && <IconButton icon="down" label="Move down" onClick={onMoveDown} disabled={!onMoveDown.enabled} />}
            {onRemove && <IconButton icon="trash" label={removeLabel} onClick={onRemove} tone="danger" />}
          </div>
        )}
      </div>
      {open && (
        <div id={panelId} className="border-t border-slate-100 p-4 sm:p-6 space-y-5">
          {children}
        </div>
      )}
    </div>
  )
}

/** Wraps a move handler so CollapsibleCard knows whether it can run (first/last item). */
export const movable = (fn, enabled) => Object.assign(() => enabled && fn(), { enabled })

export function AddButton({ onClick, disabled, children, note }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={onClick} disabled={disabled} className="admin-btn-primary">
        <AdminIcon name="plus" className="w-4 h-4" />
        {children}
      </button>
      {note && <span className="text-sm text-slate-500">{note}</span>}
    </div>
  )
}
