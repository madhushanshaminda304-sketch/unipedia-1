import { describe, expect, it, vi } from 'vitest';
import { getProgramCutoffRowsForDistrict } from '../ugcAdapter';

const remote = vi.hoisted(() => ({ from: vi.fn(), rpc: vi.fn() }));
vi.mock('@supabase/supabase-js', () => ({ createClient: () => remote }));

describe('UGC source version isolation', () => {
  it('ignores configured legacy remote UGC data on every public read path', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-only');
    vi.resetModules();
    try {
      const service = await import('../ugcDataService');
      expect(service.supabase).not.toBeNull();
      const rows = await service.fetchProgramCutoffsByDistrict(1, 'Biological Science');
      expect(rows).toHaveLength(255);
      expect(rows.find(r => r.uni_code === '001A')?.min_z_score).toBe(getProgramCutoffRowsForDistrict(1).find(r => r.uni_code === '001A')?.min_z_score);
      expect(await service.fetchAllDistrictCutoffsForUniCode('001A')).toHaveLength(25);
      expect(await service.matchEligibleProgramsRpc({ p_district_id: 1, p_student_z: 1.5, p_stream: 'ALL' })).toHaveLength(255);
      expect(remote.from).not.toHaveBeenCalled();
      expect(remote.rpc).not.toHaveBeenCalled();
      expect(service.UGC_DATA_SOURCE.cutoffYear).toBe('2025/2026');
    } finally { vi.unstubAllEnvs(); }
  });
});
