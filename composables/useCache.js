// TODO get this working

export const is10MinutesOld = (jsonTimestamp) => {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}
