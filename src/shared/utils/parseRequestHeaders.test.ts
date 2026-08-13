import { describe, expect, it } from 'vitest';
import { mergeParsedHeaders, originFromUrl, parseRequestHeaders } from './parseRequestHeaders';
import { buildModifyHeaderInfos } from '@pages/background/services/buildModifyHeaderInfos';

describe('parseRequestHeaders', () => {
  it('parses Chrome DevTools alternate name/value lines', () => {
    const text = [
      'sec-fetch-user',
      '?1',
      'upgrade-insecure-requests',
      '1',
      'user-agent',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
    ].join('\n');

    const parsed = parseRequestHeaders(text);
    expect(parsed).toEqual([
      { name: 'sec-fetch-user', value: '?1' },
      { name: 'upgrade-insecure-requests', value: '1' },
      {
        name: 'user-agent',
        value:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36',
      },
    ]);
  });

  it('parses Name: Value lines', () => {
    const parsed = parseRequestHeaders('User-Agent: CustomBot/1.0\nX-Debug: 1');
    expect(parsed).toEqual([
      { name: 'User-Agent', value: 'CustomBot/1.0' },
      { name: 'X-Debug', value: '1' },
    ]);
  });

  it('parses cURL -H flags', () => {
    const parsed = parseRequestHeaders(`curl 'https://example.com' -H 'user-agent: CurlAgent' -H "x-token: abc"`);
    expect(parsed).toEqual([
      { name: 'user-agent', value: 'CurlAgent' },
      { name: 'x-token', value: 'abc' },
    ]);
  });

  it('merges duplicate names with later values winning', () => {
    const merged = mergeParsedHeaders([
      { name: 'X-A', value: '1' },
      { name: 'x-a', value: '2' },
    ]);
    expect(merged).toEqual([{ name: 'x-a', value: '2' }]);
  });
});

describe('originFromUrl', () => {
  it('returns origin for http(s) urls', () => {
    expect(originFromUrl('https://example.com/path?q=1')).toBe('https://example.com');
  });

  it('returns empty for chrome pages', () => {
    expect(originFromUrl('chrome://extensions')).toBe('');
  });
});

describe('buildModifyHeaderInfos', () => {
  it('builds set operations for enabled headers only', () => {
    const infos = buildModifyHeaderInfos([
      { id: '1', name: 'User-Agent', value: 'A', enabled: true },
      { id: '2', name: 'X-Skip', value: 'B', enabled: false },
      { id: '3', name: '', value: 'C', enabled: true },
    ]);
    expect(infos).toEqual([{ header: 'User-Agent', operation: 'set', value: 'A' }]);
  });
});
