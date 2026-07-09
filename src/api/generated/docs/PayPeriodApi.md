# PayPeriodApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1ClosePayPeriod**](PayPeriodApi.md#v1closepayperiod) | **PATCH** /api/v1/payPeriod/{clientId}/{payPeriodId}/close | Close a pay period |
| [**v1CreatePayPeriod**](PayPeriodApi.md#v1createpayperiod) | **POST** /api/v1/payPeriod/{clientId} | Create a new pay period |
| [**v1GetNextPayPeriod**](PayPeriodApi.md#v1getnextpayperiod) | **GET** /api/v1/payPeriod/{clientId}/next | Get suggested next pay period for a client |
| [**v1GetPayPeriodById**](PayPeriodApi.md#v1getpayperiodbyid) | **GET** /api/v1/payPeriod/{clientId}/{payPeriodId} | Get a single pay period by ID |
| [**v1GetPayPeriods**](PayPeriodApi.md#v1getpayperiods) | **GET** /api/v1/payPeriod/{clientId} | Get all pay periods for a client |
| [**v1UpdatePayPeriod**](PayPeriodApi.md#v1updatepayperiod) | **PUT** /api/v1/payPeriod/{clientId}/{payPeriodId} | Update an existing pay period |



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


## v1UpdatePayPeriod

> v1UpdatePayPeriod(clientId, payPeriodId)

Update an existing pay period

### Example

```ts
import {
  Configuration,
  PayPeriodApi,
} from '';
import type { V1UpdatePayPeriodRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PayPeriodApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    payPeriodId: payPeriodId_example,
  } satisfies V1UpdatePayPeriodRequest;

  try {
    const data = await api.v1UpdatePayPeriod(body);
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
| **200** | Pay period updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

