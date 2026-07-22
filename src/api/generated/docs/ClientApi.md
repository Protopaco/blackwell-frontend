# ClientApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1CreateClient**](ClientApi.md#v1createclient) | **POST** /api/v1/client | Create a new client |
| [**v1GetClientSummary**](ClientApi.md#v1getclientsummary) | **GET** /api/v1/client/{clientId}/summary | Get a summary of a client\&#39;s payroll config (employees, supervisors, activities, funding sources, holidays, settings) |
| [**v1GetClients**](ClientApi.md#v1getclients) | **GET** /api/v1/client | Get all clients |
| [**v1UpdateClient**](ClientApi.md#v1updateclient) | **PUT** /api/v1/client/{clientId} | Update a client |



## v1CreateClient

> Client v1CreateClient(clientCreateRequest)

Create a new client

Provisions the full Drive/Sheets infrastructure for a new client (folders, PayrollConfig workbook, PayPeriodRegistry workbook) then appends the Clients row. clientId, status, and all folder/file ID fields are server-generated or server-resolved — ignored if present in the request body. Unlike other create endpoints, this returns the full created Client since the caller has no other way to retrieve the generated folder/file IDs. 

### Example

```ts
import {
  Configuration,
  ClientApi,
} from '';
import type { V1CreateClientRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientApi();

  const body = {
    // ClientCreateRequest
    clientCreateRequest: ...,
  } satisfies V1CreateClientRequest;

  try {
    const data = await api.v1CreateClient(body);
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
| **clientCreateRequest** | [ClientCreateRequest](ClientCreateRequest.md) |  | |

### Return type

[**Client**](Client.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Client created |  -  |
| **404** | A supplied existing-folder link does not resolve or is inaccessible |  -  |
| **422** | Duplicate clientCode, create-new name collision, or malformed request |  -  |

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


## v1UpdateClient

> v1UpdateClient(clientId, clientUpdateRequest)

Update a client

Only status, clientName, and clientCode are editable — all other fields (folder/file IDs) are set once at creation. All body fields are optional; only what\&#39;s provided is changed. 

### Example

```ts
import {
  Configuration,
  ClientApi,
} from '';
import type { V1UpdateClientRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ClientApi();

  const body = {
    // string
    clientId: clientId_example,
    // ClientUpdateRequest
    clientUpdateRequest: ...,
  } satisfies V1UpdateClientRequest;

  try {
    const data = await api.v1UpdateClient(body);
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
| **clientUpdateRequest** | [ClientUpdateRequest](ClientUpdateRequest.md) |  | |

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
| **200** | Client updated |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

