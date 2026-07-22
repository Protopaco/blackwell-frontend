
# TimesheetFolderUpdateRequest

All fields optional — only send what is actually changing. Drive folder links are immutable after creation.

## Properties

Name | Type
------------ | -------------
`timesheetFolderName` | string
`status` | string

## Example

```typescript
import type { TimesheetFolderUpdateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "timesheetFolderName": Main Office,
  "status": null,
} satisfies TimesheetFolderUpdateRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TimesheetFolderUpdateRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


