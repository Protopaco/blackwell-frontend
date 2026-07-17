
# EmployeeCreateRequest

Exactly one of timesheetFileId or timesheetFolderId must be provided.

## Properties

Name | Type
------------ | -------------
`firstName` | string
`lastName` | string
`position` | string
`hourlyPayRate1` | number
`hourlyPayRate2` | number
`holidayPayRate` | number
`email` | string
`status` | string
`timesheetFileId` | string
`timesheetFolderId` | string

## Example

```typescript
import type { EmployeeCreateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "firstName": Jane,
  "lastName": Smith,
  "position": Program Director,
  "hourlyPayRate1": 25.96,
  "hourlyPayRate2": 36,
  "holidayPayRate": 38.94,
  "email": jane.smith@example.org,
  "status": null,
  "timesheetFileId": 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms,
  "timesheetFolderId": null,
} satisfies EmployeeCreateRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EmployeeCreateRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


