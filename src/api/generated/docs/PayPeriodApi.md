# PayPeriodApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1AddActivityToPayPeriod**](PayPeriodApi.md#v1addactivitytopayperiod) | **POST** /api/v1/payPeriod/{clientId}/{payPeriodId}/activity/{activityId} | Add an activity to a pay period |
| [**v1AddEmployeeToPayPeriod**](PayPeriodApi.md#v1addemployeetopayperiod) | **POST** /api/v1/payPeriod/{clientId}/{payPeriodId}/employee/{employeeId} | Add an employee to a pay period |
| [**v1AddFundingSourceToPayPeriod**](PayPeriodApi.md#v1addfundingsourcetopayperiod) | **POST** /api/v1/payPeriod/{clientId}/{payPeriodId}/fundingSource/{fundingSourceId} | Add a funding source to a pay period |
| [**v1ClosePayPeriod**](PayPeriodApi.md#v1closepayperiod) | **PATCH** /api/v1/payPeriod/{clientId}/{payPeriodId}/close | Close a pay period |
| [**v1CreatePayPeriod**](PayPeriodApi.md#v1createpayperiod) | **POST** /api/v1/payPeriod/{clientId} | Create a new pay period |
| [**v1GetNextPayPeriod**](PayPeriodApi.md#v1getnextpayperiod) | **GET** /api/v1/payPeriod/{clientId}/next | Get suggested next pay period for a client |
| [**v1GetPayPeriodById**](PayPeriodApi.md#v1getpayperiodbyid) | **GET** /api/v1/payPeriod/{clientId}/{payPeriodId} | Get a single pay period by ID |
| [**v1GetPayPeriodConfig**](PayPeriodApi.md#v1getpayperiodconfig) | **GET** /api/v1/payPeriod/{clientId}/{payPeriodId}/config | Get a pay period\&#39;s full config snapshot (employees, activities, funding sources, holidays, settings) |
| [**v1GetPayPeriods**](PayPeriodApi.md#v1getpayperiods) | **GET** /api/v1/payPeriod/{clientId} | Get all pay periods for a client |
| [**v1RemoveActivityFromPayPeriod**](PayPeriodApi.md#v1removeactivityfrompayperiod) | **DELETE** /api/v1/payPeriod/{clientId}/{payPeriodId}/activity/{activityId} | Remove an activity from a pay period |
| [**v1RemoveEmployeeFromPayPeriod**](PayPeriodApi.md#v1removeemployeefrompayperiod) | **DELETE** /api/v1/payPeriod/{clientId}/{payPeriodId}/employee/{employeeId} | Remove an employee from a pay period |
| [**v1RemoveFundingSourceFromPayPeriod**](PayPeriodApi.md#v1removefundingsourcefrompayperiod) | **DELETE** /api/v1/payPeriod/{clientId}/{payPeriodId}/fundingSource/{fundingSourceId} | Remove a funding source from a pay period |
| [**v1SyncHolidaysOnPayPeriod**](PayPeriodApi.md#v1syncholidaysonpayperiod) | **POST** /api/v1/payPeriod/{clientId}/{payPeriodId}/holiday/sync | Sync a pay period\&#39;s holidays from PayrollConfig |
| [**v1UpdateActivityOnPayPeriod**](PayPeriodApi.md#v1updateactivityonpayperiod) | **PUT** /api/v1/payPeriod/{clientId}/{payPeriodId}/activity/{activityId} | Update an activity on a pay period |



## v1AddActivityToPayPeriod

> v1AddActivityToPayPeriod(clientId, payPeriodId, activityId)

Add an activity to a pay period

Copies the activity\&#39;s current row from the client\&#39;s PayrollConfig into this pay period\&#39;s report workbook snapshot. Blocked once the first timesheet has been generated for this pay period. The activity\&#39;s funding sources must already exist on this pay period\&#39;s snapshot. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1AddActivityToPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // string
    activityId: activityId_example,
  } satisfies V1AddActivityToPayPeriodRequest;

  try {
    const data = await api.v1AddActivityToPayPeriod(body);
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
| **activityId** | `string` |  | [Defaults to `undefined`] |

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
| **201** | Activity added to pay period |  -  |
| **404** | Client, pay period, or activity not found |  -  |
| **422** | A timesheet has already been generated, the activity is already on this pay period, or a referenced funding source is missing from the snapshot |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1AddEmployeeToPayPeriod

> v1AddEmployeeToPayPeriod(clientId, payPeriodId, employeeId)

Add an employee to a pay period

Copies the employee\&#39;s current row from the client\&#39;s PayrollConfig into this pay period\&#39;s report workbook snapshot. The employee must exist and be Active in PayrollConfig. If the employee was previously removed from this pay period, their snapshot row is refreshed and reactivated. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1AddEmployeeToPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // string
    employeeId: employeeId_example,
  } satisfies V1AddEmployeeToPayPeriodRequest;

  try {
    const data = await api.v1AddEmployeeToPayPeriod(body);
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
| **employeeId** | `string` |  | [Defaults to `undefined`] |

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
| **201** | Employee added to pay period |  -  |
| **404** | Client, pay period, or employee not found |  -  |
| **422** | Employee is not Active in PayrollConfig, or is already on this pay period |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1AddFundingSourceToPayPeriod

> v1AddFundingSourceToPayPeriod(clientId, payPeriodId, fundingSourceId)

Add a funding source to a pay period

Copies the funding source\&#39;s current row from the client\&#39;s PayrollConfig into this pay period\&#39;s report workbook snapshot. Blocked once the first timesheet has been generated for this pay period. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1AddFundingSourceToPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // string
    fundingSourceId: fundingSourceId_example,
  } satisfies V1AddFundingSourceToPayPeriodRequest;

  try {
    const data = await api.v1AddFundingSourceToPayPeriod(body);
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
| **fundingSourceId** | `string` |  | [Defaults to `undefined`] |

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
| **201** | Funding source added to pay period |  -  |
| **404** | Client, pay period, or funding source not found |  -  |
| **422** | A timesheet has already been generated, or the funding source is already on this pay period |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1ClosePayPeriod

> v1ClosePayPeriod(clientId, payPeriodId)

Close a pay period

Sets the pay period status to Closed. No-op if already Closed.

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1ClosePayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1ClosePayPeriodRequest;

  try {
    const data = await api.v1ClosePayPeriod(body);
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
| **200** | Pay period closed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1CreatePayPeriod

> v1CreatePayPeriod(clientId)

Create a new pay period

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1CreatePayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1CreatePayPeriodRequest;

  try {
    const data = await api.v1CreatePayPeriod(body);
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
| **201** | Pay period created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetNextPayPeriod

> PayPeriod v1GetNextPayPeriod(clientId)

Get suggested next pay period for a client

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1GetNextPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetNextPayPeriodRequest;

  try {
    const data = await api.v1GetNextPayPeriod(body);
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

### Return type

[**PayPeriod**](PayPeriod.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Suggested next pay period |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetPayPeriodById

> PayPeriod v1GetPayPeriodById(clientId, payPeriodId)

Get a single pay period by ID

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1GetPayPeriodByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GetPayPeriodByIdRequest;

  try {
    const data = await api.v1GetPayPeriodById(body);
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

[**PayPeriod**](PayPeriod.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pay period |  -  |
| **404** | Client or pay period not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetPayPeriodConfig

> PayPeriodConfigSnapshot v1GetPayPeriodConfig(clientId, payPeriodId)

Get a pay period\&#39;s full config snapshot (employees, activities, funding sources, holidays, settings)

One batched read across the pay period\&#39;s snapshot tabs, backing the Employees/Activities/ FundingSources/Holidays tabs on the Pay Period page. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1GetPayPeriodConfigRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GetPayPeriodConfigRequest;

  try {
    const data = await api.v1GetPayPeriodConfig(body);
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

[**PayPeriodConfigSnapshot**](PayPeriodConfigSnapshot.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pay period config snapshot |  -  |
| **404** | Client or pay period not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetPayPeriods

> Array&lt;PayPeriod&gt; v1GetPayPeriods(clientId)

Get all pay periods for a client

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1GetPayPeriodsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetPayPeriodsRequest;

  try {
    const data = await api.v1GetPayPeriods(body);
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

### Return type

[**Array&lt;PayPeriod&gt;**](PayPeriod.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of pay periods |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1RemoveActivityFromPayPeriod

> v1RemoveActivityFromPayPeriod(clientId, payPeriodId, activityId)

Remove an activity from a pay period

Deletes the activity from this pay period\&#39;s snapshot. Blocked once the first timesheet has been generated for this pay period. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1RemoveActivityFromPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // string
    activityId: activityId_example,
  } satisfies V1RemoveActivityFromPayPeriodRequest;

  try {
    const data = await api.v1RemoveActivityFromPayPeriod(body);
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
| **activityId** | `string` |  | [Defaults to `undefined`] |

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
| **200** | Activity removed from pay period |  -  |
| **404** | Client, pay period, or activity not found on this pay period |  -  |
| **422** | A timesheet has already been generated for this pay period |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1RemoveEmployeeFromPayPeriod

> v1RemoveEmployeeFromPayPeriod(clientId, payPeriodId, employeeId)

Remove an employee from a pay period

Soft-removes the employee from this pay period\&#39;s snapshot (flips their snapshot row to Inactive — no hard delete). Blocked once a timesheet has already been generated for that employee this pay period; use the includeInPayroll checkbox on their timesheet instead. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1RemoveEmployeeFromPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // string
    employeeId: employeeId_example,
  } satisfies V1RemoveEmployeeFromPayPeriodRequest;

  try {
    const data = await api.v1RemoveEmployeeFromPayPeriod(body);
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
| **employeeId** | `string` |  | [Defaults to `undefined`] |

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
| **200** | Employee removed from pay period |  -  |
| **404** | Client, pay period, or employee not found on this pay period |  -  |
| **422** | A timesheet has already been generated for this employee this pay period |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1RemoveFundingSourceFromPayPeriod

> v1RemoveFundingSourceFromPayPeriod(clientId, payPeriodId, fundingSourceId)

Remove a funding source from a pay period

Deletes the funding source from this pay period\&#39;s snapshot. Blocked once the first timesheet has been generated for this pay period, or while any snapshot activity still references it. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1RemoveFundingSourceFromPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // string
    fundingSourceId: fundingSourceId_example,
  } satisfies V1RemoveFundingSourceFromPayPeriodRequest;

  try {
    const data = await api.v1RemoveFundingSourceFromPayPeriod(body);
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
| **fundingSourceId** | `string` |  | [Defaults to `undefined`] |

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
| **200** | Funding source removed from pay period |  -  |
| **404** | Client, pay period, or funding source not found on this pay period |  -  |
| **422** | A timesheet has already been generated for this pay period, or the funding source is still referenced by an activity on this pay period |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1SyncHolidaysOnPayPeriod

> v1SyncHolidaysOnPayPeriod(clientId, payPeriodId)

Sync a pay period\&#39;s holidays from PayrollConfig

Recomputes this pay period\&#39;s snapshot Holidays tab from the client\&#39;s current PayrollConfig, keeping only holidays whose date falls within this pay period\&#39;s date range. Fully replaces the snapshot\&#39;s Holidays list — a holiday deleted or moved out of range in PayrollConfig drops off the snapshot. Blocked once the first timesheet has been generated for this pay period. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1SyncHolidaysOnPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1SyncHolidaysOnPayPeriodRequest;

  try {
    const data = await api.v1SyncHolidaysOnPayPeriod(body);
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
| **200** | Holidays synced on pay period |  -  |
| **404** | Client or pay period not found |  -  |
| **422** | A timesheet has already been generated for this pay period |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateActivityOnPayPeriod

> v1UpdateActivityOnPayPeriod(clientId, payPeriodId, activityId, activity)

Update an activity on a pay period

activityId is taken from the path — ignored if present in the request body. activityName, trackSeparately, payrollCategory, payRate, and flatRateAmount are locked once the first timesheet has been generated for this pay period. fundingSources percentages stay editable through Processed status and lock once the allocation report has been generated (Allocated). fundingSources cannot have more than 3 entries, and the last entry\&#39;s percentage is always overwritten with the remainder needed to make the total exactly 100. 

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1UpdateActivityOnPayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // string
    activityId: activityId_example,
    // Activity
    activity: ...,
  } satisfies V1UpdateActivityOnPayPeriodRequest;

  try {
    const data = await api.v1UpdateActivityOnPayPeriod(body);
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
| **activityId** | `string` |  | [Defaults to `undefined`] |
| **activity** | [Activity](Activity.md) |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Activity updated on pay period |  -  |
| **404** | Client, pay period, or activity not found on this pay period |  -  |
| **422** | More than 3 funding sources were provided, a referenced funding source is missing from the snapshot, or the edit is locked given the pay period\&#39;s current status |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

