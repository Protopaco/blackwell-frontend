
# AllocationReportRow


## Properties

Name | Type
------------ | -------------
`fundingSourceName` | string
`hoursAllocation` | number
`wagesAllocation` | number
`taxesAllocation` | number
`additionalExpenses` | number
`total` | number

## Example

```typescript
import type { AllocationReportRow } from ''

// TODO: Update the object below with actual values
const example = {
  "fundingSourceName": Federal Grant,
  "hoursAllocation": 320.5,
  "wagesAllocation": 14250,
  "taxesAllocation": 1156.5,
  "additionalExpenses": 1843.75,
  "total": 17250.25,
} satisfies AllocationReportRow

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AllocationReportRow
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


