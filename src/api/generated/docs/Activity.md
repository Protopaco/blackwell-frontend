
# Activity


## Properties

Name | Type
------------ | -------------
`activityId` | string
`activityName` | string
`payrollCategory` | string
`groupLabel` | string
`sortOrder` | number
`fundingSources` | [Array&lt;ActivityFundingSourcesInner&gt;](ActivityFundingSourcesInner.md)

## Example

```typescript
import type { Activity } from ''

// TODO: Update the object below with actual values
const example = {
  "activityId": null,
  "activityName": Job Coaching,
  "payrollCategory": null,
  "groupLabel": VT Grows,
  "sortOrder": 0,
  "fundingSources": null,
} satisfies Activity

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Activity
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


