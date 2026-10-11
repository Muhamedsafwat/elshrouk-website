import { describe, expect, it } from 'vitest'
import { enforceLifecycle } from '@/payload/collections/Inquiries'

type HookArgs = Parameters<typeof enforceLifecycle>[0]
type Row = { id?: string | null; status?: string | null; at?: string | null; by?: string | null }

const stored = {
  status: 'new',
  statusHistory: [{ id: 'row-1', status: 'new', at: '2026-10-01T08:00:00.000Z', by: 'system' }],
}
const sales = { id: 7, collection: 'users', role: 'sales' }

const run = (data: Record<string, unknown>, operation: 'create' | 'update' = 'update', originalDoc: Record<string, unknown> = stored) =>
  enforceLifecycle({
    data,
    originalDoc: operation === 'update' ? originalDoc : undefined,
    operation,
    req: { user: sales },
  } as unknown as HookArgs) as Record<string, unknown> & { statusHistory: Row[] }

const forged = [{ status: 'closed', at: '2020-01-01T00:00:00.000Z', by: 'forged-by-sales' }]

describe('inquiry lifecycle: the status history is server-owned (SEC-02)', () => {
  it('ignores a client-supplied history when the status does not change', () => {
    const result = run({ status: 'new', statusHistory: forged, adminNotes: 'called back' })
    expect(result.statusHistory).toEqual(stored.statusHistory)
  })

  it('ignores a forged history on a valid transition and appends exactly one real entry', () => {
    const result = run({ status: 'contacted', statusHistory: forged })
    expect(result.statusHistory).toHaveLength(2)
    expect(result.statusHistory[0]).toEqual(stored.statusHistory[0])
    expect(result.statusHistory[1]).toMatchObject({ status: 'contacted', by: '7' })
    expect(Date.parse(result.statusHistory[1]!.at!)).not.toBeNaN()
  })

  it('cannot empty the trail either', () => {
    expect(run({ statusHistory: [] }).statusHistory).toEqual(stored.statusHistory)
  })

  it('still rejects transitions outside the lifecycle', () => {
    expect(() => run({ status: 'new' }, 'update', { ...stored, status: 'closed' })).toThrow(/Invalid status change/)
    expect(() => run({ status: 'qualified' })).toThrow(/Invalid status change/)
  })

  it('a new record always starts as `new` with a single system entry', () => {
    const result = run({ status: 'closed', statusHistory: forged }, 'create')
    expect(result.status).toBe('new')
    expect(result.statusHistory).toEqual([{ status: 'new', at: expect.any(String), by: 'system' }])
  })
})
