// Shared Vitest setup. `server-only` throws outside React Server Components; stub it for unit tests.
import { vi } from 'vitest'

vi.mock('server-only', () => ({}))
