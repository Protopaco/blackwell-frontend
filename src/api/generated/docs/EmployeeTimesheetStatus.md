
# EmployeeTimesheetStatus


## Properties

Name | Type
------------ | -------------
`employeeId` | string
`employeeName` | string
`timesheetFileId` | string
`timesheetFileLink` | string
`totalHours` | number
`employeeSigned` | boolean
`supervisorSigned` | boolean
`status` | string

## Example

```typescript
import type { EmployeeTimesheetStatus } from ''

// TODO: Update the object below with actual values
const example = {
  "employeeId": null,
  "employeeName": Morgan Haynes,
  "timesheetFileId": null,
  "timesheetFileLink": https://docs.google.com/spreadsheets/d/...,
  "totalHours": 72.5,
  "employeeSigned": null,
  "supervisorSigned": null,
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


