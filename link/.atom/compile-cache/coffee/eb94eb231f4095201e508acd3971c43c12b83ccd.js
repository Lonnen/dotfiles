(function() {
  module.exports = {
    hexToRgb: function(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) {
        hex = hex.replace(/(.)(.)(.)/, "$1$1$2$2$3$3");
      }
      return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
    },
    hexaToRgb: function(hexa) {
      return this.hexToRgb((hexa.match(/rgba\((\#.+),/))[1]);
    },
    hexToHsl: function(hex) {
      hex = hex.replace('#', '');
      return this.rgbToHsl(this.hexToRgb(hex));
    },
    rgbToHex: function(rgb) {
      var _componentToHex;
      _componentToHex = function(component) {
        var _hex;
        _hex = component.toString(16);
        if (_hex.length === 1) {
          return "0" + _hex;
        } else {
          return _hex;
        }
      };
      return [_componentToHex(rgb[0]), _componentToHex(rgb[1]), _componentToHex(rgb[2])].join('');
    },
    rgbToHsl: function(_arg) {
      var b, g, r, _d, _h, _l, _max, _min, _s;
      r = _arg[0], g = _arg[1], b = _arg[2];
      r /= 255;
      g /= 255;
      b /= 255;
      _max = Math.max(r, g, b);
      _min = Math.min(r, g, b);
      _l = (_max + _min) / 2;
      if (_max === _min) {
        return [0, 0, Math.floor(_l * 100)];
      }
      _d = _max - _min;
      _s = _l > 0.5 ? _d / (2 - _max - _min) : _d / (_max + _min);
      switch (_max) {
        case r:
          _h = (g - b) / _d + (g < b ? 6 : 0);
          break;
        case g:
          _h = (b - r) / _d + 2;
          break;
        case b:
          _h = (r - g) / _d + 4;
      }
      _h /= 6;
      return [Math.floor(_h * 360), Math.floor(_s * 100), Math.floor(_l * 100)];
    },
    rgbToHsv: function(rgb) {
      var b, computedH, computedS, computedV, d, g, h, maxRGB, minRGB, r;
      if (typeof rgb === 'string') {
        rgb = rgb.match(/(\d+)/g);
      }
      r = rgb[0], g = rgb[1], b = rgb[2];
      computedH = 0;
      computedS = 0;
      computedV = 0;
      r = parseInt(("" + r).replace(/\s/g, ""), 10);
      g = parseInt(("" + g).replace(/\s/g, ""), 10);
      b = parseInt(("" + b).replace(/\s/g, ""), 10);
      if ((r == null) || (g == null) || (b == null) || isNaN(r) || isNaN(g) || isNaN(b)) {
        alert("Please enter numeric RGB values!");
        return;
      }
      if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
        alert("RGB values must be in the range 0 to 255.");
        return;
      }
      r = r / 255;
      g = g / 255;
      b = b / 255;
      minRGB = Math.min(r, Math.min(g, b));
      maxRGB = Math.max(r, Math.max(g, b));
      if (minRGB === maxRGB) {
        computedV = minRGB;
        return [0, 0, computedV];
      }
      d = (r === minRGB ? g - b : (b === minRGB ? r - g : b - r));
      h = (r === minRGB ? 3 : (b === minRGB ? 1 : 5));
      computedH = 60 * (h - d / (maxRGB - minRGB));
      computedS = (maxRGB - minRGB) / maxRGB;
      computedV = maxRGB;
      return [computedH, computedS, computedV];
    },
    hsvToHsl: function(_arg) {
      var h, s, v;
      h = _arg[0], s = _arg[1], v = _arg[2];
      return [h, s * v / ((h = (2 - s) * v) < 1 ? h : 2 - h), h / 2];
    },
    hslToHsv: function(_arg) {
      var h, l, s;
      h = _arg[0], s = _arg[1], l = _arg[2];
      s *= l < .5 ? l : 1 - l;
      return [h, 2 * s / (l + s), l + s];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBSUk7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBSUk7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEdBQUQsR0FBQTtBQUNOLE1BQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FBWixFQUFpQixFQUFqQixDQUFOLENBQUE7QUFDQSxNQUFBLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFqQjtBQUF3QixRQUFBLEdBQUEsR0FBTSxHQUFHLENBQUMsT0FBSixDQUFZLFdBQVosRUFBeUIsY0FBekIsQ0FBTixDQUF4QjtPQURBO0FBR0EsYUFBTyxDQUNGLFFBQUEsQ0FBVSxHQUFHLENBQUMsTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLENBQVYsRUFBNEIsRUFBNUIsQ0FERSxFQUVGLFFBQUEsQ0FBVSxHQUFHLENBQUMsTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLENBQVYsRUFBNEIsRUFBNUIsQ0FGRSxFQUdGLFFBQUEsQ0FBVSxHQUFHLENBQUMsTUFBSixDQUFXLENBQVgsRUFBYyxDQUFkLENBQVYsRUFBNEIsRUFBNUIsQ0FIRSxDQUFQLENBSk07SUFBQSxDQUFWO0FBQUEsSUFhQSxTQUFBLEVBQVcsU0FBQyxJQUFELEdBQUE7QUFDUCxhQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsQ0FBQyxJQUFJLENBQUMsS0FBTCxDQUFXLGVBQVgsQ0FBRCxDQUE2QixDQUFBLENBQUEsQ0FBdkMsQ0FBUCxDQURPO0lBQUEsQ0FiWDtBQUFBLElBbUJBLFFBQUEsRUFBVSxTQUFDLEdBQUQsR0FBQTtBQUNOLE1BQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxPQUFKLENBQVksR0FBWixFQUFpQixFQUFqQixDQUFOLENBQUE7QUFDQSxhQUFPLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLFFBQUQsQ0FB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
//# sourceURL=/Users/lonnen/.atom/packages/color-picker/lib/ColorPicker-convert.coffee