const schema = {"$schema":"http://json-schema.org/draft-07/schema#","definitions":{"createParams":{"type":"object","properties":{"firstName":{"type":"string"},"surname":{"type":"string"},"dateOfBirth":{"type":"string","format":"date-time"},"message":{"type":"string"}},"required":["dateOfBirth","firstName","message","surname"]}}};
export default schema.definitions;