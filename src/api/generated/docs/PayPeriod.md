
# PayPeriod


## Properties

Name | Type
------------ | -------------
`payPeriodId` | string
`payPeriodName` | string
`status` | string
`startDate` | Date
`endDate` | Date
`createdDate` | Date

## Example

```typescript
import type { PayPeriod } from ''

// TODO: Update the object below with actual values
const example = {
  "payPeriodId": null,
  "payPeriodName": 06/01 - 06/14,
  "status": null,
  "startDate": Sun May 31 17:00:00 PDT 2026,
  "endDate": Sat Jun 13 17:00:00 PDT 2026,
  "createdDate": null,
} satisfies PayPeriod

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PayPeriod
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


