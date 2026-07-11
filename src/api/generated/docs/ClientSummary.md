
# ClientSummary


## Properties

Name | Type
------------ | -------------
`employees` | [Array&lt;Employee&gt;](Employee.md)
`supervisors` | [Array&lt;Supervisor&gt;](Supervisor.md)
`activities` | [Array&lt;Activity&gt;](Activity.md)
`fundingSources` | [Array&lt;FundingSource&gt;](FundingSource.md)
`holidays` | [Array&lt;Holiday&gt;](Holiday.md)
`settings` | [Settings](Settings.md)
`payPeriods` | [Array&lt;PayPeriod&gt;](PayPeriod.md)

## Example

```typescript
import type { ClientSummary } from ''

// TODO: Update the object below with actual values
const example = {
  "employees": null,
  "supervisors": null,
  "activities": null,
  "fundingSources": null,
  "holidays": null,
  "settings": null,
  "payPeriods": null,
} satisfies ClientSummary

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ClientSummary
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


