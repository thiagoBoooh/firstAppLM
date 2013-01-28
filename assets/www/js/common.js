//var SITE_CONTEXT = "/voyage/";
var doc = $("document");
var thisWindow;
var htmlBody;
var wrapper;

var fr_monthNames = ['Janvier','F&eacute;vrier','Mars','Avril','Mai','Juin','Juillet','Ao&ucirc;t','Septembre','Octobre','Novembre','D&eacute;cembre'];
var fr_dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
var fr_pensions = {"AllInclusive":"Tout compris","FullBoard":"Pension compl&egrave;te","HalfBoard":"Demi-pension","Breakfast":"Petit-d&eacute;jeuner"};

//var storageActivated = typeof(Storage) !== "undefined";
//var storedProductsIds = new Array();

var departureCity = doc.getUrlParameter("s_dpci", true);

/**function getDefaultDepartureDate() {
    try {
        return $('#result-list').attr("data").match(".*defaultDepDate=(\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d).*")[1];
    } catch(err) { }
    return "";
}*/

var nextPageToLoad = 1;
var currentNbProducts = 0;
var lastProductShown = false;
var searching = false;
var pageOffset;
var productGenericLink;
var searchURL;



var app = {
	    // Application Constructor
	    initialize: function() {
	        this.bindEvents();
	    },
	    // Bind Event Listeners
	    //
	    // Bind any events that are required on startup. Common events are:
	    // 'load', 'deviceready', 'offline', and 'online'.
	    bindEvents: function() {
	        document.addEventListener('deviceready', this.onDeviceReady, false);
	    },
	    // deviceready Event Handler
	    //
	    // The scope of 'this' is the event. In order to call the 'receivedEvent'
	    // function, we must explicity call 'app.receivedEvent(...);'
	    onDeviceReady: function() {
	        app.receivedEvent('deviceready');
	    },
	    // Update DOM on a Received Event
	    receivedEvent: function(id) {
	    	console.log("receivedEvent");
	        /**var parentElement = document.getElementById(id);
	        var listeningElement = parentElement.querySelector('.listening');
	        var receivedElement = parentElement.querySelector('.received');

	        listeningElement.setAttribute('style', 'display:none;');
	        receivedElement.setAttribute('style', 'display:block;');

	        console.log('Received Event: ' + id);*/
	        
	        thisWindow = $(window);
	        htmlBody = $("body");
	        wrapper = $("#wrapper");

	        /**if (storageActivated) {
	            initStoredProductsIds();
	        }

	        if (window.location.pathname.indexOf("/search-results.html") >= 0) {
	            selectSearchEngineValues();
	        }*/

	        initHeader();
	        //initInputs();
	        initDatepicker();
	        initSameHeight();
	        //initSlideshow();
	        initAccordion();
	        //initInputsNumber();
	        //initValidation();
	        initAddClass();
	        //initChildrenAge();
	        //initShareProduct();
	        //initLmnSearch();
	        
	        console.log("before replaceALL");
	        console.log("window.location.pathname: " + window.location.pathname);
	        console.dir(window.location);
	        
	        //jcf.customForms.replaceAll();

	        if (window.location.pathname.indexOf("/search-results.html") >= 0) {
	            $(".select-area").css({width: $("#slt-desti").width()});
	        }
	        
	        $('#search-form').submit(function() {
	        	console.log("in searchForm submit");
	            //if ($(this).valid()) {
	            	console.log("valid request");
	                // form validation already done, so no tests needed
	                var params = 's_aj=' + $('#search-form #slt-flex').val();
	                params += '&s_minMan=' + $('#search-form #slt-dur').val();
	                params += '&s_dpci=' + $('#search-form #slt-ori').val();

	                var depDate = $('#search-form #ipt-date').val();
	                params += '&s_dd=' + depDate.substring(0, 2);
	                params += '&s_dmy=' + depDate.substring(3);

	                var dest = $('#search-form #slt-desti').val();
	                if (dest !== '' && dest !== '-1' && dest !== '*') {
	                    params += '&s_c.de=' + dest;
	                }

	                if (window.location.pathname.indexOf("search-results.html") > -1) {
	                    if ($("ul#orderControls li:eq(0) .chk-checked").length > 0) {
	                        params += '&topSales=1';
	                    }

	                } else {
	                    params += '&topSales=1';
	                }

	                
	                window.location = $('#search-form').attr('action') + "?" + params;
	                return false;
	            //}
	        });
	        
	     
	        
	    if (window.location.pathname.indexOf("/search-results.html") >= 0) {
	        productGenericLink = getGenericProductURL();
	        searchURL = getSearchURL();

	        jQuery('ul.result-filter').slideAccordion({
	            opener:'a.opener',
	            slider:'div.slide',
	            animSpeed: 300
	        });

	        $('#filter-form-container').hide();

	        pageOffset = $("ul#result-list li:last").offset();

	        $("#filter-form-opener").click(function() {
	            toggleFilterForm();
	        });


	        searchMoreResults();

	        $(window).scroll(function() {
	            if (!searching && !lastProductShown && (pageOffset.top - $(window).height() <= $(window).scrollTop())) {
	                searchMoreResults();
	            }
	        });
	    }
	        
	    }
	};

