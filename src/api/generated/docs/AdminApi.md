# AdminApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1ClearCache**](AdminApi.md#v1clearcache) | **POST** /api/v1/admin/cache/clear | Clear all in-memory caches and force fresh reads from Google Sheets |



## v1ClearCache

> v1ClearCache()

Clear all in-memory caches and force fresh reads from Google Sheets

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { V1ClearCacheRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  try {
    const data = await api.v1ClearCache();
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

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Cache cleared |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

