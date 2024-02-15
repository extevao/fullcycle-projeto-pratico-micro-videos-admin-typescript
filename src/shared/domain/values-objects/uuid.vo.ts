import { v4 as uuidV4, validate as uuidValidate } from 'uuid'


import { ValueObject } from "../value-object"

export class Uuid extends ValueObject {
  readonly id: string

  constructor(id?: string) {
    super()
    this.id = id || this.generateUuid()

    this.validate()
  }

  private generateUuid(): string {
    return uuidV4();
  }

  private validate() {
    const isValid = uuidValidate(this.id)

    if (!isValid) {
      throw new InvalidUuidError()
    }
  }

  toString() {
    return this.id
  }
}

export class InvalidUuidError extends Error {
  constructor(message = 'ID must be a valid UUID') {
    super(message)
    this.name = 'InvalidUuidError'
  }
}

