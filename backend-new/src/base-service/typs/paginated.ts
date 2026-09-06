import { PageInfo } from '../dto/paginated';

export interface IEdge<T> {
  node: T;
  cursor: string;
}

export interface IPaginatedType<T> {
  edges: IEdge<T>[];
  pageInfo: PageInfo;
  totalCount: number;
}
