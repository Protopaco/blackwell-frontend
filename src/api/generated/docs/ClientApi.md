# ClientApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1GetClientEmployees**](ClientApi.md#v1getclientemployees) | **GET** /api/v1/client/{clientId}/employees | Get all employees for a client |
| [**v1GetClientSummary**](ClientApi.md#v1getclientsummary) | **GET** /api/v1/client/{clientId}/summary | Get a summary of a client\&#39;s payroll config (employees, supervisors, activities, funding sources, holidays, settings) |
| [**v1GetClients**](ClientApi.md#v1getclients) | **GET** /api/v1/client | Get all clients |



## v1GetClientEmployees

> Array&lt;Employee&gt; v1GetClientEmployees(clientId)

Get all employees for a client

### Example

```ts
import {
  Configuration,
  ClientApi,
} from '';
import type { V1GetClientEmployeesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetClientEmployeesRequest;

  try {
    const data = await api.v1GetClientEmployees(body);
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

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetClientSummary

> ClientSummary v1GetClientSummary(clientId)

Get a summary of a client\&#39;s payroll config (employees, supervisors, activities, funding sources, holidays, settings)

### Example

```ts
import {
  Configuration,
  ClientApi,
} from '';
import type { V1GetClientSummaryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetClientSummaryRequest;

  try {
    const data = await api.v1GetClientSummary(body);
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

[**ClientSummary**](ClientSummary.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Client summary |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetClients

> Array&lt;Client&gt; v1GetClients()

Get all clients

### Example

```ts
import {
  Configuration,
  ClientApi,
} from '';
import type { V1GetClientsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientApi();

  try {
    const data = await api.v1GetClients();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;Client&gt;**](Client.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of clients |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

