import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { Uuid } from "../../../domain/values-objects/uuid.vo";
import { InMemoryRepository } from "./in-memory.repository";

type StubEntityConstructor = {
  entity_id?: Uuid;
  name: string;
  price: number;
}

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor({ entity_id, name, price }: StubEntityConstructor) {
    super()
    this.entity_id = entity_id || new Uuid()
    this.name = name
    this.price = price
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price
    }
  }

}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }
}

describe('InMemoryRepository Unit Tests', () => {

  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository()
  })

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      name: 'Teste',
      price: 100
    })

    await repository.insert(entity)

    expect(repository.items.length).toBe(1)
    expect(repository.items[0]).toBe(entity)
  })

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        name: 'teste',
        price: 100
      }),
      new StubEntity({
        name: 'teste2222',
        price: 25
      })
    ]

    await repository.bulkInsert(entities)

    expect(repository.items.length).toBe(2)
    expect(repository.items[0]).toBe(entities[0])
    expect(repository.items[1]).toBe(entities[1])
  })

  test('should returns all entities', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })
    await repository.insert(entity)

    const entities = await repository.findAll()

    expect(entities).toStrictEqual([entity])
  })

  test('should throws error on update whern entity not found', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })

    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    )
  })

  test('should update an entity', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })
    await repository.insert(entity)

    const entityUpdated = new StubEntity({
      entity_id: entity.entity_id,
      name: 'updated',
      price: 1
    })
    await repository.update(entityUpdated)

    expect(entityUpdated.toJSON()).toStrictEqual(
      repository.items[0].toJSON()
    )
  })

  test('should throws error on delete when aggregate not found', async () => {
    const uuid = new Uuid()

    await expect(repository.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.id, StubEntity)
    )
  })

  test('should delete an entity', async () => {
    const entity = new StubEntity({ name: 'name value', price: 5 })
    await repository.insert(entity)

    await repository.delete(entity.entity_id)

    expect(repository.items).toHaveLength(0)
  })

})
