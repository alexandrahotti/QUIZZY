const dateFormat = require('dateformat')

const getCurrentYearMonthDayTime = function() {
  let now = new Date()
  now = dateFormat(now, 'yyyy-mm-dd hh:MM')
  return now
}

const getCurrentYearMonth = function() {
  const today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0
  const yyyy = today.getFullYear()

  if (dd < 10) {
    dd = `0${dd}`
  }

  if (mm < 10) {
    mm = `0${mm}`
  }

  const yearMonth = `${yyyy}-${mm}`
  return yearMonth
}

module.exports = {
  getCurrentYearMonthDayTime,
  getCurrentYearMonth
}
