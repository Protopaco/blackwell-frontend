
# TimesheetFolder


## Properties

Name | Type
------------ | -------------
`timesheetFolderId` | string
`timesheetFolderName` | string
`driveFolderId` | string
`status` | string

## Example

```typescript
import type { TimesheetFolder } from ''

// TODO: Update the object below with actual values
const example = {
  "timesheetFolderId": null,
  "timesheetFolderName": Main Office,
  "driveFolderId": 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms,
  "status": null,
} satisfies TimesheetFolder

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TimesheetFolder
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


