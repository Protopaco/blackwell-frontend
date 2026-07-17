# HolidayApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1CreateHoliday**](HolidayApi.md#v1createholiday) | **POST** /api/v1/holiday/{clientId} | Create a new holiday |
| [**v1DeleteHoliday**](HolidayApi.md#v1deleteholiday) | **DELETE** /api/v1/holiday/{clientId}/{holidayId} | Delete a holiday |
| [**v1GetHolidays**](HolidayApi.md#v1getholidays) | **GET** /api/v1/holiday/{clientId} | Get all holidays for a client |
| [**v1UpdateHoliday**](HolidayApi.md#v1updateholiday) | **PUT** /api/v1/holiday/{clientId}/{holidayId} | Update an existing holiday |



## v1CreateHoliday

> v1CreateHoliday(clientId, holiday)

Create a new holiday

holidayId is server-generated — ignored if present in the request body.

### Example

```ts
import {
  Configuration,
  HolidayApi,
} from '';
import type { V1CreateHolidayRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HolidayApi();

  const body = {
    // string
    clientId: clientId_example,
    // Holiday
    holiday: ...,
  } satisfies V1CreateHolidayRequest;

  try {
    const data = await api.v1CreateHoliday(body);
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
| **holiday** | [Holiday](Holiday.md) |  | |

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
| **201** | Holiday created |  -  |
| **404** | Client not found |  -  |
| **422** | holidayDate is not a valid YYYY-MM-DD date |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1DeleteHoliday

> v1DeleteHoliday(clientId, holidayId)

Delete a holiday

### Example

```ts
import {
  Configuration,
  HolidayApi,
} from '';
import type { V1DeleteHolidayRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HolidayApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    holidayId: holidayId_example,
  } satisfies V1DeleteHolidayRequest;

  try {
    const data = await api.v1DeleteHoliday(body);
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
| **holidayId** | `string` |  | [Defaults to `undefined`] |

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
| **200** | Holiday deleted |  -  |
| **404** | Client or holiday not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetHolidays

> Array&lt;Holiday&gt; v1GetHolidays(clientId)

Get all holidays for a client

### Example

```ts
import {
  Configuration,
  HolidayApi,
} from '';
import type { V1GetHolidaysRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HolidayApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetHolidaysRequest;

  try {
    const data = await api.v1GetHolidays(body);
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

[**Array&lt;Holiday&gt;**](Holiday.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of holidays |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateHoliday

> v1UpdateHoliday(clientId, holidayId, holiday)

Update an existing holiday

holidayId is taken from the path — ignored if present in the request body.

### Example

```ts
import {
  Configuration,
  HolidayApi,
} from '';
import type { V1UpdateHolidayRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HolidayApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    holidayId: holidayId_example,
    // Holiday
    holiday: ...,
  } satisfies V1UpdateHolidayRequest;

  try {
    const data = await api.v1UpdateHoliday(body);
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
| **holidayId** | `string` |  | [Defaults to `undefined`] |
| **holiday** | [Holiday](Holiday.md) |  | |

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
| **200** | Holiday updated |  -  |
| **404** | Client or holiday not found |  -  |
| **422** | holidayDate is not a valid YYYY-MM-DD date |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

