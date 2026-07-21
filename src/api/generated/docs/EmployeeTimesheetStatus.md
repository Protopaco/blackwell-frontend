
# EmployeeTimesheetStatus


## Properties

Name | Type
------------ | -------------
`employeeId` | string
`firstName` | string
`lastName` | string
`timesheetFileId` | string
`totalHours` | number
`flatRateQuantity` | number
`employeeSigned` | boolean
`supervisorSigned` | boolean
`includeInPayroll` | boolean
`status` | string

## Example

```typescript
import type { EmployeeTimesheetStatus } from ''

// TODO: Update the object below with actual values
const example = {
  "employeeId": null,
  "firstName": Morgan,
  "lastName": Haynes,
  "timesheetFileId": null,
  "totalHours": 72.5,
  "flatRateQuantity": 2,
  "employeeSigned": null,
  "supervisorSigned": null,
  "includeInPayroll": null,
  "status": null,
} satisfies EmployeeTimesheetStatus

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EmployeeTimesheetStatus
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


