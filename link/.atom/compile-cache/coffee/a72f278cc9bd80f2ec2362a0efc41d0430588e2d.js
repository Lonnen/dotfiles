(function() {
  var CommandRunner, HLint, HLintViolation, LinterError, Point, Range, Violation, util, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  _ = require('lodash');

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  LinterError = require('../linter-error');

  util = require('../util');

  module.exports = HLint = (function() {
    HLint.canonicalName = 'HLint';

    function HLint(filePath) {
      this.filePath = filePath;
    }

    HLint.prototype.run = function(callback) {
      return this.runHLint(function(error, violations) {
        if (error != null) {
          return callback(error);
        } else {
          return callback(null, violations);
        }
      });
    };

    HLint.prototype.runHLint = function(callback) {
      var runner;
      runner = new CommandRunner(this.buildCommand());
      return runner.run(function(error, result) {
        var bufferPoint, bufferRange, col, file, item, items, line, msg, pattern, severity, violation, violations, _i, _len, _ref1, _ref2;
        if (error != null) {
          return callback(error);
        }
        if (result.exitCode === 0 || result.exitCode === 1) {
          pattern = /^(.+):(\d+):(\d+):\s*(Warning|Error):\s*([^]+)/;
          violations = [];
          items = result.stdout.split('\n\n');
          _ref1 = items.slice(0, -1);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            _ref2 = item.match(pattern).slice(1, 6), file = _ref2[0], line = _ref2[1], col = _ref2[2], severity = _ref2[3], msg = _ref2[4];
            bufferPoint = new Point(parseInt(line) - 1, parseInt(col) - 1);
            bufferRange = new Range(bufferPoint, bufferPoint);
            violation = new HLintViolation(severity.toLowerCase(), bufferRange, msg);
            violations.push(violation);
          }
          return callback(null, violations);
        } else {
          return callback(new LinterError("hlint exited with code " + result.exitCode, result));
        }
      });
    };

    HLint.prototype.buildCommand = function() {
      var command, userHLintPath;
      command = [];
      userHLintPath = atom.config.get('atom-lint.hlint.path');
      if (userHLintPath != null) {
        command.push(userHLintPath);
      } else {
        command.push('hlint');
      }
      command.push(this.filePath);
      return command;
    };

    return HLint;

  })();

  HLintViolation = (function(_super) {
    __extends(HLintViolation, _super);

    function HLintViolation() {
      return HLintViolation.__super__.constructor.apply(this, arguments);
    }

    HLintViolation.MESSAGE_PATTTERN = /^(.+)\nFound:\n(\x20{2}[\S\s]+)Why\x20not:\n(\x20{2}[\S\s]+)/;

    HLintViolation.prototype.getHTML = function() {
      var HTML, alternativeCode, foundCode, match, matches, message;
      matches = this.message.match(HLintViolation.MESSAGE_PATTTERN);
      if (matches == null) {
        return null;
      }
      match = matches[0], message = matches[1], foundCode = matches[2], alternativeCode = matches[3];
      HTML = _.escape(util.punctuate(message));
      HTML += '<div class="attachment">';
      HTML += '<p class="code-label">Found:</p>';
      HTML += this.formatSnippet(foundCode);
      HTML += '<p class="code-label">Why not:</p>';
      HTML += this.formatSnippet(alternativeCode);
      HTML += '</div>';
      return HTML;
    };

    HLintViolation.prototype.formatSnippet = function(snippet) {
      var line, lines, unindentedLines, unindentedSnippet;
      lines = snippet.split('\n');
      unindentedLines = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          _results.push(line.slice(2));
        }
        return _results;
      })();
      unindentedSnippet = unindentedLines.join('\n');
      return "<pre>" + (_.escape(unindentedSnippet)) + "</pre>";
    };

    return HLintViolation;

  })(Violation);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRmhCLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUpkLENBQUE7O0FBQUEsRUFLQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FMUCxDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsS0FBQyxDQUFBLGFBQUQsR0FBaUIsT0FBakIsQ0FBQTs7QUFFYSxJQUFBLGVBQUUsUUFBRixHQUFBO0FBQWEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQWI7SUFBQSxDQUZiOztBQUFBLG9CQUlBLEdBQUEsR0FBSyxTQUFDLFFBQUQsR0FBQTthQUNILElBQUMsQ0FBQSxRQUFELENBQVUsU0FBQyxLQUFELEVBQVEsVUFBUixHQUFBO0FBQ1IsUUFBQSxJQUFHLGFBQUg7aUJBQ0UsUUFBQSxDQUFTLEtBQVQsRUFERjtTQUFBLE1BQUE7aUJBR0UsUUFBQSxDQUFTLElBQVQsRUFBZSxVQUFmLEVBSEY7U0FEUTtNQUFBLENBQVYsRUFERztJQUFBLENBSkwsQ0FBQTs7QUFBQSxvQkFXQSxRQUFBLEdBQVUsU0FBQyxRQUFELEdBQUE7QUFDUixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxJQUFBLGFBQUEsQ0FBYyxJQUFDLENB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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/hlint.coffee