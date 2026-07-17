
# ClientCreateRequestEmployeePayrollFolder

Exactly one of link or createNew must be provided. rootFolderLink is required when createNew is true (the parent Drive folder to create it inside) and is never persisted.

## Properties

Name | Type
------------ | -------------
`link` | string
`createNew` | boolean
`rootFolderLink` | string

## Example

```typescript
import type { ClientCreateRequestEmployeePayrollFolder } from ''

// TODO: Update the object below with actual values
const example = {
  "link": https://drive.google.com/drive/folders/1abcXYZ,
  "createNew": null,
  "rootFolderLink": https://drive.google.com/drive/folders/1rootXYZ,
} satisfies ClientCreateRequestEmployeePayrollFolder

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClientCreateRequestEmployeePayrollFolder
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


