import { keywordObjectId } from '@feathersjs/mongodb'

// For more information about this file see https://dove.feathersjs.com/guides/cli/validators.html
import { Ajv, addFormats } from '@feathersjs/schema'

const formats = [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex'
]

export const dataValidator = addFormats(new Ajv({ useDefaults: true, messages: true, allowUnionTypes : true, allErrors: true }), formats)

export const dataPatchValidator = addFormats(new Ajv({messages: true, allowUnionTypes : true, allErrors: true }), formats)

export const queryValidator = addFormats(
  new Ajv({
    coerceTypes: true,
    messages: true,
    allowUnionTypes: true,
    allErrors: true
  }),
  formats
)

dataValidator.addKeyword(keywordObjectId)
dataPatchValidator.addKeyword(keywordObjectId)
queryValidator.addKeyword(keywordObjectId)
