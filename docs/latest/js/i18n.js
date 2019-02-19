(function(window) {
function I18N (selector){
  return this.init(selector);
}
I18N.prototype = {
  constructor: I18N,
  init: function(selector) {
    this.lang = [];
    this.data = null;
    this.langLabels = null;
    this.pages = {
      index: './locals/index.js',
      api: '../locals/api.js',
    };
    this.selector = document.querySelector(selector);
    this.type = this.getType();
    this.elems = this.getElems();
    this.addEvents();
    return this;
  },
  getType: function() {
    return localStorage.getItem('i18ntype') || 'en';
  },
  saveType: function(type){
    localStorage.setItem('i18ntype', this.type = type);
    return type;
  },
  getElems: function() {
    var elems = document.querySelectorAll('[i18n]');
    var result = [];
    for (var i = 0; i < elems.length; i++) {
      result.push({
        el: elems[i],
        key: elems[i].getAttribute('i18n')
      });
    }
    return result;
  },
  addEvents: function() {
    var that = this;
    that.selector && that.selector.addEventListener('change', function () {
      that.saveType(this.value);
      that.loadI18n();
    });
  },
  loadI18n: function (page, callback) {
    page = page || this.selector.getAttribute('i18n-page');
    var link = this.pages[page] || this.selector.getAttribute('i18n-link')
    if (link) {
      if (this.data) {
        jsonpI18n(this.data);
      } else {
        this.loadJs(link, callback);
      }
    }
  },
  loadJs: function (src, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    if (typeof (callback) != 'undefined') {
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null;
            callback();
          }
        }
      } else {
        script.onload = function () {
          callback();
        }
      }
    }
    script.src = src;
    document.body.appendChild(script);
  },
  langSelectorInit: function (data) {
    var labels = {};
    var options = [];
    var langs = [];
    for (var key in data) {
      labels[key] = data[key].__name__;
      data[key].__name__ && langs.push(key);
    }
    this.lang = langs;
    for (var i = 0; i < this.lang.length; i++) {
      labels[this.lang[i]] && options.push('<option value="' + this.lang[i] + '">' + labels[this.lang[i]] + '</option>');
    }
    this.data = data;
    this.langLabels = labels;
    this.selector.innerHTML = options.join('');
    this.selector.value = this.type;
  }
}
var i18n = new I18N('#i18n-list');
var jsonpI18n = window.jsonpI18n = function(data) {
  !i18n.data && i18n.langSelectorInit(data);
  var key;
  var obj = data[i18n.type] || {};
  var els = i18n.elems;
  for (var i = 0; i < els.length; i++) {
    key = els[i].key;
    els[i].el.innerHTML = obj[key] || data.default[key] || key;
  }
}
i18n.loadI18n();

})(window)
