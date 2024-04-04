import { PaginationOutputMapper } from "../../../shared/application/pagination-output";
import { IUseCase } from "../../../shared/application/use-case.interface";
import { SortDirection } from "../../../shared/domain/repository/search-params";
import { CategoryFilter, CategorySearchParams, ICategoryRepository } from "../../domain/category.repository";


export class ListCategoriesUseCase
  implements IUseCase<ListCategoriesInput, ListCategoriesOutput> {

  constructor(
    private categoryRepo: ICategoryRepository
  ) { }

  async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
    const params = new CategorySearchParams(input)
    const searchResult = await this.categoryRepo.search(params)

    const outputItems = searchResult.items.map(item => item)

    return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
  }

}



type ListCategoriesInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter | null;
}

type ListCategoriesOutput = {

}
