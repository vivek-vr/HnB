var HAB = HAB || {};
HAB.account = HAB.account || {};
HAB.slowDropdownConfig = HAB.slowDropdownConfig || {};
HAB.slowDropdownConfig.mouseDelay = 200;
HAB.slowDropdownConfig.flyOutDelay = 200;
$.root = $(document.body);
HAB.isMobile = function() {
    return $(window).width() < 768
}
;
HAB.fixIE = function() {
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(b) {
            var a = this.length >>> 0;
            var c = Number(arguments[1]) || 0;
            c = (c < 0) ? Math.ceil(c) : Math.floor(c);
            if (c < 0) {
                c += a
            }
            for (; c < a; c++) {
                if (c in this && this[c] === b) {
                    return c
                }
            }
            return -1
        }
    }
    if (!Array.prototype.find) {
        Array.prototype.find = function(a) {
            if (this == null) {
                throw new TypeError("Array.prototype.find called on null or undefined")
            }
            if (typeof a !== "function") {
                throw new TypeError("predicate must be a function")
            }
            var f = Object(this);
            var d = f.length >>> 0;
            var b = arguments[1];
            var e;
            for (var c = 0; c < d; c++) {
                e = f[c];
                if (a.call(b, e, c, f)) {
                    return e
                }
            }
            return undefined
        }
    }
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "")
        }
    }
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(b, a) {
            a = a || 0;
            return this.substr(a, b.length) === b
        }
    }
}
;
HAB.blocker = {
    block: function(b) {
        var a = $(window);
        this.container = $('<div class="lightbox-container wait-screen"><div class="masq"></div></div>').appendTo($.root).hide();
        this.messageContainer = $('<div class="content"><p><span></span>' + b + "</p></div>").appendTo(this.container);
        this.container.show();
        this.messageContainer.css({
            top: (a.height() - this.messageContainer.height()) / 2,
            left: (a.width() - this.messageContainer.width()) / 2
        });
        this.container.hide().css({
            height: $.root.height(),
            width: $.root.width()
        }).fadeIn(200)
    },
    unblock: function() {
        this.container.fadeOut(100)
    }
};
HAB.hookFormValidation = function() {
    $(".signup-form input").inlineValidation();
    $("form.feature:not(#registration-form) input, form.feature:not(#registration-form) select").inlineValidation()
}
;
HAB.validator = (function() {
    var a = {};
    a = {
        init: function() {
            a.setupInlineValidationSettings();
            a.setupCTAHandler();
            a.setupStealthValidation();
            a.setupInlineValidation()
        },
        setupInlineValidationSettings: function() {
            $.validator.setDefaults({
                onkeyup: false,
                onsubmit: false,
                onclick: function(c) {
                    $(c).valid()
                }
            });
            $.validator.prototype.init = SFR.Utils.extendFunction($.validator.prototype.init, false, function b() {
                $(this.currentForm).on("input", ":input:visible:not(button)", function() {
                    $(this).valid()
                })
            });
            $.validator.methods.email = function(d, c) {
                return this.optional(c) || /^[a-z0-9!$'*+\-_&]+(\.[a-z0-9!$'*+\-_&]+)*@([a-z0-9]+(-+[a-z0-9]+)*\.)+([a-z]{2,6})$/.test(d.toLowerCase())
            }
            ;
            $.validator.methods.maxlength = function(d, c, e) {
                return true
            }
            ;
            $.validator.addMethod("qasRequired", function(h, f, c) {
                var k = $(this.currentForm).find(".js-address-country option:selected");
                var g = ["core-country", "a-country", "b-country"];
                var m = c.indexOf(k.val()) != -1;
                var l = false;
                $.each(g, function(n, o) {
                    if (k.data(o) && c.indexOf(o) != -1) {
                        l = true;
                        return false
                    }
                });
                var d = m || l;
                var e = $(this.currentForm).find("label.label[for=" + $(f).attr("id") + "]");
                e.parent().toggleClass("required", d);
                e.parent().toggleClass("optional", !d);
                return d ? $.validator.methods.required.call(this, h, f, true) : true
            }, "This field is required");
            $.validator.addMethod("phone", function(d, c, e) {
                return this.optional(c) || /^[0-9]{1,20}$/.test(d.replace(/[\+ ]/g, ""))
            }, "Please enter a valid phone number");
            $.validator.addMethod("emailPostcode", function(d, c, e) {
                isPostcode = (this.optional(c) || /^[\w\-\s]+$/.test(d)) && this.getLength($.trim(d), c) <= 10 && this.getLength($.trim(d), c) >= 1;
                isEmail = this.optional(c) || /^[a-z0-9!$'*+\-_&]+(\.[a-z0-9!$'*+\-_&]+)*@([a-z0-9]+(-+[a-z0-9]+)*\.)+([a-z]{2,6})$/.test(d.toLowerCase());
                return isPostcode || isEmail
            }, "Please enter an email or postcode.");
            $.validator.addMethod("rflCardNumber", function(d, c, e) {
                return /^[0-9]{1,13}$/.test(d.replace(/[\+ ]/g, ""))
            }, "Please enter a valid RFL card number.");
            $.validator.addMethod("orderId", function(e, d, g) {
                var f = e.length === 10;
                var c = /^\d+$/.test(e.replace(/[\+ ]/g, ""));
                return true
            }, window.localization.inlineValidation.ORDER_NUMBER);
            if (typeof window.localization !== "undefined" && typeof window.localization.inlineValidationCheckout !== "undefined") {
                jQuery.extend(jQuery.validator.messages, window.localization.inlineValidationCheckout)
            }
        },
        enable: function(b) {
            $(b).prop("disabled", false)
        },
        disable: function(b) {
            $(b).prop("disabled", true)
        },
        setupCTAHandler: function() {
            $.validator.prototype.element = SFR.Utils.extendFunction($.validator.prototype.element, false, k);
            function k(r) {
                var q = this;
                if (!h(q, r)) {
                    return
                }
                a.handleCTA(q.currentForm)
            }
            function h(s, r) {
                var q = $(r);
                var t = q.data("valid");
                var u = f(s, q);
                if (t === u) {
                    return false
                } else {
                    q.data("valid", u)
                }
                return true
            }
            a.handleCTA = function n(s) {
                var r = $(s);
                if (r.length === 0) {
                    console.error("Form is not specified, please specify the form.");
                    return
                }
                if (!r.is(":visible")) {
                    return
                }
                var u = r;
                var t = $(r.data("cta")).filter(":visible");
                t.each(function() {
                    u = u.add($(this).data("cta-linked-forms"))
                });
                u.each(function() {
                    $(this).valid(true)
                });
                var q = g(r);
                $.each(q, function(v, w) {
                    e(w)
                })
            }
            ;
            function e(q) {
                var s = p(q);
                var r = d(q);
                var t = o(q);
                if (t) {
                    q.$linkedForms.each(function() {
                        var u = c(this);
                        t = t && o(u);
                        if (!t) {
                            r = d(u)
                        }
                    })
                }
                if (t) {
                    a.enable(q.$cta);
                    if (s) {
                        q.$cta.html(s)
                    }
                } else {
                    a.disable(q.$cta);
                    if (r) {
                        q.$cta.html(r)
                    }
                }
                if (t && q.$cta.data("cta-msg-to-update-length")) {
                    m(q.$cta);
                    $(q.$cta.data("cta-linked-forms")).off("keyup").on("keyup", function(u) {
                        m(q.$cta)
                    })
                }
            }
            function o(r) {
                var t = true;
                r.$elements.each(function() {
                    var v = $(this);
                    var w = f(r.validator, v);
                    t = t && w
                });
                var s = r.$cta.data("cta-depends-on");
                var q = $(s).filter(":visible");
                var u = true;
                q.each(function() {
                    var v = $.trim($(this).html()) === "";
                    u = u && !v
                });
                return t && u
            }
            function f(r, q) {
                return !r.invalid[q.attr("name")]
            }
            function m(q) {
                if ($(q.data("cta-msg-to-update-input")).val().length > (q.data("cta-msg-to-update-length") - 1)) {
                    q.html(q.data("cta-msg-to-update"))
                } else {
                    q.html(q.data("cta-msg-default"))
                }
            }
            function g(v) {
                var q = [];
                var s = $(v);
                q.push(c(s));
                var r = [];
                var u = s.validate();
                var t = s.find(":input:visible:not(button)");
                var w = s.find(":input:visible:not(button)[data-validation-group]");
                w.each(function() {
                    var z = $(this).data("validation-group");
                    if (r.indexOf(z) === -1) {
                        r.push(z);
                        var y = s.find(z);
                        var x = t.filter("[data-validation-group=" + z + "]");
                        q.push(b(u, y, x))
                    }
                });
                return q
            }
            function c(v) {
                var q = $(v);
                var s = q.closest("form");
                var r = q.data("validation-group");
                var u = s.validate();
                var t = s.find(":input:visible:not(button)");
                if (r) {
                    var x = s.find(r);
                    var w = t.filter("[data-validation-group=" + r + "]")
                } else {
                    x = s;
                    w = t.not("[data-validation-group]")
                }
                return b(u, x, w)
            }
            function b(s, u, t) {
                var r = $(u.data("cta")).filter(":visible");
                var q = $(r.data("cta-linked-forms")).not(u);
                return {
                    validator: s,
                    $holder: u,
                    $elements: t,
                    $cta: r,
                    $linkedForms: q
                }
            }
            function d(q) {
                return l("cta-msg-error", q)
            }
            function p(q) {
                return l("cta-msg-default", q)
            }
            function l(u, r) {
                var s = r.$holder.data(u);
                var q = r.$cta.data(u);
                var v = $(r.validator.lastActive).data(u);
                var t;
                if (v) {
                    t = v
                } else {
                    if (q) {
                        t = q
                    } else {
                        t = s
                    }
                }
                return t
            }
        },
        setupStealthValidation: function() {
            $.fn.valid = SFR.Utils.extendFunction($.fn.valid, b, c);
            function b(f) {
                var g = $(this).closest("form").validate();
                if (f) {
                    g.settings.isStealthValidation = true
                }
            }
            function c(f) {
                var g = $(this).closest("form").validate();
                if (f) {
                    g.settings.isStealthValidation = false
                }
            }
            var e = $.validator.defaults.highlight;
            $.validator.setDefaults({
                showErrors: function(f, g) {
                    if (d(this)) {
                        return
                    }
                    this.defaultShowErrors()
                },
                highlight: function(g, f) {
                    if (d(this)) {
                        return
                    }
                    e.apply(this, arguments)
                }
            });
            if ($("form.js-hab-form").length) {
                $.validator.setDefaults({
                    errorElement: "em",
                    errorPlacement: function(f, g) {
                        f.appendTo(g.parent())
                    }
                })
            }
            function d(g) {
                var f = g.settings.isStealthValidation;
                var h = $(g.lastActive).data("show-errors") === false;
                return f || h
            }
        },
        setupInlineValidation: function(b) {
            if (b) {
                var c = $(b).find("form")
            } else {
                c = $("form[data-jquery-validation=true], .js-jquery-validation form")
            }
            c.each(function() {
                $(this).validate();
                a.handleCTA(this)
            })
        }
    };
    return a
}
)();
HAB.setupReorderAllItemsLinks = function() {}
;
HAB.addSubmitIcons = function() {
    $.root.find(".prod-submit-bt, .js-emwa").each(function() {
        var b = $(this);
        var d = b.data("input-state");
        if (d != "disabled") {
            $(this).prop("disabled", false)
        }
        var a = b.data("iconClass");
        if (a) {
            var c = $("<span/>").addClass("ico").addClass(a);
            if (!b.not(":visible")) {
                c.hide()
            }
            c.on("click", function() {
                b.click()
            });
            b.before(c)
        }
    })
}
;
HAB.hookHomeHero = function() {
    var a = $("body:not(.t-home) section.hero-banner:not(.js)");
    a.each(function() {
        var f = ["", "full", "half", "third", "quarter"]
          , b = $(this)
          , h = b.addClass("js").find("ul li")
          , e = null
          , g = null;
        function c() {
            clearTimeout(g);
            g = setTimeout(function() {
                var k = e.find(".current").next();
                if (k.length === 0) {
                    e.find("li").eq(0).children("a").trigger("click")
                }
                k.children("a").trigger("click");
                c()
            }, 5000)
        }
        if ((b.length === 0) || (h.length === 0)) {
            return false
        }
        e = $('<ol class="clearfix"/>').addClass(f[h.length] + "-grid");
        var d = "<footer/>";
        b.each(function() {
            $(d).appendTo($(this)).append(e)
        });
        h.each(function(k) {
            var m = $(this)
              , l = m.data("title");
            if (l === undefined) {
                l = m.text()
            }
            $("<a/>").data("index", k).html(l).appendTo(e).wrap("<li/>")
        });
        e.find("a").on("click", function() {
            var k = $(this)
              , m = b.attr("class").replace(/bg\-\S+/, "")
              , l = h.eq(k.data("index"));
            clearTimeout(g);
            l.show().siblings().hide();
            k.parent().addClass("current").siblings().removeClass("current");
            if (typeof (l.attr("class")) !== "undefined") {
                m += " " + l.attr("class").match(/(bg\-\S+)/)[1];
                b.attr("class", m)
            }
            return false
        }).eq(0).addClass("current").trigger("click");
        h.hide().eq(0).show();
        c();
        b.height("auto")
    })
}
;
HAB.loadDesktopImages = function() {
    $.root.find("[data-img-src]").each(function() {
        var d = $(this)
          , a = d.attr("class")
          , c = d.data("img-src")
          , b = $("<img />").addClass(a).attr("src", c).attr("alt", "");
        d.parents(".teaser-item").addClass("has-img");
        d.replaceWith(b)
    })
}
;
HAB.hookDesktopMenu = function() {
    $(".main-nav").find("li").not(".main-nav-item.simple-nav-item").off("mouseenter").on("mouseenter", function() {
        if (!$(this).hasClass("loaded")) {
            var a = $(this).find(".urlRef").val();
            var b = $(this).find(".dataId").val();
            loadHeaderMenuItem(this, b, a)
        }
    });
    $.root.find(".main-nav-item:last").addClass("last-nav-item")
}
;
HAB.setupSlowDropdowns = function() {
    jQuery.widget("ui.slow_dropdown", $.ui.cx_dropdown, {
        options: {
            flyOutDelay: HAB.slowDropdownConfig.flyOutDelay
        },
        vars: {
            tabOffTimer: null
        },
        _tabOff: function(b) {
            var a = this;
            clearTimeout(this.vars.tabOffTimer);
            this.vars.tabOffTimer = setTimeout(function() {
                if (a.options.overlayClass && a._closestListItem(b.target).hasClass(a.options.hoverClass)) {
                    $("." + a.options.overlayClass + ".lightbox-container").fadeOut(0)
                }
                a._closestListItem(b.target).removeClass(a.options.hoverClass).find(a.options.menuClass).removeAttr("style")
            }, this.options.flyOutDelay)
        }
    })
}
;
HAB.setupDropdowns = function() {
    if (!$.slow_dropdown) {
        HAB.setupSlowDropdowns()
    }
    $(".main-nav ul[role=menubar]").slow_dropdown({
        hoverClass: "hover",
        menuClass: "sub-nav",
        ariaAttr: "aria-haspopup",
        ariaValue: "true",
        fixPosition: false,
        mouseDelay: HAB.slowDropdownConfig.mouseDelay,
        overlayClass: "mega-menu-overlay"
    })
}
;
HAB.destroyDropdowns = function() {
    if ($(".main-nav ul[role=menubar]").is(":ui-cx_dropdown")) {
        $(".main-nav ul[role=menubar]").cx_dropdown("destroy")
    }
}
;
HAB.switchStrings = function() {
    $.root.find("[data-string-largevp]").each(function() {
        var c = $(this)
          , b = c.children(".ico")
          , a = c.data("string-largevp");
        c.html(b).append(a)
    })
}
;
HAB.initLocalNav = function() {
    var b = $.root.find("nav.local-nav ul.local-nav-list, nav.prod-filter-nav ul.filter-set-type").not(".local-nav-child");
    var a = b.data("mobile-menu-text");
    HAB.__localNav = b.mobileMenu({
        prependTo: "nav.local-nav",
        switchWidth: 1,
        topOptionText: a,
        groupPageText: "",
        combine: false,
        bindResize: false,
        clearLabel: "View all brands"
    });
    $.root.find("nav.local-nav").domUpdated()
}
;
HAB.addSelectedIndicator = function() {
    var b = "#searchResult"
      , e = ".filter-set"
      , l = ".prod-filter-nav"
      , a = "disabled"
      , c = "active"
      , h = ".filter-list-item"
      , k = "#filters-open"
      , f = ".mobile-filter-btn"
      , g = ".filter-menu-footer .filter-clear-all"
      , d = $(b).find("input:checked");
    d.parents(e).addClass(c).parents(h).find(f).addClass(c);
    d.parents(b).find(k).addClass(c);
    d.parents(b).find(g).removeClass(a);
    d.parents(l).addClass(c)
}
;
HAB.collapseLocalNav = function(b) {
    if (!$.root.find("nav.local-nav").length) {
        return
    }
    if (typeof (HAB.__localNav) === "undefined") {
        HAB.initLocalNav()
    }
    HAB.__localNav.trigger("stateChange", b);
    var a = HAB.__localNav.find(".current a").attr("href");
    HAB.__localNav.parent().children("select").find('option[value="' + a + '"]').attr("selected", "selected")
}
;
HAB.setupMobileMenu = function() {
    var e = $.root.find(".main-nav")
      , b = e.find("[role=menubar]")
      , f = $('<div class="main-nav-bt-wrap"></div>')
      , d = $('<div class="main-nav-bt"></div>')
      , c = $('<span class="ico ico-expand"></span>')
      , a = function() {
        if (b.hasClass("is-expanded")) {
            d.html("Hide menu");
            c.removeClass("ico-expand").addClass("ico-collapse").prependTo(d)
        } else {
            d.html("Browse the store");
            c.removeClass("ico-collapse").addClass("ico-expand").prependTo(d)
        }
    };
    d.appendTo(f);
    if (!$.root.find(".main-nav-bt").length) {
        f.insertAfter(e)
    }
    if ($("body").hasClass("t-home")) {
        b.addClass("is-expanded")
    } else {
        if (!$("html").hasClass("lt-ie9")) {
            b.hide()
        }
    }
    a();
    d.click(function() {
        b.slideToggle().toggleClass("is-expanded");
        a()
    })
}
;
HAB.undoMobileMenu = function() {
    $.root.find(".main-nav ul").show()
}
;
HAB.setUpImageToggle = function() {
    var a = $.root.find("form.page-display");
    a.on("change", ".image-toggle input[type=checkbox]", function() {
        setTimeout(function() {
            a.submit()
        }, 10)
    })
}
;
HAB.checkProdInfoOverflow = function() {
    if (!$.root.find(".prod-desc .target").is("*")) {
        $.root.find(".prod-desc .overflow").hide()
    }
    if (!$.root.find(".prod-facts .target").is("*")) {
        $.root.find(".prod-facts .overflow").hide()
    }
}
;
HAB.setupProdTeasers = function() {
    if ($(".l-switcher.large-vp").length) {
        return
    }
    var a = $.root.find(".prod-teaser-block").not(".new-prod-teaser-block");
    var b = $("<fieldset />").addClass("l-switcher large-vp");
    var d = $("<button />").addClass("l-switcher-grid").attr({
        title: "Switch to grid view",
        type: "button",
        onclick: 'setViewMode("grid");'
    }).appendTo(b);
    var c = $("<button />").addClass("l-switcher-list").attr({
        title: "Switch to list view",
        type: "button",
        onclick: 'setViewMode("list");'
    }).appendTo(b);
    b.insertBefore($.root.find(".page-limit"));
    if (a.hasClass("is-grid")) {
        SFR.disableElem(d);
        SFR.enableElem(c)
    } else {
        SFR.disableElem(c);
        SFR.enableElem(d)
    }
    c.click(function() {
        a.removeClass("is-grid").addClass("is-list");
        $(".prod-teaser-block").not(".new-prod-teaser-block").find(".prod-quickbuy-container:hidden").show();
        SFR.disableElem(c);
        SFR.enableElem(d);
        HAB.truncateText(".prod-teaser-block.is-list .prod-desc")
    });
    d.click(function() {
        a.addClass("is-grid").removeClass("is-list");
        $(".prod-quickbuy-container:visible").hide();
        SFR.disableElem(d);
        SFR.enableElem(c);
        $.root.find(".prod-teaser-item").each(function() {})
    });
    HAB.hookProdQuickBuy()
}
;
HAB.setProdTeaserMobileView = function() {
    HAB.setViewMode("list")
}
;
HAB.setProdTeaserDesktopView = function() {
    if (typeof (setViewMode) != "undefined") {
        setViewMode()
    } else {
        HAB.setViewMode("grid")
    }
}
;
HAB.setViewMode = function(d) {
    var a;
    if (typeof (d) == "undefined") {
        a = "grid"
    } else {
        a = d
    }
    if (!$("body").hasClass(".t-product")) {
        if (a == "list") {
            $(".teaser-block.prod-teaser-block").attr("class", "teaser-block prod-teaser-block clearfix is-list")
        } else {
            $(".l-prod-col.prod-img-wrapper").removeAttr("style");
            $(".prod-info").parent().attr("class", "l-prod-col");
            $(".teaser-block.prod-teaser-block").attr("class", "teaser-block prod-teaser-block clearfix is-grid")
        }
        var b = $("#gridViewMode").val();
        var c = (a === "grid");
        if (typeof b !== "undefined" && b != String(c)) {
            $("#gridViewMode").val(c);
            $("#gridViewMode").closest("form").ajaxSubmit()
        }
    }
}
;
HAB.hookProdQuickBuy = function() {
    $(".prod-quickbuy-container input[type=submit]").on("click", function(h) {
        var o = $(this).parents(".prod-teaser-item")
          , c = o.find("form")
          , n = o.offset();
        if (o.parents().hasClass("is-list") || (c.length === 0)) {
            return true
        }
        var g = $('<div class="quickbuy-container prod-teaser-item lightbox-container"><div class="masq"></div></div>').appendTo($.root).hide()
          , d = $('<form class="content clearfix prod-teaser-form quick-buy" action="#" method="post"><a href="#" class="lb-close lb-close-main">Close</a></form>').appendTo(g);
        var p = (o.find(".prod-img").clone());
        p.prop({
            id: "quickBuyProduct"
        });
        var f = o.find(".prod-quickbuy-container").clone();
        f.find(".fake-submit").hide();
        d.append(p).append(o.find(".prod-title").clone()).append(f);
        var k = d.find(".prod-quickbuy-container");
        g.find(".masq, .lb-close").on("click", function() {
            g.fadeOut(100, function() {
                $(this).remove()
            });
            return false
        });
        var a = d.find(".prod-submit-bt");
        d.on("submit", function() {
            var q = d.find(".checked").length;
            if (!q) {
                return false
            }
            a.prop("disabled", true);
            k.addClass("loading");
            d.find(".quickbuy-message").remove();
            var e = c.data("ajax-url");
            if ((e === undefined) || (e === "")) {
                e = c.attr("action")
            }
            $.post(e, $(this).serialize(), function(t) {
                $(t).appendTo(d).addClass("quickbuy-message");
                var s = c.data("refresh-url");
                if (c.data("refresh-url")) {
                    $.root.find(".js-header-basket-link").load(s)
                }
                a.prop("disabled", false);
                k.removeClass("loading");
                var r = $(".basket-message.message-success.quickbuy-message").next(".basket-message.message-success.quickbuy-message").length;
                if (r) {
                    $(".basket-message.message-success.quickbuy-message").next(".basket-message.message-success.quickbuy-message").remove()
                }
            });
            return false
        });
        g.css({
            height: $.root.height(),
            width: $.root.width()
        });
        var l = (n.top - 30) + "px"
          , b = Math.min(n.left - Math.round((d.width() - o.width()) / 2), $.root.width() - d.width());
        if ((b + d.width() + 40) < $(window).width()) {
            d.css({
                top: l,
                left: b + "px"
            })
        } else {
            if (navigator.userAgent.match(/iPad/i)) {
                d.css({
                    top: l,
                    left: (b - (d.width() - o.width())) + "px"
                })
            } else {
                d.css({
                    top: l,
                    right: 0
                })
            }
        }
        d.find("[name=prod-qty-field]").inlineValidation();
        g.fadeIn(400);
        var m = $(".quickbuy-container .quick-buy");
        if (m.offset().top < $(window).scrollTop()) {
            $("html, body").animate({
                scrollTop: m.offset().top
            }, 400)
        } else {
            if (m.offset().top + m.height() + 110 > $(window).scrollTop() + $(window).height()) {
                $("html, body").animate({
                    scrollTop: (m.offset().top + m.height() - $(window).height()) + 110
                }, 400)
            }
        }
        $(".quickbuy-container .quick-buy .prod-size-opts input:radio:checked").change();
        return false
    });
    $("article.prod-teaser-item").each(function() {
        var d = $(this)
          , a = d.parents(".prod-teaser-block").eq(0)
          , b = d.find(".prod-quickbuy-container")
          , c = null;
        d.find(".prod-img-wrapper").add(b);
        d.on("mouseenter", function() {
            clearTimeout(c);
            if (a.hasClass("is-grid")) {
                b.show()
            }
        }).on("mouseleave", function(e) {
            clearTimeout(c);
            if (!a.hasClass("is-grid")) {
                return
            }
            c = setTimeout(function() {
                b.hide()
            }, 100)
        })
    })
}
;
HAB.reflowSubCatPage = function() {
    $.root.find("section.prod-teaser-block").not(".new-prod-teaser-block").each(function() {
        var c = $(this)
          , b = c.children("footer")
          , a = null;
        if (!c.find("header").is("*")) {
            a = $('<header class="prod-teaser-header"/>').prependTo(c);
            a.append(b.children());
            b.append(a.find(".list-pagination").clone())
        }
    })
}
;
HAB.initProdFilters = function() {
    $(document).on("click", ".reveal-link", function() {
        var a = $(this).closest("[data-conceal]");
        if (!a.is(".revealed")) {
            SFR.Utils.scrollTo(a)
        }
    })
}
;
HAB.setupTooltips = function() {
    $.root.find(".tooltip-target").hide();
    function a() {
        $.root = $.root || $(document.body);
        $.root.find(".tooltip-target.is-visible").removeClass("is-visible").fadeOut(100)
    }
    function b(c) {
        if (c.type === "click") {
            if ($("body").hasClass("breakpoint-220")) {
                return
            }
        }
        $.root = $.root || $(document.body);
        if ($.root.find(".tooltip-target.is-visible").length) {
            a()
        }
    }
    $.root.on("click", ".tooltip .trigger", function(c) {
        c.stopPropagation();
        if ($(this).parents(".tooltip").find(".tooltip-target").hasClass("is-visible")) {
            $(document).off("click touchstart", b);
            a()
        } else {
            $(document).one("click touchstart", b);
            a();
            $(this).parents(".tooltip").find(".tooltip-target").fadeIn().toggleClass("is-visible").show()
        }
    });
    $(window).scroll(function() {
        a()
    });
    $.root.on("click touchstart", ".tooltip-target", function(c) {
        c.stopPropagation()
    });
    $.root.bind("ajaxifyHabForm.complete", function(c) {
        HAB.setupTooltips()
    })
}
;
HAB.reflowPageNotice = function() {
    $.root.find(".l-five-sixths .notice").insertBefore("#content .page .crumb")
}
;
HAB.hookContentLightbox = function(e) {
    var a = $('<div class="preview-container lightbox-container"><div class="masq"></div></div>').appendTo($.root).css({
        height: $.root.height(),
        width: $.root.width()
    })
      , d = $('<div class="content single-image clearfix"><a href="#" class="lb-close lb-close-main">Close</a></div>').appendTo(a);
    a.find(".masq, .lb-close").on("click", function() {
        a.fadeOut(100, function() {
            $(this).remove()
        });
        return false
    });
    var h = $('<img src="' + e.attr("href") + '" alt="Email preview" />').appendTo(d);
    var b = $(window)
      , g = 100
      , c = b.width() - g
      , f = b.height() - g;
    h.css({
        "max-width": c,
        "max-height": f
    });
    h.load(function() {
        var k = $(this).width()
          , l = $(this).height();
        d.css({
            top: b.scrollTop() + ((b.height() - d.height()) / 2),
            left: (b.width() - d.width()) / 2
        })
    })
}
;
HAB.hookFacetedSearch = function() {
    var d = $("form.prod-filters")
      , e = null
      , a = $(window)
      , c = false
      , b = null;
    if (d.length === 0) {
        return false
    }
    function f() {
        d.find(":input").each(function() {
            if ($(this).prop("checked")) {
                c = true;
                $(this).parents(".filter-set").addClass("selected");
                return
            }
        });
        if (c) {
            if (!$("a.filter-clear-all").is("*")) {
                b = $(document.createElement("a"));
                b.attr({
                    href: "#",
                    "class": "filter-clear-all",
                    title: "Clear all filters"
                }).html("Clear all");
                b.on("click", function(h) {
                    d.find(":input").each(function() {
                        $(this).prop("checked", false)
                    });
                    b.remove();
                    g();
                    h.preventDefault()
                });
                d.find(".active-prod-filters").after(b)
            }
        }
    }
    f();
    if (d.hasClass("is-disabled")) {
        d.find("label").each(function() {
            var h = $(this);
            h.addClass("disabled");
            SFR.disableElem(h.find("input"))
        });
        return false
    }
    d.bind("change", ":input", function(h) {
        clearTimeout(e);
        f();
        e = setTimeout(g, 200);
        return true
    });
    function g() {
        var h = d.data("ajax-url");
        if ((h === undefined) || (h === "")) {
            h = d.attr("action")
        }
        HAB.blocker.block("Updating results");
        $.post(h, d.serialize(), function(k) {
            $("section.prod-teaser-block").not(".new-prod-teaser-block").html(k);
            HAB.blocker.unblock();
            SFR.Utils.activateSelectListNavs(".page-limit");
            HAB.setupProdTeasers();
            HAB.reflowSubCatPage();
            d.domUpdated();
            HAB.addSubmitIcons();
            HAB.hookProductSubmitButton()
        })
    }
}
;
HAB.hookSignupTeaser = function() {
    $(".signup-teaser").on("submit", "form", function(d) {
        d.preventDefault();
        var c = $(this)
          , a = c.data("ajax-url")
          , b = (c.attr("method") === "get") ? $.get : $.post;
        if (a === undefined) {
            a = c.attr("action")
        }
        if ($(this).closest("form").attr("id") === "signUpMonthlyForm") {
            SFR.Utils.showAjaxButtonLoader($(this).find(".js-submit-teaser-form"))
        } else {
            c.find("input[type=submit]").val("Please wait").prop("disabled", true)
        }
        b(a, c.serialize(), function(f) {
            if (!f.trim()) {
                try {
                    c.replaceWith($(c).find(".subscribed-notification.error").removeClass("hidden"))
                } catch (e) {}
            } else {
                c.replaceWith(f)
            }
        })
    })
}
;
HAB.hookProductSubmitButton = function() {
    $.root.off("submit", "form.prod-teaser-form, form.prod-form, form.fav-form, .adobe-recommendation form");
    $.root.on("submit", "form.prod-teaser-form, form.prod-form, form.fav-form, .adobe-recommendation form", function() {
        var d = $(this)
          , c = d.find(".prod-submit-bt")
          , a = (d.attr("method").toLowerCase() === "get") ? $.get : $.post
          , b = d.data("ajax-url");
        $.ajaxSetup({
            cache: false
        });
        if ((b === undefined) || (b === "")) {
            b = d.attr("action")
        }
        a(b, d.serialize(), function(g) {
            var f = $(g).appendTo(c.parent()).hide().slideDown()
              , h = $.root.find(".js-header-basket-link")
              , e = $(".js-header-basket-link", parent.parent.document);
            sBasketUri = null;
            c.setKeyboardFocus();
            f.siblings(".ajaxed").slideUp(400, function() {
                $(this).remove()
            });
            f.addClass("ajaxed").find(".bh-ajax-loader").habAjaxLoader();
            if (!((h.length === 0) || ((sBasketUri = h.data("refresh-url")) === undefined))) {
                h.load(sBasketUri)
            }
            if (!((e.length === 0) || ((sBasketUri = e.data("refresh-url")) === undefined))) {
                e.load(sBasketUri)
            }
            HAB.postFormSubmit(d, c, g)
        });
        return false
    })
}
;
HAB.postFormSubmit = function(c, a, d) {
    var b = $(d);
    if (!b.hasClass("js-add-to-cart-error")) {
        if (a.hasClass("js-og-update-cart")) {
            HAB.orderGroove.updateCart(a)
        }
    }
}
;
HAB.setupAddToFavourites = function() {
    $.root.find(".prod-form .prod-size-opts input").on("change", function() {
        var a = $.root.find(".prod-fav-opt");
        if (a.find("div").hasClass("success")) {
            if (a.find(".success").data("bh-url") !== undefined) {
                $.ajax({
                    url: a.find(".success").data("bh-url"),
                    type: "GET",
                    cache: false,
                    success: function(b) {
                        a.html(b);
                        $.root.domUpdated()
                    }
                })
            }
        }
    })
}
;
HAB.setupProdOptImages = function() {
    $.root.find(".prod-form .prod-size-opts input").on("click", function() {
        var b = $(this).data("image-url");
        if (typeof (b) === "undefined") {
            return
        }
        var a = $(".prod-img-container");
        a.css({
            width: a.width(),
            height: a.height()
        });
        a.addClass("loading").empty();
        a.load(b, function() {
            a.css({
                width: "",
                height: ""
            }).removeClass("loading");
            HAB.pdpProductCarousel.init()
        })
    })
}
;
HAB.setupProdOptOffers = function() {
    $.root.find(".prod-form .prod-size-opts input").on("change", function() {
        var c = $(this).data("offers");
        var a = $(".prod-offers");
        var b = $(document.createDocumentFragment());
        if (typeof (c) !== "undefined") {
            $.each(c.split(","), function(d, e) {
                b.append("<li>" + $.trim(e) + "</li>")
            });
            a.append(b)
        }
    })
}
;
HAB.pdp = {
    init: function() {
        $(".js-product-container").each(function() {
            var a = $(this);
            HAB.pdp.initSkus(a)
        });
        if ($("#bundle-description").length) {
            $(".prod-cust-opts .prod-qty.quantity-selectbox-holder").show();
            $(".prod-cust-opts .prod-submit.prod-submit-basket").show();
            $(".prod-item .l-wrap .l-one-half:first-child .product-nutrition.desktop-hidden").removeClass("desktop-hidden").addClass("bundle-nutrition");
            $(".prod-item .l-wrap .l-one-half + .l-one-half .product-nutrition.js-nutrition-container").remove()
        }
        $(".js-description-container").each(function() {
            var a = $(this);
            HAB.pdp.initNutritions(a)
        });
        HAB.pdp.showMoreLessReset();
        HAB.pdp.showPDPMoreLess();
        if (HAB.isMobile()) {
            HAB.pdp.bindPDPMoreLessMobile()
        } else {
            HAB.pdp.bindPDPMoreLessDesktop()
        }
        HAB.fixReviewsPosition.init();
        if ($("body").hasClass("t-product")) {
            HAB.pdp.pdpExpressCheckout()
        }
    },
    initSkus: function(a) {
        a.on("click", ".js-select-sku", HAB.pdp.selectSku);
        a.on("change", ".js-bundle-items", HAB.pdp.selectBundleSku);
        a.on("click", ".js-show-emwa-popup", HAB.pdp.showEMWAPopup);
        HAB.pdp.initExitMessage()
    },
    initNutritions: function(a) {
        a.on("change", ".js-bundle-items", HAB.pdp.selectNutrition)
    },
    showEMWAPopup: function(a) {
        SFR.Utils.showPopup({
            url: "/common/popup/emwaPopup.jsp",
            data: $(this).data(),
            init: function(e) {
                e.on("click", ".js-register-emwa-request", d);
                e.find("form").on("submit", d);
                e.find("input").inlineValidation()
            }
        });
        function d() {
            var e = $(this).closest("form");
            e.ajaxSubmit({
                success: function(g) {
                    var f = $(g);
                    if (f.hasClass("js-error")) {
                        c(e, f)
                    } else {
                        b(f)
                    }
                },
                error: console.error
            });
            return false
        }
        function c(e, f) {
            e.find(".js-error-messages").html(f)
        }
        function b(e) {
            SFR.Utils.showPopup({
                content: e
            })
        }
    },
    selectSku: function() {
        var a = $(this);
        HAB.pdp.updatePDP(a.data())
    },
    selectNutrition: function() {
        var a = $(this);
        var c = a.find("option:selected");
        skuId = $(c).data("sku");
        var b = {
            skuId: skuId,
            productId: a.data("productId"),
            displayName: a.data("displayName"),
            bundleSkuId: a.data("bundleSkuId"),
            isNutrition: true,
            isBundlePage: false
        };
        HAB.pdp.updateNutrition(b)
    },
    selectBundleSku: function() {
        var b = $(this);
        var e = b.find("option:selected");
        var d = a(e);
        if (d.length > 1) {
            skuId = g(d, b)
        } else {
            skuId = d[0]
        }
        var c = {
            skuId: skuId,
            productId: b.data("productId"),
            displayName: b.data("displayName"),
            isBundle: true
        };
        HAB.pdp.updatePDP(c);
        function a(h) {
            return $(h).data("bundle-skus")
        }
        function g(l, h) {
            var k = h.siblings("select");
            for (i = 0; i < k.length; i++) {
                var m = a($(k[i]).find("option:selected"));
                var n = f(l, m);
                l = (n.length > 0) ? n : l
            }
            return l[0]
        }
        function f(l, k) {
            var h = new Array();
            for (i = 0; i < l.length; i++) {
                for (j = 0; j < k.length; j++) {
                    if (l[i] == k[j]) {
                        h.push(l[i])
                    }
                }
            }
            return h
        }
    },
    updateNutrition: function(a) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/browse/json/selectSkuForPDP.jsp",
            data: a,
            success: function(b) {
                HAB.pdp.setNutritionInfo(b.skuNutritionInfoBundle);
                $(".product-nutrition .pdp-accordion-title").removeClass("pdp-accordion-closed").addClass("pdp-accordion-opened");
                HAB.pdp.showMoreLessReset();
                HAB.pdp.showPDPMoreLess();
                if (HAB.isMobile()) {
                    HAB.pdp.bindPDPMoreLessMobile()
                } else {
                    HAB.pdp.bindPDPMoreLessDesktop()
                }
            }
        })
    },
    setNutritionInfo: function(a) {
        if ($(".product-nutrition").length > 0) {
            if (a == "") {
                $(".product-nutrition").remove()
            } else {
                $(".product-nutrition").replaceWith(a)
            }
        } else {
            if (a != "") {
                $(".ps-wrapper").after(a)
            }
        }
    },
    updatePDP: function(q) {
        var m = q.skuId;
        c(m);
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/browse/json/selectSkuForPDP.jsp",
            data: q,
            success: function(s) {
                g(m);
                $(".skuImage").html(s.images);
                a(m);
                k(m, s.isSkuEligible);
                h(m);
                r(m);
                o();
                if ($(".prod-fav-opt").length > 0) {
                    $(".prod-fav-opt").html(s.isFavourite)
                }
                p(s.price);
                e();
                f(m, s.unit_price, s.unit_sale_price, s.thumbnail_url, s.stock, s.size);
                b(s.description);
                l(s.title);
                HAB.pdpProductCarousel.init();
                if (HAB.isMobile()) {
                    if (!$(".pdp-accordion .pdp-accordion-opened + .pdp-accordion-content #skuDescription").length) {
                        $(".pdp-accordion .pdp-accordion-item .pdp-accordion-opened + .pdp-accordion-content").slideToggle(500);
                        $(".pdp-accordion div:not(#skuDescription)>.pdp-accordion-item .pdp-accordion-opened").removeClass("pdp-accordion-opened").addClass("pdp-accordion-closed");
                        $(".pdp-accordion > .l-one-half:first-child > .pdp-accordion-item:first-child .pdp-accordion-title").addClass("pdp-accordion-opened");
                        $(".pdp-accordion .pdp-accordion-item .pdp-accordion-opened + .pdp-accordion-content").slideToggle(500)
                    }
                }
                d(s.bundleDescription);
                $("select.item-quantity-selectbox").each(function() {
                    $(this).prop("selectedIndex", 0)
                });
                HAB.pdp.showMoreLessReset();
                HAB.pdp.showPDPMoreLess();
                if (HAB.isMobile()) {
                    HAB.pdp.bindPDPMoreLessMobile()
                } else {
                    HAB.pdp.bindPDPMoreLessDesktop()
                }
            }
        });
        function d(s) {
            if (s && s != "") {
                $("#bundle-description").replaceWith(s)
            }
        }
        function c(s) {
            var u = $("#js-products-bundle");
            var t = "";
            if (u && u.data("href")) {
                t = u.data("href")
            }
            if (t) {
                u.data("href", t.match(/^\/\w.*\=/) + s);
                HAB.loadingContent(u)
            }
        }
        function b(s) {
            $("#skuDescription").html(s)
        }
        function n(s) {
            $("ul.prod-offers").html(s)
        }
        function l(s) {
            $(".page-title .prod-title").text(s);
            HAB.pdp.initExitMessage()
        }
        function a(s) {
            $("#favouriteform #catalogRefIds").val(s);
            var t = "transient:";
            var u = $("#favouriteform .sessionParamSkuId");
            if (!!u.val() && u.val().indexOf(t) != -1) {
                u.val(t + s)
            } else {
                u.val(s)
            }
        }
        function k(t, u) {
            var s = $(".og-pdp-add-to-basket .prod-submit-bt");
            if (s.is(":visible")) {
                if (u) {
                    s.data("og-product", t);
                    s.data("quantity", 1);
                    HAB.orderGroove.setProduct(s);
                    s.addClass("js-og-update-cart");
                    $(".og-pdp").show()
                } else {
                    s.removeClass("js-og-update-cart");
                    $(".og-pdp").hide()
                }
            }
        }
        function h(s) {
            $(".prod-submit .prodSubmitSkuId").val(s)
        }
        function r(s) {
            $("#js-paypal-form-sku").val(s)
        }
        function g(s) {
            $(".js-rr-add-to-cart").data("rr-sku-id", s)
        }
        function o() {
            $(".prod-qty #prod_qty").val(1)
        }
        function p(s) {
            $(".page-title .prod-title-info").html('<span class="sku-price">' + s + "</span>")
        }
        function e() {
            $(".prod-submit-bt").siblings(".basket-message").remove()
        }
        function f(s, u, t, v, x, w) {
            if (!!window.universal_variable && window.universal_variable.product) {
                window.universal_variable.product.sku_code = s;
                window.universal_variable.product.unit_price = parseFloat(u);
                window.universal_variable.product.unit_sale_price = parseFloat(t);
                window.universal_variable.product.thumbnail_url = v;
                window.universal_variable.product.stock = parseInt(x);
                window.universal_variable.product.size = w
            }
            (window.uvAddEvent || function() {}
            )({
                category: "product_detail_page",
                action: "sku_change"
            });
            HAB.callTealiumView()
        }
    },
    initExitMessage: function() {
        var a;
        $(".page-title .prod-title").on("mouseup", function() {
            if (window.getSelection().toString()) {
                $(".exit-message").addClass("show");
                clearTimeout(a);
                a = window.setTimeout(function() {
                    $(".exit-message").removeClass("show")
                }, 5000)
            }
        });
        $(".exit-message").mouseenter(function() {
            clearTimeout(a)
        });
        $(".exit-message").mouseleave(function() {
            clearTimeout(a);
            a = window.setTimeout(function() {
                $(".exit-message").removeClass("show")
            }, 2000)
        })
    },
    showPDPMoreLess: function() {
        $(".pdp-accordion-content").each(function() {
            if ($(this).height() > "250" && $(this).find(".pdp-content-more-less-container")) {
                $(this).addClass("pdp-content-show-more-less pdp-content-show-more")
            }
        })
    },
    bindPDPMoreLessMobile: function() {
        $(".js-pdp-content-more-less-button").on("click", function(a) {
            a.preventDefault();
            $(this).parents(".pdp-accordion-content").toggleClass("pdp-content-show-more pdp-content-show-less");
            SFR.Utils.scrollTo($(this).parents(".pdp-accordion-item"))
        })
    },
    bindPDPMoreLessDesktop: function() {
        $(".js-pdp-content-more-less-button").on("click", function(a) {
            a.preventDefault();
            $(this).parents(".pdp-accordion-content").toggleClass("pdp-content-show-more pdp-content-show-less")
        })
    },
    showMoreLessReset: function() {
        $(".js-pdp-content-more-less-button").off("click");
        if ($(".pdp-accordion-container").find(".pdp-content-show-more-less").length) {
            $(".pdp-content-show-more-less").each(function() {
                $(this).removeClass("pdp-content-show-more-less").removeClass("pdp-content-show-less").removeClass("pdp-content-show-more")
            })
        }
    },
    pdpExpressCheckout: function() {
        var a = $(".og-pdp").length;
        if (a) {
            HAB.hidePayPal = setInterval(function() {
                var d = $(".og-pdp .og-radio-group").html()
                  , c = $(".og-pdp").length
                  , e = $(".og-pdp .og-offer-iu").html()
                  , b = $(".pdp-express-checkout-block");
                if (d && c) {
                    $(".js-product-container .og-option-row input").on("change", function(f) {
                        var g = +f.currentTarget.value === 0;
                        b.toggle(g)
                    });
                    if (!e) {
                        b.removeClass("hidden")
                    }
                    clearInterval(HAB.hidePayPal)
                } else {
                    if (e) {
                        clearInterval(HAB.hidePayPal)
                    }
                }
            }, 1000)
        }
        HAB.initExpressPayPal()
    }
};
HAB.initBasket = function() {
    HAB.hookBasketRepeat();
    HAB.hookBasketShippingCosts();
    HAB.hookScrollToRFLBlock();
    if ($("html").hasClass(".no-opacity")) {
        $.root.find(".basket-product.is-zero").find(".product div.img").fadeTo("", 0.5)
    }
    HAB.hookBasketRflSection();
    HAB.basket.hookChangeRflCard();
    HAB.basket.hookScanRflBarcode();
    HAB.submitSoftGoodFromGiftlist.init();
    HAB.basket.showDeliveryWarning();
    HAB.basketExpressPayPal.init();
    HAB.basket.deliveryVan.init();
    if ($(".unavailable-items-message").length) {
        HAB.basket.hookRemoveUnavailableItems();
        HAB.basket.unavailableItemsList();
        HAB.basket.skipRemoveUnavailableItems();
        HAB.basket.scrollToUnavailableItemsMsg(".js-checkout-button")
    }
    window.paypalCheckoutReady = function() {
        HAB.initExpressPayPal()
    }
}
;
HAB.basketExpressPayPal = {
    init: function() {
        this.config = {
            paypalForm: "#js-express-paypal-form",
            paypalFormSaveAccountField: ".js-save-paypal-account-field",
            paypalFormEmailField: ".js-paypal-email-field",
            paypalAccountSelectBox: ".js-paypal-accounts-select",
            paypalAccountOptionLit: ".js-paypal-accounts-options-list",
            paypalDropdownOption: ".option",
            paypalAccountMessage: ".js-paypal-account-message",
            paypalAccountSubscriptionMessage: ".js-subscription-message",
            paypalSaveAccountCheckbox: ".js-save-paypal-account-checkbox",
            paypalSubmitBtn: "#js-express-paypal-button",
            paypalExpressBtn: ".js-paypal-express-btn",
            paypalPayNowBtn: ".js-paypal-pay-now-btn"
        },
        HAB.customDropdown(this.config.paypalAccountSelectBox, this.config.paypalAccountOptionLit, this.config.paypalDropdownOption, HAB.basketExpressPayPal.deliveryFormData.bind(HAB.basketExpressPayPal));
        $(this.config.paypalSaveAccountCheckbox).on("click", function() {
            var a = HAB.basketExpressPayPal.config
              , b = $(this).is(":checked");
            $(a.paypalFormSaveAccountField).val(b)
        })
    },
    deliveryFormData: function() {
        var a = this.config
          , b = $(a.paypalAccountSelectBox).find(".active-option").children();
        $(a.paypalSubmitBtn).removeClass("disabled");
        if (b.data("paypal-account") == "account-email") {
            $(a.paypalForm).find(a.paypalFormEmailField).val(b.data("paypal-id"));
            $(a.paypalFormSaveAccountField).val("false");
            $(a.paypalSaveAccountCheckbox).attr("checked", false);
            $(a.paypalExpressBtn).hide();
            $(a.paypalSaveAccountCheckbox).parent().addClass("hidden");
            $(a.paypalPayNowBtn).removeClass("hidden");
            $(a.paypalAccountMessage).addClass("hidden");
            if ($(a.paypalAccountSubscriptionMessage)[0]) {
                $(a.paypalAccountSubscriptionMessage).removeClass("hidden")
            }
        } else {
            $(a.paypalForm).find(a.paypalFormEmailField).val("");
            $(a.paypalAccountMessage).removeClass("hidden");
            $(a.paypalPayNowBtn).addClass("hidden");
            $(a.paypalSaveAccountCheckbox).parent().removeClass("hidden");
            $(a.paypalExpressBtn).show();
            if ($(a.paypalAccountSubscriptionMessage)[0]) {
                $(a.paypalAccountSubscriptionMessage).removeClass("hidden")
            }
        }
    }
};
HAB.hookBasketRepeat = function() {
    $("article.basket-row input.prod-repeat-in").on("change", function() {
        var d = $(this)
          , c = d.parents("article").eq(0)
          , b = d.data("ajax-url")
          , a = null;
        if ((b === undefined) || (b === "")) {
            return true
        }
        if (d.is(":checked")) {
            a = $('<span class="ico ico-wait"></span>').css({
                height: d.height(),
                width: d.width()
            }).insertAfter(d.hide());
            $.get(b, null, function(e) {
                d.show();
                a.remove();
                c.append(e)
            });
            d.parents("dd").eq(0).height(c.height()).addClass("open")
        } else {
            c.find("fieldset.basket-repeat").remove();
            d.parents("dd").eq(0).removeClass("open")
        }
        return true
    })
}
;
HAB.hookBasketShippingCosts = function() {
    $("section.s-basket").on("change", "select.basket-shipping-sel", function() {
        var b = $(this)
          , d = b.parents("section").eq(0)
          , c = b.data("ajax-url")
          , a = $('<div class=""></div>').appendTo(d);
        if ((c === undefined) || (c === "")) {
            return true
        }
        d.find(".clear-on-submit").empty();
        if (d.children("aside.basket-rewards").is(":visible")) {
            d.children("aside.basket-rewards").slideUp()
        }
        $.get(c, b.serialize(), function(e) {
            d.find("dl").replaceWith(e);
            a.remove();
            d.domUpdated()
        });
        return true
    })
}
;
HAB.hookScrollToRFLBlock = function() {
    if (location.hash === "#update-coupon") {
        var b = $(".js-basket-item").length;
        var a = 0;
        if (b > 1) {
            a = b - 2
        }
        $(".js-basket-item").eq(a).attr("id", "update-coupon")
    }
}
;
HAB.limitChars = function() {
    function a(l, k, h, c) {
        var g = ""
          , f = -1
          , d = new RegExp(h,"i")
          , b = [];
        if (!k) {
            k = window.event
        }
        if (k.keyCode) {
            f = k.keyCode
        } else {
            if (k.which) {
                f = k.which
            }
        }
        g = $(l).val().slice(c - 1, c);
        b = [13, 8, 39, 9, 37];
        if (!k.ctrlKey && !k.metaKey && $.inArray(f, b) === -1) {
            if (d.test(g)) {
                return true
            } else {
                return false
            }
        }
        return true
    }
    $.root.on("keyup", "input[data-safe-chars]", function(c) {
        var b = 0
          , e = "";
        var f = $(this).attr("data-safe-chars").toString();
        b = SFR.Utils.getCaret($(this).get(0));
        if (!a(this, c, f, b)) {
            var d = $(this).val().slice(b - 1, b);
            if (d == "") {} else {
                e = $(this).val().replace(d, "");
                $(this).val(e);
                $(this).caretTo(b - 1, 1)
            }
        }
    })
}
;
HAB.truncateText = function(a) {
    var d = $(a)
      , e = 300
      , b = $(a).data("char-length")
      , c = b ? b : e;
    if (d.hasClass("is-truncated")) {
        return
    }
    d.jTruncate({
        length: c,
        moreText: "Show More",
        lessText: "Show Less"
    }).addClass("is-truncated")
}
;
HAB.hookQtyButtons = function() {
    var a = null;
    $("input.in-qty-control").each(function() {
        var h = $(this)
          , d = parseInt(h.attr("min"), 10)
          , b = parseInt(h.attr("max"), 10)
          , e = parseInt(h.attr("step"), 10)
          , f = 0;
        if (h.siblings("button").length > 0) {
            return true
        }
        if (isNaN(d)) {
            d = Number.NEGATIVE_INFINITY
        }
        if (isNaN(b)) {
            b = Number.POSITIVE_INFINITY
        }
        if (isNaN(e)) {
            e = 1
        }
        var g = $('<button type="button" class="minus">-</button>');
        g.insertBefore(h).on("click", function() {
            if (h.val() !== "") {
                var k = parseInt(h.val(), 10) - 1;
                h.val(k).triggerHandler("blur");
                resetSkuQuantityForOG(k);
                c.prop("disabled", false);
                if (k - 1 < d) {
                    g.prop("disabled", true)
                } else {
                    if (k < d) {
                        h.val(d)
                    } else {
                        if (k > b) {
                            h.val(b)
                        }
                    }
                }
            } else {
                $(".in-qty-control").val(parseInt(prodQuantity))
            }
            return false
        });
        var c = $('<button type="button" class="plus">+</button>');
        c.insertAfter(h).on("click", function() {
            if (h.val() !== "") {
                var k = parseInt(h.val(), 10) + 1;
                h.val(k).triggerHandler("blur");
                resetSkuQuantityForOG(k);
                g.prop("disabled", false);
                if (k < d) {
                    h.val(d)
                } else {
                    if (k > b) {
                        h.val(b)
                    }
                }
                if (k + 1 > b) {
                    c.prop("disabled", true)
                }
            } else {
                $(".in-qty-control").val(parseInt(prodQuantity))
            }
            return false
        });
        if (h.val() == d) {
            g.prop("disabled", true)
        } else {
            if (h.val() == b) {
                c.prop("disabled", true)
            }
        }
        if (c.parents(".myFav").length > 0) {
            c.add(g).click(function(l) {
                l.preventDefault();
                var k = $(this).closest(".quantity-wrapper").find("input");
                $("#giftlistItemId").val(k.attr("name"));
                $("#updateQuantity").val(k.attr("value"));
                k.attr("data-saved-valid-value", k.val());
                $("#itemNumb").val(k.attr("cnt"));
                $("#updateGiftlistItemsSmbt").click();
                $("#updateGiftlistItems").ajaxSubmit()
            })
        }
        if (h.prop("disabled")) {
            h.siblings("button").addClass("disabled").prop("disabled", true)
        }
        h.inlineValidation()
    })
}
;
HAB.__updateBasket = function(c) {
    var d = c.parents("form.f-basket").eq(0)
      , a = null
      , b = null;
    if (d.length === 0) {
        return false
    }
    d.append('<div class="masq"></div>');
    a = d.data("ajax-url");
    if ((a === undefined) || (a === "")) {
        a = d.attr("action")
    }
    b = (d.attr("method").toLowerCase() === "get") ? $.get : $.post;
    b(a, d.serialize(), function(e) {
        d.html(e);
        HAB.initBasket();
        HAB.hookQtyButtons();
        d.domUpdated()
    })
}
;
HAB.hookRFLActivation = function() {
    $("body").bind("bh-triggered.bh-ajaxLoaded", function(b, a) {
        if (a && a.hasClass("rfl-activate")) {
            a.ajaxifyHabForm()
        }
    });
    $("#activateAccount").prop("disabled", true);
    $("#agreements").click(function(a) {
        if ($(this).is(":checked")) {
            $("#activateAccount").prop("disabled", false)
        } else {
            $("#activateAccount").prop("disabled", true)
        }
    })
}
;
HAB.hookBasketRflSection = function() {
    var h = $("#newRflCard");
    var f = $("#rflCardNumber");
    var m = $("#addRflCard");
    var b = $("#discountCode");
    var k = $("#addDiscount");
    var c = $("#studentCardNumber");
    var g = $(".js-addStudentDiscount");
    var a = h.attr("checked");
    if (a) {
        f.toggleDisabled();
        m.toggleDisabled()
    }
    h.click(function() {
        f.toggleDisabled();
        m.toggleDisabled()
    });
    $(".newRflCard").click(function(o) {
        $(this).closest("form").ajaxSubmit()
    });
    f.keypress(e(m));
    c.keypress(e(g));
    b.keypress(e(k));
    function e(o) {
        return function(p) {
            if (p.which == 13) {
                p.preventDefault();
                o.click()
            }
        }
    }
    m.click(function(o) {
        $("#js-barcode-capture").remove()
    });
    m.click(n(f));
    k.click(d(b, function(o) {
        HAB.basket.addDiscount(o, b.val())
    }));
    g.click(d(c, function() {
        var p = $(".js-discount-inputs");
        var o = $(".js-discount-msg");
        l(p, o)
    }));
    function d(p, o) {
        return function(q) {
            q.preventDefault();
            p.inlineValidation();
            if (p.val() == "") {
                p.trigger("blur")
            } else {
                o.call(this, q)
            }
        }
    }
    function n(o) {
        return d(o, function() {
            var r = $(this).closest("form");
            $(this).closest("form").append($("<input/>").attr({
                type: "hidden",
                name: $(this).attr("name"),
                value: $(this).attr("value")
            }));
            var q = $.root.find("#ajaxBasketModule");
            var p = HAB.basket.getRefreshURL();
            SFR.Utils.submitAjaxForm(r, q, p, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
        })
    }
    function l(p, o) {
        c.trigger("blur");
        if (c.parent().hasClass("error")) {
            return
        }
        p.hide();
        o.fadeIn(300);
        b.val($(".js-discount-code").text())
    }
}
;
HAB.__bBasketLoaded = false;
HAB.hookBasketFlyout = function() {
    var e = null
      , c = false
      , g = 100
      , f = 200
      , b = $("nav.utility-nav .basket-nav-item")
      , d = null
      , a = b.find("a").data("ajax-url");
    function h() {
        d.addClass("basket-loading").html("<p>Basket loading</p>");
        $.ajax({
            url: a,
            success: function(l) {
                d.removeClass("basket-loading").html(l);
                $(".mini-basket-holder footer a").setKeyboardFocus()
            },
            dataType: "html",
            cache: false
        });
        d.slideDown(100, function() {
            d.css("overflow", "")
        });
        c = true
    }
    function k() {
        d.slideUp(150);
        c = false
    }
    if ((a === undefined) || (a === "")) {
        return false
    }
    d = $('<div class="menu-flyout mini-basket-holder"></div>').hide().appendTo(b);
    b.on("mouseover", function() {
        $.ajaxSetup({
            cache: false
        });
        clearTimeout(e);
        if (!c) {
            e = setTimeout(h, g)
        }
    }).on("mouseout", function() {
        clearTimeout(e);
        if (c) {
            e = setTimeout(k, f)
        }
    })
}
;
HAB.hookLanguageSelection = function() {
    var a = $(".language-nav-item");
    var c = a.find(".language-dropdown");
    var b = false;
    a.find(".language-current").on({
        click: function(d) {
            d.preventDefault();
            a.toggleClass("arrow-up");
            c.toggleClass("show")
        },
        blur: function() {
            setTimeout(function() {
                if (!b) {
                    a.removeClass("arrow-up");
                    c.removeClass("show")
                }
            }, 200)
        }
    });
    c.on("click", ".language-select", function(d) {
        b = true;
        d.preventDefault();
        var f = $(this);
        window.location = f.attr("href")
    })
}
;
HAB.hookSpecialBehaviour = function() {
    var a = $("[data-conceal]");
    if (a.not(".revealed").is("*")) {
        a.revealConceal()
    }
    $.root.find(".bh-ajax-loader").habAjaxLoader()
}
;
HAB.postcodeLookup = {
    initialized: false,
    hiddenClass: "hdn",
    selectedAddressLayoutUrl: "/common/deliverToAddress.jsp",
    insertQasResults: function(a, b) {
        a.after(b)
    },
    clearQasResults: function(a) {
        a.siblings(".postcode-lookup-field").remove()
    },
    showSpinner: function(a) {
        a.addClass("loading")
    },
    hideSpinner: function(a) {
        a.removeClass("loading")
    },
    showCommonAddressFields: function(a) {
        a.find(".js-hide-if-empty-address").removeClass(HAB.postcodeLookup.hiddenClass).removeClass("js-address-manual-input")
    },
    init: function() {
        var b = this
          , a = $("#checkout_form_postcode-lookup, #frm_address_postcode-lookup, #frm_registration-rfl_postcode-lookup, .postcode-lookup-input")
          , d = a.parents("form")
          , e = false;
        d.find("input[type=text]").on("focus", function(f) {
            e = $(this)
        });
        d.on("submit", function(g) {
            if (a.is("currentElemFocus")) {
                var f = $(".js-lookup-trigger");
                if (f.is(":visible")) {
                    f.click()
                }
                g.preventDefault()
            }
        });
        var c = $.root.find(".js-lookup-trigger");
        a.each(function() {
            if (!$.trim($(this).val())) {}
        });
        a.on("keyup", function(f) {
            c.prop("disabled", false)
        });
        if (!HAB.postcodeLookup.initialized) {
            HAB.postcodeLookup.initialized = true;
            HAB.postcodeLookup.oneTimeInit()
        }
    },
    oneTimeInit: function() {
        $.root.on("click", ".js-lookup-trigger", function(h) {
            var k = $(this).addClass("pca-bound")
              , m = k.parent()
              , d = k.siblings("input")
              , b = $(this).parents("form:first")
              , c = k.data("submit-url");
            if (checkRequiredFields(b)) {
                return
            }
            HAB.postcodeLookup.clearQasResults(m);
            HAB.postcodeLookup.showSpinner(m);
            k.prop("disabled", true);
            var f = {};
            var a = b.find(':input[name="country"], :input.js-country-lookup').val();
            f.countryISO = a;
            f.houseNumName = b.find('input[name="house-lookup"], input.js-house-lookup').pVal();
            f.street = b.find('input[name="street-lookup"], input.js-street-lookup').filter(":visible").pVal();
            if (a == "IRL") {
                f.layout = "NBTYIRL4";
                f.locality = b.find('input[name="town-lookup"], input.js-town-lookup').pVal()
            } else {
                if (a == "NLD" || a == "BEL") {
                    if (a == "NLD") {
                        f.layout = "HANDBNLD"
                    }
                    f.postalCode = b.find('input[name="leading-postcode-lookup"], input.js-postcode-lookup-nld').pVal();
                    var l = b.find(".house-lookup-nld, input.js-house-lookup-nld").pVal();
                    var g = b.find('input[name="addition-lookup"], input.js-addition-lookup').pVal();
                    if (l != "") {
                        f.houseNumName = l
                    }
                    if (g != "") {
                        f.houseNumName += "-" + g
                    }
                } else {
                    f.postalCode = b.find('input[name="postcode-lookup"], input.js-postcode-lookup').pVal()
                }
            }
            $.get(c, f, function(o, p, n) {
                var e = $(o).find(".js-select-qas-address");
                if (e.length == 1) {
                    HAB.postcodeLookup.populateQASAddress(e, b)
                } else {
                    HAB.postcodeLookup.insertQasResults(m, o)
                }
                HAB.postcodeLookup.hideSpinner(m);
                k.prop("disabled", false);
                m.trigger("domUpdated")
            });
            h.preventDefault();
            return false
        });
        $.root.on("click", ".js-select-qas-address", function(a) {
            HAB.postcodeLookup.selectAddressFromQasResults(this)
        });
        $.root.on("change", ".js-mobile-select-qas-address", function(a) {
            HAB.postcodeLookup.selectAddressFromQasResults($(".js-select-qas-list").find(":contains('" + $(this).find("option:selected").text() + "')"))
        });
        HAB.postcodeLookup.selectAddressFromQasResults = function(b) {
            var c = $(b)
              , d = c.closest(".postcode-lookup-field")
              , a = c.closest("form");
            HAB.postcodeLookup.showSpinner(d);
            HAB.postcodeLookup.populateQASAddress(c, a);
            $("#checkout_form_use_delivery").prop("checked", false);
            $("#addressSelectedFlag").val(true);
            $("#addr_verified_status").val("Full Address and Postal Code Found");
            $(".qas-result-list a").removeClass("active");
            c.addClass("active");
            c.siblings().removeClass("selected");
            c.addClass("selected");
            $(".js-qas-addition").addClass(HAB.postcodeLookup.hiddenClass)
        }
        ;
        $.root.on("keypress", ".js-submit-lookup-by-enter", function(a) {
            var b = $(this).closest("form");
            if (a.which == 13) {
                b.find(".js-lookup-trigger").trigger("click");
                return false
            }
        })
    }
};
function checkRequiredFields(b) {
    var a = b.find(".lookup_fields_holder span:not(.hdn) input");
    var c = false;
    a.each(function() {
        if ($(this).data("required") && $(this).pVal() == "") {
            $(this).trigger("blur.inlineValidation");
            c = true
        }
    });
    return c
}
HAB.postcodeLookup.populateQASAddress = function(b, d) {
    var c = d.find(".js-lookup-trigger:visible").data("isbilling");
    var a = createAddrResponseUrl(b);
    if (a === "") {
        return
    }
    $.ajax({
        url: a,
        dataType: "JSON",
        success: function(u) {
            var m = htmlUnescape(u.address.addition);
            var q = htmlUnescape(u.address.onlyHouseNumber);
            var h = htmlUnescape(u.address.houseNo);
            var f = htmlUnescape(u.address.street);
            var o = htmlUnescape(u.address.town);
            var l = htmlUnescape(u.address.county);
            var k = htmlUnescape(u.address.postcode);
            d.find("#deliverButtonId").removeClass(HAB.postcodeLookup.hiddenClass);
            d.find("#checkout_form_use_delivery").prop("checked", false);
            d.find("li.error").removeClass("error").find("em").empty();
            d.find(".selectedSearchSection").removeClass(HAB.postcodeLookup.hiddenClass).removeClass("isEmpty");
            var p = d.find(".js-address-title").val();
            var s = d.find(".js-address-fname").val();
            var g = d.find(".js-address-mname").val();
            var t = d.find(".js-address-lname").val();
            var e = d.find(".js-address-country :selected").text();
            var r = (function n(w) {
                var v = "";
                $.each(w, function(x, y) {
                    if (y) {
                        v += (v.length == 0 ? "" : " ") + y
                    }
                });
                return v
            }
            )([p, s, g, t]);
            $.ajax({
                url: HAB.postcodeLookup.selectedAddressLayoutUrl,
                data: {
                    countryCode: $.trim(d.find(".js-address-country").val()),
                    isBilling: c
                },
                dataType: "HTML",
                success: function(v) {
                    var w = $(v);
                    w.find(".selected-search-personal-info").text(r);
                    w.find(".selected-search-country").text(e);
                    w.find(".selected-search-house").text(h);
                    w.find(".selected-search-street").text(f);
                    w.find(".selected-search-city").text(o);
                    w.find(".selected-search-county").text(l);
                    w.find(".selected-search-postcode").text(k);
                    d.find(".js-selected-qas-address-holder").html(w).removeClass(HAB.postcodeLookup.hiddenClass);
                    if (d.find(".js-selected-qas-address-holder").attr("data-show-scrollto")) {
                        SFR.Utils.scrollTo(d.find(".js-selected-qas-address-holder"))
                    }
                    HAB.postcodeLookup.showCommonAddressFields(d)
                }
            });
            if (m == "" || m == "undefined") {
                d.find(".js-address-house").val(h)
            } else {
                d.find(".js-address-house").val(q)
            }
            if (m != "undefined") {
                d.find(".js-address-addition").val(m)
            } else {
                d.find(".js-address-addition").val("")
            }
            d.find(".js-address-street").val(f);
            d.find(".js-address-city").val(o);
            d.find(".js-address-county").val(l);
            d.find(".js-address-postcode").val(k);
            if (d.find(".js-selected-qas-address-holder").attr("data-show-scrollto")) {
                SFR.Utils.scrollTo(d.find(".js-selected-qas-address-holder"))
            }
            HAB.postcodeLookup.hideSpinner(d.find(".postcode-lookup-field"))
        }
    })
}
;
function createAddrResponseUrl(o) {
    var g = "";
    var k = o.data("house-number");
    var l = o.data("only-house-number");
    var c = o.data("addition");
    var d = o.data("street");
    var f = o.data("address-line");
    var m = o.data("town");
    var h = o.data("county");
    var n = o.data("country");
    var b = o.data("moniker");
    var e = o.data("core");
    var a = o.data("postcode");
    if (k || d || f || m || h || n || b || e || a) {
        g = "/my-account/includes/addrResponse.jsp?data_house_number=" + k + "&data_only_house_number=" + l + "&data_addition=" + c + "&data_street=" + d + "&data_address_line=" + f + "&data_town=" + m + "&data_county=" + h + "&data_country=" + h + "&data_postcode=" + a + "&data_moniker=" + b + "&data_core=" + e
    }
    return g
}
function htmlUnescape(a) {
    return String(a).replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
}
HAB.doAccountHooks = function() {
    if ($(".t-account").length === 0) {
        return false
    }
    for (var a in HAB.account) {
        if (typeof (HAB.account[a]) === "function") {
            HAB.account[a]()
        }
    }
    $(".bh-element-toggle").click(function(c) {
        var b = $(this).closest("tr").next().find(".hb-form-payment-remove");
        c.preventDefault();
        $(".hb-form-payment-remove").removeClass("row-form-show");
        $(b).addClass("row-form-show")
    });
    $(".hb-form-cancel").click(function(b) {
        b.preventDefault();
        $(".hb-form-payment-remove").removeClass("row-form-show");
        $("#newAddressDiv").html("");
        $("#newShippingAddressId").show();
        $(".form-errors").html("");
        if (!$(".form-errors").hasClass("hdn")) {
            $(".form-errors").addClass("hdn")
        }
    });
    $(".setDefaultCard").on("change", function(c) {
        var b = $(this).data("payment-type");
        $("#jsPaymentTypeDefault").val(b);
        $(this).closest("form").ajaxSubmit()
    })
}
;
HAB.account.hookEditEmail = function() {
    var a = $(".act-enable-email").on("click", function() {
        $(this).parents(".text").find("input[name=details_email]").show().focus().siblings("span").remove().end().end().end().remove();
        return false
    }).parents(".text").find("input[name=details_email]").hide();
    a.after('<span class="readonly">' + a.val() + "</span>")
}
;
HAB.account.hookAddRFLCard = function() {
    var b = $(".fs-register-rfl")
      , a = null;
    if (b.is("*")) {
        b.ajaxifyHabFormElement(function() {
            HAB.account.makeEditable()
        })
    }
}
;
HAB.account.makeEditable = function() {
    if ($(".act-enable-rfl-number").is("*")) {
        $(".act-enable-rfl-number").on("click", function(a) {
            $("#account-rfl-number").prop("readonly", false).removeClass("readonly").focus();
            a.preventDefault()
        })
    }
}
;
HAB.account.hookAddressCallback = function() {
    $("form").bind("ajaxifyHabForm.complete", function() {
        setTimeout(HAB.postcodeLookup.init, 50)
    });
    $(".act-add-address").on("bh-complete.bh-ajaxLoader", function() {
        setTimeout(HAB.postcodeLookup.init, 50)
    })
}
;
HAB.checkRFLCardsListLength = function() {
    var b = $(".my-rewards-cards");
    var a = b.children(".card-item").length;
    if (a > 3) {
        b.addClass("scrollable-cards-list")
    }
}
;
HAB.showHideRFLCouponsTable = function() {
    var d = $(".js-available-coupons");
    var c = $(".js-expired-coupons");
    var a = $(".js-available-coupons-table");
    var b = $(".js-expired-coupons-table");
    d.on("click", function() {
        b.hide();
        a.show();
        $(this).addClass("active-coupons-tab");
        c.removeClass("active-coupons-tab")
    });
    c.on("click", function() {
        a.hide();
        b.show();
        $(this).addClass("active-coupons-tab");
        d.removeClass("active-coupons-tab")
    })
}
;
HAB.account.linkRelatedPrefs = function() {
    var c = null
      , b = null
      , a = false;
    $(".s-contact-prefs input[type=checkbox]").on("change", function(d) {
        c = $(this).closest("fieldset.grouped");
        b = $(this);
        if (c.is("*")) {
            a = c.find(":checked").is("*") ? true : false;
            $("#frm_details_contact-email").prop("checked", a)
        } else {
            a = b.is(":checked") ? true : false;
            b.parent().siblings("fieldset").find("input[type=checkbox]").attr("checked", a)
        }
    })
}
;
(function(b) {
    b.fn.ajaxifyHabForm = function() {
        return this.each(function() {
            var c = b(this)
              , f = c.data("ajax-url")
              , d = c.data("ajax-method")
              , e = (this.nodeName.toUpperCase() === "FORM") ? c : c.parents("form").eq(0);
            if ((f === undefined) || (f === "")) {
                f = e.attr("action")
            }
            if ((d === undefined) || (d === "")) {
                d = e.attr("method")
            }
            c.on("click", "input[type=submit],button[type=submit]", function() {
                var h = c.serialize();
                if (d.match(/^browser/i)) {
                    var l = f + ((f.indexOf("?") === -1) ? "?" : "&");
                    l += h;
                    document.location.href = l;
                    return false
                }
                if (d.match(/^form/i)) {
                    e.submit();
                    return false
                }
                function g(m) {
                    c.html(m);
                    c.setKeyboardFocus();
                    c.trigger("ajaxifyHabForm.complete");
                    c.domUpdated()
                }
                var k = d.replace(/^(browser|form)\./i, "");
                if (k.toLowerCase() === "get") {
                    b.get(f, h, g);
                    return false
                } else {
                    b.post(f, h, g);
                    return false
                }
            });
            c.on("click touchstart", ".act-close", function() {
                c.slideUp(400, function() {
                    b(this).remove()
                });
                return false
            });
            c.find("input[type=text],input[type=number]").on("keypress", function(g) {
                if (g.charCode === 13) {
                    c.find("input[type=submit],button[type=submit]").trigger("click");
                    return false
                }
            })
        })
    }
    ;
    b.fn.ajaxifyHabFormElement = function(c) {
        return this.each(function() {
            var d = b(this)
              , f = d.data("ajax-url")
              , e = d.data("ajax-method");
            d.on("click", "input[type=submit],button[type=submit]", function(l) {
                if (b(this).hasClass("js-lookup-trigger")) {
                    l.preventDefault();
                    return
                }
                var h = d.serialize();
                if (e.match(/^browser/i)) {
                    var m = f + ((f.indexOf("?") === -1) ? "?" : "&");
                    m += h;
                    document.location.href = m;
                    return false
                }
                function g(n) {
                    d.html(n);
                    d.setKeyboardFocus();
                    if (b.isFunction(c)) {
                        c(d)
                    }
                    d.trigger("ajaxifyHabForm.complete");
                    d.domUpdated()
                }
                var k = e.replace(/^(browser|form)\./i, "");
                if (k.toLowerCase() === "get") {
                    b.get(f, h, g);
                    return false
                } else {
                    b.post(f, h, g);
                    return false
                }
            });
            d.on("click touchstart", ".act-close", function() {
                d.slideUp(400, function() {
                    b(this).remove()
                });
                return false
            });
            d.find("input[type=text],input[type=number]").on("keypress", function(g) {
                if (g.charCode === 13) {
                    d.find("input[type=submit],button[type=submit]").trigger("click");
                    return false
                }
            })
        })
    }
    ;
    b.fn.habCarousel = function(c) {
        this.addClass("mobile-carousel").children(c).enableSwipe().on("swipeleft", function() {
            var d = b(this)
              , e = d.next(c);
            if (e.length === 0) {
                return false
            }
            d.addClass("out-left");
            e.removeClass("out-right").trigger("slidechange")
        }).on("swiperight", function() {
            var d = b(this)
              , e = d.prev(c);
            if (e.length === 0) {
                return false
            }
            d.addClass("out-right");
            e.removeClass("out-left").trigger("slidechange")
        }).not(":first-child").addClass("out-right");
        return this
    }
    ;
    b.fn.habAjaxLoader = function() {
        var c = (arguments.length === 1) ? arguments[0] : {};
        return this.addClass("bh-bound").on("click.bh-ajaxLoader", function(l) {
            var k = b(this)
              , f = k.parent()
              , h = {
                url: "",
                insert: "append",
                selector: "",
                multi: false
            }
              , d = null;
            if ((d = k.data("bh-url")) !== undefined) {
                h.url = d
            }
            if ((d = k.data("bh-insert")) !== undefined) {
                h.insert = d
            }
            if ((d = k.data("bh-selector")) !== undefined) {
                h.selector = d
            }
            if ((d = k.data("bh-multi")) !== undefined) {
                h.multi = d
            }
            b.extend(h, c);
            h.selector = b.trim(h.selector);
            if (k.hasClass("bh-triggered") && h.multi === false) {
                l.preventDefault();
                return
            }
            k.addClass("bh-triggered");
            if (h.url === "") {
                return true
            }
            try {
                if (h.selector !== "") {
                    if (h.selector.substring(0, 1) === "/") {
                        f = b.root;
                        h.selector = b.trim(h.selector.substring(1))
                    }
                    while (h.selector.substring(0, 2) === "..") {
                        f = f.parent();
                        h.selector = b.trim(h.selector.substring(2))
                    }
                    if (h.selector !== "") {
                        f = f.find(h.selector)
                    }
                }
            } catch (g) {}
            if ((f === null) || (f === undefined)) {
                return true
            }
            b.get(h.url, null, function(m) {
                var e = b(m);
                k.trigger("bh-complete.bh-ajaxLoader");
                switch (h.insert.toLowerCase()) {
                case "swap":
                    f.replaceWith(e);
                    break;
                case "before":
                    f.before(e);
                    break;
                case "after":
                    f.after(e);
                    break;
                case "replace":
                    f.html(e);
                    break;
                case "prepend":
                    f.prepend(e);
                    break;
                default:
                    f.append(e);
                    break
                }
                k.domUpdated()
            });
            if (h.multi === false) {
                k.unbind("click");
                k.bind("click", function(m) {
                    m.preventDefault()
                })
            }
            k.trigger("bh-triggered.bh-ajaxLoader");
            return false
        })
    }
    ;
    b.fn.domUpdated = function() {
        b(document.body).trigger("domUpdated", [this]);
        return this.each(function() {})
    }
    ;
    HAB.setupPlaceholderSearch = function() {
        var c = b("#site-search input[type=search]");
        var d = c.attr("placeholder");
        c.on("focus.search", function() {
            c.removeAttr("placeholder")
        }).on("blur.search", function() {
            c.attr("placeholder", d)
        })
    }
    ;
    HAB.setupAutocompleteSearch = function() {
        var f = true;
        function g(y) {
            d.empty();
            if (y.length === 0) {
                d.append('<li class="no-results">...</li>')
            } else {
                var w = null;
                var x = y.contents[0].autoSuggest;
                if (x == null || x.length == 0) {
                    return null
                }
                var r = 900;
                for (var u = 0; u < x.length; u++) {
                    var t = x[u];
                    if (t["@type"] == "RecordSearchAutoSuggestItem") {
                        w = t;
                        if (w != null && w.records != null && w.records.length > 0) {
                            d.append('<div class="auto-suggest-group">' + w.title + "</div>");
                            var s = typeof w.defaultRecsPerPage != "undefined" ? w.defaultRecsPerPage : 10;
                            b.each(w.records, function(B, A) {
                                if (B < s) {
                                    var D = contextPath + A.detailsAction.contentPath + A.detailsAction.recordState;
                                    var C = a(A, "product.displayName", "");
                                    var z = a(A, "iconURL", "");
                                    r++;
                                    d.append('<li tabindex="' + r + '" class="auto-suggest-wrapper"><a href="' + D + '"><img src="' + z + '" class="auto-suggest"/><span>' + C + "</span></a></li>")
                                }
                            })
                        }
                    }
                    if (t["@type"] == "DimensionSearchAutoSuggestItem") {
                        var v = t;
                        if (v != null && v.dimensionSearchGroups != null && v.dimensionSearchGroups.length > 0) {
                            b.each(v.dimensionSearchGroups, function(z, A) {
                                d.append('<div class="auto-suggest-group">' + v.title + "</div>");
                                if (A.dimensionSearchValues != null && A.dimensionSearchValues.length > 0) {
                                    b.each(A.dimensionSearchValues, function(C, D) {
                                        r++;
                                        var B = contextPath;
                                        B += A.dimensionSearchValues[C].contentPath;
                                        B += A.dimensionSearchValues[C].navigationState;
                                        d.append('<li class="auto-suggest-item" tabindex="' + r + '"><a href="' + B + '">' + A.dimensionSearchValues[C].label + "</a></li>")
                                    })
                                }
                            })
                        }
                    }
                }
            }
            o.addClass("ui_visible")
        }
        function q() {
            o.removeClass("ui_visible");
            d.empty()
        }
        var l = b("#site-search");
        if (l.length === 0) {
            return false
        }
        var h = l.data("search-for-label");
        var k = l.find("input[type=search]").attr("autocomplete", "off")
          , m = k.parents("form").eq(0)
          , o = b('<div class="site-search-results"></div>').appendTo(l)
          , d = b("<ul></ul>").appendTo(o)
          , p = b("<strong></strong>").appendTo(o).wrap('<a href="#" class="submit">' + h + " </a>")
          , e = ""
          , c = null;
        var n = null;
        k.off("input.search").on("input.search", function(t) {
            e = k.val();
            p.text(e);
            if (e.length === 0) {
                q();
                return true
            }
            e = b.trim(e);
            if (e.length > 1 && e.replace(/[^A-Za-z0-9]+/g, "").length > 0) {
                var s = l.data("json-submit-uri");
                var r = encodeURIComponent(e);
                n = b.ajax({
                    url: s + "?Ntk=AutoSuggest&query=" + r,
                    dataType: "json",
                    async: true,
                    success: function(u) {
                        g(u)
                    },
                    beforeSend: function() {
                        if (n != null) {
                            n.abort()
                        }
                    }
                })
            } else {
                q()
            }
            return true
        }).on("blur.search", function() {
            if (!f) {
                c = setTimeout(q, 1000)
            }
            return true
        }).on("focus.search", function(r) {
            clearTimeout(c)
        }).on("keydown.search", function(s) {
            if (s.keyCode !== 40) {
                return true
            }
            if (s.srcElement && s.srcElement.tagName !== "INPUT") {
                f = false
            }
            var r = o.find("a").eq(0).focus();
            if (r.length > 0) {
                clearTimeout(c)
            }
            return false
        });
        o.on("click.search", "li a", function() {
            k.val(b(this).text())
        }).on("click.search", "a.submit", function() {
            k.val(p.text());
            m.trigger("submit");
            return false
        }).on("focus.search", "a", function() {
            var r = b(this);
            clearTimeout(c);
            k.val((r.hasClass("submit") ? p.text() : r.text()))
        }).on("blur.search", "a", function() {
            c = setTimeout(q, 100)
        }).on("keydown.search", "a", function(t) {
            if ((t.keyCode !== 40) && (t.keyCode !== 38) && (t.keyCode !== 13)) {
                return true
            }
            var r = b(this);
            if (t.keyCode === 13) {
                if (r.hasClass("submit")) {
                    m.trigger("submit");
                    return false
                } else {
                    window.location = r.attr("href");
                    return false
                }
            }
            if (r.hasClass("submit")) {
                if (t.keyCode === 38) {
                    d.find("a:last").focus();
                    clearTimeout(c)
                }
                return false
            }
            var s = null;
            if (t.keyCode === 40) {
                s = r.parent().next().find("a");
                if (s.length === 0) {
                    oNextSection = r.parent().nextAll("li").first();
                    if (oNextSection.length === 0) {
                        s = p.parent()
                    } else {
                        s = oNextSection.find("a").eq(0)
                    }
                }
            } else {
                s = r.parent().prev().find("a");
                if (s.length === 0) {
                    oNextSection = r.parent().prevAll("li").first();
                    if (oNextSection.length === 0) {
                        s = k
                    } else {
                        s = oNextSection.find("a").last()
                    }
                }
            }
            s.trigger("focus");
            clearTimeout(c);
            return false
        });
        b("[role=banner], #content, [role=contentinfo]").click(function(s) {
            var r = b(s.target);
            if (r.parents(".site-search-form").length === 0) {
                q()
            }
        })
    }
    ;
    HAB.hookSiteSearch = function() {
        HAB.setupAutocompleteSearch();
        HAB.setupPlaceholderSearch()
    }
    ;
    var a = function(c, d, e) {
        if (c != null && d != null && c.attributes != null && c.attributes[d] != null) {
            return c.attributes[d][0]
        }
        return (typeof (e) === "undefined" ? null : e)
    };
    b("#checkout_form_country").live("blur", function(c) {
        var d = b.trim(b("#checkout_form_country option:selected").text());
        if (d == "Select Country") {
            b("#selectBoxError1").hide();
            b("#selectBoxError").hide()
        }
    });
    b("#checkout_form_country").change(function() {
        var c = b.trim(b("#checkout_form_country option:selected").text());
        if (c == "Select Country") {
            b("#selectBoxError1").hide();
            b("#selectBoxError").hide()
        }
    });
    b.fn.pVal = function() {
        var c = b(this);
        var d = c.eq(0).val();
        if (d == c.attr("placeholder")) {
            return ""
        } else {
            return d
        }
    }
}
)(jQuery);
HAB.loadFavorites = function() {
    if ($(".prod-list-item").length > 0) {
        $.ajax({
            url: "/common/favProds.jsp",
            type: "GET",
            dataType: "html",
            success: function(d) {
                var c = d.split("|");
                for (var b = 0; b < c.length; b++) {
                    var a = $.trim(c[b]);
                    if (!!a) {
                        $("<span class='ico ico-fav'>Favourite</span>").appendTo($(".prod-list-item." + a))
                    }
                }
            }
        })
    }
}
;
HAB.initScrollToError = function() {
    $(document).ajaxSuccess(function(c, b, a) {
        HAB.scrollToError(true)
    });
    HAB.scrollToError()
}
;
HAB.scrollToError = function(b) {
    var a = $(".form-errors:visible").not(".handled-error");
    if (a.length > 0) {
        SFR.Utils.scrollTo(a);
        a.addClass("handled-error")
    }
}
;
HAB.initScrollToTarget = function() {
    $(document).ajaxSuccess(function(c, b, a) {
        HAB.scrollToTarget(true)
    });
    HAB.scrollToTarget()
}
;
HAB.scrollToTarget = function(a) {
    var b = $(".onload-scroll-target:visible").not(".handled-target");
    if (b.length > 0) {
        SFR.Utils.scrollTo(b);
        b.addClass("handled-target")
    }
}
;
HAB.showMoreLessDescription = function() {
    if ($(".descript .visible-part").height() > 45) {
        $(".descript .visible-part").height(45);
        var b = $("#show-more")
          , a = $("#show-less");
        b.parent().show();
        a.show();
        b.on("click", function(c) {
            c.preventDefault();
            $(this).parent().hide();
            $(".descript .visible-part").height("auto");
            $(".descript").height("auto")
        });
        a.on("click", function(c) {
            c.preventDefault();
            $(this).prev().show().parent(".visible-part").height(45);
            $(".descript").height(45)
        })
    }
}
;
function loadHeaderMenuItem(a, c, b) {
    $.ajax({
        dataType: "html",
        url: "/common/flyoutmenuwrap.jsp?page=/flyout" + b,
        success: function(d) {
            document.getElementById(c).innerHTML = d;
            $(a).addClass("loaded")
        }
    })
}
function loadMobileHeaderMenuItem(b, d, c, a) {
    $.ajax({
        dataType: "html",
        url: "/common/flyoutmenuwrap.jsp?page=/flyout" + c,
        success: function(e) {
            document.getElementById(d).innerHTML = a + e;
            $(b).addClass("loaded")
        }
    })
}
if (typeof Object.create != "function") {
    (function() {
        var a = function() {};
        Object.create = function(b) {
            if (arguments.length > 1) {
                throw Error("Second argument not supported")
            }
            if (typeof b != "object") {
                throw TypeError("Argument must be an object")
            }
            a.prototype = b;
            return new a()
        }
    }
    )()
}
HAB.healpers = {
    cutContent: function(b, d, c) {
        var f = (c && (typeof c) === "string") ? c : "..."
          , a = 0
          , e = "";
        if (!b) {
            return ""
        }
        if ((typeof b) !== "string" || !d) {
            return b
        }
        a = b.length;
        if (b.length > d) {
            e = b.substr(0, d) + f;
            return e
        } else {
            return b
        }
    }
};
HAB.mainCarouselClass = {
    init: function(a) {
        this.config = {
            initCarousel: true,
            selector: "ul",
            selectorElements: "li",
            quantity: 1,
            showPagination: true,
            showArrow: false,
            slideEvent: true,
            $container: $(a),
            autoRotate: false,
            delayRotate: 3,
            isHomeCarousel: false
        };
        var b = this.config.$container.data("init-main-carousel-params");
        ($("body").is(".breakpoint-220") && !$("html").hasClass("lt-ie9")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        this.initialize()
    },
    initialize: function() {
        this.removeCarousel(this.config.$container);
        if (($("body").is(".breakpoint-220")) && this.config.isHomeCarousel) {
            this.config.selectorElements = "li:not(.mobile-hidden)"
        }
        if (($("body").is(".breakpoint-768")) && this.config.isHomeCarousel) {
            this.config.selectorElements = "li:not(.desktop-hidden)"
        }
        if (this.config.autoRotate) {
            var a = this.config.delayRotate;
            var c = this;
            function f() {
                if (($("body").is(".breakpoint-768")) && c.config.continueSwipping) {
                    c.slide(1);
                    c.config.continueSwipping = true
                }
                if (($("body").is(".breakpoint-220")) && c.config.continueSwipping) {
                    c.slide(1)
                }
                d = setTimeout(f, a * 1000)
            }
            var d = setTimeout(f, a * 1000);
            $(".homepage-carousel-holder").hover(function() {
                clearTimeout(d)
            }, function() {
                if (c.config.continueSwipping) {
                    d = setTimeout(f, a * 1000)
                } else {
                    clearTimeout(d)
                }
            })
        }
        this.config.length = $(this.config.selectorElements, this.config.$container).length;
        this.config.setCount = Math.ceil(this.config.length / this.config.quantity);
        if (this.config.setCount > 1 && this.config.initCarousel) {
            this.config.$container.addClass("main-carousel").find(this.config.selector).wrapAll('<div class="main-carousel-holder"><div class="main-carousel-slide-holder">');
            this.setSize();
            if (this.config.showArrow) {
                if (($(".links-holder", this.config.$container).length) && this.config.isHomeCarousel) {
                    this.adjustLinksHolder()
                }
                this.arrow()
            }
            if (this.config.showPagination) {
                for (var e = this.config.setCount; e > 0; e--) {
                    for (var b = this.config.quantity; b > 0; b--) {
                        $(this.config.selectorElements, this.config.$container).eq(e * this.config.quantity - b).attr("data-set-number", e)
                    }
                }
                this.pagination()
            }
            this.bindEvents()
        }
    },
    pagination: function() {
        var b = 1
          , a = "";
        for (b; b <= this.config.setCount; b++) {
            a += '<a href="#"><span>' + b + "</span></a>"
        }
        $('<div class="carousel-paging">' + a + "</div>").appendTo(this.config.$container);
        this.setCurrentSet(1)
    },
    arrow: function() {
        var a;
        var b = $(".homepage-carousel-holder.page").length ? "" : "page ";
        if (this.config.isHomeCarousel) {
            a = $('<div class="' + b + 'main-carousel-buttons"> <a class="prev-btn" rel="prev" href="#"><span class="ico-c ico-chevron ico-chevron-left"></span></a><a class="next-btn" rel="next" href="#"><span class="ico-c ico-chevron ico-chevron-right"></span></a></div>')
        } else {
            a = $(' <a class="prev-btn" rel="prev" href="#"><span class="ico-c ico-chevron ico-chevron-left"></span></a><a class="next-btn" rel="next" href="#"><span class="ico-c ico-chevron ico-chevron-right"></span></a>')
        }
        a.appendTo(this.config.$container.find(".main-carousel-holder"))
    },
    adjustLinksHolder: function() {
        var a = $(".links-holder", this.config.$container);
        a.wrap('<div class="page main-carousel-links-holder"/>')
    },
    setSize: function() {
        var b = $(".main-carousel-holder", this.config.$container).outerWidth() / this.config.quantity
          , a = b * this.config.length;
        this.config.elementWidth = b;
        $(".main-carousel-slide-holder", this.config.$container).css({
            width: a + "px"
        });
        $(this.config.selectorElements, this.config.$container).each(function() {
            if (b !== 0) {
                $(this).css({
                    width: b + "px"
                })
            } else {
                $(this).css({
                    width: ""
                })
            }
        })
    },
    recalculateSize: function() {
        var b = $(".main-carousel-holder", this.config.$container).outerWidth() / this.config.quantity
          , a = b * this.config.length;
        this.config.elementWidth = b;
        $(".main-carousel-slide-holder", this.config.$container).css({
            width: a + "px"
        });
        $(this.config.selectorElements, this.config.$container).each(function() {
            if (b !== 0) {
                $(this).css({
                    width: b + "px"
                })
            } else {
                $(this).css({
                    width: ""
                })
            }
        });
        $(".main-carousel-slide-holder", this.config.$container).animate({
            left: "-" + (this.config.currentSet - 1) * this.config.quantity * this.config.elementWidth
        }, 0)
    },
    setCurrentSet: function(c) {
        var b = this
          , a = this.config.currentSet;
        this.config.currentSet = (typeof Number(c) === "number") ? Number(c) : 1;
        if (a) {
            this.config.$container.find(".main-carousel-slide-holder").animate({
                left: "-=" + (this.config.currentSet - a) * this.config.quantity * this.config.elementWidth
            }, 300, function() {
                b.config.$container.find(".carousel-paging a").removeClass("selected").eq(b.config.currentSet - 1).addClass("selected")
            })
        } else {
            this.config.$container.find(".carousel-paging a").removeClass("selected").eq(b.config.currentSet - 1).addClass("selected")
        }
    },
    slide: function(b) {
        var a = $(".carousel-paging .selected", this.config.$container).text();
        a = Number(a) + b;
        if (a > this.config.setCount) {
            a = 1
        }
        if (a === 0) {
            a = this.config.setCount
        }
        this.setCurrentSet(a)
    },
    bindEvents: function() {
        var a = this;
        $(window).on("resize", function() {
            a.recalculateSize()
        });
        if (this.config.showPagination) {
            this.config.$container.on("click", ".carousel-paging a", function(b) {
                b.preventDefault();
                a.config.continueSwipping = false;
                var c = $(this).text();
                a.setCurrentSet(c)
            })
        }
        if (this.config.showArrow) {
            this.config.$container.on("click", ".prev-btn", function(b) {
                b.preventDefault();
                a.config.continueSwipping = false;
                a.slide(-1)
            }).on("click", ".next-btn", function(b) {
                b.preventDefault();
                a.config.continueSwipping = false;
                a.slide(1)
            })
        }
        if (this.config.slideEvent) {
            $(this.config.selectorElements, this.config.$container).enableSwipe().on("swipeleft", function() {
                a.config.continueSwipping = false;
                a.slide(1)
            }).on("swiperight", function() {
                a.config.continueSwipping = false;
                a.slide(-1)
            })
        }
    },
    removeCarousel: function() {
        $(window).off("resize", function() {
            that.recalculateSize()
        });
        $(this.config.selectorElements, this.config.$container).each(function() {
            $(this).css({
                width: ""
            })
        });
        this.config.$container.off("click");
        $(this.config.selectorElements, this.config.$container).off("swipeleft").off("swiperight");
        this.config.$container.find(this.config.selector).each(function() {
            if ($(this).parent().hasClass("main-carousel-slide-holder")) {
                $(this).unwrap().unwrap()
            }
        });
        this.config.$container.removeClass("main-carousel");
        this.config.$container.find(".carousel-paging").remove();
        this.config.$container.find(".prev-btn").remove();
        this.config.$container.find(".next-btn").remove()
    }
};
HAB.mainCarouselModule = Object.create(HAB.mainCarouselClass);
HAB.mainCarouselCopyContentModule = Object.create(HAB.mainCarouselClass);
HAB.mainCarouselCopyContentModule.init = function(a) {
    this.config = {
        initCarousel: true,
        selector: "ul",
        selectorElements: "li",
        quantity: 1,
        showPagination: true,
        showArrow: false,
        slideEvent: true,
        $container: $(a).html(""),
        continueSwipping: true
    };
    var b = this.config.$container.data("init-main-carousel-params"), c;
    ($("body").is(".breakpoint-220")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
    if (!this.config.initCarousel) {
        return
    }
    c = $(this.config.copySelector).clone();
    c.addClass("main-carousel-copy-content-ul").find("li").removeAttr("style");
    this.config.$container.append(c);
    this.initialize()
}
;
HAB.mainSlickCarouselClass = {
    init: function(a) {
        this.config = {
            initCarousel: true,
            $container: $(a),
            carouselContainerSelector: ".js-slick-carousel"
        };
        var b = this.config.$container.data("init-main-carousel-params");
        ($("body").is(".breakpoint-220") && !$("html").hasClass("lt-ie9")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        if (this.config.initCarousel) {
            this.initialize()
        }
    },
    initialize: function() {
        $(this.config.$container).find(this.config.carouselContainerSelector).slick({
            infinite: false,
            slidesToShow: 5,
            slidesToScroll: 5,
            touchMove: false,
            responsive: [{
                breakpoint: 1025,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 769,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "40px",
                    dots: false,
                    initialSlide: 1,
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 630,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "40px",
                    dots: false,
                    initialSlide: 1,
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }, {
                breakpoint: 430,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "80px",
                    dots: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        })
    }
};
HAB.mainSlickCarousel = Object.create(HAB.mainSlickCarouselClass);
HAB.showElementClass = {
    init: function(a) {
        this.config = {
            initShowElement: true,
            $container: $(a),
            openSelector: "li",
            openedSelectorClass: ""
        };
        this.removeShowElementClass();
        var b = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-768")) ? $.extend(true, this.config, b.breakpoint768 || {}) : $.extend(true, this.config, b.breakpoint220 || {});
        if (this.config.initShowElement) {
            this.bindEvents()
        }
    },
    bindEvents: function() {
        var a = this;
        this.config.$container.on("click", function(b) {
            b.preventDefault();
            $(a.config.openSelector).slideToggle(500);
            a.config.$container.toggleClass(a.config.openedSelectorClass)
        })
    },
    removeShowElementClass: function() {
        this.config.$container.off("click")
    }
};
HAB.showElementModule = Object.create(HAB.showElementClass);
HAB.mainAccordionClass = {
    init: function(a) {
        this.config = {
            initAccordion: true,
            parentSelector: ".list-head",
            childHolderSelector: [".l-wrap.clearfix", ".link-list"],
            childSelector: "[role=menuitem] a",
            $container: $(a)
        };
        this.removeMainAccordion();
        var b = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-220") && !$("html").hasClass("lt-ie9")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        if (this.config.initAccordion) {
            this.config.$container.addClass("main-accordion");
            this.addStyle();
            this.bindEvents()
        }
    },
    addStyle: function() {
        var a = this;
        $(this.config.parentSelector, this.config.$container).each(function() {
            if ($(this).next(a.config.childHolderSelector).html()) {
                $(this).addClass("main-accordion-closed");
                $(this).next(a.config.childHolderSelector).css({
                    display: "none"
                }).find(a.config.childSelector).addClass("main-accordion-link")
            } else {
                $(this).addClass("main-accordion-link")
            }
        })
    },
    bindEvents: function() {
        var a = this;
        this.config.$container.on("click", a.config.parentSelector + ".main-accordion-closed", function(b) {
            b.preventDefault();
            a.openClose(this)
        }).on("click", a.config.parentSelector + ".main-accordion-opened", function(b) {
            b.preventDefault();
            a.openClose(this)
        })
    },
    openClose: function(a) {
        $(a).hasClass("main-accordion-closed") ? $(a).removeClass("main-accordion-closed").addClass("main-accordion-opened") : $(a).removeClass("main-accordion-opened").addClass("main-accordion-closed");
        $(a).next(this.config.childHolderSelector).slideToggle(500)
    },
    removeMainAccordion: function() {
        var a = this;
        this.config.$container.removeClass("main-accordion");
        $(this.config.parentSelector, this.config.$container).each(function() {
            if ($(this).next(a.config.childHolderSelector).html()) {
                $(this).next(a.config.childHolderSelector).removeAttr("style")
            }
        });
        this.config.$container.off("click")
    }
};
HAB.mainAccordionModule = Object.create(HAB.mainAccordionClass);
HAB.pdpAccordionClass = {
    init: function(a) {
        this.config = {
            initAccordion: true,
            parentSelector: ".pdp-accordion-title",
            itemSelector: ".pdp-accordion-item",
            itemContentSelector: ".pdp-accordion-content",
            childHolderSelector: ["pdp-accordion-container"],
            childSelector: "",
            $container: $(a)
        };
        this.removeMainAccordion();
        var b = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-220")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        if (this.config.initAccordion) {
            this.config.$container.addClass("pdp-accordion");
            this.addStyle();
            this.bindEvents();
            HAB.pdp.showMoreLessReset();
            HAB.pdp.showPDPMoreLess();
            HAB.pdp.bindPDPMoreLessMobile()
        }
    },
    addStyle: function() {
        var a = this;
        $(this.config.parentSelector, this.config.$container).each(function() {
            if ($(this).next(a.config.childHolderSelector).html() && !$(this).hasClass("pdp-accordion-opened")) {
                $(this).addClass("pdp-accordion-closed");
                $(this).next(a.config.childHolderSelector).css({
                    display: "none"
                })
            }
        })
    },
    bindEvents: function() {
        var a = this;
        this.config.$container.on("click", a.config.parentSelector + ".pdp-accordion-closed", function(b) {
            b.preventDefault();
            a.openClose($(a.config.parentSelector + ".pdp-accordion-opened"));
            a.openClose(this);
            SFR.Utils.scrollTo($(a.config.parentSelector))
        }).on("click", a.config.parentSelector + ".pdp-accordion-opened", function(b) {
            b.preventDefault();
            a.openClose(this)
        })
    },
    openClose: function(a) {
        $(a).hasClass("pdp-accordion-closed") ? $(a).removeClass("pdp-accordion-closed").addClass("pdp-accordion-opened") : $(a).removeClass("pdp-accordion-opened").addClass("pdp-accordion-closed");
        $(a).next(this.config.childHolderSelector).slideToggle(500)
    },
    removeMainAccordion: function() {
        var a = this;
        this.config.$container.removeClass("pdp-accordion");
        $(this.config.parentSelector, this.config.$container).each(function() {
            if ($(this).next(a.config.childHolderSelector).html()) {
                $(this).next(a.config.childHolderSelector).removeAttr("style")
            }
            if ($(this).find("pdp-accordion-opened").length) {
                $(this).find("pdp-accordion-opened").removeClass("pdp-accordion-opened")
            }
            if ($(this).find("pdp-accordion-closed").length) {
                $(this).find("pdp-accordion-closed").removeClass("pdp-accordion-closed")
            }
        });
        HAB.pdp.showMoreLessReset();
        HAB.pdp.showPDPMoreLess();
        if (HAB.isMobile()) {
            HAB.pdp.bindPDPMoreLessMobile()
        } else {
            HAB.pdp.bindPDPMoreLessDesktop()
        }
        this.config.$container.off("click")
    }
};
HAB.pdpAccordionModule = Object.create(HAB.pdpAccordionClass);
HAB.simpleAccordionClass = {
    init: function(a) {
        this.config = {
            initAccordion: true,
            parentSelector: ".simple-accordion-title",
            childHolderSelector: ["simple-accordion-container"],
            childSelector: "",
            $container: $(a)
        };
        this.removeMainAccordion();
        var b = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-220") && !$("html").hasClass("lt-ie9")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        if (this.config.initAccordion) {
            this.config.$container.addClass("simple-accordion");
            this.addStyle();
            this.bindEvents()
        }
    },
    addStyle: function() {
        var a = this;
        $(this.config.parentSelector, this.config.$container).each(function() {
            if ($(this).next(a.config.childHolderSelector).html() && !$(this).hasClass("simple-accordion-opened")) {
                $(this).addClass("simple-accordion-closed");
                $(this).next(a.config.childHolderSelector).css({
                    display: "none"
                })
            }
        })
    },
    bindEvents: function() {
        var a = this;
        this.config.$container.on("click", a.config.parentSelector + ".simple-accordion-closed", function(b) {
            b.preventDefault();
            a.openClose(this)
        }).on("click", a.config.parentSelector + ".simple-accordion-opened", function(b) {
            b.preventDefault();
            a.openClose(this)
        })
    },
    openClose: function(a) {
        var b = this;
        $(a).hasClass("simple-accordion-closed") ? $(a).removeClass("simple-accordion-closed").addClass("simple-accordion-opened") : $(a).removeClass("simple-accordion-opened").addClass("simple-accordion-closed");
        $(a).next(this.config.childHolderSelector).slideToggle(500)
    },
    removeMainAccordion: function() {
        var a = this;
        this.config.$container.removeClass("simple-accordion");
        $(this.config.parentSelector, this.config.$container).each(function() {
            if ($(this).next(a.config.childHolderSelector).html()) {
                $(this).next(a.config.childHolderSelector).removeAttr("style")
            }
        });
        this.config.$container.off("click")
    }
};
HAB.simpleAccordionModule = Object.create(HAB.simpleAccordionClass);
HAB.pdpStrengthSelect = {
    init: function(a) {
        this.config = {
            initSelect: true,
            selectStrengthSelector: "#strength-flavour-select",
            selectStrengthOptionContainer: ".prod-size-multi-opts",
            $container: $(a)
        };
        this.removeSelect();
        var b = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-220")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        if (this.config.initSelect) {
            this.bindEvents()
        }
    },
    bindEvents: function() {
        var a = this;
        $(this.config.selectStrengthSelector).on("change", function(c) {
            var b = $(this).find(":selected").data("strength-select-href");
            window.location.href = b
        })
    },
    removeSelect: function() {
        var a = this;
        this.config.$container.off("click")
    }
};
HAB.pdpStrengthSelectModule = Object.create(HAB.pdpStrengthSelect);
HAB.pdpSizeSelect = {
    init: function(b) {
        this.config = {
            initDesktopSelect: true,
            initMobileSelect: true,
            selectSizeSelector: "#size-select",
            selectSizeOptionContainer: ".prod-size-opts",
            selectSizeInputContainerSelector: ".radio",
            selectSizeOptionTitleSelector: ".prod-size-title",
            formItemsContainerClass: ".form-item-container",
            disabledItemClass: "oos",
            submitButtonClass: ".prod-submit.prod-submit-basket",
            ecsPaypalBlock: "#js-pdp-ecs-paypal-block",
            ogDivPDPclass: ".og-pdp",
            quantitySelectorClass: ".prod-submit-opts .prod-qty.quantity-selectbox-holder",
            emwaSelectorClass: ".emwa-link-container",
            radioElementSelector: ".prod-size-opts .radio .js-select-sku",
            $container: $(b)
        };
        this.removeSelect();
        var c = this.config.$container.data("init-params");
        $("body").is(".breakpoint-220") ? $.extend(true, this.config, c.breakpoint220 || {}) : $.extend(true, this.config, c.breakpoint768 || {});
        if (this.config.initDesktopSelect) {
            this.initRadio();
            this.bindEvents()
        }
        if (this.config.initMobileSelect) {
            this.initMobileRadio();
            this.bindMobileEvents()
        }
        if ($(".og-pdp").data("og-eligible")) {
            var a = $(".og-pdp-add-to-basket .prod-submit-bt");
            if (a.is(":visible")) {
                HAB.orderGroove.setProduct(a)
            }
        } else {
            $(this.config.ogDivPDPclass).hide()
        }
    },
    initRadio: function() {
        var a = this;
        $(this.config.selectSizeInputContainerSelector).find("input[disabled]").each(function() {
            $(this).prop("disabled", false)
        });
        this.checkAvailability($(this.config.formItemsContainerClass).find("input[checked]").parents(this.config.selectSizeInputContainerSelector))
    },
    initMobileRadio: function() {
        var a = this;
        $(this.config.selectSizeInputContainerSelector + "[data-sku-disabled=true]").each(function() {
            $(this).find("input").prop("disabled", true).prop("checked", false)
        });
        if ($(a.config.formItemsContainerClass).find("input[type='radio']:checked").is(":not(:disabled)")) {
            a.checkMobileAvailability($(a.config.formItemsContainerClass).find("input[type='radio']:checked").not(":disabled"))
        }
    },
    bindEvents: function() {
        var a = this;
        $(this.config.selectSizeSelector).on("change", function(b) {
            var c = $(this).find(":selected").data("size-id");
            a.toggleSku($(a.config.formItemsContainerClass).find("[data-sku-id=" + c + "]"))
        })
    },
    bindMobileEvents: function() {
        var a = this;
        $(this.config.selectSizeInputContainerSelector).find("input").on("click", function(b) {
            a.checkMobileAvailability($(this))
        })
    },
    toggleSku: function(a) {
        $(a).find("input").click();
        this.checkAvailability($(a))
    },
    checkMobileAvailability: function(a) {
        var b = $(a).data("sku-id");
        if ($(a).data("show-emwa")) {
            if (!$(a).find("input:visible").length) {
                $(a).find("input").attr("checked", true)
            }
            $(this.config.submitButtonClass).hide();
            $(this.config.ecsPaypalBlock).hide();
            $(this.config.ogDivPDPclass).hide();
            $(this.config.quantitySelectorClass).hide();
            $(this.config.emwaSelectorClass + "[data-sku-id=" + b + "]").show()
        } else {
            $(this.config.submitButtonClass).show();
            $(this.config.ecsPaypalBlock).show();
            $(this.config.quantitySelectorClass).show()
        }
    },
    checkAvailability: function(a) {
        var b = $(a).data("sku-id");
        if ($(a).data("show-emwa")) {
            if (!$(a).find("input:visible").length) {
                $(a).find("input").attr("checked", true)
            }
            $(this.config.submitButtonClass).hide();
            $(this.config.ecsPaypalBlock).hide();
            $(this.config.ogDivPDPclass).hide();
            $(this.config.quantitySelectorClass).hide();
            $(this.config.emwaSelectorClass + ":visible").hide();
            $(this.config.emwaSelectorClass + "[data-sku-id=" + b + "]").show()
        } else {
            $(this.config.submitButtonClass).show();
            $(this.config.ecsPaypalBlock).show();
            $(this.config.quantitySelectorClass).show();
            $(this.config.emwaSelectorClass + ":visible").hide()
        }
    },
    removeSelect: function() {
        var a = this;
        this.config.$container.off("click")
    }
};
HAB.pdpSizeSelectModule = Object.create(HAB.pdpSizeSelect);
HAB.desktopFilters = {
    init: function(a) {
        this.config = {
            initFilters: true,
            itemSelector: ".filter-list-item",
            itemTitleSelector: ".filter-group-title",
            initializedContainerSelector: ".prod-filters-accordion-active",
            initializedContainerClass: "prod-filters-accordion-active",
            $container: $(a)
        };
        this.removeDesktopFilters();
        var b = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-220") && !$("html").hasClass("lt-ie9")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        if (!$(this.config.initializedContainerSelector).length) {
            this.generateFiltersAccordion();
            this.config.$container.addClass(this.config.initializedContainerClass);
            this.bindEvents()
        }
    },
    generateFiltersAccordion: function() {
        var a = this
    },
    bindEvents: function() {
        var a = this;
        $(a.config.itemTitleSelector).on("click", function(b) {
            var c = b.target;
            $(c).parents(a.config.itemSelector).toggleClass("expanded collapsed")
        })
    },
    removeDesktopFilters: function() {
        var a = this
    }
};
HAB.desktopFiltersModule = Object.create(HAB.desktopFilters);
HAB.mobileFilters = {
    init: function(a) {
        this.config = {
            initFilters: true,
            activeContainerSelector: ".filter-menu-active",
            activeContainerClass: "filter-menu-active",
            initializedContainerSelector: ".filter-menu-initialized",
            initializedContainerClass: "filter-menu-initialized",
            $container: $(a)
        };
        this.removeMobileFilters();
        var b = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-220")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        if (!$(this.config.activeContainerSelector).length && this.config.initFilters) {
            this.config.$container.addClass(this.config.activeContainerClass);
            if (!$(this.config.initializedContainerSelector).length) {
                this.generateFiltersMenu();
                this.config.$container.addClass(this.config.initializedContainerClass)
            }
            this.bindEvents()
        }
    },
    generateFiltersMenu: function() {
        var a = this;
        $("#filter-menu").multilevelpushmenu({
            menuWidth: "100%",
            collapsed: false,
            mode: "cover",
            backText: "",
            backItemIcon: "",
            menuInactiveClass: "mlpm_inactive"
        })
    },
    bindEvents: function() {
        var a = this;
        $("#filters-open").click(function() {
            $(".filter-menu-container").addClass("opened")
        });
        $("#filters-close").click(function() {
            $(".filter-menu-container").removeClass("opened")
        })
    },
    removeMobileFilters: function() {
        var a = this;
        this.config.$container.removeClass(this.config.activeContainerClass)
    }
};
HAB.mobileFiltersModule = Object.create(HAB.mobileFilters);
HAB.mainProductsBundleClass = {
    init: function(a) {
        this.config = {
            init: true,
            elementSelector: ".l-col",
            formSelector: ".prod-teaser-form",
            elementPriceSelector: ".prod-price .current-prod-price",
            checkboxSelector: ".checkbox-selector",
            totalPriceSelector: ".total-price .total-price-sum",
            submitSelector: ".orangeSubmit.bigSubmit",
            productsBundleBuyMessageSelector: ".products-bundle-buy-message",
            titleSelector: ".prod-title",
            titleCutAfter: 42,
            $container: $(a)
        };
        this.removeProductsBundle();
        var b = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-220") && !$("html").hasClass("lt-ie9")) ? $.extend(true, this.config, b.breakpoint220 || {}) : $.extend(true, this.config, b.breakpoint768 || {});
        if (this.config.init) {
            this.bindEvents();
            this.activateElements();
            this.calculateTotalPrice()
        }
    },
    activateElements: function() {
        $(this.config.checkboxSelector + " input:eq(0)", this.config.$container).prop("disabled", true);
        $(this.config.submitSelector, this.config.$container).prop("disabled", false);
        this.cutContent()
    },
    cutContent: function() {
        var b = this
          , a = "";
        $(this.config.titleSelector, this.config.$container).each(function() {
            a = $(this).html();
            $(this).html(HAB.healpers.cutContent(a, b.config.titleCutAfter))
        })
    },
    bindEvents: function() {
        var a = this;
        this.config.$container.on("click", a.config.checkboxSelector, function(c) {
            var b = $("input", this);
            if (!b.prop("disabled")) {
                a.calculateTotalPrice()
            }
        }).on("click", a.config.submitSelector, function(d) {
            d.preventDefault();
            var e = {}
              , f = $(a.config.formSelector + ":eq(0)", a.config.$container)
              , b = f.data("ajax-url")
              , c = f.data("refresh-url");
            e.isRecommendedBundle = true;
            e["prod-qty-field"] = 0;
            e.recommendedBundles = [];
            $(a.config.checkboxSelector + " input", a.config.$container).each(function() {
                if ($(this).is(":checked")) {
                    var h = $(this).closest(a.config.formSelector)
                      , k = h.serializeArray()
                      , g = {};
                    $(k).each(function() {
                        g[this.name] = this.value
                    });
                    e.recommendedBundles.push(g);
                    e["prod-qty-field"] += 1
                }
            });
            e.recommendedBundles = JSON.stringify(e.recommendedBundles);
            $(a.config.productsBundleBuyMessageSelector, a.config.$container).html("").addClass("loading");
            $.post(b, e, function(g) {
                $(a.config.productsBundleBuyMessageSelector, a.config.$container).html(g).removeClass("loading");
                $.root.find(".js-header-basket-link").load(c)
            })
        })
    },
    calculateTotalPrice: function() {
        var c = this
          , b = 0
          , a = 0;
        $(this.config.checkboxSelector + " input", this.config.$container).each(function() {
            if ($(this).is(":checked")) {
                a = parseFloat($(this).closest(c.config.elementSelector).find(c.config.elementPriceSelector).text().substr(1));
                if (a) {
                    b += parseFloat(a)
                } else {
                    $(this).prop("checked", false).prop("disabled", true)
                }
            }
        });
        $(this.config.totalPriceSelector, this.config.$container).text(b.toFixed(2))
    },
    removeProductsBundle: function() {
        this.config.$container.off("click")
    }
};
HAB.mainProductsBundleModule = Object.create(HAB.mainProductsBundleClass);
HAB.mainFacetsClass = {
    init: function(b) {
        this.config = {
            init: true,
            inputSelector: ".facets-input",
            elementHolderSelector: ".facets-elements",
            elementSelector: ".facets-item",
            elementLinkSelector: "a",
            noSearchResults: ".no-search-results",
            placeholderSelector: ".placeholder-item",
            placeholderText: "",
            $container: $(b)
        };
        var d = $(this.config.placeholderSelector, this.config.$container)
          , a = d.html().toLowerCase();
        this.config.placeholderText = a;
        this.removeModule();
        var c = this.config.$container.data("init-params");
        ($("body").is(".breakpoint-220")) ? $.extend(true, this.config, c.breakpoint220 || {}) : $.extend(true, this.config, c.breakpoint768 || {});
        if (this.config.init) {
            this.bindEvents()
        }
    },
    bindEvents: function() {
        var b = this
          , a = "";
        $(this.config.inputSelector, this.config.$container).on("propertychange", function() {
            a = $(this).val();
            b.selectElement(a)
        });
        if ($("html").hasClass("ie9")) {
            this.config.$container.on("keyup", b.config.inputSelector, function() {
                a = $(this).val();
                b.selectElement(a)
            })
        }
        this.config.$container.on("input", b.config.inputSelector, function() {
            a = $(this).val();
            b.selectElement(a)
        })
    },
    selectElement: function(d) {
        var c = this
          , a = ""
          , e = d.toLowerCase()
          , b = 0;
        this.showAll();
        if (e != "" && e != this.config.placeholderText) {
            $(this.config.elementSelector + " " + this.config.elementLinkSelector, this.config.$container).each(function() {
                a = $.trim($(this).html().toLowerCase());
                if (a.length > 0) {
                    if (a.indexOf(e) != 0) {
                        $(this).closest(c.config.elementSelector).addClass("facets-item-hidden")
                    } else {
                        b += 1
                    }
                }
            });
            if (b == 0) {
                $(this.config.noSearchResults, this.config.$container).removeClass("facets-item-hidden")
            }
        }
    },
    showAll: function() {
        $(this.config.elementSelector, this.config.$container).removeClass("facets-item-hidden");
        $(this.config.noSearchResults, this.config.$container).addClass("facets-item-hidden")
    },
    removeModule: function() {
        this.config.$container.off("input");
        this.config.$container.off("keyup");
        this.config.$container.off("propertychange");
        if (this.config.placeholderText != $(this.config.inputSelector, this.config.$container).val().toLowerCase()) {
            $(this.config.inputSelector, this.config.$container).val("")
        }
        this.showAll()
    }
};
HAB.mainFacetsModule = Object.create(HAB.mainFacetsClass);
HAB.initModule = function() {
    var a = {};
    $("[data-init-module]").each(function() {
        a[$(this).data("init-module")] = true
    });
    for (property in a) {
        $('[data-init-module="' + property + '"]').each(function(b) {
            HAB[property][b] = Object.create(HAB[property]);
            if (typeof HAB[property][b].config !== "undefined") {
                var c = $(this).data("init-params");
                $.extend(true, HAB[property][b].config, c || {})
            }
            HAB[property][b].init(this)
        })
    }
}
;
HAB.loadingContent = function(a) {
    var c = (a) ? a.data("href") : ""
      , d = function() {}
      , b = function() {};
    if (c) {
        d = function(e) {
            a.html(e);
            $("[data-init-module]", a).each(function() {
                var h = $(this).data("init-module")
                  , g = 0;
                if (Object.keys) {
                    g = Object.keys(HAB[h]).length
                } else {
                    var f;
                    for (f in HAB[h]) {
                        if (HAB[h].hasOwnProperty(f)) {
                            g++
                        }
                    }
                }
                HAB[h][g] = Object.create(HAB[h]);
                HAB[h][g].init(this)
            })
        }
        ;
        b = function() {
            a.html("")
        }
        ;
        $.ajax({
            type: "GET",
            url: c,
            success: d,
            error: b
        })
    }
}
;
HAB.replacementSubmitFormClass = {
    init: function(a) {
        this.config = {
            init: true,
            formSelector: "#orderReplacementForm",
            labelSelector: ".order-replacement-checkbox",
            inputSelector: "#js-is-order-replacement",
            $container: $(a)
        };
        this.bindEvents()
    },
    bindEvents: function() {
        var a = this;
        this.config.$container.on("change", a.config.labelSelector, function(d) {
            var c = $.root.find("#ajaxBasketModule");
            var b = HAB.basket.getRefreshURL();
            $(a.config.inputSelector).attr("value", $(a.config.labelSelector).is(":checked"));
            SFR.Utils.submitAjaxForm($(a.config.formSelector), c, b, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
        })
    }
};
HAB.replacementSubmitFormModule = Object.create(HAB.replacementSubmitFormClass);
HAB.quantitySelectboxClass = {
    init: function(a) {
        this.config = {
            holderSelector: ".quantity-selectbox-holder",
            selectSelector: ".item-quantity-selectbox",
            inputSelector: ".input-quantity-selectbox"
        };
        this.bindEvents()
    },
    bindEvents: function() {
        var a = this;
        $("body").on("change", a.config.selectSelector, function() {
            if (!$(this).is(":disabled")) {
                $(this).closest(a.config.holderSelector).find(a.config.inputSelector).val($(this).val()).trigger(jQuery.Event("keypress", {
                    which: 13
                }))
            }
        }).on("change", a.config.inputSelector, function() {
            var g = $(this)
              , f = g.siblings("button.minus")
              , d = g.siblings("button.plus")
              , c = parseInt(g.attr("min"), 10)
              , b = parseInt(g.attr("max"), 10);
            g.siblings("button").prop("disabled", false);
            var e = g.val();
            if (g.val() <= c) {
                f.prop("disabled", true);
                e = c
            } else {
                if (g.val() >= b) {
                    d.prop("disabled", true);
                    e = b
                }
            }
            resetSkuQuantityForOG(e)
        })
    }
};
function resetSkuQuantityForOG(b) {
    if ($(".og-pdp").is(":visible")) {
        var a = $(".og-pdp-add-to-basket .prod-submit-bt");
        a.data("quantity", b);
        HAB.orderGroove.setProduct(a)
    }
}
HAB.quantitySelectboxClass.init();
HAB.mobileHamburgerNavigationClass = {
    init: function() {
        this.config = {
            initMenu: true,
            $container: $(".mobile-navigation"),
            mobileNavigationBtn: "#mobile-navigation-header-logo-btn",
            mobileNavigationHeaderItemsList: "#mobile-navigation-header-items-list",
            mobileHamburgerNavigationOverlay: "#mobile-hamburger-navigation-overlay",
            mobileHamburgerNavigationOpenedClass: "mobile-menu-opened",
            mobileNavigationItemsListSelector: ".mobile-navigation-list",
            dataLevel: "data-level",
            dataLevelCurrent: "data-level-current",
            dataLevelCurrentCount: "1",
            dataLevelActive: "data-level-active",
            dataLevelContinue: "data-level-continue",
            openClassSelector: "open",
            closeClassSelector: "close",
            mobileMenu: ""
        };
        if (!$(this.config.mobileNavigationHeaderItemsList).length) {
            this.addChangeToHtml()
        }
    },
    remove: function() {
        var a = this;
        $("html").removeClass(a.config.mobileHamburgerNavigationOpenedClass);
        $("body").removeClass(a.config.mobileHamburgerNavigationOpenedClass);
        $(a.config.mobileHamburgerNavigationOverlay).hide();
        $(a.config.mobileNavigationBtn).removeClass(a.config.closeClassSelector).addClass(a.config.openClassSelector)
    },
    addChangeToHtml: function() {
        var c = this
          , f = document.createElement("div")
          , a = ""
          , d = ""
          , b = ""
          , e = "";
        $.each($(".main-nav.replete-nav [role=menubar] .main-nav-item"), function() {
            d = $(this).find(">a");  
			d.removeClass().addClass("mobile-nav-item simple-nav-item");
            c.config.mobileMenu += "<li>"+ $(d) +"</li>";
        });
        if ($(".js-mobile-navigation-menu-item").find(".account-nav-item").prop("outerHTML") !== undefined) {
            c.config.mobileMenu += $(".js-mobile-navigation-menu-item").find(".account-nav-item").prop("outerHTML")
        }
        c.config.mobileMenu = "<div class='desktop-hidden' id='" + c.config.mobileNavigationHeaderItemsList.substr(1) + "'><ul class='mobile-navigation-list' data-level='1' data-level-current='1'>" + c.config.mobileMenu + "</ul></div><div id='" + c.config.mobileHamburgerNavigationOverlay.substr(1) + "'></div>";
        $("body").prepend(c.config.mobileMenu);
      //  this.preBindEvents()
    },
    preBindEvents: function() {
        var a = this;
        if ($(a.config.mobileNavigationHeaderItemsList).length) {
            a.bindEvents()
        } else {
            setTimeout(function() {
                a.preBindEvents()
            }, 500)
        }
    },
    bindEvents: function() {
        var a = this;
        a.config.$container.on("click", a.config.mobileNavigationBtn + "." + a.config.openClassSelector, function(b) {
            $("html").addClass(a.config.mobileHamburgerNavigationOpenedClass);
            $("body").addClass(a.config.mobileHamburgerNavigationOpenedClass);
            $(a.config.mobileHamburgerNavigationOverlay).show();
            $(a.config.mobileNavigationBtn).removeClass(a.config.openClassSelector).addClass(a.config.closeClassSelector)
        }).on("click", a.config.mobileNavigationBtn + "." + a.config.closeClassSelector, function(b) {
            $("html").removeClass(a.config.mobileHamburgerNavigationOpenedClass);
            $("body").removeClass(a.config.mobileHamburgerNavigationOpenedClass);
            $(a.config.mobileHamburgerNavigationOverlay).hide();
            $(a.config.mobileNavigationBtn).removeClass(a.config.closeClassSelector).addClass(a.config.openClassSelector);
            $("[" + a.config.dataLevel + "][" + a.config.dataLevelActive + "=active]").attr(a.config.dataLevelActive, "");
            $("." + a.config.mobileSecondLevelShowClass).removeClass(a.config.mobileSecondLevelShowClass);
            $(a.config.mobileNavigationItemsListSelector).attr(a.config.dataLevelCurrent, a.config.dataLevelCurrentCount = "1")
        });
        $(a.config.mobileNavigationHeaderItemsList).on("click", "li .mobile-nav-item:not(.simple-nav-item):not(.loaded)", function(c) {
            c.preventDefault();
            var d = $(this).attr("data-url-ref");
            var e = "mfly" + $(this).attr("data-url-id");
            var b = $("#" + e).html();
            loadMobileHeaderMenuItem(this, e, d, b);
            $(a.config.mobileNavigationItemsListSelector).attr(a.config.dataLevelCurrent, ++a.config.dataLevelCurrentCount);
            $(this).siblings("[" + a.config.dataLevel + "]").attr(a.config.dataLevelActive, "active");
            $(this).closest(".flyout-nav-column").next(".flyout-nav-column").find(".flyout-nav-block:first-child>.link-list[data-level-continue='true']").attr(a.config.dataLevelActive, "active").css({
                top: $(this).siblings("[" + a.config.dataLevel + "]").height()
            });
            $(a.config.mobileNavigationHeaderItemsList).addClass(a.config.mobileSecondLevelShowClass);
            $(this).addClass(a.config.mobileSecondLevelOpenedClass)
        });
        $(a.config.mobileNavigationHeaderItemsList).on("click", "li .mobile-nav-item:not(.simple-nav-item).loaded", function(b) {
            b.preventDefault();
            $(a.config.mobileNavigationItemsListSelector).attr(a.config.dataLevelCurrent, ++a.config.dataLevelCurrentCount);
            $(this).siblings("[" + a.config.dataLevel + "]").attr(a.config.dataLevelActive, "active");
            $(this).closest(".flyout-nav-column").next(".flyout-nav-column").find(".flyout-nav-block:first-child>.link-list[data-level-continue='true']").attr(a.config.dataLevelActive, "active").css({
                top: $(this).siblings("[" + a.config.dataLevel + "]").height()
            })
        });
        $(a.config.mobileNavigationHeaderItemsList).on("click", ".mobile-nav-item-back", function(b) {
            b.preventDefault();
            $("[" + a.config.dataLevel + "=" + a.config.dataLevelCurrentCount + "][" + a.config.dataLevelActive + "=active]").attr(a.config.dataLevelActive, "");
            $(a.config.mobileNavigationItemsListSelector).attr(a.config.dataLevelCurrent, --a.config.dataLevelCurrentCount);
            setTimeout(function() {}, 200)
        });
        $(a.config.mobileNavigationItemsListSelector).on("click", function() {
            if ($(a.config.mobileNavigationHeaderItemsList).scrollTop() != 0) {
                $(a.config.mobileNavigationHeaderItemsList).animate({
                    scrollTop: 0
                }, 200)
            }
            $(a.config.mobileNavigationHeaderItemsList).css("overflow-y", "hidden");
            setTimeout(function() {
                $(a.config.mobileNavigationHeaderItemsList).css("overflow-y", "auto")
            }, 300)
        });
        $("body").on("click vclick", a.config.mobileHamburgerNavigationOverlay, function(b) {
            b.preventDefault();
            $(a.config.mobileNavigationBtn + "." + a.config.closeClassSelector).trigger("click")
        })
    }
};
HAB.mobileHamburgerNavigationModule = Object.create(HAB.mobileHamburgerNavigationClass);
HAB.winMobilePopup = {
    init: function() {
        if ($("body").hasClass("is-ieMobile")) {
            this.config = {
                bodyFrameCls: ".is-ieMobile",
                frameId: "iframe-ieMobile",
                frameBtnCls: ".ie-frame",
                frameCloseBtn: "close",
                frameTemplate: {
                    width: "100%",
                    height: "100%",
                    frameborder: 0
                },
                frameBodyCss: {
                    margin: "0",
                    background: "#fff",
                    padding: "0 35px 0 15px"
                },
                frameBtnCloseCss: {
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    font: "bold 32px/1 Arial, sans-serif",
                    color: "#000",
                    textDecoration: "none"
                }
            };
            this.config.frameTemplate.id = this.config.frameId;
            this.initHolder();
            this.bindEvents()
        }
    },
    initHolder: function() {
        var a = this;
        var b = $("<iframe />", a.config.frameTemplate);
        if (!$("#" + a.config.frameId).length) {
            b.load(function() {
                var c = $("#" + a.config.frameId).contents();
                c.find("body").css(a.config.frameBodyCss);
                c.find("body").append('<a href="#" class="' + a.config.frameCloseBtn + '">X</a>');
                c.find("." + a.config.frameCloseBtn).css(a.config.frameBtnCloseCss)
            }).appendTo(a.config.bodyFrameCls)
        }
    },
    bindEvents: function() {
        var a = this;
        $(a.config.frameBtnCls).click(function(c) {
            c.preventDefault();
            var b = $(this).attr("href");
            $("#" + a.config.frameId).attr("src", b).addClass("active")
        });
        $("#" + a.config.frameId).load(function() {
            $("#" + a.config.frameId).contents().find("." + a.config.frameCloseBtn).on("click", function() {
                $("#" + a.config.frameId).removeClass("active")
            })
        })
    }
};
HAB.callTealiumView = function() {
    HAB.callTealium("view", window.universal_variable)
}
;
HAB.callTealium = function(b, a) {
    if (typeof utag != "undefined" && typeof utag[b] === "function") {
        utag[b](a)
    }
}
;
HAB.mobileCheckoutBtnPos = {
    init: function() {
        this.config = {
            bthHolder: $(".f-basket .holder-for-p-fixed"),
            checkoutBtn: $(".f-basket .checkoutBtn"),
            flag: true
        };
        if (this.config.checkoutBtn.length > 0) {
            this.btnPositionChange()
        }
    },
    remove: function() {
        this.config.bthHolder.removeClass("p-fixed");
        this.config.flag = false
    },
    btnPositionChange: function() {
        var b = this
          , a = this.config.checkoutBtn.offset().top;
        if ($(window).scrollTop() >= a) {
            b.config.bthHolder.addClass("p-fixed")
        }
        $(window).scroll(function() {
            if (b.config.flag) {
                if ($(window).scrollTop() >= a) {
                    b.config.bthHolder.addClass("p-fixed")
                } else {
                    if ($(window).scrollTop() < a) {
                        b.config.bthHolder.removeClass("p-fixed")
                    }
                }
            }
        })
    }
};
HAB.confirmationOfRegistration = {
    getCookieName: function() {
        return "regOnPage"
    },
    init: function() {
        this.config = {
            slideTime: 500,
            delayTime: 5000,
            popupBox: $(".boxRegistration"),
            btnRegisterUser: $("#register-submit"),
            btnConfirmRegisterUser: $("#confirm-register-submit"),
            btnCheckoutRegisterUser: $("#checkout-about-you-submit"),
            chbCheckoutNoAccount: $("#checkout_form_no_account"),
            fldCheckoutFormPassword: $("#checkout_form_password"),
            isPasswordSpecified: false,
            registredOnPage: this.getCookieName()
        };
        this.bindEvents();
        this.postRegisteredActions()
    },
    bindEvents: function() {
        var a = this;
        this.config.btnRegisterUser.on("click", function() {
            a.createCookie(a.config.registredOnPage, a.getCurrentURL())
        });
        this.config.btnConfirmRegisterUser.on("click", function() {
            a.createCookie(a.config.registredOnPage, a.getCurrentURL())
        });
        this.config.fldCheckoutFormPassword.on("blur", function() {
            if (a.config.fldCheckoutFormPassword.val()) {
                a.config.isPasswordSpecified = true
            } else {
                a.config.isPasswordSpecified = false
            }
        });
        this.config.btnCheckoutRegisterUser.on("click", function() {
            var b = !a.config.chbCheckoutNoAccount.prop("checked");
            if (b && a.config.isPasswordSpecified) {
                a.createCookie(a.config.registredOnPage, a.getCurrentURL())
            }
        })
    },
    createCookie: function(c, d, e) {
        if (e) {
            var b = new Date();
            b.setTime(b.getTime() + (e * 24 * 60 * 60 * 1000));
            var a = "; expires=" + b.toGMTString()
        } else {
            var a = ""
        }
        document.cookie = c + "=" + d + a + "; path=/"
    },
    readCookie: function(b) {
        var e = b + "=";
        var a = document.cookie.split(";");
        for (var d = 0; d < a.length; d++) {
            var f = a[d];
            while (f.charAt(0) == " ") {
                f = f.substring(1, f.length)
            }
            if (f.indexOf(e) == 0) {
                return f.substring(e.length, f.length)
            }
        }
        return null
    },
    removeCookie: function(a) {
        this.createCookie(a, "", -1)
    },
    getCurrentURL: function() {
        return window.location.href.split("?")[0]
    },
    isRegistredOnPage: function() {
        return this.readCookie(this.getCookieName())
    },
    postRegisteredActions: function() {
        var a = this
          , b = this.isRegistredOnPage();
        if (b != null) {
            if (this.getCurrentURL() != b) {
                this.config.popupBox.slideDown(this.config.slideTime, function() {
                    a.removeCookie(a.config.registredOnPage)
                }).delay(this.config.delayTime).slideUp(this.config.slideTime)
            } else {
                this.removeCookie(this.config.registredOnPage)
            }
        }
    }
};
HAB.address = {
    hiddenClass: "hdn",
    selectedSearchSectionClass: ".selectedSearchSection",
    config: {
        houseContainer: ".js-container-house-number",
        codeContainer: ".js-container-postal-code"
    },
    init: function() {
        $(document).on("click", "#show-address-manual-input", this.showManualInput);
        $(document).on("click", "#show-address-selected-search", this.showSelectedSearch);
        $("#editYourDetailsFormId, #rflFullActivationForm").submit(function() {
            HAB.address.chooseCorrectAddressBeforeSubmit()
        });
        this.initAddressConfig();
        this.initStylesUKandNED(this.config.initialCountryCode)
    },
    initAddressConfig: function() {
        if (window.globalConfig.address) {
            $.extend(this.config, window.globalConfig.address)
        }
    },
    chooseCorrectAddressBeforeSubmit: function(a) {
        var c = b(a);
        if (!c.find(HAB.address.selectedSearchSectionClass).hasClass(HAB.address.hiddenClass)) {
            c.find(".js-address-house").val(c.find(".selected-search-house").text());
            c.find(".js-address-addition").val(c.find(".js-address-addition-alternative").val());
            c.find(".js-address-street").val(c.find(".selected-search-street").text());
            c.find(".js-address-city").val(c.find(".selected-search-city").text());
            c.find(".js-address-county").val(c.find(".selected-search-county").text());
            c.find(".js-address-postcode").val(c.find(".selected-search-postcode").text());
            c.find("#manual_addr_verified").val("false")
        }
        return true;
        function b(d) {
            if (d) {
                return c = $(d).closest("form")
            }
            return c = $(document).find(".js-handle-address")
        }
    },
    showManualInput: function() {
        HAB.address.switchAddressView($(this).closest("form"), true)
    },
    showSelectedSearch: function() {
        HAB.address.switchAddressView($(this).closest("form"), false)
    },
    switchAddressView: function(d, a) {
        var e = d.find(".js-address-manual-input");
        var b = d.find(".js-address-selected-search:not(.isEmpty), .multiselect.postcode-lookup-field");
        var f = d.find(':input[name="country"]').val();
        var c = d.find(".js-manual-label-address");
        if (a) {
            e.removeClass("hdn");
            b.addClass("hdn");
            c.removeClass("hdn")
        } else {
            e.addClass("hdn");
            b.removeClass("hdn");
            c.addClass("hdn");
            HAB.address.switchValidation(d, f);
            HAB.address.switchSpecialFields(d, f);
            d.find(".lookup_fields_holder").find("span.error").removeClass("error").find("em").empty()
        }
    },
    checkRequiredPostCode: function(a) {
        var b = a.value;
        var c = $($(a).parents("form:first")[0]);
        var d = c.find(".js-address-manual-container");
        HAB.address.switchOptionalPostCode(c, b);
        HAB.address.switchValidation(c, b);
        HAB.address.switchSpecialFields(c, b);
        HAB.address.initStylesUKandNED(b);
        HAB.address.adjustStylesForCountry(c, b);
        if (!d.hasClass("hdn")) {
            HAB.address.switchAddressView(c, true)
        }
        c.find(".lookup_fields_holder").find("span.error").removeClass("error").find("em").empty();
        HAB.address.clearLookupFields(c)
    },
    switchOptionalPostCode: function(b, a) {
        var c = HAB.address.config.optionalPostCodeCountryList;
        if (c.indexOf(a) > -1) {
            b.find(".postcode-lookup-field .optional").attr("style", "display:block");
            b.find('.postcode-lookup-field input[name="registration-rfl_postcode-lookup"]').prop("required", false).removeInlineValidation()
        } else {
            b.find(".postcode-lookup-field .optional").attr("style", "display:none");
            b.find('.postcode-lookup-field input[name="registration-rfl_postcode-lookup"]').prop("required", true).inlineValidation()
        }
    },
    switchValidation: function(c, b) {
        var a = HAB.address.config.countryPostalCodeAList;
        if (b == "IRL") {
            c.find(".js-address-selected-search .house-lookup, .town-lookup, .street-lookup").prop("required", false).removeInlineValidation();
            c.find(".js-address-selected-search .street-lookup, .town-lookup").prop("required", true).inlineValidation();
            var d = c.find(".house-lookup");
            HAB.address.hidePlaceholder(c, d, true)
        } else {
            if (a.indexOf(b) > -1) {
                c.find(".postCodeMandatory .optional").attr("style", "display:none");
                c.find(".js-address-selected-search .house-lookup, .town-lookup, .street-lookup").prop("required", false).removeInlineValidation();
                c.find(".js-address-selected-search .house-lookup, .town-lookup, .street-lookup").prop("required", true).inlineValidation();
                var d = c.find(".house-lookup, .postcode-lookup");
                HAB.address.hidePlaceholder(c, d, true)
            } else {
                var d = c.find(".house-lookup, .postcode-lookup");
                if (b == "NLD" || b == "BEL") {
                    c.find(".js-address-selected-search .house-lookup").prop("required", false).removeInlineValidation();
                    c.find(".js-address-selected-search .house-lookup").prop("required", true).inlineValidation();
                    c.find(".js-address-selected-search .town-lookup, .street-lookup").prop("required", false).removeInlineValidation()
                } else {
                    c.find(".js-address-selected-search .house-lookup, .town-lookup, .street-lookup").prop("required", false).removeInlineValidation()
                }
                HAB.address.hidePlaceholder(c, d, false)
            }
        }
    },
    switchSpecialFields: function(c, b) {
        var a = HAB.address.config.countryPostalCodeAList;
        var d = HAB.address.config.countryPostalCodeCoreList;
        if (d.indexOf(b) > -1) {
            if (b == "IRL") {
                c.find(".postCodeMandatory").removeClass("hdn");
                c.find(".js-container-house-number").removeClass("house-number-oneline");
                c.find(".js-address-selected-search-city").removeClass("hdn");
                c.find(".js-address-selected-search-street").removeClass("hdn");
                c.find(".js-postcode-lookup-span").addClass("hdn").removeClass("js-postcode-lookup-span-view");
                c.find(".js-switch-label-houseNumName").removeClass("hdn");
                c.find(".js-switch-label-address").addClass("hdn");
                c.find(".js-leading-postcode-lookup-span").addClass("hdn");
                c.find(".js-addition-lookup-span").addClass("hdn")
            } else {
                if (b == "NLD" || b == "BEL") {
                    c.find(".postCodeMandatory").removeClass("hdn");
                    c.find(".js-address-selected-search-city").addClass("hdn");
                    c.find(".js-address-selected-search-street").addClass("hdn");
                    c.find(".js-postcode-lookup-span").removeClass("hdn js-postcode-lookup-span-view");
                    c.find(".js-container-house-number").addClass("house-number-oneline");
                    c.find(".js-postcode-label").addClass("hdn");
                    c.find(".js-switch-label-houseNumName").addClass("hdn");
                    c.find(".js-switch-label-address").removeClass("hdn");
                    c.find(".js-leading-postcode-lookup-span").removeClass("hdn");
                    c.find(".js-postcode-lookup-span").addClass("hdn");
                    c.find(".js-addition-lookup-span").removeClass("hdn")
                } else {
                    c.find(".postCodeMandatory").removeClass("hdn");
                    c.find(".js-address-selected-search-city").addClass("hdn");
                    c.find(".js-address-selected-search-street").addClass("hdn");
                    c.find(".js-postcode-lookup-span").removeClass("hdn js-postcode-lookup-span-view");
                    c.find(".js-postcode-label").addClass("hdn");
                    c.find(".js-switch-label-houseNumName").addClass("hdn");
                    c.find(".js-switch-label-address").removeClass("hdn");
                    c.find(".js-leading-postcode-lookup-span").addClass("hdn");
                    c.find(".js-addition-lookup-span").addClass("hdn")
                }
            }
        } else {
            if (a.indexOf(b) > -1) {
                c.find(".postCodeMandatory").removeClass("hdn");
                c.find(".js-container-house-number").removeClass("house-number-oneline");
                c.find(".js-address-selected-search-city").addClass("hdn");
                c.find(".js-address-selected-search-street").removeClass("hdn");
                c.find(".js-postcode-lookup-span").removeClass("hdn").addClass("js-postcode-lookup-span-view");
                c.find(".js-postcode-label").removeClass("hdn");
                c.find(".js-switch-label-houseNumName").removeClass("hdn");
                c.find(".js-switch-label-address").addClass("hdn");
                c.find(".js-leading-postcode-lookup-span").addClass("hdn");
                c.find(".js-addition-lookup-span").addClass("hdn")
            } else {
                HAB.address.switchAddressView(c, true);
                c.find(".postCodeMandatory").addClass("hdn");
                c.find(".js-leading-postcode-lookup-span").addClass("hdn");
                c.find(".js-addition-lookup-span").addClass("hdn")
            }
        }
    },
    hidePlaceholder: function(a, c, b) {
        var d = a.find(':input[name="country"]').val();
        c.each(function() {
            var e = $(this).data("placeholdervalue");
            var f = e[d];
            if (b) {
                $(this).removeAttr("placeholder");
                if ($(this).val() == f) {
                    $(this).val("")
                }
            } else {
                if (f) {
                    $(this).attr("placeholder", f)
                } else {
                    $(this).attr("placeholder", e.general)
                }
                $(this).blur()
            }
        })
    },
    clearLookupFields: function(a) {
        a.find(".lookup_fields_holder input").each(function() {
            $(this).val("")
        })
    },
    handleAddition: function(a, c) {
        var b = a.value ? a.value : a;
        if (c.indexOf(b) <= -1) {
            $(".js-hide-addition-target").hide();
            $("span.additional_address").removeClass("isAdditionActive")
        } else {
            $(".js-hide-addition-target").show();
            $("span.additional_address").addClass("isAdditionActive")
        }
    },
    adjustStylesForCountry: function(b, a) {
        b.find(".address-container").attr("country", a)
    },
    initStylesUKandNED: function(b) {
        var a = this.config;
        if (b === "GBR" || b === "NLD" || b === "BEL") {
            $(a.houseContainer).addClass("house-number-oneline");
            $(a.codeContainer).addClass("postal-code-oneline")
        } else {
            $(a.houseContainer).removeClass("house-number-oneline");
            $(a.codeContainer).removeClass("postal-code-oneline")
        }
    }
};
HAB.rewardPointsClass = {
    config: {
        selectors: {
            rewardPointsHolder: ".js-reward-points-holder",
            pointPromotionsHolder: ".js-point-promotions-holder",
            checkoutButton: ".js-checkout-button"
        },
        ajax: {
            url: "/basket/includes/rfl/calculatePointsAjax.jsp",
            timeout: 5000,
            errorText: "Cannot calculate points"
        },
        pointPromoAajax: {
            url: "/basket/includes/couponInfo.jsp?onlyPointPromotions=true",
            errorText: "Rewards points will be added to your loyalty card later"
        }
    },
    init: function() {
        var b = this;
        var a = b.config;
        if (a.initialized) {
            return
        } else {
            a.initialized = true
        }
        b.refreshRewardPoints()
    },
    refreshRewardPoints: function() {
        var b = this;
        var a = b.config;
        $.ajax({
            url: a.ajax.url,
            timeout: a.ajax.timeout,
            success: function(c) {
                b.updateRewardPoints(c);
                b.updatePointPromotions()
            },
            error: function() {
                b.updateRewardPoints(a.ajax.errorText);
                b.updatePointPromotions(a.pointPromoAajax.errorText)
            },
            complete: function() {
                b.switchCheckoutButtonDisabled(false)
            }
        })
    },
    updateRewardPoints: function(b) {
        var a = this.config;
        $(a.selectors.rewardPointsHolder).each(function() {
            $(this).html(b)
        })
    },
    updatePointPromotions: function(b) {
        var a = this.config;
        if (b) {
            $(a.selectors.pointPromotionsHolder).html(b)
        } else {
            $.ajax({
                url: a.pointPromoAajax.url,
                success: function(c) {
                    $(a.selectors.pointPromotionsHolder).html(c)
                }
            })
        }
    },
    switchCheckoutButtonDisabled: function(a) {
        var b = this.config;
        if (a === true) {
            $(b.selectors.checkoutButton).attr("disabled", "disabled").prop("disabled", true)
        } else {
            $(b.selectors.checkoutButton).removeAttr("disabled").prop("disabled", false)
        }
    }
};
HAB.rewardPoints = Object.create(HAB.rewardPointsClass);
HAB.rflCoupon = {
    config: {
        section: "#js-basket-rfl-coupon",
        btnActivate: "#js-basket-coupon-btn-activate",
        btnRemove: "#js-basket-coupon-btn-remove",
        item: ".js-coupon-item",
        fieldCoupon: "#discountCode"
    },
    init: function() {
        var b = this;
        var a = b.config;
        if (a.initialized) {
            return
        } else {
            a.initialized = true
        }
        $(document).on("click", a.item, HAB.rflCoupon.updateDiscount)
    },
    updateDiscount: function(b) {
        var a = HAB.rflCoupon.config;
        var c = $(this).attr("data-isApplied") === "true";
        $(a.fieldCoupon).val($(this).attr("data-coupon-number"));
        if (!c) {
            HAB.basket.addDiscount(b, $(a.fieldCoupon).val())
        } else {
            HAB.basket.removeVoucher(b, $(a.fieldCoupon).val())
        }
    }
};
HAB.passwordStrengthMeter = {
    config: {
        strengthMeterUrl: "/common/passwordStrengthMeter.jsp",
        pasBlock: ".strength-password-block",
        targetInput: ".form-create-a-password",
        confirmInput: ".form-confirm-your-password",
        strengthLine: ".strength-progress-bar",
        popUp: "#popup-with-tips",
        strengthText: "#strength-password",
        strength: {
            veryWeak: {
                text: window.localization.passwordStrengthMeter.strengthVeryWeak,
                color: "red"
            },
            weak: {
                text: window.localization.passwordStrengthMeter.strengthWeak,
                color: "red"
            },
            medium: {
                text: window.localization.passwordStrengthMeter.strengthMedium,
                color: "orange"
            },
            strong: {
                text: window.localization.passwordStrengthMeter.strengthStrong,
                color: "green"
            }
        },
        heightProgressBar: "10px"
    },
    init: function() {
        var b = this;
        var a = $.extend(true, {}, HAB.passwordStrengthMeter.config);
        if ($(a.targetInput).length == 0) {
            return false
        }
        $.get(HAB.passwordStrengthMeter.config.strengthMeterUrl, function(c) {
            $(a.pasBlock).append(c);
            if (!/Chrome/.test(window.navigator.userAgent)) {
                $(a.targetInput).removeAttr("readonly");
                $(a.confirmInput).removeAttr("readonly")
            }
            HAB.switchPasswordMask.init();
            b.bindEvents()
        });
        $(a.targetInput).complexify({
            strengthScaleFactor: 0.35
        }, function(d, c) {
            b.restylePasStrength(c)
        })
    },
    bindEvents: function() {
        var a = HAB.passwordStrengthMeter.config;
        var b = this;
        $(a.targetInput).on("focus", function() {
            $(a.popUp).show();
            $(this).removeAttr("readonly")
        });
        $(a.confirmInput).on("focus", function() {
            $(this).removeAttr("readonly")
        });
        $(a.targetInput).on("blur", function(c) {
            $(a.popUp).hide();
            c.stopPropagation()
        })
    },
    restylePasStrength: function(a) {
        var b = HAB.passwordStrengthMeter.config;
        if (a <= 0) {
            $(b.strengthText).html("");
            $(b.strengthLine).css("height", "0px")
        } else {
            var c = b.strength.veryWeak;
            if (a <= 40) {
                c = b.strength.veryWeak
            } else {
                if (a <= 65) {
                    c = b.strength.weak
                } else {
                    if (a <= 90) {
                        c = b.strength.medium
                    } else {
                        c = b.strength.strong
                    }
                }
            }
            $(b.strengthText).html(c.text).add(b.strengthLine).removeClass("red orange green").addClass(c.color);
            $(b.strengthLine).css({
                height: b.heightProgressBar,
                width: a + "%"
            })
        }
    }
};
HAB.switchPasswordMaskClass = {
    config: {
        linkMasked: ".password-masked",
        maskShow: window.localization.passwordStrengthMeter.maskShow,
        maskHide: window.localization.passwordStrengthMeter.maskHide,
        parentForm: "form",
        passwordField: ".js-password-field",
        initialized: false
    },
    init: function() {
        var b = this;
        var a = b.config;
        if (a.initialized) {
            return
        } else {
            if ($(a.linkMasked).length) {
                a.initialized = true
            }
        }
        b.initMask();
        b.bindEvents()
    },
    initMask: function() {
        var b = this;
        var a = b.config;
        this.changePasswordMask(a.linkMasked, a.defaultMasked)
    },
    bindEvents: function() {
        var b = this;
        var a = b.config;
        $(a.linkMasked).on("click", function(d) {
            var c = $(this);
            b.changePasswordMask(c, c.data("masked"));
            d.stopPropagation()
        })
    },
    changePasswordMask: function(d, e) {
        var c = this;
        var a = c.config;
        $(d).closest(a.parentForm).find(a.passwordField).each(function() {
            $(this)[0].type = e ? "text" : "password"
        });
        var b = e ? a.maskHide : a.maskShow;
        $(d).data("masked", !e).html(b)
    }
};
HAB.switchPasswordMask = Object.create(HAB.switchPasswordMaskClass);
HAB.login = {
    saveToFavouritesLocker: {
        locked: false,
        lock: function() {
            this.locked = true
        },
        unlock: function() {
            this.locked = false
        }
    },
    saveToFavourites: function() {
        if (!HAB.login.saveToFavouritesLocker.locked) {
            HAB.login.saveToFavouritesLocker.lock();
            var a = HAB.login.takeOptions();
            $("#mergeSaveFavourites").ajaxSubmit(a)
        }
        return false
    },
    doMerge: function() {
        var a = HAB.login.takeOptions();
        $("#mergeAddItems").ajaxSubmit(a);
        return false
    },
    editBasket: function() {
        var a = HAB.login.takeOptions();
        a.success = function() {
            location.href = contextPath + "/basket/basket.jsp"
        }
        ;
        $("#editBasket").ajaxSubmit(a);
        return false
    },
    takeOptions: function() {
        var a = {
            beforeSend: function() {
                SFR.Utils.switchAjaxLoader()
            },
            complete: function() {
                SFR.Utils.switchAjaxLoader()
            },
            success: function(b) {
                var c = Url.parse(window.location.href);
                c.removeParam("mergeToBeDone");
                c.addParam("useCache", "false");
                location.href = c.toString();
                SFR.Utils.hidePopup();
                HAB.login.saveToFavouritesLocker.unlock()
            },
            error: function(b) {
                console.log(b)
            }
        };
        return a
    }
};
HAB.allBrands = {
    productsByBrand: function() {
        $("#brandLetterSelect").change(function() {
            location.hash = "#" + $(this).val()
        })
    }
};
HAB.hookStickyHeader = {
    init: function() {
        this.config = {
            currentTop: 0,
            previousTop: 0,
            headerSelector: ".js-main-header",
            stickyHeaderClass: "sticky-header",
            stickyHeaderCategoriesSelector: ".main-nav",
            stickyHeaderCategoriesClass: "main-nav-hidden",
            stickyHeaderStartPoint: 45
        };
        if (this.config.currentTop > this.config.stickyHeaderStartPoint) {
            $(this.config.headerSelector).addClass(this.config.stickyHeaderClass)
        }
        var a = this;
        $(window).on("scroll touchmove ready resize", function() {
            a.config.currentTop = $(document).scrollTop();
            if (a.config.currentTop > a.config.stickyHeaderStartPoint) {
                $(a.config.headerSelector).addClass(a.config.stickyHeaderClass);
                if (a.config.currentTop > a.config.previousTop) {
                    $(a.config.stickyHeaderCategoriesSelector).addClass(a.config.stickyHeaderCategoriesClass)
                } else {
                    $(a.config.stickyHeaderCategoriesSelector).removeClass(a.config.stickyHeaderCategoriesClass)
                }
                a.config.previousTop = $(document).scrollTop()
            } else {
                $(a.config.headerSelector).removeClass(a.config.stickyHeaderClass)
            }
        })
    }
};
HAB.QRcode = {
    init: function() {
        HAB.QRcode.getCode()
    },
    getCode: function() {
        var b = $(".js-QRcode-container");
        var a, c;
        b.each(function() {
            c = $(this).find(".js-QRcode-value").text().trim();
            a = $(this).find(".js-QRcode");
            if (a.attr("data-qr-rendered") === "true") {
                return
            }
            a.qrcode({
                width: 90,
                height: 90,
                text: c
            });
            a.attr("data-qr-rendered", "true")
        })
    }
};
HAB.showTermsConditionsModal = function() {
    $.root.on("click", ".js-terms-conditions-show-modal", function(a) {
        a.preventDefault();
        SFR.Utils.showPopup({
            url: "/my-account/includes/termsAndConditions.jsp",
            data: $(a.target).data()
        })
    });
    $.root.on("click", ".js-privacy-policy-show-modal", function(a) {
        a.preventDefault();
        SFR.Utils.showPopup({
            url: "/my-account/includes/privacy-policy.jsp",
            data: $(a.target).data()
        })
    })
}
;
HAB.showReferFriendModal = function() {
    $.root.on("click", ".js-refer-a-friend-show-modal", function(b) {
        b.preventDefault();
        var a = $(".js-refer-a-friend-show-modal").data("share-link");
        SFR.Utils.showPopup({
            url: "/checkout/confirmation/invitation/invitationPopup.jsp?sl=" + a,
            data: $(b.target).data(),
            showAjaxLoader: true,
            disableScroll: true,
            init: function() {
                if (navigator.userAgent.match(/ipad|iphone/i)) {
                    $(".share-email").attr("target", "_blank")
                }
                if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
                    $("#js-share-whatsapp-link").data("mobile", true)
                } else {
                    $("#js-share-whatsapp-link").attr("target", "_blank")
                }
                Share.twitter.init();
                Share.facebook.init();
                Share.whatsapp.init();
                $(".js-get-referral-link").on("click", function(d) {
                    $(".referral-link-copied-tooltip").show().delay(1000).fadeOut();
                    var c = function(g) {
                        var f = document.getElementById(g);
                        var l = navigator.userAgent.match(/ipad|iphone/i);
                        if (l) {
                            var h = f.contentEditable;
                            var m = f.readOnly;
                            f.contentEditable = true;
                            f.readOnly = false;
                            var e = document.createRange();
                            e.selectNodeContents(f);
                            var k = window.getSelection();
                            k.removeAllRanges();
                            k.addRange(e);
                            f.setSelectionRange(0, 999999);
                            f.contentEditable = h;
                            f.readOnly = m;
                            return document.execCommand("copy")
                        } else {
                            document.querySelector("#referral-link").select();
                            return document.execCommand("copy")
                        }
                    };
                    c("referral-link")
                })
            }
        })
    })
}
;
HAB.popupShowHide = function() {
    $("[data-accept-popup]").on("click", function() {
        var a = $(this).attr("data-accept-popup");
        $("[data-accept-popup-target=" + a + "]").slideDown();
        $(".js-accept-popup-close").off("click").on("click", function() {
            $(this).closest("[data-accept-popup-target]").slideUp()
        })
    })
}
;
HAB.mobileZoomPDP = function() {
    var d = $(".pdp-mobile-large-image")
      , c = $(".pdp-mobile-large-image .large-image-inner")
      , f = $(".pdp-mobile-large-image .large-image-inner-landscape")
      , b = $(".pdp-mobile-large-image .close-image");
    function e(l, h) {
        var k = l;
        var g = h;
        d.fadeIn(300);
        c.css("background-image", 'url("' + k + '")');
        f.append("<img class='lazyload' data-srcset='" + g + "' data-src='" + k + "'/>");
        c.zoom({
            url: k,
            urlSet: g,
            on: "mouseover",
            touch: true,
            callback: function() {
                $(this).css("background-color", "#fff")
            }
        });
        $("html").addClass("modal-opened");
        SFR.Utils.disableBodyScroll(true, ".pdp-mobile-large-image")
    }
    function a() {
        d.fadeOut(300);
        $("html").removeClass("modal-opened");
        SFR.Utils.disableBodyScroll(false, ".pdp-mobile-large-image")
    }
    $(".prod-img img").off().on("click", function() {
        var k = $(this).attr("src");
        var g = $(this).attr("srcset");
        e(k, g);
        try {
            SS.EventTrack.rp("image-zoom-click")
        } catch (h) {}
    });
    b.off().on("click", function() {
        $(".zoomImg").remove();
        f.find("img").remove();
        a();
        try {
            SS.EventTrack.rp("image-zoom-close")
        } catch (g) {}
    })
}
;
HAB.customDropdown = function(c, a, b, e) {
    var d = $(c);
    d.on("click", function() {
        var f = $(this).find(a);
        $(this).attr("tabindex", 1).focus();
        if (f.is(":visible")) {
            f.hide()
        } else {
            f.show()
        }
    });
    d.blur(function() {
        $(this).attr("tabindex", 0);
        $(this).find(a).hide()
    });
    $(a).find(b).on("click", function(f) {
        f.stopPropagation();
        $(this).parents(c).find(".active-option").html($(this).html());
        $(this).parents(a).hide();
        if (e) {
            e.call(this)
        }
    })
}
;
HAB.pdpProductCarousel = {
    init: function pdpCarouselMain() {
        this.config = {
            prodCarousel: ".js-pdp-product-carousel",
            prodCarouselSlide: ".image-prod-zoom-trigger",
            videoTrigger: ".js-prod-video-trigger",
            zoomTrigger: ".js-prod-zoom-trigger",
            imgContainer: ".js-prod-img-container"
        };
        var a = this;
        if ($(this.config.prodCarousel).find(this.config.prodCarouselSlide).length > 1 && !$(this.config.prodCarousel).hasClass("slick-initialized")) {
            $(this.config.prodCarousel).slick({
                infinite: false,
                dots: true,
                touchMove: false,
                lazyLoad: "progressive",
                responsive: [{
                    breakpoint: 767,
                    settings: {
                        dots: true,
                        arrows: false
                    }
                }]
            })
        }
        if (!HAB.isMobile()) {
            $(this.config.zoomTrigger).off().on("click", function(f) {
                if ($(a.config.prodCarousel).hasClass(".slick-initialized")) {
                    var c = $(a.config.prodCarousel).slick("slickCurrentSlide")
                }
                var d = $('<div class="modal-close-btn"><i class="ico-s ico-20 ico-close js-hide-popup" role="button">Close</i></div>');
                var b = $(a.config.zoomTrigger).attr("data-sku-id");
                SFR.Utils.showPopup({
                    url: "/browse/gadgets/skuImagePopup.jsp?skuId=" + b,
                    init: function(e) {
                        if ($(a.config.prodCarousel).find(a.config.prodCarouselSlide).length > 1) {
                            setTimeout(function() {
                                var g = e.find($(a.config.prodCarousel));
                                g.slick({
                                    infinite: false,
                                    dots: true,
                                    touchMove: false,
                                    lazyLoad: "progressive"
                                });
                                g.slick("slickGoTo", c, true);
                                d.insertBefore(g)
                            }, 1)
                        } else {
                            d.insertBefore(e.find($(a.config.prodCarousel)))
                        }
                    }
                })
            })
        }
        if (HAB.isMobile()) {
            HAB.mobileZoomPDP()
        }
        $(this.config.videoTrigger).off().on("click", function(d) {
            var c = $(a.config.videoTrigger).attr("data-video-show");
            var b = $("<div class='video-wrapper-popup'><div class='modal-close-btn'><i class='ico-s ico-20 ico-close js-hide-popup' role='button'>Close</i></div><video controls> <source src='" + c + "'type='video/mp4'>Your browser does not support the video tag.</video></div>");
            SFR.Utils.showPopup({
                content: b
            });
            $("video").get(0).play()
        })
    }
};
HAB.submitSoftGoodFromGiftlist = {
    init: function fillFields() {
        var a = {
            formSubmit: "#saveForLaterAddToBasketPrimeSkuForm",
            submitButton: ".js-saveAddToBasketPrimeSku",
            primeSkuItemId: "#saveAddToBasketPrimeSkuItemId",
            primeProductId: "#saveAddToBasketPrimeProductId",
            primeSkuGiftlistId: "#saveAddToBasketPrimeSkuGiftlistId",
            primeSkuGiftItemId: "#saveAddToBasketPrimeSkuGiftItemId"
        };
        $(a.submitButton).on("click", function(d) {
            d.preventDefault();
            $(a.primeSkuItemId).val($(this).attr("skuId"));
            $(a.primeProductId).val($(this).attr("productId"));
            $(a.primeSkuGiftlistId).val($(this).attr("giftlistId"));
            $(a.primeSkuGiftItemId).val($(this).attr("giftItemId"));
            var c = $.root.find("#ajaxBasketModule");
            var b = HAB.basket.getRefreshURL();
            SFR.Utils.submitAjaxForm($(a.formSubmit), c, b, HAB.basket.hookUpdateCartEvents, HAB.basket.showErrorMessages)
        })
    }
};
HAB.submitTrackOrderForm = {
    init: function() {
        var a = {
            formSubmit: "#trackOrderForm",
            leftSection: ".trackOrderLeftSection",
            errorSection: ".trackOrderErrorSection",
            trackingLabel: ".tracking-label",
            trackingInput: ".js-order-tracking-input",
            trackingSubmitBtn: $("#trackOrderSubmit")
        };
        var c = /[^0-9]/g;
        function d(f) {
            if (f.type === "number") {
                f.value = f.value.replace(c, "");
                return
            }
            var k = f.selectionStart;
            var e = f.selectionEnd;
            var g = f.value.length;
            f.value = f.value.replace(c, "");
            var h = g - f.value.length;
            k = k - h;
            e = e - h;
            f.setSelectionRange(k, e)
        }
        function b(e) {
            a.trackingSubmitBtn.prop("disabled", (e.value.length !== 10))
        }
        $(a.formSubmit).on("submit", function(f) {
            f.preventDefault();
            SFR.Utils.showAjaxLoader();
            $(this).ajaxSubmit(function(e) {
                var g = JSON.parse(e);
                if (g.success && g.orderId !== "") {
                    HAB.submitTrackOrderForm.loadPage(a.leftSection, "/tracking/orderStatusPage.jsp", function() {
                        $(a.topErrorSection).html("");
                        SFR.Utils.hideAjaxLoader()
                    }, {
                        oId: g.oId
                    })
                }
                if (!g.success) {
                    $(a.errorSection).html(g.errorMessages);
                    $(a.errorSection).addClass("notification-danger");
                    $(a.trackingLabel).addClass("error");
                    SFR.Utils.hideAjaxLoader()
                }
            })
        });
        $(a.trackingInput).on("keyup input", function(f) {
            if (f.type === "input") {
                $(a.trackingInput).off("keyup")
            }
            d(this);
            b(this)
        })
    },
    loadPage: function(f, d, b, e) {
        var a = $(f);
        var c = {
            dataType: "html",
            url: d,
            data: e,
            success: function(g) {
                a.html(g);
                if (b) {
                    b()
                }
            },
            error: function(k, g, h) {
                console.log(k, g, h)
            }
        };
        $.ajax(c)
    }
};
function addItemToBasket(c, b) {
    var a = $(c).parents(".prod-teaser-form");
    var d = a.prop("action");
    $.post(d, a.serialize(), function(e) {
        if (b) {
            location.reload(true)
        } else {
            $(c).parent().next().html(e);
            $.root.find(".js-header-basket-link").load("/modules/ajax/basket-masthead.jsp")
        }
    });
    return false
}
$(window).load(function() {
    loyaltyPromoCarousel()
});
function loyaltyPromoCarousel() {
    $(".js-loyalty-promo-carousel").slick({
        infinite: false,
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [{
            breakpoint: 1025,
            settings: {
                slidesToShow: 3
            }
        }, {
            breakpoint: 769,
            settings: {
                arrows: false,
                slidesToShow: 1
            }
        }]
    })
}
function spotlightCarusel() {
    $(".js-spotlight-carousel").slick({
        infinite: true,
        dots: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        touchMove: false,
        responsive: [{
            breakpoint: 1025,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 769,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: "40px",
                initialSlide: 1,
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 630,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: "40px",
                initialSlide: 1,
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 430,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: "80px",
                dots: false,
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    })
}
function richRelevanceCarousel(a) {
    var b = $(a);
    if (SFR.Utils.cssCarouselInit(b)) {
        return false
    }
    b.slick({
        infinite: true,
        dots: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        touchMove: true,
        swipeToSlide: true,
        responsive: [{
            breakpoint: 1027,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 769,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: "40px",
                initialSlide: 1,
                slidesToShow: 3,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 630,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: "40px",
                initialSlide: 1,
                slidesToShow: 2,
                slidesToScroll: 1
            }
        }, {
            breakpoint: 430,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: "80px",
                dots: false,
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    })
}
function richRelevanceCarouselPdpVertical(a) {
    $(a).slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        verticalSwiping: true,
        adaptiveHeight: true,
        vertical: true
    })
}
HAB.orderGroove = {
    prepareData: function(b) {
        var a = $(b);
        return {
            id: a.data("og-product"),
            quantity: a.data("quantity"),
            module: a.data("og-module")
        }
    },
    prepareRemoveData: function(a) {
        return {
            id: a
        }
    },
    takeData: function() {
        return window.og_settings ? og_settings.cart.products : []
    },
    setProduct: function(a) {
        var b = a ? a : this;
        if (window.OG && OG.setProduct) {
            OG.setProduct(HAB.orderGroove.prepareData(b))
        }
    },
    setQuantity: function(a) {
        var b = a ? a : this;
        if (window.OG && OG.setQuantity) {
            OG.setQuantity(HAB.orderGroove.prepareData(b))
        }
    },
    setQuantityOnLoad: function() {
        HAB.orderGroove.setQuantity(this)
    },
    updateCart: function(a) {
        if (window.OG && OG.updateCart) {
            OG.updateCart([HAB.orderGroove.prepareData(a)])
        }
    },
    updateCartWithDataByAjax: function(a) {
        if (window.OG && OG.updateCart && a && a.length && a.length > 0) {
            OG.updateCart(a, {
                isAjax: true
            })
        }
    },
    removeFromCart: function(a) {
        if (window.OG && OG.removeFromCart) {
            OG.removeFromCart([a], {
                isAjax: true
            })
        }
    }
};
HAB.myRflCards = {
    init: function() {
        $(".js-add-disc-code").click(HAB.myRflCards.addToCart)
    },
    addToCart: function() {
        SFR.Utils.showAjaxLoader();
        var c = $(this);
        var b = c.data("item-d-code") + "";
        var e = c.data("item-redirect-url");
        var a = c.data("btn-disabled-ttl");
        var d = {
            type: "POST",
            dataType: "html",
            url: "/modules/ajax/addedDiscountToBasket.jsp",
            data: {
                voucherNum: b
            },
            success: function(f) {
                console.log($("[data-item-d-code=" + b + "]").attr("disabled", "true").val(a));
                SFR.Utils.hideAjaxLoader()
            }
        };
        $.ajax(d)
    }
};
HAB.myAccount = {
    init: function() {
        $(".js-my-account-order-history-details").on("click", ".js-add-to-cart", HAB.myAccount.addToCart);
        $(".js-og-product-holder").each(HAB.orderGroove.setQuantityOnLoad);
        $("#js-resend-password-code-link").on("click", HAB.myAccount.resendResetPasswordCode);
        $("#js-cancel-reset-password").on("click", HAB.myAccount.cancelResetPassword);
        $("#js-submit-forgot-password").on("click", HAB.myAccount.submitResetPassword);
        $("#jsAddPaypalAccount").on("click", HAB.myAccount.submitPaypalAccount);
        HAB.headerNotificationCloseHandler.init(function() {
            document.cookie = "isOverwritten=;path=/"
        })
    },
    addToCart: function() {
        var b = $(this);
        var d = b.data("rr-item-id");
        var e = b.data("quantity");
        var a = b.data("rr-sku-id");
        var c = {
            type: "POST",
            dataType: "html",
            url: "/modules/ajax/addItemToOrder.jsp",
            data: {
                productId: d,
                quantity: e,
                skuId: a
            },
            success: function(f) {
                var g = null;
                try {
                    g = $.parseJSON(f)
                } catch (m) {}
                try {
                    if (g) {
                        var h = b.data("basket-refresh-url");
                        if (h) {
                            $.root.find(".js-header-basket-link").load(h)
                        }
                        if (l(b)) {
                            if (!k(g)) {
                                HAB.orderGroove.updateCart(b)
                            }
                        }
                        var n = $(g.notification).appendTo(b.parent()).hide().slideDown();
                        b.siblings(".ajaxed").slideUp(400, function() {
                            $(this).remove()
                        });
                        n.addClass("ajaxed");
                        function l(o) {
                            return o.hasClass("js-og-update-card")
                        }
                        function k(o) {
                            return o && $(o.notification).hasClass("js-add-to-cart-error")
                        }
                    }
                } catch (m) {
                    console.log("Error during handling results of submitting form. ", m, response, status, xhr)
                }
            }
        };
        $.ajax(c)
    },
    resendResetPasswordCode: function() {
        event.preventDefault();
        $("#resendResetPasswordCodeForm").submit()
    },
    cancelResetPassword: function() {
        var b = $("#frm_login_email").val();
        var a = $("#js-cancel-reset-password").attr("href") + "&email=" + b;
        $("#js-cancel-reset-password").attr("href", a)
    },
    submitResetPassword: function() {
        var a = $("#frm_login_email").val();
        var b = $("#js-forgot-password-success").attr("value") + "?email=" + a;
        $("#js-forgot-password-success").attr("value", b)
    },
    submitPaypalAccount: function(b) {
        b.preventDefault();
        var a = {
            type: "POST",
            dataType: "json",
            success: function(c) {
                window.location.assign(c.redirectURL)
            },
            error: function() {
                SFR.Utils.hideAjaxLoader()
            }
        };
        SFR.Utils.showAjaxLoader();
        $("#jsAddPaypalAccountForm").ajaxSubmit(a)
    }
};
HAB.reloadPageFromPublitas = function(a) {
    if (window != top.window) {
        top.location = a.href
    }
}
;
$(document).ready(function() {
    if ($("#all-product-tabs").html() !== undefined) {
        $("#all-product-tabs").tabs()
    }
}).on("click", ".seo-text-button", function(a) {
    var b = $(this);
    b.toggleClass("active");
    if (b.hasClass("active")) {
        b.text("Show less");
        $(".seo-text-additional").slideDown(100)
    } else {
        b.text("Show more");
        $(".seo-text-additional").slideUp(100)
    }
});
HAB.hookContextPathToAjaxRequests = function() {
    $.ajaxPrefilter(function(a, c, b) {
        if (!a.url.startsWith("http") && !a.url.startsWith(contextPath)) {
            a.url = contextPath + a.url
        }
    })
}
;
HAB.initHoneypot = function() {
    var a = $(".js-honeypot");
    a.each(function() {
        $(this).val($(this).data("realValue"))
    })
}
;
HAB.initPOQ = function() {
    if (globalConfig.isMobileApp) {
        $(document).on("click", "a[data-mobile-app-disabled]", false);
        $("[data-mobile-app-hidden]").addClass("hidden")
    }
}
;
HAB.enableCTA = {
    init: function() {
        $(".js-cta-btn-section").on("keyup", ".js-cta-field", HAB.enableCTA.validate);
        $(".js-cta-btn-section").on("paste", ".js-cta-field", function() {
            var a = this;
            setTimeout(function() {
                var b = $(a).val();
                HAB.enableCTA.validate(b)
            }, 0)
        })
    },
    validate: function(d) {
        var c = true;
        var b = $(".js-cta-btn").attr("data-disabled-msg");
        var a = $(".js-cta-btn").attr("data-enabled-msg");
        $(".js-cta-field").each(function() {
            if ($(this).val() == "") {
                c = false
            }
        });
        if ($(".error").length && !d) {
            c = false
        }
        if (c) {
            $(".js-cta-btn").attr("disabled", false);
            $(".js-cta-btn").attr("value", a)
        } else {
            $(".js-cta-btn").attr("disabled", true);
            $(".js-cta-btn").attr("value", b)
        }
    }
};
HAB.samples = {
    init: function() {
        HAB.samples.unbindPreviousEvents();
        HAB.basket.hookAddSample();
        $(".samples-trigger").on("click", "#js-samples-accordion.bh-triggered ", HAB.samples.showHideSamples);
        $(".samples-popup-header").on("click", "#js-samples-popup-close", HAB.samples.showHideSamples);
        HAB.samples.setMobileBodyStyle();
        HAB.disableEnableSamples()
    },
    unbindPreviousEvents: function() {
        $(".js-samples-container").off("change", ".js-add-sample-checkbox");
        $(".samples-trigger").off("click", "#js-samples-accordion.bh-triggered ");
        $(".samples-popup-header").off("click", "#js-samples-popup-close")
    },
    showHideSamples: function() {
        var a = $(".js-samples-container").css("display") == "none";
        if (a) {
            if (HAB.isMobile()) {
                $("html").addClass("disable-scroll")
            }
            $(".js-samples-container").show();
            $("#js-samples-accordion.bh-triggered").removeClass("samples-not-triggered");
            $("#js-samples-accordion.bh-triggered").addClass("samples-triggered")
        } else {
            if (HAB.isMobile()) {
                $("html").removeClass("disable-scroll")
            }
            $(".js-samples-container").hide();
            $("#js-samples-accordion.bh-triggered").removeClass("samples-triggered");
            $("#js-samples-accordion.bh-triggered").addClass("samples-not-triggered")
        }
    },
    setMobileBodyStyle: function() {
        if (HAB.isMobile() && $("#js-samples-accordion").hasClass("bh-triggered")) {
            var b = $("#js-samples-accordion");
            var a = !b.hasClass("bh-triggered") || b.hasClass("samples-not-triggered");
            if (!a) {
                $("html").addClass("disable-scroll")
            } else {
                $("html").removeClass("disable-scroll")
            }
        }
    }
};
HAB.disableEnableSamples = function() {
    var e = $(".js-add-sample-checkbox:checked");
    var c = $(".js-add-sample-checkbox:not(:checked)");
    var a = $("#js-max-allowed-samples").attr("value");
    if (e.length >= a) {
        c.closest(".samples-list-item").addClass("disabled").click(function(f) {
            f.preventDefault()
        })
    } else {
        c.closest(".samples-list-item").off("click").removeClass("disabled")
    }
    if (HAB.isMobile()) {
        var b = $(".js-samples-trigger-text");
        if (e.length > 0) {
            var d = b.data("mobile-triggerd-value");
            b.html(d)
        } else {
            var d = b.data("mobile-not-triggerd-value");
            b.html(d)
        }
    }
}
;
HAB.basket = {
    showSamples: false,
    hookRemoveItem: function() {
        $(".removeCartItem").one("click", function(a) {
            HAB.basket.removeItemFromCart(a, $(this).attr("removeItem"), $(this).data("removed-sku"))
        })
    },
    hookRemoveUnavailableItems: function() {
        $(".removeCartUnavailableItems").one("click", function(b) {
            var c = $(this).attr("remove-items-list").replace(/{|\s|}/g, "").split(",");
            var a = c.length;
            $.each(c, function(f, h) {
                var d = h.split("=");
                var g = $.root.find("#ajaxBasketModule");
                var e = HAB.basket.getRefreshURL();
                var k = (f == a - 1);
                $("#removalCommerceId").val(d[0]);
                HAB.orderGroove.removeFromCart(HAB.orderGroove.prepareRemoveData(d[1]));
                SFR.Utils.submitAjaxForm($("#removeItemForm"), g, e, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages, k)
            });
            b.preventDefault()
        })
    },
    unavailableListRemovedMessage: function() {
        var c = ".unavailable-items-removed-msg";
        var b = $(c);
        var a = "hidden";
        setTimeout(function() {
            b.removeClass(a);
            SFR.Utils.scrollTo(c)
        }, 500);
        setTimeout(function() {
            b.addClass(a)
        }, 10000)
    },
    unavailableItemsList: function() {
        var a = $(".unavailable-items-list-expand");
        a.on("click", function() {
            var b = a.siblings(".unavailable-items-list-item").slice(2);
            a.toggleClass("active").siblings("");
            b.toggleClass("hidden")
        })
    },
    skipRemoveUnavailableItems: function() {
        var a = $(".js-unavailable-items-remove-later-btn");
        a.on("click", function() {
            SFR.Utils.scrollTo(".basket-product-unavailable-label")
        })
    },
    unavailableItemsDetection: function(a) {
        var c = ".unavailable-items-message";
        var b = $(c);
        var d = "pulse";
        if (b.length) {
            b.removeClass(d);
            SFR.Utils.scrollTo(c);
            setTimeout(function() {
                b.addClass(d)
            }, 200);
            a.preventDefault()
        }
    },
    scrollToUnavailableItemsMsg: function(a) {
        $(a).on("click", function(b) {
            HAB.basket.unavailableItemsDetection(b)
        })
    },
    hookUpdateQty: function() {
        $(".cartItem button").click(function(b) {
            var a = $(this).closest(".quantity-wrapper").find("input");
            HAB.basket.updateQuantity(a.attr("name"), a.attr("value"))
        });
        $(".js-saved-last-valid-value").on("keyup", $.debounce(1000, function(d) {
            var c = $(this);
            if (tabWasPressed(d)) {
                return
            }
            if (hasErrorOrEmpty(c)) {
                return
            }
            var b = this;
            var f = $(b).attr("value");
            var a = $(b).attr("name");
            HAB.basket.updateQuantity(a, f)
        }))
    },
    hookSaveForLater: function() {
        $(".saveForLaterFromCart").click(function(a) {
            HAB.basket.saveForLaterFromCart(a, $(this).attr("commerceItemId"), $(this).attr("giftlistId"), $(this).attr("itemQty"), $(this).data("sku-id"))
        })
    },
    hookChangeRflCard: function() {
        $("#jsChangeRflCard").click(function(a) {
            HAB.basket.changeRflCard(a)
        })
    },
    hookScanRflBarcode: function() {
        $("#js-barcode-capture").on("change", function(a) {
            $("#js-scan-rfl-barcode-form").append($(this));
            HAB.basket.scanRflBarcode(a)
        })
    },
    hookRemoveDiscount: function() {
        $(".js-remove-coupon").click(function(a) {
            var b = $(this).data("promo-item");
            HAB.basket.removeDiscount(a, b)
        })
    },
    hookRemoveAllFromSaved4Later: function() {
        $(".act-remove-all").click(function(a) {
            var b = $(this).attr("giftlistId");
            HAB.basket.removeAllSaved4Later(a, b)
        })
    },
    hookUpdateSaveForLaterQty: function() {
        $(".saveForItem button").click(function() {
            var a = $(this).closest(".quantity-wrapper").find("input");
            HAB.basket.updateSaveForLaterQty(a.attr("giftlistId"), a.attr("name"), a.val())
        })
    },
    hookRemoveSaveForLater: function() {
        $(".removeGiftItem").click(function(a) {
            HAB.basket.removeSaveForLater(a, $(this).attr("giftItemId"), $(this).attr("giftlistId"))
        })
    },
    hookAddToBasketSaveForLater: function() {
        $(".saveAddToBasket").click(function(a) {
            HAB.basket.addToBasketFromSavedLater(a, $(this).attr("giftlistId"), $(this).attr("giftItemId"))
        })
    },
    hookValidation: function() {
        $.root.off("keyup", ".itemQty, .saveForLater-itemQty, .itemQtyControl");
        $("#ajaxBasketModule").off("keyup", ".itemQty, .saveForLater-itemQty, .itemQtyControl");
        $("#ajaxBasketModule").on("keyup", ".itemQty, .saveForLater-itemQty, .itemQtyControl", $.debounce(500, function(a) {
            if ($(this).val() != "") {
                $(this).triggerHandler("blur")
            }
        }))
    },
    addToBasketFromSavedLater: function(e, f, a) {
        e.preventDefault();
        $("#saveAddToBasketGiftlistId").val(f);
        $("#saveAddToBasketGiftItemId").val(a);
        var c = "#giftItemQty" + a;
        $("#saveAddToBasketQuantity").val($(c).val());
        var d = $.root.find("#ajaxBasketModule");
        var b = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#saveForLaterAddToBasketForm"), d, b, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    removeSaveForLater: function(d, a, e) {
        d.preventDefault();
        $("#saveRemoveGItemId").val(a);
        $("#saveRemoveGiftlistId").val(e);
        var c = $.root.find("#ajaxBasketModule");
        var b = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#saveForLaterRemoveForm"), c, b, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    updateSaveForLaterQty: function(e, b, d) {
        $("#saveQtyUpdateGiftlistId").val(e);
        $("#saveQtyUpdateGiftItemId").val(b);
        $("#saveQtyUpdateQuantity").val(d);
        var c = $.root.find("#ajaxBasketModule");
        var a = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#saveForLaterQtyUpdateForm"), c, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    removeAllSaved4Later: function(c, d) {
        c.preventDefault();
        $("#saveRemoveAllGiftlistId").val(d);
        var b = $.root.find("#ajaxBasketModule");
        var a = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#saveForLaterRemoveAllForm"), b, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    removeDiscount: function(c, e) {
        c.preventDefault();
        var d = $("#js-remove-coupon-form").attr("action");
        $("#js-remove-coupon-form").attr("action", d + "?promoItem=" + e);
        var b = $.root.find("#ajaxBasketModule");
        $("#jsPromoItem").val(e);
        var a = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#js-remove-coupon-form"), b, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    addDiscount: function(c, d) {
        c.preventDefault();
        var b = $.root.find("#ajaxBasketModule");
        $("#jsDiscountCode").val(d);
        var a = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#js-basket-coupon-form"), b, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    removeVoucher: function(c, d) {
        c.preventDefault();
        var b = $.root.find("#ajaxBasketModule");
        $("#jsRemoveDiscountCode").val(d);
        var a = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#js-remove-voucher-form"), b, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    removeItemFromCart: function(d, e, a) {
        d.preventDefault();
        var c = $.root.find("#ajaxBasketModule");
        $("#removalCommerceId").val(e);
        var b = HAB.basket.getRefreshURL();
        HAB.orderGroove.removeFromCart(HAB.orderGroove.prepareRemoveData(a));
        SFR.Utils.submitAjaxForm($("#removeItemForm"), c, b, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    updateQuantity: function(b, d) {
        $("#updateItemSkuId").val(b);
        $("#updateItemQty").val(d);
        var c = $.root.find("#ajaxBasketModule");
        HAB.basket.showSamples = HAB.basket.samplesShouldBeLoaded();
        var a = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#updateItemForm"), c, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    saveForLaterFromCart: function(f, a, g, d, b) {
        f.preventDefault();
        $("#saveCItemId").val(a);
        $("#saveGiftlistId").val(g);
        $("#saveQty").val(d);
        var e = $.root.find("#ajaxBasketModule");
        var c = HAB.basket.getRefreshURL();
        HAB.orderGroove.removeFromCart(HAB.orderGroove.prepareRemoveData(b));
        SFR.Utils.submitAjaxForm($("#saveForLaterForm"), e, c, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    changeRflCard: function(c) {
        c.preventDefault();
        var b = $.root.find("#ajaxBasketModule");
        HAB.basket.showSamples = HAB.basket.samplesShouldBeLoaded();
        var a = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#jsClearRFLContext"), b, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    scanRflBarcode: function(c) {
        var b = $.root.find("#ajaxBasketModule");
        HAB.basket.showSamples = HAB.basket.samplesShouldBeLoaded();
        var a = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#js-scan-rfl-barcode-form"), b, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    addSample: function(d, e, a, f) {
        d.preventDefault();
        $("#js-sample-prod-id").val(e);
        $("#js-sample-sku-id").val(a);
        $("#js-sample-quantity").val(f);
        var c = $.root.find("#ajaxBasketModule");
        var b = HAB.basket.getRefreshURL();
        SFR.Utils.submitAjaxForm($("#js-add-sample-form"), c, b, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    },
    hookAddSample: function() {
        $(".js-add-sample-checkbox").off("change").on("change", function(f) {
            var c = $(this);
            var d = c.data("rr-item-id");
            var g = c.data("quantity");
            var b = c.data("rr-sku-id");
            var e = c.is(":checked");
            if (e) {
                HAB.basket.addSample(f, d, b, g)
            } else {
                var a = $(".removeCartItem[data-removed-sku='" + b + "']").data("removeitem");
                HAB.basket.removeItemFromCart(f, a, b)
            }
        })
    },
    getRefreshURL: function() {
        HAB.basket.showSamples = HAB.basket.samplesShouldBeLoaded();
        var a = $.root.find("#ajaxBasketModule").data("basket-refresh-url") + "?showSamples=" + HAB.basket.showSamples;
        return a
    },
    addRemoveSamples: function() {
        var c = $(this);
        var d = c.data("rr-item-id");
        var f = c.data("quantity");
        var b = c.data("rr-sku-id");
        var e = c.is(":checked");
        if (e) {
            HAB.basket.addSample(event, d, b, f)
        } else {
            var a = $(".removeCartItem[data-removed-sku='" + b + "']").data("removeitem");
            HAB.basket.removeItemFromCart(event, a, b)
        }
    },
    hookUpdateCartEvents: function() {
        HAB.initBasket();
        HAB.hookQtyButtons();
        HAB.basket.hookRemoveItem();
        HAB.basket.hookUpdateQty();
        HAB.basket.hookSaveForLater();
        HAB.basket.hookRemoveDiscount();
        HAB.basket.hookRemoveAllFromSaved4Later();
        HAB.basket.hookUpdateSaveForLaterQty();
        HAB.basket.hookRemoveSaveForLater();
        HAB.basket.hookAddToBasketSaveForLater();
        HAB.basket.hookValidation();
        HAB.rflCoupon.init();
        HAB.popupShowHide();
        HAB.ICS.priceOverride();
        $.root.find(".bh-ajax-loader").habAjaxLoader();
        HAB.samples.init();
        HAB.initModule();
        HAB.rewardPointsClass.refreshRewardPoints();
        HAB.basket.loadRichRelevanceScripts();
        HAB.invitation.init()
    },
    onAjaxReloadingComplete: function() {
        HAB.basket.deliveryVan.doAnimate();
        HAB.orderGroove.updateCartWithDataByAjax(HAB.orderGroove.takeData());
        HAB.basket.hookUpdateCartEvents();
        HAB.basket.loadUniversalVariable();
        HAB.basket.updateMiniBasket()
    },
    updateMiniBasket: function() {
        var a = $.root.find("#ajaxBasketModule").data("minibasket-refresh-url");
        if (a) {
            $.root.find(".js-header-basket-link").load(a)
        }
    },
    loadRichRelevanceScripts: function() {
        var a = $.root.find("#ajaxBasketRR");
        a.load(a.data("refresh-url"))
    },
    loadUniversalVariable: function() {
        var a = $("#js-universal-variable-val").html();
        $("#js-universal-var-replace").html(a)
    },
    showErrorMessages: function(d) {
        var c = $.root.find("#js-basket-errors");
        var b = $(d).find("#js-basket-errors");
        if (c.length > 0 && $.trim(d)) {
            c.html(d);
            SFR.Utils.scrollTo(c)
        }
    },
    samplesShouldBeLoaded: function() {
        var a = $("#js-samples-accordion");
        if (!a.hasClass("bh-triggered")) {
            return false
        }
        if (a.hasClass("bh-triggered") && a.hasClass("samples-not-triggered")) {
            return false
        }
        return true
    },
    loadSamples: function() {
        $("#js-samples-accordion").click()
    },
    showDeliveryWarning: function() {
        var a = $(".js-select-box .active-option");
        var b = a.hasClass("js-show-message");
        var c = b ? "slideDown" : "slideUp";
        $(".js-checkout-warning-hbp")[c]()
    },
    deliveryVan: {
        params: {},
        firstLoad: true,
        init: function() {
            if (HAB.basket.deliveryVan.firstLoad) {
                HAB.basket.deliveryVan.doAnimate();
                HAB.basket.deliveryVan.firstLoad = false
            }
        },
        doAnimate: function() {
            var k = HAB.basket.deliveryVan.firstLoad;
            var q = $(".js-delivery-van");
            if (!q.length) {
                HAB.basket.deliveryVan.params = {};
                return
            }
            var b = q.data();
            var c = b.firstAnimationDelay || 2000;
            var g = b.nextAnimationDelay || 300;
            var n = (k) ? c : g;
            var p = Math.round(HAB.basket.deliveryVan.params.progressPercent || 0);
            var l = (p) + "%";
            var o = Math.round(b.progressPercent || 0);
            var h = (o) + "%";
            var m = q.find(".delivery-van-van");
            var a = q.find(".delivery-van-progress-bar");
            var e = "js-delivery-van-style";
            var d = $("#" + e);
            if (!d.length) {
                var f = ".delivery-van-van{background-image: url(" + b.vanImageUrl + ")}";
                $.root.prepend('<style id="' + e + '">' + f + "</style>")
            }
            if (!k) {
                m.css({
                    left: l
                });
                a.css({
                    width: l
                })
            }
            q.addClass("animated");
            setTimeout(function() {
                var s = "translate3d(" + (o - p) + "%, 0, 0)";
                m.css({
                    "-webkit-transform": s,
                    transform: s
                });
                a.css({
                    width: h
                });
                if (h === "100%") {
                    var u = b.pulseAnimationDuration || 1;
                    var t = b.pulsatingCount || 2;
                    var r = "pulsating " + u + "s linear 2s " + t;
                    m.css({
                        "-webkit-animation": r,
                        animation: r
                    })
                }
                HAB.basket.deliveryVan.params = b
            }, n)
        }
    }
};
HAB.ICS = {
    priceOverride: function() {
        $(".js-price-override-container").each(function() {
            var a = $(this);
            a.on("click", ".js-price-override-checkbox", function() {
                var b = $(this).is(":checked");
                $(this).closest(".js-price-override-checkbox-container").toggleClass("hdn", b);
                a.find(".js-price-override-form").toggleClass("hdn", !b)
            });
            a.on("click", ".js-price-override-submit", function() {
                $("#priceOverrideSkuId").val(a.data("sku-id"));
                $("#priceOverrideAmount").val(a.find(".js-price-override-amount").val());
                $("#priceOverrideDescription").val(a.find(".js-price-override-description").val());
                var c = $.root.find("#ajaxBasketModule");
                var b = HAB.basket.getRefreshURL();
                SFR.Utils.submitAjaxForm($("#priceOverrideForm"), c, b, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
            })
        })
    }
};
HAB.fixReviewsPosition = {
    init: function() {
        $(window).load(function() {
            HAB.fixReviewsPosition.slideToReviewSection()
        })
    },
    slideToReviewSection: function() {
        if (window.location.hash === "#reviews" && window.innerWidth > 767) {
            var b = $("#reviews").offset().top;
            var a = $(".branding").height() + $(".main-nav").height();
            $("html").scrollTop(b - a)
        }
    }
};
HAB.invitation = {
    config: {
        $popupInvitation: "#js-invitation",
        $popupFormSubmit: "#js-invitation-email-form",
        $popupCTASubmitEmail: "#js-invitation-email-submit",
        $popupEmail: "#js-invitation-email",
        $closePopup: ".js-hide-friend-popup",
        $methodSelector: ".js-delivery-method-change"
    },
    init: function() {
        this.initialize();
        $(this.config.$popupInvitation).on("click", this.config.$popupCTASubmitEmail, this.sendBonusCode);
        SFR.Events.handlePressingEnter(this.config.$popupFormSubmit, this.config.$popupEmail, this.checkInvalidation);
        SFR.Events.handlePressingEnter(this.config.$popupFormSubmit, $(".js-accept-terms"), this.checkInvalidation);
        $(this.config.$closePopup).on("click", this.hidePopup);
        $(this.config.$methodSelector).on("click", this.changeDeliveryMethod);
        HAB.customDropdown(".js-select-box", ".js-option-list", ".option", this.changeDeliveryMethod)
    },
    checkInvalidation: function() {
        if ($(".js-accept-terms").attr("aria-invalid") == "false") {
            HAB.invitation.sendBonusCode()
        }
    },
    initialize: function() {
        HAB.validator.setupInlineValidation(this.config.$popupFormSubmit)
    },
    sendBonusCode: function() {
        var a = HAB.invitation.config;
        if (!$(a.$popupFormSubmit).valid()) {
            return false
        }
        SFR.Utils.sendAjaxForm($(a.$popupInvitation), $(a.$popupFormSubmit), true, function(b) {
            $(a.$popupInvitation).html(b);
            $(a.$closePopup).focus();
            $(a.$closePopup).on("click", HAB.invitation.hidePopup)
        })
    },
    hidePopup: function() {
        $(".homepage-friend-modal").hide();
        $(".friend-modal-content").html("")
    },
    changeDeliveryMethod: function() {
        var b = $.root.find("#ajaxBasketModule");
        var a = HAB.basket.getRefreshURL();
        $("#js-delivery-method-type").val($(this).data("delivery-type"));
        SFR.Utils.submitAjaxForm($("#changeDeliveryMethodForm"), b, a, HAB.basket.onAjaxReloadingComplete, HAB.basket.showErrorMessages)
    }
};
HAB.headerNotificationCloseHandler = {
    init: function(a) {
        var b = $(".header-notification");
        var d = ".header-notification-close";
        var c = 5000;
        b.on("click", d, function() {
            b.remove();
            if (a !== undefined) {
                a()
            }
        });
        setTimeout(function() {
            b.remove();
            document.cookie = "isOverwritten=;path=/"
        }, c)
    }
};
HAB.rflHub = {
    config: {
        $rflLoginForm: "#js-rfl-login-form",
        $rflLogoutForm: "#js-rfl-logout-form",
        $rflLoginCTASubmit: "#js-rfl-login-submit",
        $rflLoginDataInput: "#js-rfl-email-postcode",
        $rflLoginIsEmail: "#js-rfl-is-email",
        $rflLogoutLink: "#js-rfl-logout"
    },
    init: function() {
        $(HAB.rflHub.config.$rflLoginForm).on("click", HAB.rflHub.config.$rflLoginCTASubmit, this.sendLoginForm);
        $(HAB.rflHub.config.$rflLogoutForm).on("click", HAB.rflHub.config.$rflLogoutLink, this.logOut)
    },
    sendLoginForm: function() {
        var a = $(HAB.rflHub.config.$rflLoginDataInput).val();
        if (/@/i.test(a)) {
            $(HAB.rflHub.config.$rflLoginIsEmail).val("true")
        }
        $(HAB.rflHub.config.$rflLoginForm).submit()
    },
    logOut: function(a) {
        a.preventDefault();
        $(HAB.rflHub.config.$rflLogoutForm).submit()
    }
};
HAB.headerNotificationClose = {
    init: function() {
        this.config = {
            slideTime: 500,
            notificationContainer: $(".important-notification"),
            notificationCloseButton: $(".js-close-notification"),
            closeNotificationForm: $("#jsCloseTermsNotificationForm")
        };
        var a = this;
        this.config.notificationCloseButton.on("click", function() {
            a.config.notificationContainer.slideUp(a.config.slideTime);
            a.config.closeNotificationForm.ajaxSubmit({
                type: "POST",
                url: "/my-account/my-account.jsp",
                error: function(d, b, c) {
                    console.log("Can't proccess AJAX request " + c)
                }
            })
        })
    }
};
HAB.removeAccount = {
    config: {
        $removeAccountForm: "#js-remove-account-form",
        $removeAccountSubmit: "#js-remove-account-submit",
        $removeAccountModal: ".remove-account-modal",
        $removeAccountPasswordField: "#js-remove-account-password",
        $closeRemoveAccountPopup: ".remove-account-modal .js-close-modal"
    },
    init: function() {
        $(this.config.$removeAccountSubmit).on("click", HAB.removeAccount.sendForm);
        SFR.Events.handlePressingEnter(this.config.$removeAccountForm, this.config.$removeAccountPasswordField, this.sendForm)
    },
    sendForm: function() {
        var a = HAB.removeAccount.config;
        SFR.Utils.sendAjaxForm($(".s-remove-account"), a.$removeAccountForm, true, function() {
            $(a.$removeAccountModal).show();
            $(a.$closeRemoveAccountPopup).focus();
            $(a.$closeRemoveAccountPopup).on("click", HAB.removeAccount.hidePopup)
        })
    },
    hidePopup: function() {
        $("#popup-container.remove-account-modal").hide("");
        window.location.href = contextPath + "/home.jsp"
    }
};
HAB.changeColumnContent = {
    init: function() {
        if ($("body").hasClass("t-page-two-columns")) {
            SFR.Utils.showAjaxLoader();
            var d = window.location.href.split("#");
            var b = $("#column-content").data("default-tab");
            if (d.length == 2) {
                b = b.substring(0, b.lastIndexOf("/") + 1) + d[1]
            }
            var c = $(".js-column-navigation").find("li[data-content-collection='" + b + "']").data("breadcrumb-title");
            var a = {
                type: "POST",
                dataType: "html",
                url: "/modules/ajax/staticframecontent-changing.jsp",
                data: {
                    contentCollection: b
                },
                success: function(e) {
                    $.root.find("#column-content").html(e);
                    SFR.Utils.hideAjaxLoader();
                    HAB.initModule();
                    HAB.changeColumnContent.updateNavigation(b, c)
                },
                fail: function() {
                    console.log("errors")
                }
            };
            $.ajax(a);
            $("li.js-change-frame-view").off().on("click", HAB.changeColumnContent.updateDesktopContent);
            $("#mobile-column-navigation").off().on("change", HAB.changeColumnContent.updateMobileContent)
        }
    },
    updateDesktopContent: function(d) {
        var a = $(d.currentTarget);
        var b = a.data("content-collection");
        var c = a.data("breadcrumb-title");
        HAB.changeColumnContent.updateRightHandContent(b, c)
    },
    updateMobileContent: function(d) {
        var a = $(d.currentTarget).find("option:selected");
        var b = a.data("content-collection");
        var c = a.data("breadcrumb-title");
        HAB.changeColumnContent.updateRightHandContent(b, c)
    },
    updateRightHandContent: function(c, b) {
        SFR.Utils.showAjaxLoader();
        var a = {
            type: "POST",
            dataType: "html",
            url: "/modules/ajax/staticframecontent-changing.jsp",
            data: {
                contentCollection: c
            },
            success: function(d) {
                $.root.find("#column-content").html(d);
                SFR.Utils.hideAjaxLoader();
                HAB.initModule();
                HAB.changeColumnContent.updateNavigation(c, b)
            }
        };
        $.ajax(a)
    },
    updateNavigation: function(b, c) {
        $(".js-column-navigation").find(".js-change-frame-view.selected").removeClass("selected");
        $(".js-column-navigation").find("li[data-content-collection='" + b + "']").addClass("selected");
        $("#mobile-column-navigation").find("option[selected]").removeAttr("selected");
        $("#mobile-column-navigation").find("option[data-content-collection='" + b + "']").attr("selected", true);
        var a = $('.crumb ul.mobile-hidden li:last-child [itemprop="name"]');
        a.text(a.text().substring(0, a.text().indexOf("|") + 1) + " " + c)
    }
};
HAB.quickOrder = {
    config: {
        form: ".quick-order-form",
        quickOrderSubmit: ".js-quick-order-submit",
        quickOrderContainer: ".quick-order-button-container",
        toggledElement: ".js-toggled",
        quantitySelect: ".js-quick-order-select-quantity",
        quantityInput: ".js-quick-order-quantity",
        headerBasketLink: ".js-header-basket-link",
        productErrorNotification: ".js-plp-error-notification",
        progressClass: "in-progress",
        addedClass: "item-added",
        isMobile: $(window).width() < 768
    },
    init: function() {
        var a = this.config;
        $(a.form).on("submit", HAB.quickOrder.addItemToCart);
        $(a.quantitySelect).on("change", function() {
            var b = this.options[this.selectedIndex].text
              , d = HAB.quickOrder.config
              , c = $(this).closest(d.form);
            c.find(d.quantityInput).val(b)
        })
    },
    addItemToCart: function(g) {
        g.preventDefault();
        var d = HAB.quickOrder.config
          , b = $(this).closest(d.form)
          , c = b.data("refresh-url");
        var f = function() {
            b.find(d.quickOrderSubmit).addClass(d.progressClass);
            if (d.isMobile) {
                SFR.Utils.showTargetAjaxLoader(b.find(d.quickOrderContainer), false)
            } else {
                b.find(d.quickOrderSubmit).attr("disabled", true)
            }
        };
        var a = function(k) {
            if (d.isMobile) {
                SFR.Utils.hideTargetAjaxLoader(b.find(d.quickOrderContainer), false)
            }
            var m = null;
            try {
                m = $.parseJSON(k)
            } catch (o) {}
            try {
                if (m.success) {
                    if (d.isMobile) {
                        b.find(d.toggledElement).toggle()
                    } else {
                        b.find(d.quickOrderSubmit).addClass(d.addedClass).removeClass(d.progressClass)
                    }
                    setTimeout(function() {
                        if (d.isMobile) {
                            b.find(d.toggledElement).hide();
                            b.find(d.quickOrderSubmit).removeClass(d.progressClass)
                        } else {
                            b.find(d.quickOrderSubmit).removeClass(d.addedClass).attr("disabled", false)
                        }
                    }, 2000);
                    $.root.find(d.headerBasketLink).load(c)
                } else {
                    b.find(d.productErrorNotification).text(m.message);
                    if (d.isMobile) {
                        b.find(d.quickOrderSubmit).removeClass(d.progressClass).attr("disabled", true);
                        b.find(d.productErrorNotification).fadeIn().delay(3000).fadeOut(function() {
                            b.find(d.quickOrderSubmit).attr("disabled", false)
                        })
                    } else {
                        var l = b.find(d.productErrorNotification).parent();
                        var n = "visible";
                        b.find(d.quickOrderSubmit).removeClass(d.progressClass).attr("disabled", false);
                        l.addClass(n);
                        setTimeout(function() {
                            l.removeClass(n)
                        }, 3000)
                    }
                }
            } catch (o) {
                console.log("Error during handling results of submitting form. ", o, k, status, xhr)
            }
        };
        var h = function(l, e, k) {
            console.log(l, e, k);
            SFR.Utils.hideTargetAjaxLoader(b.find(d.quickOrderContainer), false);
            b.find(d.quickOrderSubmit).removeClass(d.progressClass).attr("disabled", false)
        };
        b.ajaxSubmit({
            url: b.data("ajax-url") || b.prop("action"),
            beforeSubmit: f,
            success: a,
            error: h
        })
    }
};
HAB.pressReleases = {
    config: {
        pressReleaseText: ".js-press-release-text"
    },
    init: function() {
        if (HAB.isMobile()) {
            HAB.pressReleases.mobileStringTruncation(55)
        } else {
            HAB.pressReleases.desktopString()
        }
    },
    mobileStringTruncation: function(a) {
        var b = "...";
        $(HAB.pressReleases.config.pressReleaseText).each(function() {
            var e = $(this).html().trim();
            if (e.length > a) {
                var c, f, d;
                c = e.substr(0, a);
                f = e.substr(a, e.length - a);
                d = c + '<span class="js-ellipses">' + b + ' </span><span class="more-content">' + f + "</span>";
                $(this).html(d)
            }
        })
    },
    desktopString: function() {
        $(HAB.pressReleases.config.pressReleaseText).each(function() {
            console.log(this);
            $(this).find(".js-ellipses").remove();
            $(this).html($(this).text())
        })
    }
};
HAB.showMoreFunctionality = function(a, f, h, e) {
    var c = $(a).siblings(".js-show-more-btn"), d = $(a).siblings(".js-show-less-btn"), b, g;
    b = $(a + " " + f).size();
    g = h;
    $(a + " " + f).slice(h, b).addClass("hidden-item");
    if (!(b <= h)) {
        c.removeClass("hidden")
    }
    c.on("click", function() {
        if (e !== undefined) {
            if (g < b) {
                if (b - g <= e) {
                    c.addClass("hidden");
                    d.removeClass("hidden")
                }
                g += e;
                $(a + " " + f + ":lt(" + g + ")").removeClass("hidden-item")
            } else {
                c.addClass("hidden")
            }
        } else {
            $(a + " " + f + ":lt(" + b + ")").removeClass("hidden-item");
            c.addClass("hidden");
            d.removeClass("hidden")
        }
    });
    d.on("click", function() {
        $(a + " li").slice(h, b).addClass("hidden-item");
        d.addClass("hidden");
        c.removeClass("hidden");
        g = h
    })
}
;
HAB.orderReview = {
    config: {
        deliveryForm: "#js-change-delivery-address-form",
        addressDropdown: ".js-checkout-addresses-select",
        addressDropdownOptions: ".js-checkout-addresses-options-list",
        editLink: ".js-edit-delivery-address",
        addressField: ".js-chosen-address",
        paypalBtn: "#js-express-paypal-button",
        submitBtn: ".order-review-confirm-btn",
        payNowBtn: "#js-pay-now-btn",
        payNowSubmit: "#js-pay-now-submit"
    },
    init: function() {
        var a = this;
        HAB.customDropdown(this.config.addressDropdown, this.config.addressDropdownOptions, ".option", HAB.orderReview.changeAddress);
        $(this.config.editLink).on("click", function(b) {
            b.preventDefault();
            $(a.config.addressField).hide();
            $(a.config.editLink).hide();
            $(a.config.addressDropdown).removeClass("hidden");
            $(a.config.submitBtn).addClass("disabled")
        });
        $(this.config.paypalBtn).on("click", function(b) {
            b.preventDefault();
            HAB.initExpressPayPal()
        });
        $(this.config.payNowBtn).on("click", function(b) {
            $(this).attr("disabled", true);
            $(a.config.payNowSubmit).click()
        });
        if (HAB.isMobile()) {
            HAB.orderReview.showAllInit()
        }
    },
    changeAddress: function() {
        var b = HAB.orderReview.config
          , a = $(this).find("p").data("address-id");
        $(b.deliveryForm).find("#delivery-address-field").val(a);
        $(b.submitBtn).removeClass("disabled");
        $(b.deliveryForm).ajaxSubmit({
            beforeSubmit: SFR.Utils.showAjaxLoader,
            success: HAB.orderReview.changeAddressSuccess,
            error: HAB.orderReview.changeAddressError,
            complete: SFR.Utils.hideAjaxLoader
        })
    },
    changeAddressSuccess: function(a) {
        var c = HAB.orderReview.config;
        var b = null;
        try {
            b = JSON.parse(a);
            if (b.success) {
                var d = $(c.addressDropdown).find(".active-option")
                  , f = d.find(".delivery-address").html();
                $(c.addressDropdown).addClass("hidden");
                $(c.addressField).html(f).show();
                $(c.editLink).show();
                d.find(".delivery-address").html(d.data("msg-default"))
            } else {
                window.location.href = window.contextPath + "/basket/basket.jsp"
            }
        } catch (g) {
            console.log("Error during handling results of submitting form. ")
        }
    },
    changeAddressError: function(c, a, b) {
        console.log(c, a, b);
        window.location.href = window.contextPath + "/basket/basket.jsp"
    },
    showAllInit: function() {
        HAB.showMoreFunctionality(".js-products-list", "li", 2)
    }
};
HAB.initExpressPayPal = function() {
    var d = "#js-express-paypal-form"
      , b = "#js-express-paypal-button"
      , a = $(d).find(".js-paypal-email-field")
      , f = $(b).data("checkout-id")
      , e = $(b).data("checkout-env");
    var c = {
        type: "POST",
        success: function(h, g, o) {
            var l = null;
            try {
                l = JSON.parse(h);
                if (l.success) {
                    if (l.redirectURL.indexOf("https://") !== -1) {
                        paypal.checkout.startFlow(l.redirectURL)
                    } else {
                        SFR.Utils.showAjaxLoader();
                        window.location.href = l.redirectURL
                    }
                } else {
                    if (l.notification) {
                        var p = $(l.notification).appendTo($(b).parent()).hide().slideDown();
                        console.log($(this).parent());
                        $(b).siblings(".ajaxed").slideUp(400, function() {
                            $(this).remove()
                        });
                        p.addClass("ajaxed")
                    } else {
                        paypal.checkout.closeFlow();
                        var m = $.root.find("#ajaxBasketModule");
                        var k = HAB.basket.getRefreshURL();
                        m.load(k, function() {
                            $("#js-basket-errors").html(l.basketErrorMessages);
                            HAB.basket.hookUpdateCartEvents();
                            HAB.basket.loadUniversalVariable()
                        })
                    }
                }
            } catch (n) {
                console.log("Error during handling results of submitting form. ", n, h, g, o);
                paypal.checkout.closeFlow()
            }
        },
        error: function(l, g, h) {
            console.log(l, g, h);
            paypal.checkout.closeFlow();
            if (l.status === 409) {
                var k = $.root.find("#js-basket-errors");
                if (k.length > 0) {
                    k.html(window.localization.basket.sessionExpirationAjaxError);
                    SFR.Utils.scrollTo(k)
                }
            }
        },
        complete: SFR.Utils.hideAjaxLoader
    };
    if ($("#js-express-paypal-button").length) {
        paypal.checkout.setup(f, {
            environment: e,
            button: "js-express-paypal-button",
            click: function(g) {
                if ($(".unavailable-items-message").length) {
                    HAB.basket.unavailableItemsDetection(g);
                    return false
                }
                if ($(a).val() == "") {
                    paypal.checkout.initXO()
                }
                if ($("#js-express-paypal-form").parent(".pdp-express-checkout-block")) {
                    var h = $(".prod-qty-select #prod_qty").val();
                    $("#js-paypal-form-qty").val(h)
                }
                $("#js-express-paypal-form").ajaxSubmit(c)
            }
        })
    }
    if (window.location.search === "?error=insufficient.funds") {
        paypal.checkout.initXO();
        $("#js-express-paypal-form").ajaxSubmit(c)
    }
}
;
HAB.modalRegistration = {
    btn: $(".modal-registration-btn"),
    elem: $("#modal-registration"),
    container: $(".register-modal__container"),
    bodyEl: $("body"),
    autocloseTime: $("#modal-registration").data("autoclose-time"),
    selectors: {
        elem: "#modal-registration",
        closeBtn: ".register-modal__close",
        container: ".register-modal__container",
        errHolder: "#js-account-modal-errors",
        errSection: ".modal-form__err-section",
        errContainer: ".modal-form__err-container",
        loginButton: "#js-modal-login-button",
        loginForm: "#js-signin-modal-form",
        loginFormInputs: "#js-signin-modal-form input",
        createAccBtn: ".register-modal__to-reg",
        createAccLink: ".reg-modal__to-reg",
        closeErrorBtn: ".modal-form__err-close",
        loginLink: ".reg-modal__to-login",
        registrationForm: "#js-register-modal-form",
        registrationFormInputs: "#js-register-modal-form input",
        registrationBtn: "#js-modal-register-btn",
        forgotPasswordLink: ".reg-modal__to-forgot",
        forgotPasswordInput: "#modal-form__action_change_pass",
        siginInput: "#modal-form__action_login",
        forgotPasswordForm: "#js-forgot-passw-form",
        emailInput: ".modal-form__email_input",
        resendCodeForm: "#js-resend-code-form",
        submitCodeForm: "#js-submit-code-form",
        requestCodeLink: "#reg-modal__request-code",
        newPasswordForm: "#modal-form__new_pass_form"
    },
    close: function() {
        var a = this;
        a.elem.removeClass("opened");
        a.bodyEl.removeClass("no-scroll")
    },
    scroll: function(a) {
        var b = 0;
        if (a) {
            if ($(a).position().top < 0) {
                b = $(a).position().top + this.container.scrollTop()
            } else {
                b = this.container.scrollTop() - $(a).position().top
            }
        }
        this.container.animate({
            scrollTop: b
        }, 500)
    },
    reset: function() {
        this.container.html("")
    },
    showErr: function(a) {
        $(this.selectors.errContainer).html(a);
        $(this.selectors.errSection).slideDown(300)
    },
    closeErr: function(a) {
        $(this.selectors.errContainer).html("");
        $(this.selectors.errSection).slideUp(300)
    },
    init: function() {
        var a = this;
        a.btn.on("click", function(c) {
            var b = +($(this).attr("data-islogged"));
            if (!b) {
                c.preventDefault();
                a.container.load("/my-account/modal/login.jsp", function() {
                    HAB.modalRegistration.initModal();
                    HAB.modalRegistration.initLogin();
                    a.elem.addClass("opened");
                    a.bodyEl.addClass("no-scroll")
                })
            }
            if ($("#mobile-navigation-header-logo-btn").hasClass("close")) {
                $("#mobile-navigation-header-logo-btn").click()
            }
        })
    },
    initModal: function() {
        var a = this;
        a.elem.on("click", function(b) {
            if ((b.target == this) || ($(b.target).hasClass("register-modal__close"))) {
                a.close()
            }
        })
    },
    initLogin: function() {
        var a = HAB.modalRegistration;
        var b = HAB.modalRegistration.selectors;
        $(b.forgotPasswordLink).on("click", function(c) {
            c.preventDefault();
            SFR.Utils.showAjaxLoader();
            $(b.forgotPasswordInput).val("true");
            $(b.siginInput).remove();
            HAB.modalRegistration.redirectToForgotPassword()
        });
        $(b.loginForm).on("submit", function(c) {
            c.preventDefault();
            HAB.modalRegistration.submitForm($(b.loginForm), HAB.modalRegistration.onLoginSuccess, HAB.modalRegistration.showErrors)
        });
        $(b.createAccBtn).add(b.createAccLink).on("click", function(c) {
            c.preventDefault();
            SFR.Utils.showAjaxLoader();
            HAB.modalRegistration.redirectToRegistration()
        });
        $(b.loginFormInputs).inlineValidation();
        SFR.Utils.hideAjaxLoader();
        HAB.switchPasswordMask.config.initialized = false;
        HAB.switchPasswordMask.init()
    },
    initRegistration: function() {
        var a = HAB.modalRegistration;
        var b = HAB.modalRegistration.selectors;
        $(b.registrationForm).on("submit", function(c) {
            c.preventDefault();
            HAB.modalRegistration.submitForm($(b.registrationForm), HAB.modalRegistration.onLoginSuccess, HAB.modalRegistration.onRegistrationErrors)
        });
        $(b.loginLink).on("click", function(c) {
            c.preventDefault();
            SFR.Utils.showAjaxLoader();
            HAB.modalRegistration.redirectToLogin()
        });
        HAB.initHoneypot();
        $(b.registrationFormInputs).inlineValidation();
        SFR.Utils.hideAjaxLoader();
        HAB.switchPasswordMask.config.initialized = false;
        HAB.switchPasswordMask.config.defaultMasked = true;
        HAB.passwordStrengthMeter.init();
        a.scroll()
    },
    initForgotPassword: function() {
        var a = HAB.modalRegistration;
        var b = HAB.modalRegistration.selectors;
        $(b.forgotPasswordForm).on("submit", function(c) {
            c.preventDefault();
            HAB.modalRegistration.submitForm($(b.forgotPasswordForm), a.onForgotPasswordSuccess, a.showErrors)
        });
        a.bindCancelForgotPassword();
        $(b.forgotPasswordForm + " input").inlineValidation();
        HAB.enableCTA.init();
        SFR.Utils.hideAjaxLoader()
    },
    initForgotPasswordCode: function() {
        var a = HAB.modalRegistration;
        var b = HAB.modalRegistration.selectors;
        a.bindCancelForgotPassword();
        $(b.submitCodeForm).on("submit", function(c) {
            c.preventDefault();
            HAB.modalRegistration.submitForm($(b.submitCodeForm), a.onSubmitCodeSuccess, a.showErrors)
        });
        $(b.requestCodeLink).on("click", function(c) {
            c.preventDefault();
            HAB.modalRegistration.submitForm($(b.resendCodeForm), a.onResendCodeSuccess, a.showErrors)
        });
        $(b.submitCodeForm + " input").inlineValidation();
        HAB.enableCTA.init();
        SFR.Utils.hideAjaxLoader()
    },
    initNewPasswordForm: function() {
        var a = HAB.modalRegistration;
        var b = HAB.modalRegistration.selectors;
        $(b.newPasswordForm).on("submit", function(c) {
            c.preventDefault();
            HAB.modalRegistration.submitForm($(b.newPasswordForm), a.onLoginSuccess, a.showErrors)
        });
        a.bindCancelForgotPassword();
        $(b.newPasswordForm + " input").inlineValidation();
        HAB.enableCTA.init();
        HAB.switchPasswordMask.config.initialized = false;
        HAB.switchPasswordMask.config.defaultMasked = true;
        HAB.passwordStrengthMeter.init();
        SFR.Utils.hideAjaxLoader()
    },
    submitForm: function(f, a, b) {
        var d = this;
        var e = this.selectors;
        var c = {
            type: "POST",
            success: function(h, g, m) {
                var k = null;
                try {
                    k = JSON.parse(h);
                    if (k.success) {
                        a(k.successMessage)
                    } else {
                        b(k.errorMessages);
                        SFR.Utils.hideAjaxLoader()
                    }
                } catch (l) {
                    console.log("Error during handling results of submitting form. ", l, h, g, m)
                }
            },
            error: function(k, g, h) {
                console.log(k, g, h);
                if (k.status === 409) {
                    HAB.modalRegistration.showErrors(window.localization.account.sessionExpirationAjaxError)
                }
                SFR.Utils.hideAjaxLoader()
            }
        };
        SFR.Utils.showAjaxLoader();
        f.ajaxSubmit(c)
    },
    onLoginSuccess: function(b) {
        var a = HAB.modalRegistration.selectors;
        $(a.container).html(b);
        $(a.elem).on("click", function(c) {
            if ((c.target == this) || ($(c.target).hasClass("register-modal__close"))) {
                c.preventDefault();
                location.reload()
            }
        });
        if (HAB.modalRegistration.autocloseTime) {
            setTimeout(function() {
                location.reload()
            }, HAB.modalRegistration.autocloseTime)
        }
        SFR.Utils.hideAjaxLoader()
    },
    onForgotPasswordSuccess: function() {
        var b = HAB.modalRegistration;
        var c = b.selectors;
        var a = $(c.emailInput).val();
        $(c.container).load("/my-account/modal/resetCode.jsp", function() {
            $(HAB.modalRegistration.selectors.emailInput).each(function() {
                $(this).val(a)
            });
            HAB.modalRegistration.initForgotPasswordCode()
        })
    },
    onResendCodeSuccess: function() {
        $(".caption-notification").removeClass("hidden");
        SFR.Utils.hideAjaxLoader()
    },
    onSubmitCodeSuccess: function() {
        var b = HAB.modalRegistration;
        var c = b.selectors;
        var a = $(c.emailInput).val();
        $(c.container).load("/my-account/modal/changePassword.jsp", function() {
            SFR.Utils.showAjaxLoader();
            $(HAB.modalRegistration.selectors.emailInput).val(a);
            HAB.modalRegistration.initNewPasswordForm()
        })
    },
    onRegistrationErrors: function(a) {
        HAB.modalRegistration.showErrors(a);
        HAB.modalRegistration.reloadHoneypot()
    },
    showErrors: function(c) {
        var a = HAB.modalRegistration;
        var b = a.selectors;
        $(b.errHolder).html(c);
        a.scroll($(b.errHolder));
        $(b.closeErrorBtn).on("click", function(d) {
            a.closeErr()
        })
    },
    reloadHoneypot: function() {
        $("#modal-form__honeypot").load("/my-account/modal/includes/registrationHoneypot.jsp", function() {
            var a = $("#js-modal-honepot-input");
            a.val($("#js-reloaded-honeypot-value").data("real-value"))
        })
    },
    redirectToRegistration: function() {
        var a = this.selectors;
        $(a.container).load("/my-account/modal/register.jsp", this.initRegistration)
    },
    redirectToLogin: function() {
        var a = this.selectors;
        $(a.container).load("/my-account/modal/login.jsp", this.initLogin)
    },
    redirectToForgotPassword: function() {
        var b = this.selectors;
        var a = $(b.emailInput).val();
        $(b.container).load("/my-account/modal/forgotPassword.jsp", function() {
            HAB.modalRegistration.initForgotPassword();
            if (a !== "") {
                $(HAB.modalRegistration.selectors.emailInput).val(a);
                $(".js-cta-btn").attr("disabled", false)
            }
        })
    },
    bindCancelForgotPassword: function() {
        var a = this.selectors;
        $(a.loginLink).on("click", function(b) {
            b.preventDefault();
            SFR.Utils.showAjaxLoader();
            HAB.modalRegistration.cancelForgotPassword()
        })
    },
    cancelForgotPassword: function() {
        var b = this.selectors;
        var a = $(b.emailInput).val();
        $(b.container).load("/my-account/modal/login.jsp", function() {
            $(HAB.modalRegistration.selectors.emailInput).val(a);
            HAB.modalRegistration.initLogin()
        })
    }
};
HAB.orderProgress = {
    el: $(".js-order-progress"),
    activeClass: "active",
    init: function() {
        var a = this.el.find(".order-progress-step");
        var b = +this.el.attr("data-progress");
        a.slice(0, b).addClass(this.activeClass)
    }
};
HAB.oisPopup = {
    init: function() {
        var a = $(".js-ois-pop-up");
        if (a.length) {
            HAB.oisPopup.open()
        }
    },
    open: function() {
        var a = {
            url: "/modules/ajax/oisFreeDeliveryModal.jsp",
            showAjaxLoader: true,
            closableBackground: false
        };
        SFR.Utils.showPopup(a)
    }
};
HAB.healthboxFixedHeader = {
    allIsOK: ($(".js-sticky-header").length) && ($(window).width() < 768),
    mainHeaderEl: $(".js-main-header"),
    stickyNavParent: $(".healthbox-mobile-header"),
    stickyNavEl: $(".healthbox-mobile-header-container"),
    linkArr: $(".healthbox-mobile-header-item"),
    MAINOFFSET: 82,
    HEADERHEIGHT: 55,
    activeClass: "active",
    fixedClass: "fixed",
    stickyNavOffset: 0,
    navElementsArr: [],
    init: function() {
        var a = this;
        if (a.allIsOK) {
            $(window).load(function() {
                a.offsetsInit();
                a.updateAllStates(window.scrollY);
                window.addEventListener("orientationchange", function() {
                    setTimeout(function() {
                        a.offsetsInit()
                    }, 100)
                });
                window.addEventListener("scroll", function(b) {
                    a.updateAllStates(this.scrollY)
                }, false);
                a.ancorScrollInit()
            })
        }
    },
    updateAllStates: function(b) {
        var a = this;
        a.headerFix(a.mainHeaderEl, a.fixedClass, 0, b);
        a.headerFix(a.stickyNavEl, a.fixedClass, a.stickyNavOffset, b);
        a.navElementsArr.map(function(c) {
            a.navScroll(c, b)
        })
    },
    ancorScrollInit: function() {
        var a = this;
        a.stickyNavEl.on("click", ".healthbox-mobile-header-item", function() {
            var b = $(this).attr("href");
            var c = $(b).offset().top - a.MAINOFFSET + 10;
            $("html,body").animate({
                scrollTop: c
            }, 0);
            return false
        })
    },
    offsetsInit: function() {
        this.stickyNavOffset = this.stickyNavParent.offset().top - this.HEADERHEIGHT;
        this.navElementsArr = this.sectionOffsetsInit(this.linkArr)
    },
    headerFix: function(b, a, d, c) {
        b.toggleClass(a, c > d)
    },
    sectionOffsetsInit: function(d) {
        var a = this;
        var b = [];
        d.each(function() {
            var h = $(this);
            var k = h.attr("href");
            var f = $(k);
            var e = f.offset().top - a.MAINOFFSET;
            var g = e + f.outerHeight();
            b.push(new c(h,e,g))
        });
        function c(g, e, f) {
            this.linkEl = g;
            this.startOffset = e;
            this.endOffset = f
        }
        return b
    },
    navScroll: function(a, c) {
        var b = $(a.linkEl);
        var d = (a.startOffset <= c) && (a.endOffset > c);
        b.toggleClass(this.activeClass, d)
    }
};
HAB.responsiveHref = {
    config: {
        links: $("[data-responsive-href]"),
        cursors: $("[data-cursor-fallback]"),
        hasNativeSupport: !!(window.CSS && window.CSS.supports && window.CSS.supports("(--a: 0)"))
    },
    init: function() {
        this.addEventListeners()
    },
    addEventListeners: function() {
        var a = this.config;
        if (a.links.length) {
            $(document).on("click", "[data-responsive-href]", function(h) {
                h.preventDefault();
                var g = $(this);
                var d = g.data("responsiveHref");
                var c = d.desktop || null;
                var f = d.mobile || null;
                var b = HAB.isMobile();
                if (c && !b) {
                    window.location.href = c
                }
                if (f && b) {
                    window.location.href = f
                }
            })
        }
        if (!a.hasNativeSupport && a.cursors.length) {
            HAB.responsiveHref.recalculate();
            $(window).on("resize", HAB.responsiveHref.recalculate)
        }
    },
    recalculate: function() {
        var b = HAB.responsiveHref.config.cursors;
        var a = HAB.isMobile();
        $.each(b, function() {
            var c = $(this);
            var d = c.data("cursorFallback");
            c.css({
                cursor: (a) ? d.mobile : d.desktop
            })
        })
    }
};
HAB.cssCustomPropsBannerFallback = {
    config: {
        images: $("[data-height-fallback]"),
        blocks: $("[data-background-fallback]")
    },
    init: function() {
        var a = !!(window.CSS && window.CSS.supports && window.CSS.supports("(--a: 0)"));
        if (!a && (this.config.images.length || this.config.blocks.length)) {
            this.recalculate();
            this.addEventListeners()
        }
    },
    recalculate: function() {
        var c = this.config.images;
        var b = this.config.blocks;
        var a = HAB.isMobile();
        $.each(c, function() {
            var f = $(this);
            var e = f.data("heightFallback");
            var d = f.data("widthFallback");
            f.css({
                "max-height": (a) ? e.mobile : e.desktop,
                width: (a) ? d.mobile : d.desktop
            })
        });
        $.each(b, function(d, g) {
            var f = $(this);
            var e = f.data("backgroundFallback");
            f.css({
                "background-color": (a) ? e.mobile : e.desktop
            })
        })
    },
    addEventListeners: function() {
        $(window).on("resize", function() {
            HAB.cssCustomPropsBannerFallback.recalculate()
        })
    }
};
