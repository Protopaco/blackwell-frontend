
# Supervisor


## Properties

Name | Type
------------ | -------------
`supervisorId` | string
`firstName` | string
`lastName` | string
`email` | string

## Example

```typescript
import type { Supervisor } from ''

// TODO: Update the object below with actual values
const example = {
  "supervisorId": null,
  "firstName": Alex,
  "lastName": Rivera,
  "email": alex.rivera@example.org,
} satisfies Supervisor

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Supervisor
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


