(function($) {
    $.fn.Pager = function (options) {
        
        var $this = this;
        var opts = $.extend({}, $.fn.Pager.defaults, options);

        var thisId = $this[0].id;
        if (thisId == "") {
            $this.attr({ "id": Math.floor((Math.random() * 100) + 1) });
            thisId = $this[0].id;
        }
        $this.addClass('pgr_tbl');
        if (opts.rows == null) throw "A rows function must be provided, taking params of page, items per page, sort, sort direction, searchterm, callback";

        var Setup = function (el) {
            if(opts.totalPages > 0)
            $this.after(CreatePager());
        };
        var GetSortDirection = function() {
            return $this.data('pgr_srt_dir') || "asc";
        };
        var SetSortDirection = function(dir) {
            $this.data('pgr_srt_dir', dir);
        };
        var GetSort = function() {
            return $this.data('pgr_srt') || 0;
        };
        var SetSort = function(srt) {
            $this.data('pgr_srt', srt);
        };
        var GetSearch = function() {
            return $this.data('pgr_srt_srch') || "";
        };
        var SetSearch = function(srch) {
            $this.data('pgr_srt_srch', srch);
        };

        var GetPage = function() {
            return $this.data('pgr_pg') || 1;
        };

        var SetPage = function(p, opts) {
            if (p < 1)
                p = 1;
            if (p > opts.totalPages)
                p = opts.totalPages;

            
            //$('#' + thisId + "prv").toggle(p > 1);
            //$('#' + thisId + "nxt").toggle(p < opts.totalPages);
            

                $this.data('pgr_pg', p);
                $('#' + thisId + '_pgr_pager select').val(p);
                Update(opts);
        

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
            $(prv).addClass('pgr_prv').addClass('pgr_btn').attr({ "id": thisId + "prv" });
            $(nxt).addClass('pgr_nxt').addClass('pgr_btn').attr({"id":thisId + "_nxt"});
            var pgr = document.createElement('div');
            pgr.appendChild(prv);
            pgr.appendChild(s);
            pgr.appendChild(nxt);
            $(pgr).addClass('pgr_pager').attr({"id":thisId + '_pgr_pager'});
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
            //console.log(opts, "Updating to page " + p, "sort: " + GetSort(), "sort dir: " + GetSortDirection(), "search filter: " + GetSearch());
            opts.rows(GetPage(), opts.itemsPerPage, GetSort(), GetSortDirection(), GetSearch(), function(html) {
                $this.find('tbody').html(html);
            });
        };

        SetPage(1, opts);
        SetSort("", opts);
        
        Setup(this);
        if (opts.Sort) {
            $(this).find('thead tr th').each(function (i, e) {
                alert(i);
                if ($(e).text().trim() != "") {
                    $(this).data({ "pgr_srtIndex": i + 1 }).addClass('pgr_srtHeader').wrapInner('<a/>');
                    $(e).on('click', function() {
                        var direction = $(this).hasClass("pgr_asc") ? "desc" : "asc";
                        SetSortDirection(direction, opts);
                        $this.find('thead tr th').removeClass('pgr_sorted').removeClass("pgr_desc").removeClass("pgr_asc");
                        $(this).addClass('pgr_sorted').addClass(direction == "desc" ? "pgr_desc" : "pgr_asc");
                        SetSort($(this).data('pgr_srtIndex'), opts);
                        SetPage(1, opts);
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