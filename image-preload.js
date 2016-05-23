/*===================================
    OpenDigital FrontEnd Library
    Name: CheckboxUI - ODFC-ImagePreload
    Author: Xuong Luu
    License: Based on code of this article http://decodize.com/css/site-preloading-methods/
    Version: 1.0.0
    Documentation: 
        http://wip.projectuat.com/ODFC/
    Demo:
        http://wip.projectuat.com/ODFC/
===================================*/
;
(function($, window, document, undefined) {
  var pluginName = "imagePreload";
  defaults = {
    onImageCompleteLoading: function(percentage) {},
    onEachCompleteLoading: function(percentage) {},
    onBeforeLoading: function() {},
    onImageLoadingError: function(args){}
  };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.$e = $(this.element);
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function() {
      var _this = this,
          bgImg = [],
          img = [],
          count=0,
          percentage = 0,
          imgArray;

      if (typeof this.settings.onBeforeLoading == 'function') {
        this.settings.onBeforeLoading(this.$cb);
      }
      this.$e.find('*').filter(function() {
          var val = $(this).css('background-image').replace(/url\(/g,'').replace(/\)/,'').replace(/"/g,'');
          var imgVal = $(this).not('script').attr('src');
          //Getting urls of background images.
          if(val !== 'none' && !/linear-gradient/g.test(val) && $.inArray(val, bgImg) === -1){
              bgImg.push(val)
          }
          //Getting src of images in the document.
          if(imgVal !== undefined && $.inArray(imgVal, img) === -1){
              img.push(imgVal)
          }
      });
      //Merging both bg image array & img src array
      imgArray = bgImg.concat(img); 
      imgArray = $.unique(imgArray); 
      //Adding events for all the images in the array.
      $.each(imgArray, function(i,val){ 
        //Attaching load event 
        $("<img />").each(function() {
          if(this.complete) $(this).load();
        }).on("load", function () {
          count++;
          percentage = Math.floor(count / imgArray.length * 100);
          _this.settings.onEachCompleteLoading(percentage);

          //When percentage is 100 we will remove loader and display page.
          if(percentage === 100){
            _this.settings.onImageCompleteLoading(percentage);
          }
        }).on("error", function () {
            _this.settings.onImageLoadingError(this);
        }).attr("src", val);
      });
    }
  });

  $.fn[pluginName] = function(option, val) {
    this.each(function() {
      var options = typeof option == 'object' && option;
      new Plugin(this, options)
    });
    // chain jQuery functions
    return this;
  };

})(jQuery, window, document);