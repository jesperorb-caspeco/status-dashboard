import { Status, System, Task, ResponseCode } from "./index";

export const URLS: Status[] = [
  {
    system: System.MARC,
    task: Task.Build,
    url:
      "https://caspecodev.visualstudio.com/Cloud/_apis/build/status/MARC%20Build%20&%20Deploy%20Trackingdev",
    status: ResponseCode.Unknown,
  },
  {
    system: System.WebPlatform,
    task: Task.Build,
    url:
      "https://caspecodev.visualstudio.com/Cloud/_apis/build/status/WEBPLATFORM%20Build%20&%20Deploy%20Trackingdev",
    status: ResponseCode.Unknown,
  },
  {
    system: System.MARC,
    task: Task.Live,
    url: "https://cloud.caspeco.se/api/test/get",
    status: ResponseCode.Unknown,
  },
  {
    system: System.WebPlatform,
    task: Task.Live,
    url: "https://cloud.caspeco.se",
    status: ResponseCode.Unknown,
  },
  {
    system: System.MARC,
    task: Task.IntegrationTest,
    url:
      "https://caspecodev.visualstudio.com/Cloud/_apis/build/status/MARC%20Build%20&%20IntegrationTest",
    status: ResponseCode.Unknown,
  },
  {
    system: System.WebPlatform,
    task: Task.IntegrationTest,
    url:
      "https://caspecodev.visualstudio.com/Cloud/_apis/build/status/WEBPLATFORM%20Build%20&%20Test",
    status: ResponseCode.Unknown,
  },
  {
    system: System.MARC,
    task: Task.UnitTest,
    url:
      "https://caspecodev.visualstudio.com/Cloud/_apis/build/status/MARC%20Build%20&%20Unit%20Test",
    status: ResponseCode.Unknown,
  },
  {
    system: System.ReverseProxy,
    task: Task.Live,
    url: "https://cloud.caspeco.se/.where",
    status: ResponseCode.Unknown,
  },
];
