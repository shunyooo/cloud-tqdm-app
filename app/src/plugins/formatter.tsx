import moment from "moment-timezone";
import "moment/min/locales";
const TIMEZONE = process.env.TIMEZONE;

export function numToDisplay(d: number): string {
  return d.toString().padStart(2, "0");
}

export function secondsToHms(d: number): string {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);

  const hDisplay = h > 0 ? numToDisplay(h) + ":" : "";
  const mDisplay = numToDisplay(m) + ":";
  const sDisplay = numToDisplay(s);
  return hDisplay + mDisplay + sDisplay;
}

export function dateWithAgo(date: Date, fromDayAgo = 1): string {
  // 直近の日付は「●日前」
  // 昔の日付は「2019年10月1日」のように整形する
  // fromDayAgo以降のdateは「直近」であるとする
  const _date = moment(date).tz(TIMEZONE);
  const beforeNow = moment().tz(TIMEZONE).subtract(fromDayAgo, "d");
  if (_date.isAfter(beforeNow)) {
    return _date.fromNow();
  } else {
    return _date.format("LL");
  }
}
