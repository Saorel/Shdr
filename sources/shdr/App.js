// Generated by CoffeeScript 1.4.0
(function() {
  var App;

  App = (function() {

    App.UPDATE_ALL = 0;

    App.UPDATE_ENTER = 1;

    App.UPDATE_MANUAL = 2;

    function App(domEditor, domCanvas, conf) {
      var _this = this;
      if (conf == null) {
        conf = {};
      }
      this.conf = {
        update: App.UPDATE_ALL
      };
      this.extend(this.conf, conf);
      this.ui = new shdr.UI(this);
      this.editor = ace.edit(domEditor);
      this.editor.setFontSize("16px");
      this.editor.setTheme("ace/theme/monokai");
      this.editor.getSession().setTabSize(2);
      this.editor.getSession().setMode("ace/mode/glsl");
      this.editor.getSession().setUseWrapMode(true);
      this.viewer = new shdr.Viewer(this.byId(domCanvas));
      this.editor.getSession().setValue(this.viewer.fs);
      this.byId(domEditor).addEventListener('keyup', (function(e) {
        return _this.onEditorKey(e, false);
      }), false);
      this.byId(domEditor).addEventListener('keydown', (function(e) {
        return _this.onEditorKey(e, true);
      }), false);
      this.loop();
    }

    App.prototype.loop = function() {
      var _this = this;
      requestAnimationFrame(function() {
        return _this.loop();
      });
      return this.update();
    };

    App.prototype.update = function() {
      return this.viewer.update();
    };

    App.prototype.onEditorKey = function(e, override) {
      var bubble, update, _ref;
      if (override && this.conf.update !== App.UPDATE_MANUAL) {
        return;
      }
      if (!override && this.conf.update === App.UPDATE_MANUAL) {
        return;
      }
      _ref = this.needsUpdate(e.keyCode, e.ctrlKey, e.altKey), update = _ref[0], bubble = _ref[1];
      if (update) {
        this.viewer.updateShader(this.editor.getSession().getValue());
        if (!bubble) {
          e.cancelBubble = true;
          e.returnValue = false;
          if (typeof e.stopPropagation === "function") {
            e.stopPropagation();
          }
          if (typeof e.preventDefault === "function") {
            e.preventDefault();
          }
        }
        return bubble;
      } else {
        return true;
      }
    };

    App.prototype.needsUpdate = function(key, ctrl, alt) {
      switch (this.conf.update) {
        case App.UPDATE_ENTER:
          console.log("update-E");
          return [key === 13, true];
        case App.UPDATE_MANUAL:
          console.log("update-S");
          return [ctrl && key === 83, false];
        default:
          console.log("update-A");
          console.log(this.conf.update === App.UPDATE_ENTER);
          console.log(this.conf.update, App.UPDATE_ENTER);
          return [true, true];
      }
    };

    App.prototype.setUpdateMode = function(mode) {
      this.conf.update = parseInt(mode);
      return console.log("setUpdateMode: " + mode + " / " + this.conf.update + " / " + App.UPDATE_ENTER);
    };

    App.prototype.byId = function(id) {
      return document.getElementById(id);
    };

    App.prototype.extend = function(object, properties) {
      var key, val;
      for (key in properties) {
        val = properties[key];
        object[key] = val;
      }
      return object;
    };

    return App;

  })();

  this.shdr || (this.shdr = {});

  this.shdr.App = App;

}).call(this);
