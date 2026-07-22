# SettingsApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1GetSettings**](SettingsApi.md#v1getsettings) | **GET** /api/v1/settings/{clientId} | Get settings for a client |
| [**v1UpdateSettings**](SettingsApi.md#v1updatesettings) | **PUT** /api/v1/settings/{clientId} | Update settings for a client |



## v1GetSettings

> Settings v1GetSettings(clientId)

Get settings for a client

### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { V1GetSettingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetSettingsRequest;

  try {
    const data = await api.v1GetSettings(body);
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

[**Settings**](Settings.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Client settings |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateSettings

> v1UpdateSettings(clientId, settings)

Update settings for a client

### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { V1UpdateSettingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  const body = {
    // string
    clientId: clientId_example,
    // Settings
    settings: ...,
  } satisfies V1UpdateSettingsRequest;

  try {
    const data = await api.v1UpdateSettings(body);
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
| **settings** | [Settings](Settings.md) |  | |

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
| **200** | Settings updated |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

