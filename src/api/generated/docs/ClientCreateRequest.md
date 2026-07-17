
# ClientCreateRequest


## Properties

Name | Type
------------ | -------------
`clientName` | string
`clientCode` | string
`employeePayrollFolder` | [ClientCreateRequestEmployeePayrollFolder](ClientCreateRequestEmployeePayrollFolder.md)
`payrollConfigFolder` | [FolderInput](FolderInput.md)
`payrollReportFolder` | [FolderInput](FolderInput.md)
`settings` | [Settings](Settings.md)

## Example

```typescript
import type { ClientCreateRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "clientName": null,
  "clientCode": null,
  "employeePayrollFolder": null,
  "payrollConfigFolder": null,
  "payrollReportFolder": null,
  "settings": null,
} satisfies ClientCreateRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClientCreateRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


