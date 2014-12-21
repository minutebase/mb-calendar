/* global moment */

import Ember from 'ember';

export default Ember.Component.extend({
  classNames: 'calendar',
  classNameBindings: ["selectableClass"],

  // attrs
  selected:     null,
  currentMonth: null,
  weekStart:   'monday', // optionally set to "sunday" for USA

  selectableClass: function() {
    if (this.get("select")) {
      return "calendar--selectable";
    }
  }.property(),

  defaultCurrentView: function() {
    var selected = this.get('selected');
    var current  = selected ? selected.clone() : moment.utc();
    this.set('currentMonth', current);
  }.on('init'),

  weekStartModifier: function() {
    if (this.get('weekStart') === 'monday') {
      return 'isoweek';
    } else {
      return 'week';
    }
  }.property('weekStart'),

  daysOfWeek: function() {
    var start = moment().startOf(this.get('weekStartModifier'));
    var days = [];
    for (var i=0; i<7; i++) {
      days.push(start.clone().add(i, 'days'));
    }
    return days;
  }.property('weekStartModifier'),

  weeks: function() {
    var current           = this.get('currentMonth');
    var startOfMonth      = current.startOf('month');
    var daysInMonth       = current.daysInMonth();
    var startModifier     = this.get('weekStartModifier');
    var daysFromWeekStart = current.diff(current.clone().startOf(startModifier), 'days');
    var weeksInMonth      = Math.ceil((daysInMonth + daysFromWeekStart) / 7);

    var weeks = [];
    for (var i=0; i<weeksInMonth; i++) {
      weeks.push(Week.create({
        date:     startOfMonth.clone().add(i, 'weeks').startOf(startModifier),
        calendar: this
      }));
    }
    return weeks;
  }.property('currentMonth', 'weekStartModifier'),

  actions: {
    showPrevMonth: function() {
      this.set('currentMonth', this.get('currentMonth').clone().subtract(1, 'months'));
    },

    showThisMonth: function() {
      this.set('currentMonth', moment.utc());
    },

    showNextMonth: function() {
      this.set('currentMonth', this.get('currentMonth').clone().add(1, 'months'));
    },

    selectDate: function(date) {
      this.sendAction("select", date);
    }
  }

});

var Week = Ember.Object.extend({
  date:     null,
  calendar: null,

  days: function() {
    var start    = this.get("date");
    var calendar = this.get("calendar");

    var days  = [];
    for (var i=0; i<7; i++) {
      days.push(Day.create({
        date:     start.clone().add(i, "days"),
        calendar: calendar
      }));
    }
    return days;
  }.property()
});

var Day = Ember.Object.extend({
  date:     null,
  calendar: null,

  isToday: function() {
    return this.get("date").isSame(moment.utc(), "day");
  }.property(),

  isSelected: function() {
    var selected = this.get("calendar.selected");
    return selected && selected.isSame(this.get("date"), "day");
  }.property("calendar.selected"),

  isWeekend: function() {
    var dow = this.get("date").day();
    return dow === 0 || dow === 6;
  }.property(),

  isOtherMonth: function() {
    return !this.get("date").isSame(this.get("calendar.currentMonth"), "month");
  }.property(),

  isTodayClass: function() {
    if (this.get("isToday")) {
      return "calendar__day--today";
    }
  }.property("isToday"),

  isSelectedClass: function() {
    if (this.get("isSelected")) {
      return "calendar__day--selected";
    }
  }.property("isSelected"),

  isOtherMonthClass: function() {
    if (this.get("isOtherMonth")) {
      return "calendar__day--other-month";
    }
  }.property("isOtherMonth"),

  isWeekendClass: function() {
    if (this.get("isWeekend")) {
      return "calendar__day--weekend";
    }
  }.property("isWeekend")
});
