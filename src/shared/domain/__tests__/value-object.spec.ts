import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly prop1: string, readonly prop2: number) {
    super();
  }
}

describe('ValueObject Unit Tests', () => {
  test('should be equals', () => {
    const valueObject1 = new StringValueObject('test')
    const valueObject2 = new StringValueObject('test')

    expect(valueObject1.equals(valueObject2)).toBe(true)
  })

  test('should be equals complexValueObject', () => {
    const complexValueObject1 = new ComplexValueObject('test', 2)
    const complexValueObject2 = new ComplexValueObject('test', 2)

    expect(complexValueObject1.equals(complexValueObject2)).toBe(true)
  })

  test('should not be equals', () => {
    const valueObject1 = new StringValueObject('teste1')
    const valueObject2 = new StringValueObject('teste2')


    expect(valueObject1.equals(valueObject2)).toBe(false)
    expect(valueObject1.equals(null as any)).toBe(false)
    expect(valueObject1.equals(undefined as any)).toBe(false)
  })

  test('should not be equals complexValueObject', () => {
    const complexValueObject1 = new ComplexValueObject('test', 2)
    const complexValueObject2 = new ComplexValueObject('test2', 3)

    expect(complexValueObject1.equals(complexValueObject2)).toBe(false)
    expect(complexValueObject1.equals(null as any)).toBe(false)
    expect(complexValueObject1.equals(undefined as any)).toBe(false)
  })

})