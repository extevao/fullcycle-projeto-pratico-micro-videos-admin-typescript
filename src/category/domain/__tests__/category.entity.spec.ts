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

    test('exemplo tratativa de erro', () => {
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


    test('should an invalid category with name property', () => {
      expect(() => Category.create({ name: null }))
        .containsErrorMessages({
          name: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        })

      expect(() => Category.create({ name: "" }))
        .containsErrorMessages({
          name: ['name should not be empty']
        })

      expect(() => Category.create({ name: 5 as any }))
        .containsErrorMessages({
          name: [
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        })

      expect(() => Category.create({ name: "t".repeat(256) }))
        .containsErrorMessages({
          name: [
            'name must be shorter than or equal to 255 characters'
          ]
        })
    })

    it('should a invalid category using description property', () => {
      expect(() => Category.create({ description: 5 } as any))
        .containsErrorMessages({
          description: ['description must be a string']
        })
    })


    it('should a invalid category using is_active property', () => {
      expect(() => Category.create({ is_active: 5 } as any))
        .containsErrorMessages({
          is_active: ['is_active must be a boolean value']
        })
    })


    describe('changeName method', () => {
      it('should a invalid category using name property', () => {
        const category = Category.create({ name: 'Movie' })

        expect(() => category.changeName(null)).containsErrorMessages({
          name: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        })

        expect(() => category.changeName(""))
          .containsErrorMessages({
            name: ['name should not be empty']
          })

        expect(() => category.changeName(5 as any))
          .containsErrorMessages({
            name: [
              'name must be a string',
              'name must be shorter than or equal to 255 characters'
            ]
          })

        expect(() => category.changeName("t".repeat(256)))
          .containsErrorMessages({
            name: [
              'name must be shorter than or equal to 255 characters'
            ]
          })
      })
    })


    describe('changeDescription method', () => {
      it('should a invalid category using desctiption property', () => {
        const category = Category.create({ name: 'NMovie' })

        expect(() => category.changeDescription(5 as any)).containsErrorMessages({
          description: ['description must be a string']
        })
      })
    })

  })
})
