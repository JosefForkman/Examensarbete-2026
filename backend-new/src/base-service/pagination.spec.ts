import { Pagination } from './pagination';

describe('Pagination', () => {
  const items = [
    { id: 'one', value: 1 },
    { id: 'two', value: 2 },
    { id: 'three', value: 3 },
  ];

  it('returns the first page with pagination metadata', () => {
    const result = new Pagination(items, { first: 2 }).getResult();

    expect(result.edges).toEqual([
      { node: items[0], cursor: 'one' },
      { node: items[1], cursor: 'two' },
    ]);
    expect(result.pageInfo).toEqual({
      hasNextPage: true,
      endCursor: 'two',
    });
    expect(result.totalCount).toBe(3);
  });

  it('starts after the supplied cursor', () => {
    const result = new Pagination(items, {
      first: 2,
      after: 'one',
    }).getResult();

    expect(result.edges).toEqual([
      { node: items[1], cursor: 'two' },
      { node: items[2], cursor: 'three' },
    ]);
    expect(result.pageInfo).toEqual({
      hasNextPage: false,
      endCursor: 'three',
    });
  });

  it('returns an empty edges array when the cursor is on the last item', () => {
    const result = new Pagination(items, {
      first: 2,
      after: 'three',
    }).getResult();

    expect(result.edges).toEqual([]);
    expect(result.pageInfo).toEqual({
      hasNextPage: false,
      endCursor: undefined,
    });
  });

  it('uses the default page size', () => {
    const result = new Pagination(items, {}).getResult();

    expect(result.edges).toHaveLength(3);
    expect(result.pageInfo.hasNextPage).toBe(false);
  });

  it('rejects a negative page size', () => {
    expect(() => new Pagination(items, { first: -1 }).getResult()).toThrow(
      RangeError,
    );
  });
});
