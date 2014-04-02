(function($) {
    $.fn.Pager = function (options) {

        var pagers = window.pagers || {};
        var pager = pagers[this[0].id] || {};

        pager.table = this[0];
        pager.$table = $(pager.table);


        pager.opts = $.extend({}, $.fn.Pager.defaults, options);

        if (pager.table.id == "") {
            pager.$table.attr({ "id": Math.floor((Math.random() * 100) + 1) });
        }


        pager.init = function () {
            if (pager.opts.rows == null) throw "A rows function must be provided, taking params of page, items per page, sort, sort direction, searchterm, callback";
            pager.$table.addClass('pgr_tbl');
            if (pager.opts.totalPages > 0) {
                pager.$table.after(pager.CreatePager());
                if (pager.opts.Search)
                    pager.$table.before(pager.CreateSearcher());
            }
            pager.SetPage(1);
            pager.SetSort("");
        }

        pager.GetSortDirection = function () {
            return pager.$table.data('pgr_srt_dir') || pager.opts.defaultDirection;
        };
        pager.SetSortDirection = function (dir) {
            pager.$table.data('pgr_srt_dir', dir);
        };
        pager.GetSort = function () {
            return pager.$table.data('pgr_srt') || 0;
        };
        pager.SetSort = function (srt) {
            pager.$table.data('pgr_srt', srt);
        };
        pager.GetSearch = function () {
            return pager.$table.data('pgr_srt_srch') || "";
        };
        pager.SetSearch = function (srch) {
            pager.$table.data('pgr_srt_srch', srch);
        };
        pager.GetPage = function () {
            return pager.$table.data('pgr_pg') || 1;
        };

        pager.SetPage = function (p) {
            if (p < 1)
                p = 1;
            if (p > pager.opts.totalPages)
                p = pager.opts.totalPages;
            pager.$table.data('pgr_pg', p);
            $('#' + pager.table.id + '_pgr_pager select').val(p);
            pager.Update();
        

        };

        pager.CreateSearcher = function () {
            var l = document.createElement('label');
            $(l).addClass("pgr_srch_lbl");
            $(l).html('Search: <input type="text" />');
            var search = document.createElement('div');
            $(search).addClass("pgr_search");
            search.appendChild(l);

            l = document.createElement('label');
            $(l).addClass("pgr_fltr_lbl");
            $(l).html('Filter: <a></a>');
            $(l).css({ "display": "none" });
            search.appendChild(l);

            $(search).find('input').keypress(function(e) {
                if (e.which == 13) {
                    pager.SetSearch($(this).val());
                    $('.pgr_fltr_lbl').html('Filter: ' + $(this).val() + " <a>" + pager.opts.SearchCancelContent + "</a>");
                    $('.pgr_fltr_lbl a').on("click", function() {
                        $('.pgr_fltr_lbl, .pgr_srch_lbl').toggle();
                        pager.SetSearch("");
                        pager.SetPage(1);
                    });
                    $('.pgr_fltr_lbl, .pgr_srch_lbl').toggle();
                    pager.SetPage(1);
                }
            });
            return search;
        };
        
        pager.CreatePager = function () {
            var s = document.createElement('select');
            for (var i = 1; i <= pager.opts.totalPages; i++) {
                var o = document.createElement('option');
                $(o).attr({ "value": i }).text(i);
                s.appendChild(o);
            }

            $(s).on("change", function() {
                pager.SetPage(this.value);
                pager.Update();
            });
            var nxt = document.createElement('a');
            var prv = document.createElement('a');
            prv.innerHTML = pager.opts.previousText;
            nxt.innerHTML = pager.opts.nextText;
            $(prv).addClass('pgr_prv').addClass('pgr_btn').attr({ "id": pager.table.id + "prv" });
            $(nxt).addClass('pgr_nxt').addClass('pgr_btn').attr({"id":pager.table.id + "_nxt"});
            var pgr = document.createElement('div');
            pgr.appendChild(prv);
            pgr.appendChild(s);
            pgr.appendChild(nxt);
            $(pgr).addClass('pgr_pager').attr({"id":pager.table.id + '_pgr_pager'});
            $(prv).on("click", function() {
                pager.SetPage(pager.GetPage() - 1);
            });
            $(nxt).on("click", function() {
                pager.SetPage(pager.GetPage() + 1);

            });
            return pgr;
        };

        pager.Update = function () {
            pager.opts.rows(pager.GetPage(), pager.opts.itemsPerPage, pager.GetSort(), pager.GetSortDirection(), pager.GetSearch(), function (html) {
                pager.$table.find('tbody').html(html);
            });
        };

        
        
        if (pager.opts.Sort) {
            pager.$table.find('thead tr th').each(function (i, e) {
                if ($(e).text().trim() != "") {
                    $(this).data({ "pgr_srtIndex": i + 1 }).addClass('pgr_srtHeader').wrapInner('<a/>');
                    $(e).on('click', function() {
                        var direction = $(this).hasClass("pgr_asc") ? "desc" : "asc";
                        pager.SetSortDirection(direction);
                        pager.$table.find('thead tr th').removeClass('pgr_sorted').removeClass("pgr_desc").removeClass("pgr_asc");
                        $(this).addClass('pgr_sorted').addClass(direction == "desc" ? "pgr_desc" : "pgr_asc");
                        pager.SetSort($(this).data('pgr_srtIndex'));
                        pager.SetPage(1);
                    });
                }
            });
        }

        pagers[pager.table.id] = pager;
        window.pagers = pagers;

        pager.init();

    };
    $.fn.Pager.defaults = {
        rows: null,
        totalPages: 1,
        itemsPerPage: 20,
        Sort: true,
        Search: true,
        SearchCancelContent: "X",
        nextText: "Next",
        previousText: "Previous",
        defaultDirection: "asc"
        
    };


})(jQuery)