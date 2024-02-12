import { EntityValidationError } from '../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../shared/domain/values-objects/uuid.vo';
import { Category } from '../category.entity';

describe('Category Unit Tests', () => {
  let validateSpy: any;

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, 'validate')
  })

  describe('constructor', () => {
    test('should create a category with default values', () => {
      const category = new Category({
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test('should create a category with all values', () => {
      const created_at = new Date();

      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
        is_active: false,
        created_at,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBe(created_at);
    });

    test('should create a category with only name and description', () => {
      const category = new Category({
        name: 'Movie',
        description: 'Movie description',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe('create command', () => {
    test('should create a category', () => {
      const category = Category.create({
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
      // expect(validateSpy).toHaveBeenCalledTimes(1)
    });

    test('should create a category with name and description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description',
      });

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBe('Movie description')
      expect(category.is_active).toBe(true)
      expect(category.created_at).toBeInstanceOf(Date)

      // expect(validateSpy).toHaveBeenCalledTimes(1)
    });

    test('should create a category with name and is_active', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      })

      expect(category.category_id).toBeInstanceOf(Uuid)
      expect(category.name).toBe('Movie')
      expect(category.description).toBeNull()
      expect(category.is_active).toBe(false)
      expect(category.created_at).toBeInstanceOf(Date)
      // expect(validateSpy).toHaveBeenCalledTimes(1)

    })
  })

  test('should change name', () => {
    const category = Category.create({
      name: 'Movie',
    });

    expect(category.name).toBe('Movie');

    category.changeName('Name changed');

    expect(category.name).toBe('Name changed');

  });

  test('should change description', () => {
    const category = Category.create({
      name: 'Movie',
    });

    expect(category.description).toBe(null);

    category.changeDescription('Description');

    expect(category.description).toBe('Description');

  });

  test('should active a category', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: false,
    });

    expect(category.is_active).toBe(false);

    category.activate();

    expect(category.is_active).toBe(true);
  });

  test('should dactive a category', () => {
    const category = new Category({
      name: 'Movie',
      is_active: true,
    });

    expect(category.is_active).toBe(true);

    category.deactivate();

    expect(category.is_active).toBe(false);
  });

  describe('category_id field', () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() }
    ]

    test.each(arrange)('should be id %j', (arrangeItem) => {
      const category = new Category({
        category_id: arrangeItem.category_id as any,
        name: 'Movie',
      })

      expect(category.category_id).toBeInstanceOf(Uuid)

      if (arrangeItem.category_id instanceof Uuid) {
        expect(category.category_id).toBe(arrangeItem.category_id)
      }
    })
  });
});


describe('Category Validator', () => {
  describe('create command', () => {

    test('xpto', () => {
      expect(() => {
        Category.create({
          name: ''
        })
      }).toThrow(
        new EntityValidationError({
          name: ['name is required']
        })
      )
    })

  })
})
