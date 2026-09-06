import { PaginationArgs } from 'src/args/pagination.args';
import { IEdge, IPaginatedType } from './typs/paginated.js';

export type CursorEntity = {
  id: string;
};

export class Pagination<T extends CursorEntity> {
  private static readonly defaultPageSize = 10;

  constructor(
    private readonly items: T[],
    private readonly args: PaginationArgs,
  ) {}

  getResult(): IPaginatedType<T> {
    const pageSize = this.args.first ?? Pagination.defaultPageSize;
    if (pageSize < 0) {
      throw new RangeError('The first pagination argument cannot be negative');
    }

    const startIndex = this.getStartIndex();
    const pageItems = this.items.slice(startIndex, startIndex + pageSize);
    const lastItem = pageItems.at(-1);

    const edges: IEdge<T>[] = pageItems.map((item) => ({
      node: item,
      cursor: item.id,
    }));

    const paginationResult = {
      edges,
      pageInfo: {
        hasNextPage: startIndex + pageSize < this.items.length,
        endCursor: lastItem?.id,
      },
      totalCount: this.items.length,
    } satisfies IPaginatedType<T>;

    return paginationResult;
  }

  private getStartIndex(): number {
    if (!this.args.after) {
      return 0;
    }

    const cursorIndex = this.items.findIndex(
      (item) => item.id === this.args.after,
    );
    if (cursorIndex === -1) {
      return 0;
    }
    return cursorIndex + 1;
  }
}
