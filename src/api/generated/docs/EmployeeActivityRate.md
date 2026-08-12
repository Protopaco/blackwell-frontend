
# EmployeeActivityRate

id is omitted for a newly-added row that hasn\'t been saved yet.

## Properties

Name | Type
------------ | -------------
`id` | string
`activityId` | string
`payRateType` | string
`payRate` | number
`holidayPayRate` | number

## Example

```typescript
import type { EmployeeActivityRate } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "activityId": null,
  "payRateType": null,
  "payRate": 25.96,
  "holidayPayRate": 38.94,
} satisfies EmployeeActivityRate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EmployeeActivityRate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


