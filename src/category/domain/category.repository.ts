import { IRepository } from "../../shared/domain/repository/repository.interface";
import { Uuid } from "../../shared/domain/values-objects/uuid.vo";
import { Category } from "./category.entity";

export interface CategoryRepository extends IRepository<Category, Uuid> { }
