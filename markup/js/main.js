(function ($) {
    var getItemsCount = function (elem) {
            return elem.children().length;
        };
    var methods = {
        index: 1,
        init: function (options) {
            var opts = $.extend({
                'stuff_to_paginate': '.cus-popup_store-location-list',
                'items_on_page': 3
                }, options),
                index = 1,
                $pages,
                $stuffToPaginate = $(opts.stuff_to_paginate),
                collect_paginate = this,
                items_count = getItemsCount($stuffToPaginate),
                pages_count = Math.ceil(items_count / opts.items_on_page);

            if (items_count < opts.items_on_page) {
                collect_paginate.hide();
                return;
            }
            return collect_paginate.each(function () {
                var $this = $(this),
                    data = $this.data('pagination');
                if (data && data.opts !== JSON.stringify(opts)) {
                    return $this;
                }
                var documentFragment = $(document.createDocumentFragment());
                for (var i = 0; i <= pages_count; ++i) {
                    var btn = $('<li>', {
                            'class': 'cus-popup_pagination-list-btn'
                        }),
                        link = $('<a>', {
                            'href': '#',
                            'class': 'cus-popup_pagination-list-btn-link',
                            'text': i+1
                        });
                    btn.append(link);
                    documentFragment.append(btn);
                }
                $this.find('>li:first').after(documentFragment);
                if (!data) {
                    $this.data('pagination', {
                        target: $this,
                        opts: JSON.stringify(opts)
                    });
                    $pages = $this.find('.cus-popup_pagination-list-btn-link:not(:first):not(:last)');
                    $pages.bind('click.pagination', {
                        collect_paginate: collect_paginate,
                        class_btn: '.cus-popup_pagination-list-btn-link:not(:first):not(:last)'
                    }, methods.setActive);
                }
            });
        },
        updateIndex: function(value) {
            methods.index = value;
            return methods.index;
        },
        setActive: function (e) {
            var text_link = $(e.currentTarget).text(),
                index = methods.updateIndex(text_link),
                class_active = 'cus-popup_pagination-list-btn-link-active';
            e.data.collect_paginate.each(function (i, elem) {
                $(elem).find(e.data.class_btn).removeClass(class_active);
                $($(elem).find(e.data.class_btn).get(index-1)).addClass(class_active);
            });
        }
        //destroy: function () {
        //    return this.each(function () {
        //        var $this = $(this),
        //            data = $this.data('tooltip');
        //        $(window).unbind('.tooltip');
        //        data.tooltip.remove();
        //        $this.removeData('tooltip');
        //    })
        //}
    };
    $.fn.pagination = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует для jQuery.pagination');
        }
    };
})(jQuery);
$('.cus-popup_pagination-list').pagination({
    'items_on_page': 3
});