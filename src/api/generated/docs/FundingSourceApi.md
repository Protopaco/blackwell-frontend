# FundingSourceApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1CreateFundingSource**](FundingSourceApi.md#v1createfundingsource) | **POST** /api/v1/fundingSource/{clientId} | Create a new funding source |
| [**v1DeleteFundingSource**](FundingSourceApi.md#v1deletefundingsource) | **DELETE** /api/v1/fundingSource/{clientId}/{fundingSourceId} | Delete a funding source |
| [**v1GetFundingSources**](FundingSourceApi.md#v1getfundingsources) | **GET** /api/v1/fundingSource/{clientId} | Get all funding sources for a client |
| [**v1UpdateFundingSource**](FundingSourceApi.md#v1updatefundingsource) | **PUT** /api/v1/fundingSource/{clientId}/{fundingSourceId} | Update an existing funding source |



## v1CreateFundingSource

> v1CreateFundingSource(clientId, fundingSource)

Create a new funding source

fundingSourceId is server-generated — ignored if present in the request body.

### Example

```ts
import {
  Configuration,
  FundingSourceApi,
} from '';
import type { V1CreateFundingSourceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FundingSourceApi();

  const body = {
    // string
    clientId: clientId_example,
    // FundingSource
    fundingSource: ...,
  } satisfies V1CreateFundingSourceRequest;

  try {
    const data = await api.v1CreateFundingSource(body);
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
| **fundingSource** | [FundingSource](FundingSource.md) |  | |

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
| **201** | Funding source created |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1DeleteFundingSource

> v1DeleteFundingSource(clientId, fundingSourceId)

Delete a funding source

### Example

```ts
import {
  Configuration,
  FundingSourceApi,
} from '';
import type { V1DeleteFundingSourceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FundingSourceApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    fundingSourceId: fundingSourceId_example,
  } satisfies V1DeleteFundingSourceRequest;

  try {
    const data = await api.v1DeleteFundingSource(body);
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
| **200** | Funding source deleted |  -  |
| **404** | Client or funding source not found |  -  |
| **422** | Funding source is still referenced by one or more activities |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetFundingSources

> Array&lt;FundingSource&gt; v1GetFundingSources(clientId)

Get all funding sources for a client

### Example

```ts
import {
  Configuration,
  FundingSourceApi,
} from '';
import type { V1GetFundingSourcesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FundingSourceApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetFundingSourcesRequest;

  try {
    const data = await api.v1GetFundingSources(body);
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

[**Array&lt;FundingSource&gt;**](FundingSource.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of funding sources |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateFundingSource

> v1UpdateFundingSource(clientId, fundingSourceId, fundingSource)

Update an existing funding source

fundingSourceId is taken from the path — ignored if present in the request body.

### Example

```ts
import {
  Configuration,
  FundingSourceApi,
} from '';
import type { V1UpdateFundingSourceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FundingSourceApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    fundingSourceId: fundingSourceId_example,
    // FundingSource
    fundingSource: ...,
  } satisfies V1UpdateFundingSourceRequest;

  try {
    const data = await api.v1UpdateFundingSource(body);
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
| **fundingSourceId** | `string` |  | [Defaults to `undefined`] |
| **fundingSource** | [FundingSource](FundingSource.md) |  | |

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
| **200** | Funding source updated |  -  |
| **404** | Client or funding source not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

