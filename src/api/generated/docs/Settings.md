
# Settings


## Properties

Name | Type
------------ | -------------
`timeInputMethod` | string
`payPeriodInterval` | string
`payPeriodStartDate` | Date

## Example

```typescript
import type { Settings } from ''

// TODO: Update the object below with actual values
const example = {
  "timeInputMethod": null,
  "payPeriodInterval": null,
  "payPeriodStartDate": Sun Jan 04 16:00:00 PST 2026,
} satisfies Settings

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Settings
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


