/*global jQuery:false */
/*global $:false */
/*global document */
(function ($) {
    'use strict';
    var namespace_pgn = 'pagination',
        btn_pgn = 'cus-popup_pagination-list-btn',
        btn_pgn_num = '.cus-popup_pagination-list-btn:not(:first):not(:last)',
        btn_pgn_link_num = '.cus-popup_pagination-list-btn-link:not(:first):not(:last)',
        btn_link_pgn = 'cus-popup_pagination-list-btn-link',
        btn_link_pgn_active = 'cus-popup_pagination-list-btn-link-active',
        prev_pgn_btn_link = '.cus-popup_pagination-list-btn-link-prev',
        next_pgn_btn_link = '.cus-popup_pagination-list-btn-link-next',
        $nextPage,
        $prevPage,
        methods,
        i,
        checkPositiveInteger = function (value) {
            return value && value === ~~value && value >= 0;
        },
        /**
         * @description - get the count of elements in some Jquery element
         * @param elem {jQuery} - some element
         * @returns {Number} - the count of elements
         */
        getItemsCount = function (elem) {
            return elem && elem instanceof jQuery && elem.children().length;
        },
        /**
         * @description - it for appending pagination buttons into some place
         * @param $place_append {jQuery} - some element
         * @param pages_count {Number} - the count of buttons
         */
        appendPaginateBtns = function ($place_append, pages_count) {
            if (!$place_append || !($place_append instanceof jQuery)) {
                throw new Error('$place_append must be a jQuery element');
            }
            if (!$place_append || !checkPositiveInteger(pages_count)) {
                throw new Error('pages_count must be a positive integer');
            }
            var documentFragment = $(document.createDocumentFragment()),
                btn = $('<li>', {
                    'class': btn_pgn
                }),
                link = $('<a>', {
                    'href': '#',
                    'class': btn_link_pgn
                });
            btn.append(link);
            for (i = 0; i < pages_count; i += 1) {
                link.text(i + 1);
                documentFragment.append(btn.clone());
            }
            $place_append.find('>li:first').after(documentFragment);
        },
        /**
         * @description - for setting active button in the pagination
         * @param collect_paginate {Array.<jQuery>} - collection of pagination elements
         * @param index {Number} - index to define the active button to set
         */
        setActive = function (collect_paginate, index) {
            if (!collect_paginate) {
                throw new Error('collect_paginate must be passed');
            }
            if (!checkPositiveInteger(index)) {
                throw new Error('index must be a positive integer');
            }
            /*jslint unparam: true*/
            collect_paginate.each(function (i, elem) {
                var $btn_pgn_link_num = $(elem).find(btn_pgn_link_num);
                $btn_pgn_link_num.removeClass(btn_link_pgn_active);
                $($btn_pgn_link_num.get(index - 1)).addClass(btn_link_pgn_active);
            });
            /*jslint unparam: false*/
        },
        /**
         * @description - for showing items for active page and hiding others
         * @param data {Object}
         */
        showPageItems = function (data) {
            if (!data) {
                throw new Error('data must be passed');
            }
            var index = data.index.getIndex() - 1,
                col_items = data.items_on_page;
            data.$stuffToPaginate.children()
                .hide()
                .removeClass(data.stuff_pgn_highlight)
                .slice(index * col_items, col_items * (index + 1))
                .each(function (index, elem) {
                    if ((index + 1) % 2 === 0) {
                        $(elem).addClass(data.stuff_pgn_highlight);
                    }
                })
                .show();
        },
        /**
         * @description - constructor for indexing pagination
         * @constructor
         */
        Index = function () {
            this.index = null;
        };
    Index.prototype = {
        /**
         * @description - for getting current index
         * @returns {null|Number}
         */
        getIndex: function () {
            return this.index;
        },
        /**
         * @description - for increasing index by input value
         * @param value {Number} - value to increase index how much
         */
        increaseIndex: function (value) {
            if (value &&  !checkPositiveInteger(value)) {
                throw new Error('index must be a positive integer');
            }
            value = value || 1;
            this.index += value;
        },
        /**
         * @description - for increasing index by input value
         * @param value {Number} - value to decrease index how much
         */
        decreaseIndex: function (value) {
            if (value && !checkPositiveInteger(value)) {
                throw new Error('index must be a positive integer');
            }
            value = value || 1;
            this.index -= value;
        },
        /**
         * @description - for updating the current index
         * @param value {Number} - value to set for index
         * @returns {Number}
         */
        updateIndex: function (value) {
            if (value) {
                if (!checkPositiveInteger(value)) {
                    throw new Error('index must be a positive integer');
                }
                this.index = +value;
            }
            return this.index;
        }
    };
    methods = {
        /**
         * @description - to set pagination plugin
         * @param options - options for plugin
         */
        init: function (options) {
            var opts = $.extend({
                    'stuff_to_paginate': '.cus-popup_store-location-list',
                    'stuff_pgn_highlight': 'cus-popup_store-location-list-item_highlighted',
                    'items_on_page': 3
                }, options),
                collect_paginate = this,
                $stuffToPaginate = $(opts.stuff_to_paginate),
                items_count = getItemsCount($stuffToPaginate),
                items_on_page = opts.items_on_page,
                stuff_pgn_highlight = opts.stuff_pgn_highlight,
                pages_count = Math.ceil(items_count / items_on_page),
                index = new Index(),
                $collect_first = $(collect_paginate[0]),
                data = $collect_first.data(namespace_pgn),
                $pages;
            if (items_count < items_on_page) {
                collect_paginate.hide();
                return collect_paginate;
            }

            if (data && data.opts !== JSON.stringify(opts)) {
                methods.reload.call(collect_paginate, opts);
                return collect_paginate;
            }

            if (!data) {
                $collect_first.data(namespace_pgn, {
                    collect_paginate: collect_paginate,
                    $stuffToPaginate: $stuffToPaginate,
                    items_count: items_count,
                    pages_count: pages_count,
                    stuff_pgn_highlight: stuff_pgn_highlight,
                    index: index,
                    items_on_page: items_on_page,
                    opts: JSON.stringify(opts)
                });
                collect_paginate.each(function () {
                    var $this = $(this);
                    appendPaginateBtns($this, pages_count);

                    $pages = $this.find(btn_pgn_link_num);
                    $nextPage = $this.find(next_pgn_btn_link);
                    $prevPage = $this.find(prev_pgn_btn_link);

                    $('.' + btn_link_pgn).bind('click', function (e) {
                        e.preventDefault();
                    });

                    $pages.bind('click.' + namespace_pgn, function (e) {
                        methods.setPage.call(collect_paginate, +$(e.currentTarget).text());
                    });

                    $prevPage.bind('click.' + namespace_pgn, $.proxy(methods.prevPage, collect_paginate));
                    $nextPage.bind('click.' + namespace_pgn, $.proxy(methods.nextPage, collect_paginate));
                });
                methods.setPage.call(collect_paginate, 1);
            }
            return collect_paginate;
        },
        /**
         * @description - for getting the previous pagination page
         */
        prevPage: function () {
            var data = $(this[0]).data(namespace_pgn),
                index = data.index;
            if (index.getIndex() === 1) { return this; }
            index.decreaseIndex();
            setActive(this, index.getIndex());
            showPageItems(data);
            return this;
        },
        /**
         * @description - for getting the next pagination page
         */
        nextPage: function () {
            var data = $(this[0]).data(namespace_pgn),
                index = data.index;
            if (index.getIndex() === data.pages_count) { return this; }
            index.increaseIndex();
            setActive(this, index.getIndex());
            showPageItems(data);
            return this;
        },
        /**
         * @description - for setting the pagination page
         * @param index_to_set {Number} - index for setting the pagination page by
         */
        setPage: function (index_to_set) {
            if (!index_to_set || !checkPositiveInteger(index_to_set)) {
                throw new Error('index_to_set must be a positive integer');
            }
            var data = $(this[0]).data(namespace_pgn),
                index = data.index;
            if (index.getIndex() === index_to_set) { return this; }
            index.updateIndex(index_to_set);
            setActive(this, index.getIndex());
            showPageItems(data);
            return this;
        },
        /**
         * @description - for destroying the pagination plugin
         */
        destroy: function () {
            var data = $(this[0]).data(namespace_pgn);
            this.each(function () {
                var $this = $(this);
                $this.find(btn_pgn_num).remove();
                $nextPage.unbind('.' + namespace_pgn);
                $prevPage.unbind('.' + namespace_pgn);
                data.$stuffToPaginate.children()
                    .removeClass(data.stuff_pgn_highlight)
                    .show();

            });
            $(this[0]).removeData(namespace_pgn);
            return this;
        },
        /**
         * @description - for reloading the pagination plugin
         * @param opts - new options to reload with
         */
        reload: function (opts) {
            methods.destroy.call(this);
            methods.init.call(this, opts);
            return this;
        }
    };
    /**
     * @description - pagination plugin
     * @param method {String} - method to call plugin with
     */
    $.fn.pagination = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        throw new Error('A method ' + method + 'is not available in jQuery.pagination');
    };
}(jQuery));

$('.cus-popup_pagination-list').pagination();
$('.cus-popup_main-wrap-hide-btn').on('click', function () {
    'use strict';
    $('.cus-popup_pagination-list').pagination('destroy');
});