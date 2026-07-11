
# Holiday


## Properties

Name | Type
------------ | -------------
`holidayId` | string
`holidayName` | string
`holidayDate` | Date

## Example

```typescript
import type { Holiday } from ''

// TODO: Update the object below with actual values
const example = {
  "holidayId": null,
  "holidayName": Labor Day,
  "holidayDate": Sun Sep 06 17:00:00 PDT 2026,
} satisfies Holiday

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Holiday
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


