// PostgREST / Postgres codes meaning "the table does not exist yet".
const MISSING_TABLE_CODES = ['PGRST205', 'PGRST204', '42P01']

/** Thrown when a feature's table has not been created in Supabase yet. */
export class TableNotSetUpError extends Error {
  constructor(table, sqlFile) {
    super(`The ${table} table has not been created yet. Run supabase/${sqlFile} in the Supabase SQL editor.`)
    this.name = 'TableNotSetUpError'
    this.table = table
    this.sqlFile = sqlFile
  }
}

export function toSupabaseError(error, { table, sqlFile }) {
  if (MISSING_TABLE_CODES.includes(error?.code)) return new TableNotSetUpError(table, sqlFile)
  // P0001 = message raised by our spam-protection triggers; safe to show to visitors.
  if (error?.code === 'P0001') return Object.assign(new Error(error.message), { userFacing: true })
  return new Error(error?.message || 'Request failed')
}