/**jQuery(window).load(function(){
    initSlideshow();
    jcf.customForms.replaceAll();

    if (window.location.pathname.indexOf("/search-results.html") >= 0) {
        $(".select-area").css({width: $("#slt-desti").width()});
    }
});*/

function initHeader() {
    var menuBtn = jQuery("#header #menu-btn");
    var openClass = "selected";
    var menu = jQuery("#menu");

    menuBtn.click(function() {
        if (menuBtn.hasClass(openClass)) {
            menuBtn.removeClass(openClass);
            menu.slideUp();
        } else {
            menuBtn.addClass(openClass);
            menu.slideDown();
        }
        return false;
    });

    var backBtn = jQuery("#header #back-btn");
    backBtn.click(function() {
        history.back();
        return false;
    });
}

/**function initLmnSearch() {
    $(this).on("click", ".lastminuteSearchLauncher", function() {
        window.location.href = SITE_CONTEXT + "PAR/lmn-search-results.html";
    });
}*/

/**
 * Share product.
 */
var shareProductSlideSpeed = 1000;

function showShareProduct() {
    var linkData = jQuery(this).attr('data');
    if (linkData != null) {
        var dataParts = linkData.split('#');
        $("#shared-product-title").html(dataParts[1]);
        $("#shared-product-id").val(dataParts[0]);
        $("#shared-product-name").val($("#shared-product-title").text());
    }
    $("#note-container .note").hide();
    $("#share-product-buttons").show();
    $("#share-product-loader").hide();
    $("#share-product-message").hide();

    $("#share-product").css({marginTop:thisWindow.scrollTop()});
    htmlBody.css({overflow:"hidden"});
    wrapper.animate({left:thisWindow.width() + "px"}, {queue: false, duration: shareProductSlideSpeed});
    return false;
}

function hideShareProduct() {
    wrapper.animate({left:"0"}, {queue: false, duration: shareProductSlideSpeed, complete: function(){
        htmlBody.css({overflow:"auto"});
    }});
    return false;
}

