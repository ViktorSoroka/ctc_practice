(function ($) {
    var index = 1,
        getIndex = function () {
            return index;
        },
        increaseIndex = function (value) {
            index += value;
        },
        decreaseIndex = function (value) {
            index -= value;
        },
        updateIndex = function (value) {
            index = +value;
            return index;
        },
        getItemsCount = function (elem) {
            return elem.children().length;
        },
        appendPaginateBtns = function ($place_append, pages_count) {
            var documentFragment = $(document.createDocumentFragment()),
                btn = $('<li>', {
                    'class': 'cus-popup_pagination-list-btn'
                }),
                link = $('<a>', {
                    'href': '#',
                    'class': 'cus-popup_pagination-list-btn-link'
                });
            btn.append(link);
            for (var i = 0; i < pages_count; i++) {
                link.text(i + 1);
                documentFragment.append(btn.clone());
            }
            $place_append.find('>li:first').after(documentFragment);
    };
    var methods = {
        init: function (options) {
            var opts = $.extend({
                    'stuff_to_paginate': '.cus-popup_store-location-list',
                    'items_on_page': 3
                }, options),
                $pages,
                $nextPage,
                $prevPage,
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
                if (!data) {
                    $this.data('pagination', {
                        target: $this,
                        opts: JSON.stringify(opts)
                    });

                    appendPaginateBtns($this, pages_count);

                    $pages = $this.find('.cus-popup_pagination-list-btn-link:not(:first):not(:last)');
                    $nextPage = $this.find('.cus-popup_pagination-list-btn-link:last');
                    $prevPage = $this.find('.cus-popup_pagination-list-btn-link:first');

                    $pages.bind('click.pagination', {
                        link_active: 'cus-popup_pagination-list-btn-link-active',
                        collect_paginate: collect_paginate,
                        class_btn: '.cus-popup_pagination-list-btn-link:not(:first):not(:last)',
                        $stuffToPaginate: $stuffToPaginate,
                        items_on_page: opts.items_on_page
                    }, methods.setActive);

                    $nextPage.bind('click.pagination', {
                        link_active: 'cus-popup_pagination-list-btn-link-active',
                        pages_count: pages_count,
                        collect_paginate: collect_paginate,
                        class_btn: '.cus-popup_pagination-list-btn-link:not(:first):not(:last)',
                        $stuffToPaginate: $stuffToPaginate,
                        items_on_page: opts.items_on_page
                    }, methods.pgnNext);

                    $prevPage.bind('click.pagination', {
                        link_active: 'cus-popup_pagination-list-btn-link-active',
                        collect_paginate: collect_paginate,
                        class_btn: '.cus-popup_pagination-list-btn-link:not(:first):not(:last)',
                        $stuffToPaginate: $stuffToPaginate,
                        items_on_page: opts.items_on_page
                    }, methods.pgnPrev);

                    $($pages[0]).trigger('click');
                }
            });
        },

        setActive: function (e) {
            if ($(e.currentTarget).hasClass(e.data.link_active)) return;
            var text_link = $(e.currentTarget).text(),
                index = updateIndex(text_link);
            e.data.collect_paginate.each(function (i, elem) {
                $(elem).find(e.data.class_btn).removeClass(e.data.link_active);
                $($(elem).find(e.data.class_btn).get(index - 1)).addClass(e.data.link_active);
            });
            methods.showPageItems(e.data.items_on_page, e.data.$stuffToPaginate);
        },

        pgnNext: function (e) {
            if (getIndex() === e.data.pages_count) return;
            increaseIndex(1);
            e.data.collect_paginate.each(function (i, elem) {
                $(elem).find(e.data.class_btn).removeClass(e.data.link_active);
                $($(elem).find(e.data.class_btn).get(getIndex() - 1)).addClass(e.data.link_active);
            });
            methods.showPageItems(e.data.items_on_page, e.data.$stuffToPaginate);
        },

        pgnPrev: function (e) {
            if (getIndex() === 1) return;
            decreaseIndex(1);
            e.data.collect_paginate.each(function (i, elem) {
                $(elem).find(e.data.class_btn).removeClass(e.data.link_active);
                $($(elem).find(e.data.class_btn).get(getIndex() - 1)).addClass(e.data.link_active);
            });
            methods.showPageItems(e.data.items_on_page, e.data.$stuffToPaginate);
        },

        showPageItems: function (col_items, elem) {
            elem.children().hide().removeClass('cus-popup_store-location-list-item_highlighted');
            elem.children().slice((getIndex() - 1) * col_items, (getIndex() - 1) * col_items + col_items).show().each(function (index, elem) {
                if ((index + 1) % 2 === 0) {
                    $(elem).addClass('cus-popup_store-location-list-item_highlighted');
                }
            });
        },

        destroy: function() {
            return this.each(function(){
                var $this = $(this),
                    $pages = $this.find('.cus-popup_pagination-list-btn-link:not(:first):not(:last)'),
                    $nextPage = $this.find('.cus-popup_pagination-list-btn-link:last'),
                    $prevPage = $this.find('.cus-popup_pagination-list-btn-link:first');
                $($pages[0]).trigger('click');
                $pages.unbind('.pagination');
                $nextPage.unbind('.pagination');
                $prevPage.unbind('.pagination');
                $this.removeData('pagination').hide();
                $('.cus-popup_store-location-list').children().show();
            });
        }
    };

    $.fn.pagination = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('A method ' + method + 'is not available in jQuery.pagination');
        }
    };
})(jQuery);

$('.cus-popup_pagination-list').pagination();
$('.cus-popup_main-wrap-hide-btn').on('click', function () {
    $('.cus-popup_pagination-list').pagination('destroy');
});