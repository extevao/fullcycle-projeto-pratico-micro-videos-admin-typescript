import { ISearcheableRepository } from "../../shared/domain/repository/repository.interface";
import { SearchParams } from "../../shared/domain/repository/search-params";
import { SearchResult } from "../../shared/domain/repository/search-result";
import { Uuid } from "../../shared/domain/values-objects/uuid.vo";
import { Category } from "./category.entity";


export type CategoryFilter = string

export class CategorySearchParams extends SearchParams<CategoryFilter> { }

export class CategorySearchResult extends SearchResult<Category> { }

export interface ICategoryRepository
  extends ISearcheableRepository<
    Category,
    Uuid,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > { }

