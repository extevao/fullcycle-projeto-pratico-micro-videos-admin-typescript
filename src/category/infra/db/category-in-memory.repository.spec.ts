import { Category } from "../../domain/category.entity"
import { CategoryInMemoryRespository } from "./category-in-memory.repository"


describe('CategoryInMemoryRepository', () => {
  let respository: CategoryInMemoryRespository

  beforeEach((() => respository = new CategoryInMemoryRespository()))


  it('should no filter items when filter object is null', async () => {
    const items = [
      Category.fake().aCategory().build()
    ]
    const filterSpy = jest.spyOn(items, 'filter' as any)

    const itemsFiltered = await respository['applyFilter'](items, null)
    expect(itemsFiltered).toStrictEqual(items)
    expect(filterSpy).not.toHaveBeenCalled()
  })


  it('should filter items using filter parameter', async () => {
    const items = [
      Category.fake().aCategory().withName('test').build(),
      Category.fake().aCategory().withName('TEST').build(),
      Category.fake().aCategory().withName('fake').build(),
    ]
    const filterSpy = jest.spyOn(items, 'filter' as any)

    const itemsFiltered = await respository['applyFilter'](items, 'TEST')
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])
    expect(filterSpy).toHaveBeenCalledTimes(1)
  })

  it('should sort by created_at when sort param is null', async () => {
    const createdAt = new Date()
    const items = [
      Category
        .fake()
        .aCategory()
        .withName('fake')
        .withCreatedAt(createdAt)
        .build(),
      Category.fake()
        .aCategory()
        .withName('TEST')
        .withCreatedAt(new Date(createdAt.getTime() + 200))
        .build(),
      Category
        .fake()
        .aCategory()
        .withName('fake')
        .withCreatedAt(new Date(createdAt.getTime() + 300))
        .build(),
    ]


    const itemsSorted = await respository['applySort'](items, null, null)
    // expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('should sort by name', async () => {
    const items = [
      Category
        .fake()
        .aCategory()
        .withName('c')
        .build(),
      Category
        .fake()
        .aCategory()
        .withName('b')
        .build(),
      Category
        .fake()
        .aCategory()
        .withName('a')
        .build(),
    ]

    let itemsSorted = await respository['applySort'](items, 'name', 'asc')
    // expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])

    itemsSorted = await respository['applySort'](items, 'name', 'desc')
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]])
  })

})
