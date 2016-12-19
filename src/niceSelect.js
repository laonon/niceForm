/**  
 * 美化select jquery 插件
 * https://github.com/hernansartorio/jquery-nice-select  
 * Made by Hernán Sartorio  
 */

;
(function($) {
  //美化select
  $.fn.niceSelect = function(method) {

    var selectNodes = this;

    // 方法
    if (typeof method == 'string') {
      if (method == 'update') {
        selectNodes.each(function() {
          var $select = $(this);
          var $dropdown = $(this).next('.nice-select');
          var open = $dropdown.hasClass('open');

          if ($dropdown.length) {
            $dropdown.remove();
            create_nice_select($select);

            if (open) {
              $select.next().trigger('click');
            }
          }
        });
      } else if (method == 'destroy') {
        selectNodes.each(function() {
          var $select = $(this);
          var $dropdown = $(this).next('.nice-select');

          if ($dropdown.length) {
            $dropdown.remove();
            $select.css('display', '');
          }
        });
        if ($('.nice-select').length == 0) {
          $(document).off('.nice_select');
        }
      } else {
        console.warn('方法 "' + method + '" 不存在.')
      }
      return this;
    }

    // 隐藏原生select
    selectNodes.hide();

    // 创建自定义
    this.each(function() {
      var $select = $(this);

      if (!$select.next().hasClass('nice-select')) {
        create_nice_select($select);
      }
    });

    function create_nice_select($select) {
      $select.after($('<div></div>')
        .addClass('nice-select')
        .addClass($select.attr('class') || '')
        .addClass($select.attr('disabled') ? 'disabled' : '')
        .attr('tabindex', $select.attr('disabled') ? null : '0')
        .html('<span class="current"></span><ul class="list"></ul>')
      );

      var $dropdown = $select.next();
      var $options = $select.find('option');
      var $selected = $select.find('option:selected');

      $dropdown.find('.current').html($selected.data('display') ||  $selected.text());

      $options.each(function(i) {
        var $option = $(this);
        var display = $option.data('display');

        $dropdown.find('ul').append($('<li></li>')
          .attr('data-value', $option.val())
          .attr('data-display', (display || null))
          .addClass('option' +
            ($option.is(':selected') ? ' selected' : '') +
            ($option.is(':disabled') ? ' disabled' : ''))
          .html($option.text())
        );
      });
    }

    /* 事件监听 */

    // 在插件初始化前解绑事件
    $(document).off('.nice_select');

    // 展开/闭合
    $(document).on('click.nice_select', '.nice-select', function(event) {
      if ($(this).hasClass('disabled') || $(this).attr('disabled')) {
        return
      }
      var $dropdown = $(this);

      $('.nice-select').not($dropdown).removeClass('open');
      $dropdown.toggleClass('open');

      if ($dropdown.hasClass('open')) {
        $dropdown.find('.option');
        $dropdown.find('.focus').removeClass('focus');
        $dropdown.find('.selected').addClass('focus');
      } else {
        $dropdown.focus();
      }
    });

    // 点击其它区域关闭
    $(document).on('click.nice_select', function(event) {
      if ($(this).hasClass('disabled') || $(this).attr('disabled')) {
        return
      }

      if ($(event.target).closest('.nice-select').length === 0) {
        $('.nice-select').removeClass('open').find('.option');
      }
    });

    // 选择option
    $(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {

      if ($(this).hasClass('disabled') || $(this).attr('disabled')) {
        return
      }

      var $option = $(this);
      var $dropdown = $option.closest('.nice-select');

      $dropdown.find('.selected').removeClass('selected');
      $option.addClass('selected');

      var text = $option.data('display') || $option.text();
      $dropdown.find('.current').text(text);

      $dropdown.prev('select').val($option.data('value')).trigger('change');
    });

    // 键盘事件
    $(document).on('keydown.nice_select', '.nice-select', function(event) {
      var $dropdown = $(this);
      var $focused_option = $($dropdown.find('.focus') || $dropdown.find('.list .option.selected'));

      switch (event.keyCode) {
        case 13:
        case 32: //回车或空格
          if ($dropdown.hasClass('open')) {
            $focused_option.trigger('click');
          } else {
            $dropdown.trigger('click');
          }
          return false;
          break;
        case 40: //向下
          if (!$dropdown.hasClass('open')) {
            $dropdown.trigger('click');
          } else {
            var $next = $focused_option.nextAll('.option:not(.disabled)').first();
            if ($next.length > 0) {
              $dropdown.find('.focus').removeClass('focus');
              $next.addClass('focus');
            }
          }
          return false;
          break;
        case 38: //向上
          if (!$dropdown.hasClass('open')) {
            $dropdown.trigger('click');
          } else {
            var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
            if ($prev.length > 0) {
              $dropdown.find('.focus').removeClass('focus');
              $prev.addClass('focus');
            }
          }
          return false;
          break;
        case 27: //ESC
          if ($dropdown.hasClass('open')) {
            $dropdown.trigger('click');
          }
          break;
        case 9: //Tab
          if ($dropdown.hasClass('open')) {
            return false;
          }
          break;
      }

    });

    // 检测 CSS pointer-events 支持
    var style = document.createElement('a').style;
    style.cssText = 'pointer-events:auto';
    if (style.pointerEvents !== 'auto') {
      $('html').addClass('no-csspointerevents');
    }

    return this;

  };

}(jQuery));
