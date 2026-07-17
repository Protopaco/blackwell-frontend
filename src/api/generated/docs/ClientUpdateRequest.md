
# ClientUpdateRequest

All fields optional — only send what is actually changing.

## Properties

Name | Type
------------ | -------------
`status` | string
`clientName` | string
`clientCode` | string

## Example

```typescript
import type { ClientUpdateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "status": null,
  "clientName": null,
  "clientCode": null,
} satisfies ClientUpdateRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClientUpdateRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


