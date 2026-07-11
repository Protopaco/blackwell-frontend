# PayrollReportApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1GenerateAllocationReport**](PayrollReportApi.md#v1generateallocationreport) | **POST** /api/v1/payrollReport/{clientId}/{payPeriodId}/allocation-report | Generate or regenerate the allocation report for a pay period |
| [**v1GeneratePayrollReport**](PayrollReportApi.md#v1generatepayrollreport) | **POST** /api/v1/payrollReport/{clientId}/{payPeriodId}/generate | Generate or regenerate the payroll report for a pay period |
| [**v1GetAdditionalExpenses**](PayrollReportApi.md#v1getadditionalexpenses) | **GET** /api/v1/payrollReport/{clientId}/{payPeriodId}/additional-expenses | Get additional expense records for a pay period |
| [**v1GetAllocationReport**](PayrollReportApi.md#v1getallocationreport) | **GET** /api/v1/payrollReport/{clientId}/{payPeriodId}/allocation-report | Get the allocation report for a pay period |
| [**v1GetEmployeeExpenses**](PayrollReportApi.md#v1getemployeeexpenses) | **GET** /api/v1/payrollReport/{clientId}/{payPeriodId}/employee-expenses | Get employee expense records for a pay period |
| [**v1GetPayrollReport**](PayrollReportApi.md#v1getpayrollreport) | **GET** /api/v1/payrollReport/{clientId}/{payPeriodId} | Get the current payroll summary for a pay period grouped by employee |
| [**v1UpdateAdditionalExpenses**](PayrollReportApi.md#v1updateadditionalexpenses) | **PUT** /api/v1/payrollReport/{clientId}/{payPeriodId}/additional-expenses | Save additional expense records for a pay period |
| [**v1UpdateEmployeeExpenses**](PayrollReportApi.md#v1updateemployeeexpenses) | **PUT** /api/v1/payrollReport/{clientId}/{payPeriodId}/employee-expenses | Update a single employee expense record for a pay period |



## v1GenerateAllocationReport

> Array&lt;AllocationReportRow&gt; v1GenerateAllocationReport(clientId, payPeriodId)

Generate or regenerate the allocation report for a pay period

Reads current_hours, EmployeeExpenses, and AdditionalExpenses to calculate funding source allocations. Overwrites the AllocationReport tab and returns the results.

### Example

```ts
import {
  Configuration,
  PayrollReportApi,
} from '';
import type { V1GenerateAllocationReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayrollReportApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GenerateAllocationReportRequest;

  try {
    const data = await api.v1GenerateAllocationReport(body);
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

[**Array&lt;AllocationReportRow&gt;**](AllocationReportRow.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Allocation report generated successfully. Returns one row per funding source. |  -  |
| **404** | Client or pay period not found |  -  |
| **422** | Payroll report not yet generated, or no hours data found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GeneratePayrollReport

> v1GeneratePayrollReport(clientId, payPeriodId)

Generate or regenerate the payroll report for a pay period

Only processes timesheets that are Complete (both employee and supervisor signed). Archives the previous report tabs and writes fresh data.

### Example

```ts
import {
  Configuration,
  PayrollReportApi,
} from '';
import type { V1GeneratePayrollReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayrollReportApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GeneratePayrollReportRequest;

  try {
    const data = await api.v1GeneratePayrollReport(body);
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
| **200** | Payroll report generated successfully |  -  |
| **404** | Client or pay period not found |  -  |
| **422** | No Complete timesheets found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetAdditionalExpenses

> Array&lt;AdditionalExpense&gt; v1GetAdditionalExpenses(clientId, payPeriodId)

Get additional expense records for a pay period

### Example

```ts
import {
  Configuration,
  PayrollReportApi,
} from '';
import type { V1GetAdditionalExpensesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayrollReportApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GetAdditionalExpensesRequest;

  try {
    const data = await api.v1GetAdditionalExpenses(body);
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

[**Array&lt;AdditionalExpense&gt;**](AdditionalExpense.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of additional expense records |  -  |
| **404** | Client or pay period not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetAllocationReport

> Array&lt;AllocationReportRow&gt; v1GetAllocationReport(clientId, payPeriodId)

Get the allocation report for a pay period

### Example

```ts
import {
  Configuration,
  PayrollReportApi,
} from '';
import type { V1GetAllocationReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayrollReportApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GetAllocationReportRequest;

  try {
    const data = await api.v1GetAllocationReport(body);
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

[**Array&lt;AllocationReportRow&gt;**](AllocationReportRow.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Allocation report rows, one per funding source. Empty array if report has not been generated yet. |  -  |
| **404** | Client or pay period not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetEmployeeExpenses

> Array&lt;EmployeeExpense&gt; v1GetEmployeeExpenses(clientId, payPeriodId)

Get employee expense records for a pay period

### Example

```ts
import {
  Configuration,
  PayrollReportApi,
} from '';
import type { V1GetEmployeeExpensesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayrollReportApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GetEmployeeExpensesRequest;

  try {
    const data = await api.v1GetEmployeeExpenses(body);
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

[**Array&lt;EmployeeExpense&gt;**](EmployeeExpense.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of employee expense records |  -  |
| **404** | Client or pay period not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetPayrollReport

> { [key: string]: V1GetPayrollReport200ResponseValue; } v1GetPayrollReport(clientId, payPeriodId)

Get the current payroll summary for a pay period grouped by employee

### Example

```ts
import {
  Configuration,
  PayrollReportApi,
} from '';
import type { V1GetPayrollReportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayrollReportApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1GetPayrollReportRequest;

  try {
    const data = await api.v1GetPayrollReport(body);
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

[**{ [key: string]: V1GetPayrollReport200ResponseValue; }**](V1GetPayrollReport200ResponseValue.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Payroll report grouped by employee, with hourly and flat rate entries separated |  -  |
| **404** | Client or pay period not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateAdditionalExpenses

> v1UpdateAdditionalExpenses(clientId, payPeriodId, additionalExpense)

Save additional expense records for a pay period

### Example

```ts
import {
  Configuration,
  PayrollReportApi,
} from '';
import type { V1UpdateAdditionalExpensesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayrollReportApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // Array<AdditionalExpense>
    additionalExpense: ...,
  } satisfies V1UpdateAdditionalExpensesRequest;

  try {
    const data = await api.v1UpdateAdditionalExpenses(body);
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
| **additionalExpense** | `Array<AdditionalExpense>` |  | |

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
| **200** | Additional expenses saved |  -  |
| **404** | Client, pay period, or payroll report not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateEmployeeExpenses

> v1UpdateEmployeeExpenses(clientId, payPeriodId, employeeExpense)

Update a single employee expense record for a pay period

### Example

```ts
import {
  Configuration,
  PayrollReportApi,
} from '';
import type { V1UpdateEmployeeExpensesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayrollReportApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
    // EmployeeExpense
    employeeExpense: ...,
  } satisfies V1UpdateEmployeeExpensesRequest;

  try {
    const data = await api.v1UpdateEmployeeExpenses(body);
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
| **employeeExpense** | [EmployeeExpense](EmployeeExpense.md) |  | |

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
| **200** | Employee expense updated |  -  |
| **404** | Client, pay period, or payroll report not found |  -  |
| **422** | Employee has hours this pay period and cannot be marked inactive |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

