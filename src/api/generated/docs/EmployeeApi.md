# EmployeeApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1CreateEmployee**](EmployeeApi.md#v1createemployee) | **POST** /api/v1/employee/{clientId} | Create a new employee |
| [**v1GetEmployees**](EmployeeApi.md#v1getemployees) | **GET** /api/v1/employee/{clientId} | Get all employees for a client |
| [**v1UpdateEmployee**](EmployeeApi.md#v1updateemployee) | **PUT** /api/v1/employee/{clientId}/{employeeId} | Update an existing employee |



## v1CreateEmployee

> v1CreateEmployee(clientId, employeeCreateRequest)

Create a new employee

employeeId is server-generated — ignored if present in the request body. Exactly one of timesheetFileId (existing file, used as-is) or timesheetFolderId (must be an Active TimesheetFolder configured for this client — a new timesheet workbook is provisioned there) must be provided. 

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { V1CreateEmployeeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // string
    clientId: clientId_example,
    // EmployeeCreateRequest
    employeeCreateRequest: ...,
  } satisfies V1CreateEmployeeRequest;

  try {
    const data = await api.v1CreateEmployee(body);
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
| **employeeCreateRequest** | [EmployeeCreateRequest](EmployeeCreateRequest.md) |  | |

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
| **201** | Employee created |  -  |
| **404** | Client not found, or timesheetFolderId doesn\&#39;t match an Active TimesheetFolder |  -  |
| **422** | Neither timesheetFileId nor timesheetFolderId was provided |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetEmployees

> Array&lt;Employee&gt; v1GetEmployees(clientId)

Get all employees for a client

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { V1GetEmployeesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetEmployeesRequest;

  try {
    const data = await api.v1GetEmployees(body);
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

[**Array&lt;Employee&gt;**](Employee.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of employees |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateEmployee

> v1UpdateEmployee(clientId, employeeId, employee)

Update an existing employee

employeeId is taken from the path — ignored if present in the request body. timesheetFileId can be changed here (e.g. to correct a mistake).

### Example

```ts
import {
  Configuration,
  EmployeeApi,
} from '';
import type { V1UpdateEmployeeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new EmployeeApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    employeeId: employeeId_example,
    // Employee
    employee: ...,
  } satisfies V1UpdateEmployeeRequest;

  try {
    const data = await api.v1UpdateEmployee(body);
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
| **employeeId** | `string` |  | [Defaults to `undefined`] |
| **employee** | [Employee](Employee.md) |  | |

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
| **200** | Employee updated |  -  |
| **404** | Client or employee not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