function initShareProduct(){
    $("#cancel-share-product").click(hideShareProduct);
    $("#message-back-link").click(hideShareProduct);

    jQuery("#share-product-form").each(function(){
        var form = jQuery(this);
        form.validate({
            onkeyup:false,
            onfocusout:false,
            onsubmit: true,
            highlight: function(element, errorClass, validClass) {
                jQuery(element).parents(".row").addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function(element, errorClass, validClass) {
                jQuery(element).parents(".row").removeClass(errorClass).addClass(validClass);
            },
            errorPlacement: function(){
                //message.show();
            }
        });
        jQuery.validator.addMethod("defaultInvalid", function(value, element) {
            return value != element.defaultValue;
        }, "");
    })

    /**$("#share-product-form").submit(function() {
        if($(this).find(".row.error .error-msg:visible").length == false) {
            $("#share-product-buttons").hide();
            $("#share-product-loader").show();
            $.post(SITE_CONTEXT + "shareProduct", $("#share-product-form").serialize(), function(data) {
                $("#share-product-loader").hide();
                if (data !== null && data == "success") {
                    $("#message-content").text("Votre message a bien été envoyé.");
                } else {
                    $("#message-content").text("Une erreur est survenue lors de l'envoi.");
                }
                $("#share-product-message").show();
                window.setTimeout(hideShareProduct, 2000);
             });
        }
        return false;
    });*/
}


function initAddClass(){
    var activeClass = 'active';
    jQuery('.controls-btn').each(function(){
        var list = jQuery(this);
        var items = list.find('li');
        items.each(function(){
            var item = jQuery(this);
            item.bind('click touchstart', function(){
                if(!item.hasClass(activeClass)){
                    items.removeClass(activeClass);
                    item.addClass(activeClass);
                }
            });
        });
    });
}

/**function initChildrenAge() {
    jQuery('#wrapper #main #resaForm #ipt-2.childrenAge').on('change', function(){
        var valC = $(this).val();
        var area = $(this).attr('id');
        if(valC > 0){
            var val = valC - 1;
            $('#child-'+area).find("div.box:lt(" + valC + ")").show().end().find("div.box:gt(" + val + ")").hide();
            $('#child-'+area).show();

        }else{
            $('#child-'+area).hide();
        }
    });
}*/


// validation init
/*function initValidation(){
    jQuery("form#lmn-search-form, form#search-form").each(function(){
        var form = jQuery(this);
        var message = form.find('div.note');
        message.hide();
        form.validate({
            onkeyup:false,
            onfocusout:false,
            onsubmit: true,
            highlight: function(element, errorClass, validClass) {
                jQuery(element).parents('li').addClass(errorClass).removeClass(validClass);
            },
            unhighlight: function(element, errorClass, validClass) {
                jQuery(element).parents('li').removeClass(errorClass).addClass(validClass);
            },
            errorPlacement: function(){
                message.show();
            }
        });
        jQuery.validator.addMethod("defaultInvalid", function(value, element) {
            return value != element.defaultValue;
        }, "");
    })
};*/

// datepicker init
function initDatepicker(){
    jQuery('input.with-dp').each(function(){
        var hold = jQuery(this);
        hold.bind('focus', function(e){
            e.preventDefault();
        })
        hold.datepicker({
            showOn: "button",
            buttonImage: "/css_imgs/none.gif",
            buttonImageOnly: true,
            minDate: '1d',
            maxDate: '365d'
        });
    });
    jQuery.datepicker.regional['fr'] = {
        closeText: 'Fermer',
        prevText: 'Précédent',
        nextText: 'Suivant',
        currentText: 'Aujourd\'hui',
        monthNames: fr_monthNames,
        monthNamesShort: ['Janv.','F&eacute;vr.','Mars','Avril','Mai','Juin',
        'Juil.','Ao&ucirc;t','Sept.','Oct.','Nov.','D&eacute;c.'],
        dayNames: fr_dayNames,
        dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
        dayNamesMin: ['D','L','M','M','J','V','S'],
        weekHeader: 'Sem.',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''};
    jQuery.datepicker.setDefaults($.datepicker.regional['fr']);

    var initDate;
    if (window.location.pathname.indexOf("search-results.html") >= 0) {
        var monthYear = doc.getUrlParameter("s_dmy", true);
        var day = doc.getUrlParameter("s_dd", true);
        if (day == "" || monthYear == "") {
            try {
                var defaultDepDate = getDefaultDepartureDate();
                initDate = new Date(
                        parseInt(defaultDepDate.substring(6, 11),10),
                        parseInt(defaultDepDate.substring(3, 5),10) - 1,
                        parseInt(defaultDepDate.substring(0, 2),10));
            } catch (err) {
                return;
            }
        } else {
            initDate = new Date(
                    parseInt(monthYear.substring(3,7),10),
                    parseInt(monthYear.substring(0,2),10) - 1,
                    parseInt(day,10));
        }
    } else {
        initDate = new Date();
        initDate.setDate(initDate.getDate() + 30);
    }
    console.log("initDate: " + initDate);
    $('#ipt-date').datepicker('setDate', initDate);
};

// set same column height
function initSameHeight(){
    jQuery('.cols').sameHeight({
        elements: '.col',
        flexible: true,
        multiLine: true
    });
    jQuery('.about-box').sameHeight({
        elements: '.price-col, .text-box',
        flexible: true,
        multiLine: true
    });
}

// accordion init
function initAccordion() {
    jQuery('ul.accordion').slideAccordion({
        opener:'>a.opener',
        slider:'>div.slide',
        animSpeed: 300
    });
}
// init change numbers in inputs
/**function initInputsNumber(){
    jQuery('.counter input').changeNumbers({
        btnUp: 'a.btn-inc',
        btnDown: 'a.btn-dec',
        event: 'click'
    });
};

// slideshow init
function initSlideshow(){
    jQuery('div.gallery').slideshow({
        slides:'div.gallery-holder > ul > li',
        pagingHolder:'div.switcher',
        pagingTag:'li',
        createPaging:true,
        autoHeight:true,
        animSpeed:700 //ms
    });
}*/

// clear inputs on focus
function initInputs() {
    PlaceholderInput.replaceByOptions({
        // filter options
        clearInputs: true,
        clearTextareas: true,
        clearPasswords: true,
        skipClass:'default',

        // input options
        wrapWithElement:false,
        showUntilTyping:false,
        getParentByClass:false,
        placeholderAttr: 'placeholder'
    });
}



function selectSearchEngineValues() {
    $('#search-form #slt-flex').val(doc.getUrlParameter("s_aj", true));
    $('#search-form #slt-dur').val(doc.getUrlParameter("s_minMan", true));
    $('#search-form #slt-ori').val(departureCity);

    var destiStr = doc.getUrlParameter("s_c.de", true);
    if (destiStr !== '') {
        $('#search-form #slt-desti').val(destiStr);
    } else {
        $('#search-form #slt-desti').val("*");
    }
}



function getGenericProductURL() {
    var genericProductURL = "/" + departureCity + "/";

    var duration = doc.getUrlParameter("s_minMan", true);
    if (duration == "") {
        duration = "6-9";
    } else {
        duration = duration.replace(",", "-");
    }
    genericProductURL = genericProductURL + duration + "/product.html";

    var depDay = doc.getUrlParameter("s_dd", true);
    var depMY = doc.getUrlParameter("s_dmy", true);
    if (depDay !== "" && depMY !== "") {
        genericProductURL = genericProductURL + "?depDate=" + depDay + "/" + depMY;
    }
    return genericProductURL;
}

function getSearchURL() {
    var tmpSearchUrl = "http://lastminutemobile.recette.orchestra-platform.com/voyage/searchProducts" + window.location.search;
    var depDay = doc.getUrlParameter("s_dd", true);
    var depMY = doc.getUrlParameter("s_dmy", true);
    if (depDay == "" || depMY == "") {
        try {
            var defaultDepDate = getDefaultDepartureDate();
            tmpSearchUrl = tmpSearchUrl + "&s_dd=" + defaultDepDate.substring(0, 2) + "&s_dmy=" + defaultDepDate.substring(3, 11);
        } catch(err) {
            // nothing to do
        }
    }
    return tmpSearchUrl;
}


/**
 * Favourites management.
 *
 * id#title#price#productDuration#productUrl
 */
/**function initStoredProductsIds() {
    if (localStorage.favoriteProducts != null && localStorage.favoriteProducts.length > 0) {
        var storedProductsInfos = localStorage.favoriteProducts.split("|");
        for (var i = 0; i < storedProductsInfos.length; i++) {
            try {
                storedProductsIds.push(storedProductsInfos[i].substring(0, storedProductsInfos[i].indexOf("#")));
            } catch(err) { }
        }
    }
}
function storeProduct(data) {
    if (storageActivated) {
        if (localStorage.favoriteProducts == null) {
            localStorage.favoriteProducts = "";
        } else if (localStorage.favoriteProducts != "") {
            localStorage.favoriteProducts += "|";
        }
        localStorage.favoriteProducts += data;
        storedProductsIds.push(data.substring(0, data.indexOf("#")));
    }
}
function isProductStored(productId) {
    for (var i = 0; i < storedProductsIds.length; i++) {
        if (storedProductsIds[i] == productId) {
            return true;
        }
    }
    return false;
}*/



/**
 * Search management.
 */


//$(document).ready( function () {
    

    /**$("#lmn-search-form").submit(function() {
        if ($(this).valid()) {
            window.location.href = SITE_CONTEXT + $("#slt-dep-city").val() + "/lmn-search-results.html";
            return false;
        }
    });

    if (window.location.pathname.indexOf("/clear-private-data\.html") > -1) {
        $("#wrapper #main .content-box .row-submit #clear-data").click(function() {
            if (storageActivated) {
                localStorage.favoriteProducts = "";
            }
            $("#wrapper #main .content-box .row-submit a").hide();
            $("#wrapper #main .content-box .row-submit p#success-msg").show();
            return false;
        });

    } else if (window.location.pathname.indexOf("/product\.html") > -1) {

        var urlParts = window.location.pathname.match("/([0-9]+)/([A-Z]+)/");
        var productId = urlParts[1];
        var resaForm = $("#resaForm");
        resaForm.find("input[name=depCityCode]").val(urlParts[2]);
        resaForm.find("input[name=productUrl]").val(window.location.href);
        resaForm.find("input[name=productDetailsUrl]").val(window.location.href);

        $(this).on("click", "#btn-share", showShareProduct);

        if (storageActivated) {
            var storeButton = $("#btn-add");
            if (isProductStored(window.location.pathname.match("/([0-9]+)/")[1])) {
                storeButton.addClass("alt");
            } else {
                storeButton.click(function() {
                    jQuery(this).addClass("alt");
                    storeProduct(jQuery(this).attr("data") + "#" + window.location.pathname + window.location.search);
                    return false;
                });
            }
        }

        var availDate = doc.getUrlParameter("depDate", true);
        var availDur = doc.getUrlParameter("dur", true);
        if (availDate !== "") {
            var targetDate = availDate.replace(/\//g, "-") + "-" + availDur;
            resaForm.find("select#slt_avail option").each(function(){
                if ($(this).attr("value").indexOf(targetDate) != -1) {
                    resaForm.find("select#slt_avail").val($(this).attr("value"));
                    return false;
                }
            });
        } else {
            resaForm.find("select#slt_avail option").each(function(){
                if ($(this).attr("data") == "cheapest") {
                    $resaForm.find("select#slt_avail").val($(this).attr("value"));
                    return false;
                }
            });
        }

    } else if (window.location.pathname.indexOf("/favorites\.html") > -1) {

        if (storageActivated) {
            if (localStorage.favoriteProducts != null && localStorage.favoriteProducts != "") {
                var favorites = localStorage.favoriteProducts.split("|");
                var favorite;
                var container = $("#wrapper #main ul#fav-list");
                var model = container.find("li:first");
                var favoriteHtml;
                var daysAndNights;

                for (var i = 0; i < favorites.length; i++) {
                    favorite = favorites[i].split("#");
                    if (favorites[i] == "" || favorite.length < 4) {
                        continue;
                    }

                    favoriteHtml = model.clone();
                    favoriteHtml.attr("style", "");
                    favoriteHtml.find(".col").attr("data", favorite[0]).click(function() {
                        var rgx = new RegExp(
                                "^" + $(this).attr("data") + "#[^#]*#[^#]*#[^#]*#[^#|]*\\|?"
                                + "|"
                                + "\\|" + $(this).attr("data") + "#[^#]*#[^#]*#[^#]*#[^#|]*", "");
                        localStorage.favoriteProducts = localStorage.favoriteProducts.replace(rgx, "");
                        $(this).parents("li").first().hide();
                        return false;
                    });

                    favoriteHtml.find(".col2 .text-box h3 a").html(favorite[1]).attr("href", favorite[4]);
                    favoriteHtml.find(".col3 a").attr("href", favorite[4]);

                    favoriteHtml.find(".col2 .text-box .price").html(favorite[2] + "<sup>&euro;</sup>");

                    daysAndNights = favorite[3].split("-");
                    favoriteHtml.find(".col2 .text-box p.dur").html(daysAndNights[0] + " jours / " + daysAndNights[1] + " nuits");

                    favoriteHtml.find(".col2").click(function() {window.location.href = $(this).find(".text-box h3 a").attr("href"); return false;});
                    favoriteHtml.find(".col3").click(function() {window.location.href = $(this).find("a").attr("href"); return false;});

                    container.append(favoriteHtml);
                }

            } else {
                 $("#wrapper #main #no-favorites").show();
            }

        } else {
            $("#wrapper #main #storage-disabled").show();
        }

    } else if (window.location.pathname.indexOf("/lmn-search-results\.html") > -1) {
        $("#slt-dep-city").on('change', function(){
            window.location.href = SITE_CONTEXT + $(this).val() + "/lmn-search-results.html";
            return false;
        });
        jQuery("#wrapper #main ul.news-list li").click(function() {
            window.location.href = jQuery(this).attr("data");
            return false;
        });
        jQuery("#wrapper #main ul.news-list li .entry").each(function(){
            $(this).on("click", "a.btn-email", showShareProduct);
            return false;
        });

        if (storageActivated) {
            jQuery("#wrapper #main ul.news-list li .entry a.btn-add").each(function(){
                var data = jQuery(this).attr("data");
                if (isProductStored(data.match("^([0-9]+)#")[1])) {
                    jQuery(this).addClass("alt");
                } else {
                    jQuery(this).click(function() {
                        jQuery(this).addClass("alt");
                        storeProduct(data + "#" + jQuery(this).parents("li:first").attr("data"));
                        return false;
                    });
                }
            });
        }

    } else*/ 
        function toggleFilterForm() {
            var container = $('#filter-form-container');

            if (container.hasClass("open")) {
                container.removeClass("open");
                container.slideUp(1000);
            } else {
                container.addClass("open");
                container.slideDown(1000);
            }

            pageOffset = $("ul#result-list").find("li.product-item:last").offset();
        }

        function searchMoreResults() {
            searching = true;
            $("#searchLoader").show();
            console.log(searchURL + "&page=" + nextPageToLoad);
            $.ajax({
                type: "GET",
                url: searchURL + "&page=" + nextPageToLoad,
                    //data: $("#contactDetailsForm").serialize(),
                dataType: "json",
                success: function(data) {
                    showSearchResults(data);
                    console.log("search successfully processed");
                    searching = false;
                },
                error: function(data) {
                    processSearchError(data);
                    searching = false;
                }
            });
        }

        function processSearchError(data) {
            lastProductShown = true;
            $("#searchError").show();
        }

        function showSearchResults(data) {
            var container = $("ul#result-list");
            var model = container.find("li.product-item:first");
            var newProduct;
            var depDate;
            var depDateStr;
            var htmlAvails;
            var htmlPrice;
            var productLink;
            var price;
            var dateParts;

            for (var i = 0; i < data.products.length; i++) {
                price = data.products[i].price.replace(new RegExp("^([0-9]+)([0-9]{3})(\\.[0-9]+)?$","g"), "$1 $2");

                productLink = data.products[i].id + productGenericLink;
                newProduct = model.clone();
                newProduct.find(".holder .text-box h3 a").html(data.products[i].loc).attr("href", productLink);
                newProduct.find(".holder .text-box h2 a").html(data.products[i].title).attr("href", productLink);
                newProduct.find(".holder .text-box .entry img").attr("src", data.products[i].mainPic);/*.click(function() {window.location.href = $(this).parents(".text-box").find("h2 a").attr("href"); return false;});*/
                newProduct.find(".holder .text-box .entry .text .units p").html(data.products[i].dur.split("-")[1] + " nuits");
                newProduct.find(".holder .text-box .entry .text p.pension").html(fr_pensions[data.products[i].mealP]);
                newProduct.find(".holder .text-box .entry .btns .btn-email").attr("data", data.products[i].id + "#" + data.products[i].title);
                newProduct.find(".holder .text-box .entry .btns a.btn-add").attr("data", price + "#" + data.products[i].dur + "#" + productLink);

                /**if (storageActivated && isProductStored(data.products[i].id)) {
                    newProduct.find(".holder .text-box .entry .btns a.btn-add").addClass("alt");
                }*/

                htmlPrice = '<div class="link-to-product" data="' + productLink + '">';
                if (data.products[i].perc != "") {
                    htmlPrice += '<span class="disc">-' + data.products[i].perc
                                + '<span>%</span></span><span class="alt">&agrave; partir de</span><span class="price red">';
                } else {
                    htmlPrice += '<span class="alt">&agrave; partir de</span><span class="price">';
                }

                htmlPrice = htmlPrice + price + '<sup>&euro;</sup></span><p>TTC / pers.</p>';
                if (data.products[i].CPrice != "") {
                    htmlPrice = htmlPrice + '<span class="alt2">au lieu de <mark>' + data.products[i].CPrice + '&euro;</mark></span>';
                }
                htmlPrice = htmlPrice + '</div><a href="#" class="opener">LES DATES</a>';
                newProduct.find(".holder .price-box").html(htmlPrice);
                //newProduct.find(".holder .price-box .link-to-product").click(function() {window.location.href = $(this).attr("data"); return false;});

                htmlAvails = "";
                for (var j = 0; j < data.products[i].avails.length; j++) {
                    dateParts = data.products[i].avails[j].date.split("-");
                    depDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                    depDateStr = "depDate=" + (depDate.getDate() < 10 ? "0" : "") + depDate.getDate()
                        + "/" + (depDate.getMonth() < 9 ? "0" : "") + (depDate.getMonth() + 1)
                        + "/" + depDate.getFullYear();
                    htmlAvails =
                        htmlAvails + '<li onclick="javascript:window.location.href=\''
                        + productLink.replace(/depDate=.{10}/, depDateStr)
                        + '&dur=' + data.products[i].dur + '\';return false;"><a href="#" class="link">link</a><span class="price">'
                        + data.products[i].avails[j].price
                        + '<sup>&euro;</sup></span><span class="alt-text">&agrave; partir de</span><span class="text">D&eacute;part : <em>'
                        + fr_dayNames[depDate.getDay()] + ' ' + depDate.getDate() + ' '
                        + fr_monthNames[depDate.getMonth()] + '</em></span></li>';
                }
                newProduct.find(".slide .action-box ul").html(htmlAvails);

                container.append(newProduct);
            }

            $("#searchLoader").hide();
            container.find("li.product-item:gt(" + currentNbProducts + ")")
                .show()
                .sameHeight({
                    elements: '.price-box, .text-box',
                    flexible: true,
                    multiLine: true
            }).find('.holder .text-box .entry .btns').each(function(){
                $(this).on("click", "a.btn-email", showShareProduct);
            });

            /**if (storageActivated) {
                container.find("li.product-item:gt(" + currentNbProducts + ")").find('.holder .text-box .entry .btns a.btn-add').each(function(){
                    $(this).click(function() {
                        if (!jQuery(this).hasClass("alt")) {
                            jQuery(this).addClass("alt");

                            var cartouche = jQuery(this).parents('li.product-item');

                            storeProduct(jQuery(this).parents("li.product-item").find(".holder .text-box .entry .btns .btn-email").attr("data")
                                    + "#" + jQuery(this).attr("data"));
                        }
                        return false;
                    });
                });
            }*/

            container.slideAccordion({
                opener:'a.opener',
                slider:'div.slide',
                animSpeed: 300
            });

            currentNbProducts = currentNbProducts + data.products.length;
            nextPageToLoad++;
            lastProductShown = data.lastProductReached;
            pageOffset = container.find("li.product-item:last").offset();

            if (currentNbProducts == 0 && lastProductShown) {
                $("#searchNoResults").show();
            }
        }

        
//});


// FlexSlider
/**$(function(){
  SyntaxHighlighter.all();
});
$(window).load(function(){
  $('.flexslider').flexslider({
    animation: "slide",
    start: function(slider){
      $('body').removeClass('loading');
    }
  });
});*/

