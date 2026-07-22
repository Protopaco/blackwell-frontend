# TimesheetFolderApi

All URIs are relative to *http://localhost:3000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**v1CreateTimesheetFolder**](TimesheetFolderApi.md#v1createtimesheetfolder) | **POST** /api/v1/timesheetFolder/{clientId} | Create a new timesheet folder |
| [**v1GetTimesheetFolders**](TimesheetFolderApi.md#v1gettimesheetfolders) | **GET** /api/v1/timesheetFolder/{clientId} | Get all timesheet folders for a client |
| [**v1UpdateTimesheetFolder**](TimesheetFolderApi.md#v1updatetimesheetfolder) | **PUT** /api/v1/timesheetFolder/{clientId}/{timesheetFolderId} | Update a timesheet folder |



## v1CreateTimesheetFolder

> v1CreateTimesheetFolder(clientId, timesheetFolderCreateRequest)

Create a new timesheet folder

timesheetFolderId is server-generated, status is always created Active — both ignored if present in the request body. driveFolderLink is parsed and verified against Drive before being stored. 

### Example

```ts
import {
  Configuration,
  TimesheetFolderApi,
} from '';
import type { V1CreateTimesheetFolderRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TimesheetFolderApi();

  const body = {
    // string
    clientId: clientId_example,
    // TimesheetFolderCreateRequest
    timesheetFolderCreateRequest: ...,
  } satisfies V1CreateTimesheetFolderRequest;

  try {
    const data = await api.v1CreateTimesheetFolder(body);
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
| **timesheetFolderCreateRequest** | [TimesheetFolderCreateRequest](TimesheetFolderCreateRequest.md) |  | |

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
| **201** | TimesheetFolder created |  -  |
| **404** | Client not found, or the supplied driveFolderLink doesn\&#39;t resolve/is inaccessible |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1GetTimesheetFolders

> Array&lt;TimesheetFolder&gt; v1GetTimesheetFolders(clientId)

Get all timesheet folders for a client

### Example

```ts
import {
  Configuration,
  TimesheetFolderApi,
} from '';
import type { V1GetTimesheetFoldersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TimesheetFolderApi();

  const body = {
    // string
    clientId: clientId_example,
  } satisfies V1GetTimesheetFoldersRequest;

  try {
    const data = await api.v1GetTimesheetFolders(body);
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

[**Array&lt;TimesheetFolder&gt;**](TimesheetFolder.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of timesheet folders |  -  |
| **404** | Client not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## v1UpdateTimesheetFolder

> v1UpdateTimesheetFolder(clientId, timesheetFolderId, timesheetFolderUpdateRequest)

Update a timesheet folder

All body fields are optional; only what\&#39;s provided is changed. The Drive folder link/id is immutable after creation. 

### Example

```ts
import {
  Configuration,
  TimesheetFolderApi,
} from '';
import type { V1UpdateTimesheetFolderRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new TimesheetFolderApi();

  const body = {
    // string
    clientId: clientId_example,
    // string
    timesheetFolderId: timesheetFolderId_example,
    // TimesheetFolderUpdateRequest
    timesheetFolderUpdateRequest: ...,
  } satisfies V1UpdateTimesheetFolderRequest;

  try {
    const data = await api.v1UpdateTimesheetFolder(body);
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
| **timesheetFolderId** | `string` |  | [Defaults to `undefined`] |
| **timesheetFolderUpdateRequest** | [TimesheetFolderUpdateRequest](TimesheetFolderUpdateRequest.md) |  | |

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
| **200** | TimesheetFolder updated |  -  |
| **404** | Client or timesheet folder not found |  -  |
| **422** | Duplicate timesheet folder name, or driveFolderLink was supplied on update |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

