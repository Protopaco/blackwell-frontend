# ActivityApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1CreateActivity**](ActivityApi.md#v1createactivity) | **POST** /api/v1/activity/{clientId} | Create a new activity |
| [**v1DeleteActivity**](ActivityApi.md#v1deleteactivity) | **DELETE** /api/v1/activity/{clientId}/{activityId} | Delete an activity |
| [**v1GetActivities**](ActivityApi.md#v1getactivities) | **GET** /api/v1/activity/{clientId} | Get all activities for a client |
| [**v1UpdateActivity**](ActivityApi.md#v1updateactivity) | **PUT** /api/v1/activity/{clientId}/{activityId} | Update an existing activity |



## v1CreateActivity

> v1CreateActivity(clientId, activity)

Create a new activity

activityId is server-generated — ignored if present in the request body. fundingSources cannot have more than 3 entries, and the last entry\&#39;s percentage is always overwritten with the remainder needed to make the total exactly 100.

### Example

```ts
import {
  Configuration,
  ActivityApi,
} from '';
import type { V1CreateActivityRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ActivityApi();

  const body = {
    // string
    clientId: clientId_example,
    // Activity
    activity: ...,
  } satisfies V1CreateActivityRequest;

  try {
    const data = await api.v1CreateActivity(body);
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
| **201** | Activity created |  -  |
| **404** | Client not found |  -  |
| **422** | More than 3 funding sources were provided, or a referenced funding source does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1DeleteActivity

> v1DeleteActivity(clientId, activityId)

Delete an activity

### Example

```ts
import {
  Configuration,
  ActivityApi,
} from '';
import type { V1DeleteActivityRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ActivityApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    activityId: activityId_example,
  } satisfies V1DeleteActivityRequest;

  try {
    const data = await api.v1DeleteActivity(body);
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
| **200** | Activity deleted |  -  |
| **404** | Client or activity not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetActivities

> Array&lt;Activity&gt; v1GetActivities(clientId)

Get all activities for a client

### Example

```ts
import {
  Configuration,
  ActivityApi,
} from '';
import type { V1GetActivitiesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ActivityApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetActivitiesRequest;

  try {
    const data = await api.v1GetActivities(body);
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

[**Array&lt;Activity&gt;**](Activity.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of activities |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateActivity

> v1UpdateActivity(clientId, activityId, activity)

Update an existing activity

activityId is taken from the path — ignored if present in the request body. fundingSources cannot have more than 3 entries, and the last entry\&#39;s percentage is always overwritten with the remainder needed to make the total exactly 100.

### Example

```ts
import {
  Configuration,
  ActivityApi,
} from '';
import type { V1UpdateActivityRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ActivityApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    activityId: activityId_example,
    // Activity
    activity: ...,
  } satisfies V1UpdateActivityRequest;

  try {
    const data = await api.v1UpdateActivity(body);
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
| **200** | Activity updated |  -  |
| **404** | Client or activity not found |  -  |
| **422** | More than 3 funding sources were provided, or a referenced funding source does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

