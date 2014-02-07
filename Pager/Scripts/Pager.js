(function($) {
    $.fn.Pager = function (options) {
        var $this = this;
        var opts = $.extend({}, $.fn.Pager.defaults, options);
        $(this).addClass('pgr_tbl');
        if (opts.rows == null) throw "A rows function must be provided, taking params of page, items per page, sort, sort direction, searchterm, callback";






        var Setup = function(el) {
            var foot;
            if (el.find('tfoot').length > 0) {
                foot = el.find('tfoot')[0];
            } else {
                foot = document.createElement('tfoot');
                el.append(foot);
            }
            foot.appendChild(CreatePager());
        };
        var GetSortDirection = function() {
            return $this.data('pgr_srt_dir') || "pgr_srtdir_up";
        };
        var SetSortDirection = function(dir) {
            $this.data('pgr_srt_dir', dir);
            Update(opts);
        };
        var GetSort = function() {
            return $this.data('pgr_srt') || "";
        };
        var SetSort = function(srt) {
            $this.data('pgr_srt', srt);
            Update(opts);
        };
        var GetSearch = function() {
            return $this.data('pgr_srt_srch') || "";
        };
        var SetSearch = function(srch) {
            $this.data('pgr_srt_srch', srch);
            Update(opts);
        };

        var GetPage = function() {
            return $this.data('pgr_pg') || 1;
        };

        var SetPage = function(p, opts) {
            if (p < 1)
                p = 1;
            if (p > opts.totalPages)
                p = opts.totalPages;
            if (p != GetPage()) {
                $this.data('pgr_pg', p);
                $('.pgr_pager select').val(p);
                Update(opts);
            }

        };

        var CreateSearcher = function() {
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
                    SetSearch($(this).val(), opts);
                    $('.pgr_fltr_lbl').html('Filter: ' + $(this).val() + " <a>" + opts.SearchCancelContent + "</a>");
                    $('.pgr_fltr_lbl a').on("click", function() {
                        $('.pgr_fltr_lbl, .pgr_srch_lbl').toggle();
                        SetSearch("", opts);
                    });
                    $('.pgr_fltr_lbl, .pgr_srch_lbl').toggle();
                }
            });
            return search;
        };

        var CreatePager = function() {
            var s = document.createElement('select');
            for (var i = 1; i <= opts.totalPages; i++) {
                var o = document.createElement('option');
                $(o).attr({ "value": i }).text(i);
                s.appendChild(o);
            }

            $(s).on("change", function() {
                SetPage(this.value, opts);
                Update(opts);
            });
            var nxt = document.createElement('a');
            var prv = document.createElement('a');
            prv.innerHTML = opts.previousText;
            nxt.innerHTML = opts.nextText;
            $(prv).addClass('pgr_prv');
            $(nxt).addClass('pgr_nxt');
            var pgr = document.createElement('div');
            pgr.appendChild(prv);
            pgr.appendChild(s);
            pgr.appendChild(nxt);
            $(pgr).addClass('pgr_pager');
            $(prv).on("click", function() {
                SetPage(GetPage() - 1, opts);
            });
            $(nxt).on("click", function() {
                SetPage(GetPage() + 1, opts);

            });
            return pgr;
        };

        var Update = function() {
            var p = GetPage();
            console.log(opts, "Updating to page " + p, "sort: " + GetSort(), "sort dir: " + GetSortDirection(), "search filter: " + GetSearch());
            opts.rows(GetPage(), opts.itemsPerPage, GetSort(), GetSortDirection(), GetSearch(), function(html) {
                $this.find('tbody').html(html);
            });
        };








        SetPage(1, opts);
        SetSort("", opts);
        
        
        Setup(this);
        if (opts.Sort) {
            $(this).find('thead tr th').each(function(i, e) {
                if ($(e).text().trim() != "") {
                    $(this).data({ "pgr_srtIndex": i }).addClass('pgr_srtHeader').wrapInner('<a/>');
                    $(e).on('click', function() {
                        var direction = $(this).hasClass("pgr_srtdir_up") ? "pgr_srtdir_down" : "pgr_srtdir_up";
                        SetSortDirection(direction, opts);
                        $($this).find('thead tr th').removeClass('pgr_sorted').removeClass("pgr_srtdir_down").removeClass("pgr_srtdir_up");
                        $(this).addClass('pgr_sorted').addClass(direction);
                        SetPage(1, opts);
                        SetSort($(this).data('pgr_srtIndex'), opts);
                    });
                }
            });
        }
        if (opts.Search) {
            $this.before(CreateSearcher());
        }
        
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
        
    };


})(jQuery)