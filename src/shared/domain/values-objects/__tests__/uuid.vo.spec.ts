import { validate as uuidValidate } from 'uuid'
import { InvalidUuidError, Uuid } from "../uuid.vo"

describe('Uuid Unit Tests', () => {

  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')

  test('should throw an error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid')
    }).toThrow(new InvalidUuidError())

    expect(validateSpy).toHaveBeenCalled()
    expect(validateSpy).toHaveBeenCalledTimes(1)
  })

  test('should create a valid uuid', () => {
    const uuid = new Uuid()

    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true)
  })

  test('should accepta valid uuid', () => {
    const uuid = new Uuid('b94d0fe4-1645-4b91-83e7-c3378319362f')

    expect(uuid.id).toBe('b94d0fe4-1645-4b91-83e7-c3378319362f');
  })
})
