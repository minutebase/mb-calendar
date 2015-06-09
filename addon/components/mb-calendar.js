/* global moment */

import Ember from 'ember';

const Day = Ember.Object.extend({
  date:     null,
  calendar: null,

  isToday: Ember.computed({
    get() {
      return this.get("date").isSame(moment.utc(), "day");
    }
  }),

  isSelected: Ember.computed("calendar.selected", {
    get() {
      const selected = this.get("calendar.selected");
      return selected && selected.isSame(this.get("date"), "day");
    }
  }),

  isWeekend: Ember.computed({
    get() {
      const dow = this.get("date").day();
      return dow === 0 || dow === 6;
    }
  }),

  isOtherMonth: Ember.computed({
    get() {
      return !this.get("date").isSame(this.get("calendar.currentMonth"), "month");
    }
  }),

  isTodayClass: Ember.computed("isToday", {
    get() {
      if (this.get("isToday")) {
        return "calendar__day--today";
      }
    }
  }),

  isSelectedClass: Ember.computed("isSelected", {
    get() {
      if (this.get("isSelected")) {
        return "calendar__day--selected";
      }
    }
  }),

  isOtherMonthClass: Ember.computed("isOtherMonth", {
    get() {
      if (this.get("isOtherMonth")) {
        return "calendar__day--other-month";
      }
    }
  }),

  isWeekendClass: Ember.computed("isWeekend", {
    get() {
      if (this.get("isWeekend")) {
        return "calendar__day--weekend";
      }
    }
  })
});

const Week = Ember.Object.extend({
  date:     null,
  calendar: null,

  days: Ember.computed({
    get() {
      const start    = this.get("date");
      const calendar = this.get("calendar");

      const days = Ember.A();
      for (let i=0; i<7; i++) {
        days.push(Day.create({
          date:     start.clone().add(i, "days"),
          calendar: calendar
        }));
      }
      return days;
    }
  })
});

export default Ember.Component.extend({
  classNames: 'calendar',
  classNameBindings: ["selectableClass"],

  // attrs
  selected:     null,
  currentMonth: null,
  weekStart:   'monday', // optionally set to "sunday" for USA

  selectableClass: Ember.computed({
    get() {
      if (this.get("select")) {
        return "calendar--selectable";
      }
    }
  }),

  isThisMonth: Ember.computed("currentMonth", {
    get() {
      return this.get("currentMonth").isSame(moment.utc(), "month");
    }
  }),

  defaultCurrentView: Ember.on('init', function() {
    const selected = this.get('selected');
    const current  = selected ? selected.clone() : moment.utc();
    this.set('currentMonth', current);
  }),

  weekStartModifier: Ember.computed('weekStart', {
    get() {
      if (this.get('weekStart') === 'monday') {
        return 'isoweek';
      } else {
        return 'week';
      }
    }
  }),

  daysOfWeek: Ember.computed('weekStartModifier', {
    get() {
      const start = moment().startOf(this.get('weekStartModifier'));
      const days = Ember.A();
      for (let i=0; i<7; i++) {
        days.push(start.clone().add(i, 'days'));
      }
      return days;
    }
  }),

  weeks: Ember.computed('currentMonth', 'weekStartModifier', {
    get() {
      const current           = this.get('currentMonth');
      const startOfMonth      = current.startOf('month');
      const daysInMonth       = current.daysInMonth();
      const startModifier     = this.get('weekStartModifier');
      const daysFromWeekStart = current.diff(current.clone().startOf(startModifier), 'days');
      const weeksInMonth      = Math.ceil((daysInMonth + daysFromWeekStart) / 7);

      const weeks = Ember.A();
      for (let i=0; i<weeksInMonth; i++) {
        weeks.push(Week.create({
          date:     startOfMonth.clone().add(i, 'weeks').startOf(startModifier),
          calendar: this
        }));
      }
      return weeks;
    }
  }),

  actions: {
    showPrevMonth() {
      this.set('currentMonth', this.get('currentMonth').clone().subtract(1, 'months'));
    },

    showThisMonth() {
      this.set('currentMonth', moment.utc());
    },

    showNextMonth() {
      this.set('currentMonth', this.get('currentMonth').clone().add(1, 'months'));
    },

    selectDate(date) {
      this.sendAction("select", date);
    }
  }

});