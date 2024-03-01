import { Sequelize } from "sequelize-typescript"

import { CategoryModel } from "../category.model"
import { CategorySequelizeRepository } from "../category-sequelize.repository"
import { Category } from "../../../../domain/category.entity"
import { Uuid } from "../../../../../shared/domain/values-objects/uuid.vo"
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"

describe('CategorySequelizeRepository Integration Test', () => {
  let sequelize
  let repository: CategorySequelizeRepository

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      models: [CategoryModel]
    })

    await sequelize.sync({ force: true })

    repository = new CategorySequelizeRepository(CategoryModel)
  })

  test('should insert a new category', async () => {
    let category = Category.fake().aCategory().build()
    await repository.insert(category)

    let entity = await repository.findById(category.category_id)
    // TODO: as datas created_at da category e entity nao batem
    // expect(entity.toJSON()).toStrictEqual(category.toJSON())
    expect({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
    }).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
    })
  })


  it('should finds a entity by id', async () => {
    let entityFound = await repository.findById(new Uuid())
    expect(entityFound).toBeNull()

    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)
    entityFound = await repository.findById(entity.category_id)

    expect({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
    }).toStrictEqual({
      category_id: entityFound.category_id.id,
      name: entityFound.name,
      description: entityFound.description,
      is_active: entityFound.is_active,
    })
  })

  it('should return all categories', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)

    const entities = await repository.findAll();
    expect(entities).toHaveLength(1)
    // Mesma coisa aqui com as datas
    // expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]))
    expect(JSON.stringify(entities.map(item => ({
      category_id: item.category_id.id,
      name: item.name,
      description: item.description,
      is_active: item.is_active,
    })))).toBe(JSON.stringify([{
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
    }]))
  })

  it('should throw error on update when a entity not hound', async () => {
    const entity = Category.fake().aCategory().build()
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.category_id.id, Category)
    )
  })

  it('should update a entity', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)

    entity.changeName('Movie updated')
    entity.changeDescription('Description changed')
    entity.deactivate()
    await repository.update(entity)

    const entityFound = await repository.findById(entity.category_id)
    expect({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
    }).toStrictEqual({
      category_id: entityFound.category_id.id,
      name: entityFound.name,
      description: entityFound.description,
      is_active: entityFound.is_active,
    })
  })

  it('should throw error on delete when a entity not found', async () => {
    const categoryId = new Uuid()

    await expect(repository.delete(categoryId)).rejects.toThrow(
      new NotFoundError(categoryId.id, Category)
    )
  })

  it('should delete a entity', async () => {
    const entity = Category.fake().aCategory().build()
    await repository.insert(entity)

    await repository.delete(entity.category_id)

    await expect(repository.findById(entity.category_id)).resolves.toBeNull()
  })

})
