
# TimesheetFolderCreateRequest


## Properties

Name | Type
------------ | -------------
`timesheetFolderName` | string
`driveFolderLink` | string

## Example

```typescript
import type { TimesheetFolderCreateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "timesheetFolderName": Main Office,
  "driveFolderLink": https://drive.google.com/drive/folders/1abcXYZ,
} satisfies TimesheetFolderCreateRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TimesheetFolderCreateRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


