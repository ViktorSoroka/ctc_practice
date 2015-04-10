(function ($) {
    var index = 1,
        namespace_pgn = '.pagination',
        btn_pgn = 'cus-popup_pagination-list-btn',
        btn_pgn_num = 'cus-popup_pagination-list-btn-link:not(:first):not(:last)',
        btn_link_pgn = 'cus-popup_pagination-list-btn-link',
        btn_link_pgn_active = 'cus-popup_pagination-list-btn-link-active',
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
                    'class': btn_pgn
                }),
                link = $('<a>', {
                    'href': '#',
                    'class': btn_link_pgn
                });
            btn.append(link);
            for (var i = 0; i < pages_count; i++) {
                link.text(i + 1);
                documentFragment.append(btn.clone());
            }
            $place_append.find('>li:first').after(documentFragment);
        },
        some = function (collect_paginate) {
            collect_paginate.each(function (i, elem) {
                $(elem).find('.' + btn_pgn_num).removeClass(btn_link_pgn_active);
                $($(elem).find('.' + btn_pgn_num).get(getIndex() - 1)).addClass(btn_link_pgn_active);
            });
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

                    $pages.bind('click' + namespace_pgn, {
                        collect_paginate: collect_paginate,
                        $stuffToPaginate: $stuffToPaginate,
                        items_on_page: opts.items_on_page
                    }, methods.setActive);

                    $nextPage.bind('click' + namespace_pgn, {
                        pages_count: pages_count,
                        collect_paginate: collect_paginate,
                        $stuffToPaginate: $stuffToPaginate,
                        items_on_page: opts.items_on_page
                    }, methods.pgnNext);

                    $prevPage.bind('click' + namespace_pgn, {
                        collect_paginate: collect_paginate,
                        $stuffToPaginate: $stuffToPaginate,
                        items_on_page: opts.items_on_page
                    }, methods.pgnPrev);

                    $($pages[0]).trigger('click');
                }
            });
        },

        setActive: function (e) {
            if ($(e.currentTarget).hasClass(e.data.link_active)) return;
            var text_link = $(e.currentTarget).text();
            updateIndex(text_link);
            some(e.data.collect_paginate);
            methods.showPageItems(e.data.items_on_page, e.data.$stuffToPaginate);
        },

        pgnNext: function (e) {
            if (getIndex() === e.data.pages_count) return;
            increaseIndex(1);
            some(e.data.collect_paginate);
            methods.showPageItems(e.data.items_on_page, e.data.$stuffToPaginate);
        },

        pgnPrev: function (e) {
            if (getIndex() === 1) return;
            decreaseIndex(1);
            some(e.data.collect_paginate);
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
                    $nextPage = $this.find('.cus-popup_pagination-list-btn-link:last'),
                    $prevPage = $this.find('.cus-popup_pagination-list-btn-link:first');
                $this.find('.cus-popup_pagination-list-btn:not(:first):not(:last)').remove();
                $nextPage.unbind(namespace_pgn);
                $prevPage.unbind(namespace_pgn);
                $this.removeData(namespace_pgn).hide();
                $('.cus-popup_store-location-list').children().removeClass('cus-popup_store-location-list-item_highlighted').show();
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