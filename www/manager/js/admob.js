module.controller('AdmobController', ['$scope', '$http', '$sce','SharedScopes', function ($scope, $http, $sce,SharedScopes) {
	var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) {
    admobid = { // for Android
        banner: 'ca-app-pub-3940256099942544/6300978111',
        interstitial: 'ca-app-pub-3940256099942544/1033173712',
        rewardvideo: 'ca-app-pub-3940256099942544/5224354917',
    };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
        banner: 'ca-app-pub-8394432247836009/9773867413',
        interstitial: 'ca-app-pub-3940256099942544/4411468910',
        rewardvideo: 'ca-app-pub-3940256099942544/1712485313',
    };
} else {
    admobid = { // for Windows Phone
        banner: 'ca-app-pub-6869992474017983/8878394753',
        interstitial: 'ca-app-pub-6869992474017983/1355127956',
        rewardvideo: '',
    };
}

var selected_pos_value = 8; //AdMob.AD_POSITION.BOTTOM_CENTER

function createSelectedBanner(){
    AdMob.removeBanner();
    var ads_size = $("#btn_size_txt").text();
    var ads_pos = selected_pos_value;
    if(AdMob) AdMob.createBanner({
        adId: admobid.banner,
        overlap: $('#overlap').prop('checked'),
        offsetTopBar: $('#offsetTopBar').prop('checked'),
        adSize: ads_size,
        position: ads_pos
    });
}

function showBannerAtPosition(){
    var ads_pos = selected_pos_value;
    if(AdMob) AdMob.showBanner( ads_pos );
}

function prepareInt(){
    AdMob.prepareInterstitial({
        adId:admobid.interstitial,
        autoShow: $('#autoshow').prop('checked')
    });
}

function initialization(){
    AdMob.getAdSettings(function(info){
        console.log('adId: ' + info.adId + '\n' + 'adTrackingEnabled: ' + info.adTrackingEnabled);
    }, function(){
        console.log('failed to get user ad settings');
    });
    
    AdMob.setOptions({
        //adId: admobid.banner,
        //adSize: 'SMART_BANNER',
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        isTesting: true, // set to true, to receiving test ad for testing purpose
        bgColor: 'black', // color name, or '#RRGGBB'
        // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
        // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
    });
    
    // new events, with variable to differentiate: adNetwork, adType, adEvent
    $(document).on('onAdFailLoad', function(e){
        // when jquery used, it will hijack the event, so we have to get data from original event
        if(typeof e.originalEvent !== 'undefined') e = e.originalEvent;
        var data = e.detail || e.data || e;

        alert('error: ' + data.error +
            ', reason: ' + data.reason +
            ', adNetwork:' + data.adNetwork +
            ', adType:' + data.adType +
            ', adEvent:' + data.adEvent); // adType: 'banner', 'interstitial', etc.
        });
        
    $('#btn_size').click(showBannerSize);
    $('#btn_pos').click(showBannerPos);
    $('#btn_create').click(createSelectedBanner);
    $('#btn_show').click(showBannerAtPosition);
    
    $('#btn_remove').click(function(){
        AdMob.removeBanner();
    });
    
    $('#btn_hide').click(function(){
        AdMob.hideBanner();
    });

    // test interstitial ad
    $('#btn_prepare').click(function(){
        AdMob.prepareInterstitial({
            adId:admobid.interstitial,
            autoShow: $('#autoshow').prop('checked')
        });
    });

    $('#btn_showfull').click(function(){
        console.log("SHOw full quang cao");
        AdMob.showInterstitial();
    });
}

function btnPosLabel(value){
    value = parseInt(value);
    txt = "";
    switch(value) {
        case 1:
            txt = "TOP_LEFT";
            break;
        case 2:
            txt = "TOP_CENTER";
            break;
        case 3:
            txt = "TOP_RIGHT";
            break;
        case 4:
            txt = "LEFT";
            break;
        case 5:
            txt = "CENTER";
            break;
        case 6:
            txt = "RIGHT";
            break;
        case 7:
            txt = "BOTTOM_LEFT";
            break;
        case 8:
            txt = "BOTTOM_CENTER";
            break;
        case 9:
            txt = "BOTTOM_RIGHT";
            break;
    }
    return txt;
}

var dialogs = {};
function showBannerSize() {
    var dlg = "banner_size.html";
    if (!dialogs[dlg]) {
          ons.createDialog(dlg).then(function(dialog) {
        	dialogs[dlg] = dialog;
	    	dialog.show();
            
            $('input[name=radio_size]').on('change', function() {
                var selected_value = $('input[name=radio_size]:checked').val();
                $("#btn_size_txt").text(selected_value);
                dialog.hide();
            });
	  	});
	} else {
	  	dialogs[dlg].show();
	}
}

function showBannerPos() {
    var dlg = "banner_pos.html";
    if (!dialogs[dlg]) {
          ons.createDialog(dlg).then(function(dialog) {
        	dialogs[dlg] = dialog;
	    	dialog.show();
            
            $('input[name=radio_pos]').on('change', function() {
                var selected_value = $('input[name=radio_pos]:checked').val();
                var selected_text = btnPosLabel(selected_value);
                $("#btn_pos_txt").text(selected_text);
                selected_pos_value = selected_value;
                dialog.hide();
            });
	  	});
	} else {
	  	dialogs[dlg].show();
	}
}
        
function onDeviceReady() {
    if (! AdMob) { alert( 'admob plugin not ready' ); return; }
    initialization();
    // display a banner at startup
    createSelectedBanner();
}

$(document).ready(function(){
    // on mobile device, we must wait the 'deviceready' event fired by cordova
    if(/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent)) {
        document.addEventListener('deviceready', onDeviceReady, false);
    } else {
        onDeviceReady();
    }
});
  
}]);
