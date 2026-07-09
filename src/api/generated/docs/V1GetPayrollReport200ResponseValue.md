
# V1GetPayrollReport200ResponseValue


## Properties

Name | Type
------------ | -------------
`employeeName` | string
`hourly` | [Array&lt;V1GetPayrollReport200ResponseValueHourlyInner&gt;](V1GetPayrollReport200ResponseValueHourlyInner.md)
`flatRate` | [Array&lt;V1GetPayrollReport200ResponseValueFlatRateInner&gt;](V1GetPayrollReport200ResponseValueFlatRateInner.md)

## Example

```typescript
import type { V1GetPayrollReport200ResponseValue } from ''

// TODO: Update the object below with actual values
const example = {
  "employeeName": null,
  "hourly": null,
  "flatRate": null,
} satisfies V1GetPayrollReport200ResponseValue

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as V1GetPayrollReport200ResponseValue
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


