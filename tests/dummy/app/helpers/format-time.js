/* global moment */

// Cut down implementation of format-time to satisfy the calendar
// In our real apps this comes via i18n helpers
var FORMATS = {
  "calendar.monthTitle": 'MMM YYYY',
  "calendar.dayName":    'ddd',
  "calendar.dayNum":     'D'
};

import Ember from 'ember';

export function formatTime(time, key, options) {
  var localTime = moment.utc(time).local();
  return localTime.format(FORMATS[key]);
}

export default Ember.HTMLBars.makeBoundHelper(function(params, hash) {
  var time   = params[0];
  var format = params[1];
  return formatTime(time, format, hash);
});
