# TimesheetApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1GenerateTimesheets**](TimesheetApi.md#v1generatetimesheets) | **POST** /api/v1/timesheet/{clientId}/{payPeriodId}/generate | Generate timesheets for all active employees for a pay period |
| [**v1GetTimesheetStatus**](TimesheetApi.md#v1gettimesheetstatus) | **GET** /api/v1/timesheet/status/{clientId}/{payPeriodId} | Get timesheet status for all active employees for a pay period |



## v1GenerateTimesheets

> v1GenerateTimesheets(clientId, payPeriodId)

Generate timesheets for all active employees for a pay period

### Example

```ts
import {
  Configuration,
  TimesheetApi,
} from '';
import type { V1GenerateTimesheetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TimesheetApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GenerateTimesheetsRequest;

  try {
    const data = await api.v1GenerateTimesheets(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **clientId** | `string` |  | [Defaults to `undefined`] |
| **payPeriodId** | `string` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Timesheets generated |  -  |
| **404** | Client or pay period not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetTimesheetStatus

> Array&lt;EmployeeTimesheetStatus&gt; v1GetTimesheetStatus(clientId, payPeriodId)

Get timesheet status for all active employees for a pay period

### Example

```ts
import {
  Configuration,
  TimesheetApi,
} from '';
import type { V1GetTimesheetStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TimesheetApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GetTimesheetStatusRequest;

  try {
    const data = await api.v1GetTimesheetStatus(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **clientId** | `string` |  | [Defaults to `undefined`] |
| **payPeriodId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;EmployeeTimesheetStatus&gt;**](EmployeeTimesheetStatus.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Per-employee timesheet status including hours and signature state |  -  |
| **404** | Pay period not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

