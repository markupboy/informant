(function(window, $) {

  var Informant = function(scope, options) {
    this.options = $.extend({}, this.defaults, options)
    this.scope = $(scope);
    this.inform = false;
    this.init();
  };

  Informant.prototype = {
    init: function() {
      this.initialState = this.captureState();
      this.on();
    },

    on: function() {
      $(window).on('beforeunload.informant', function() {
        if(this.inform) {
          return this.options.message;
        }
      }.bind(this));

      this.scope.on('change.informant', function() {
        this.inform = this.initialState != this.captureState();
      }.bind(this));

      this.scope.on('submit.informant', function() {
        this.inform = false;
        this.initialState = this.captureState;
      }.bind(this));
    },

    off: function() {
      $(window).off('beforeunload.informant');
      this.scope.off('submit.informant change.informant');
    },

    captureState: function() {
      return this.scope.serialize();
    },

    defaults: {
      message: 'All unsaved changes will be lost.'
    }
  }

  $.fn.informant = function(options) {
    return $(this).each(function() {
      $(this).data('informant', new Informant(this, options));
    })
  }

})(window, jQuery)
