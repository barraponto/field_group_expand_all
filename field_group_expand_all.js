(function($) {
  /**
   * Overrides Drupal.FieldGroup.processHook().
   */
  Drupal.FieldGroup.Effects.processAccordion = {
    execute: function (context, settings, type) {
      $('div.field-group-accordion-wrapper', context).once('fieldgroup-effects', function () {
        var wrapper = $(this);

        // Dynamically add a button (it wouldn't be useful without javascript anyway).
        $('<input />', {'id': 'field-group-expand-all', 'value': Drupal.t('Expand all'), 'type': 'button', 'click': function() {
            if (this.value == Drupal.t('Expand all')) {
                wrapper.multiAccordion('option', 'active', 'all');
            } else if (this.value == Drupal.t('Hide all')) {
                wrapper.multiAccordion('option', 'active', 'none');
            }
        }}).insertBefore(wrapper);

        wrapper.multiAccordion({
          autoHeight: false,
          active: wrapper.children('.field-group-accordion-active').map(function(i, e) { return wrapper.children('.accordion-item').index(e);}),
          collapsible: true,
          changestart: function(event, ui) {
            if ($(this).hasClass('effect-none')) {
              ui.options.animated = false;
            }
            else {
              ui.options.animated = 'slide';
            }
          },
          tabShown: function(event, ui) {
            if (wrapper.children('.accordion-item:not(.ui-state-active)').length === 0) {
                wrapper.prev('#field-group-expand-all').val(Drupal.t('Hide all'));
            }
          },
          tabHidden: function(event, ui) {
            wrapper.prev('#field-group-expand-all').val(Drupal.t('Expand all'));
          }
        });

        if (type == 'form') {

          var $firstErrorItem = false;

          // Add required fields mark to any element containing required fields
          wrapper.find('div.field-group-accordion-item').each(function(i) {

            if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
              $('h3.ui-accordion-header a').eq(i).append(' ').append($('.form-required').eq(0).clone());
            }
            if ($('.error', $(this)).length) {
              // Save first error item, for focussing it.
              if (!$firstErrorItem) {
                $firstErrorItem = $(this).parent().accordion("activate" , i);
              }
              $('h3.ui-accordion-header').eq(i).addClass('error');
            }
          });

          // Save first error item, for focussing it.
          if (!$firstErrorItem) {
            $('.ui-accordion-content-active', $firstErrorItem).css({height: 'auto', width: 'auto', display: 'block'});
          }

        }
      });
    }
  };
})(jQuery);
