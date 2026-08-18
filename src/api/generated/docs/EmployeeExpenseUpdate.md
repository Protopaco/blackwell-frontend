
# EmployeeExpenseUpdate


## Properties

Name | Type
------------ | -------------
`employeeId` | string
`wageExpense` | number
`taxExpense` | number

## Example

```typescript
import type { EmployeeExpenseUpdate } from ''

// TODO: Update the object below with actual values
const example = {
  "employeeId": null,
  "wageExpense": 2326.92,
  "taxExpense": 189.45,
} satisfies EmployeeExpenseUpdate

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as EmployeeExpenseUpdate
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


