
# Client


## Properties

Name | Type
------------ | -------------
`clientId` | string
`clientName` | string
`clientCode` | string
`trackFundingSource` | boolean
`clientFolderLink` | string
`clientFolderId` | string
`employeePayrollFolderId` | string
`payrollConfigFolderId` | string
`reportsFolderId` | string
`payrollReportFolderId` | string
`timesheetsFolderId` | string
`payrollConfigFileId` | string
`payPeriodRegistryFileId` | string

## Example

```typescript
import type { Client } from ''

// TODO: Update the object below with actual values
const example = {
  "clientId": null,
  "clientName": null,
  "clientCode": null,
  "trackFundingSource": null,
  "clientFolderLink": null,
  "clientFolderId": null,
  "employeePayrollFolderId": null,
  "payrollConfigFolderId": null,
  "reportsFolderId": null,
  "payrollReportFolderId": null,
  "timesheetsFolderId": null,
  "payrollConfigFileId": null,
  "payPeriodRegistryFileId": null,
} satisfies Client

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Client
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


