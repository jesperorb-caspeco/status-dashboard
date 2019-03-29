export const defaultPollingRate = 60000;

export enum System {
  WebPlatform = "WebPlatform",
  MARC = "MARC",
  ReverseProxy = "ReverseProxy",
}

export enum Task {
  UnitTest = "Unit",
  IntegrationTest = "Integration",
  Build = "Build",
  Live = "Live",
}

export enum ResponseCode {
  Success = "Success",
  Failed = "Failed",
  Unknown = "Unknown",
}

export interface Status {
  system: System;
  task: Task;
  url: string;
  status: ResponseCode;
  time?: number;
  days?: number;
  hours?: number;
  minutes?: number;
}

export async function getStatus(status: Status) {
  try {
    const response = await fetch(status.url);
    const badge = await response.text();
    const isLiveAndWell = status.task === Task.Live && response.ok;
    if (status.system === System.ReverseProxy && response.ok) {
      return success(status);
    }
    if (status.system === System.MARC && isLiveAndWell) {
      return success(status);
    }
    if (status.system === System.WebPlatform && isLiveAndWell) {
      return success(status);
    }
    if (badge.includes("succeeded") && response.ok) {
      return success(status);
    }
    if (badge.includes("failed")) {
      return failed(status);
    }
    return unknown(status);
  } catch (error) {
    return failed(status);
  }
}

export function getStatusesFromLocalStorage(): Status[] {
  try {
    const statuses = localStorage.getItem("statuses");
    if (statuses) {
      return JSON.parse(statuses);
    }
    return [];
  } catch(error) {
      return [];
  }
}

export function setStatusesInLocalStorage(statuses: Status[]): void {
  localStorage.setItem("statuses", JSON.stringify(statuses));
}

export function saveTheme(checked: boolean) {
  localStorage.setItem("theme", checked.toString());
}

export function getTheme() {
  const theme = localStorage.getItem("theme");
  return theme === "false" ? false : true;
}

export async function allStatuses(urls: Status[]) {
  return Promise.all(urls.map(getStatus));
}

function assignStatus(status: Status, responseCode: ResponseCode) {
  return Object.assign({}, status, { status: responseCode, time: Date.now() });
}

function success(status: Status) {
  return assignStatus(status, ResponseCode.Success);
}

function failed(status: Status) {
  return assignStatus(status, ResponseCode.Failed);
}

function unknown(status: Status) {
  return assignStatus(status, ResponseCode.Unknown);
}

export function compareStatuses(previousStatuses: Status[], newStatuses: Status[]) {
  if (previousStatuses.length > 0 && newStatuses.length > 0) {
    const newSorted = newStatuses.sort(sortByName);
    const previousSorted = previousStatuses.sort(sortByName);
    const newDate = Date.now();
    return newSorted.map((s, i) =>
      s.status !== previousSorted[i].status
        ? Object.assign(s, {
            time: newDate,
            days: getDays(newDate),
            hours: getHours(newDate),
            minutes: getMinutes(newDate),
          })
        : Object.assign(s, {
            time: previousSorted[i].time,
            days: getDays(newDate),
            hours: getHours(previousSorted[i].time),
            minutes: getMinutes(previousSorted[i].time),
          })
    );
  }
  return newStatuses;
}

function sortByName(a: Status, b: Status): number {
  if (a.system + a.task < b.system + b.task) {
    return -1;
  }
  if (a.system + a.task > b.system + b.task) {
    return 1;
  }
  return 0;
}

function getMinutes(past: number | undefined): number {
  const time = past || new Date().getTime();
  return Math.round((Math.abs(new Date().getTime() - time) / (1000 * 60)) % 60);
}

function getHours(past: number | undefined): number {
  const time = past || new Date().getTime();
  return Math.floor((Math.abs(new Date().getTime() - time) / (1000 * 60 * 60)) % 24);
}

function getDays(past: number | undefined): number {
  const time = past || new Date().getTime();
  return Math.floor((Math.abs(new Date().getTime() - time) / (1000 * 60 * 60 * 24)) % 24);
}
