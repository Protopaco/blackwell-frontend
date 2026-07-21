
# EmployeeExpense


## Properties

Name | Type
------------ | -------------
`employeeId` | string
`employeeName` | string
`totalExpense` | number

## Example

```typescript
import type { EmployeeExpense } from ''

// TODO: Update the object below with actual values
const example = {
  "employeeId": null,
  "employeeName": Jane Smith,
  "totalExpense": 2326.92,
} satisfies EmployeeExpense

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EmployeeExpense
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


