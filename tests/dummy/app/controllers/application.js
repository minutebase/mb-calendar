import Ember from 'ember';

export default Ember.Controller.extend({
  someDate: null,

  actions: {
    dateSelected: function(date) {
      this.set("someDate", date);
    }
  }
});