
# EmployeeCreateRequest

Exactly one of timesheetFileLink or timesheetFolderId must be provided.

## Properties

Name | Type
------------ | -------------
`firstName` | string
`lastName` | string
`position` | string
`salaryAmount` | number
`activityRates` | [Array&lt;EmployeeActivityRate&gt;](EmployeeActivityRate.md)
`email` | string
`status` | string
`timesheetFileLink` | string
`timesheetFolderId` | string

## Example

```typescript
import type { EmployeeCreateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "firstName": Jane,
  "lastName": Smith,
  "position": Program Director,
  "salaryAmount": 0,
  "activityRates": null,
  "email": jane.smith@example.org,
  "status": null,
  "timesheetFileLink": https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit,
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


