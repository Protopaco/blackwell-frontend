# SupervisorApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1CreateSupervisor**](SupervisorApi.md#v1createsupervisor) | **POST** /api/v1/supervisor/{clientId} | Create a new supervisor |
| [**v1DeleteSupervisor**](SupervisorApi.md#v1deletesupervisor) | **DELETE** /api/v1/supervisor/{clientId}/{supervisorId} | Delete a supervisor |
| [**v1GetSupervisors**](SupervisorApi.md#v1getsupervisors) | **GET** /api/v1/supervisor/{clientId} | Get all supervisors for a client |
| [**v1UpdateSupervisor**](SupervisorApi.md#v1updatesupervisor) | **PUT** /api/v1/supervisor/{clientId}/{supervisorId} | Update an existing supervisor |



## v1CreateSupervisor

> v1CreateSupervisor(clientId, supervisor)

Create a new supervisor

supervisorId is server-generated — ignored if present in the request body.

### Example

```ts
import {
  Configuration,
  SupervisorApi,
} from '';
import type { V1CreateSupervisorRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SupervisorApi();

  const body = {
    // string
    clientId: clientId_example,
    // Supervisor
    supervisor: ...,
  } satisfies V1CreateSupervisorRequest;

  try {
    const data = await api.v1CreateSupervisor(body);
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
| **supervisor** | [Supervisor](Supervisor.md) |  | |

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
| **201** | Supervisor created |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1DeleteSupervisor

> v1DeleteSupervisor(clientId, supervisorId)

Delete a supervisor

### Example

```ts
import {
  Configuration,
  SupervisorApi,
} from '';
import type { V1DeleteSupervisorRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SupervisorApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    supervisorId: supervisorId_example,
  } satisfies V1DeleteSupervisorRequest;

  try {
    const data = await api.v1DeleteSupervisor(body);
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
| **supervisorId** | `string` |  | [Defaults to `undefined`] |

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
| **200** | Supervisor deleted |  -  |
| **404** | Client or supervisor not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetSupervisors

> Array&lt;Supervisor&gt; v1GetSupervisors(clientId)

Get all supervisors for a client

### Example

```ts
import {
  Configuration,
  SupervisorApi,
} from '';
import type { V1GetSupervisorsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SupervisorApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetSupervisorsRequest;

  try {
    const data = await api.v1GetSupervisors(body);
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

[**Array&lt;Supervisor&gt;**](Supervisor.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of supervisors |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateSupervisor

> v1UpdateSupervisor(clientId, supervisorId, supervisor)

Update an existing supervisor

supervisorId is taken from the path — ignored if present in the request body.

### Example

```ts
import {
  Configuration,
  SupervisorApi,
} from '';
import type { V1UpdateSupervisorRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SupervisorApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    supervisorId: supervisorId_example,
    // Supervisor
    supervisor: ...,
  } satisfies V1UpdateSupervisorRequest;

  try {
    const data = await api.v1UpdateSupervisor(body);
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
| **supervisorId** | `string` |  | [Defaults to `undefined`] |
| **supervisor** | [Supervisor](Supervisor.md) |  | |

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
| **200** | Supervisor updated |  -  |
| **404** | Client or supervisor not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

