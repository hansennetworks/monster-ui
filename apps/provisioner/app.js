define(["require","jquery","underscore","monster","toastr"],function(e){var t=e("jquery"),n=e("underscore"),a=e("monster"),i=e("toastr"),s={name:"provisioner",css:["app"],i18n:{"en-US":{customCss:!1},"fr-FR":{customCss:!1}},requests:{"provisioner.reseller.get":{apiRoot:a.config.api.provisioner,url:"resellers/{resellerId}",verb:"GET",generateError:!1},"provisioner.reseller.update":{apiRoot:a.config.api.provisioner,url:"resellers/{resellerId}",verb:"POST"},"provisioner.accounts.get":{apiRoot:a.config.api.provisioner,url:"accounts/{accountId}",verb:"GET",generateError:!1},"provisioner.accounts.update":{apiRoot:a.config.api.provisioner,url:"accounts/{accountId}",verb:"POST"},"provisioner.devices.get":{apiRoot:a.config.api.provisioner,url:"devices/{accountId}/{macAddress}",verb:"GET"},"provisioner.devices.create":{apiRoot:a.config.api.provisioner,url:"devices/{accountId}/{macAddress}",verb:"PUT"},"provisioner.devices.update":{apiRoot:a.config.api.provisioner,url:"devices/{accountId}/{macAddress}",verb:"POST"},"provisioner.devices.delete":{apiRoot:a.config.api.provisioner,url:"devices/{accountId}/{macAddress}",verb:"DELETE"},"provisioner.devices.list":{apiRoot:a.config.api.provisioner,url:"devices/{accountId}",verb:"GET"},"provisioner.devices.getAccountId":{apiRoot:a.config.api.provisioner,url:"devices/search/{macAddress}",verb:"GET",generateError:!1},"provisioner.devices.unlock":{apiRoot:a.config.api.provisioner,url:"locks/{accountId}/{macAddress}",verb:"DELETE"},"provisioner.ui.getGlobal":{apiRoot:a.config.api.provisioner,url:"ui",verb:"GET"},"provisioner.ui.getModel":{apiRoot:a.config.api.provisioner,url:"ui/{brand}/{family}/{model}",verb:"GET"}},subscribe:{},load:function(e){var t=this;t.initApp(function(){e&&e(t)})},initApp:function(e){var t=this;a.pub("auth.initApp",{app:t,callback:e})},render:function(e,i){var s=this,o=i||{},c=o.hasOwnProperty("accountId")?o.accountId:s.accountId,r=n.isEmpty(e)?t("#monster-content"):e,d=o.macAddress;a.parallel({currentAccount:function(e){s.requestGetKazooAccount(function(t){e(null,t)})},children:function(e){s.requestListKazooChildren(function(t){e(null,t)})},devices:function(e){s.requestAllDevices(c,function(t){e(null,t)})}},function(e,n){var i="";i=a.config.whitelabel.hasOwnProperty("realm_suffix")?"http://p."+a.config.whitelabel.realm_suffix:"//"===a.config.api.provisioner.substr(0,2)?"http:"+a.config.api.provisioner:a.config.api.provisioner;var o=function(e){var t=e.devices,n=e.currentAccount,a=e.children;if(a.sort(function(e,t){return e.name.toLowerCase()>t.name.toLowerCase()?1:-1}).unshift(n),t.length>0)for(var i=0,s=a.length;s>i;i++)if(a[i].id===c){a[i].devices=t;break}return a}(n),u=t(a.template(s,"app",{provisionerUrl:i,isReseller:a.apps.auth.currentAccount.is_reseller,accounts:o}));a.ui.tooltips(u),a.ui.mask(u.find("#search_device input"),"macAddress"),r.empty().append(u),s.bindEvents(r),s.slideAccountSection(r,{accountId:c,macAddress:d})})},bindEvents:function(e){var n=this,s=e.find("#provisioner-container"),o=function(i,s,o){n.requestAllDevices(s,function(c){if(0===c.length)i.addClass("empty");else{var r=t(a.template(n,"devicesWrapper",{devices:c}));a.ui.tooltips(r),i.find(".devices-wrapper").empty().append(r)}n.slideAccountSection(e,{accountId:s,macAddress:o})})};s.find(".search-custom input").focus(),s.find(".account-header").on("click",function(){var a=t(this).parent(),i=a.data("id");if(a.hasClass("active"))n.slideAccountSection(e,{accountId:i});else{var s=a.find(".devices-wrapper .device-box");s.hasClass("no-data")&&!a.hasClass("empty")?o(a,i):n.slideAccountSection(e,{accountId:i})}}),s.on("mouseenter",".device-box:not(.no-data)",function(){t(this).addClass("selected")}),s.on("mouseleave",".device-box:not(.no-data)",function(){t(this).removeClass("selected")}),s.find("#search-device").on("click",function(){var c=t(this).siblings("input").val();if(/^([0-9a-fA-F]{2}[:]){5}([0-9a-fA-F]{2})$/.test(c)){var r=c.replace(/:/g,""),d=!1;t.each(s.find(".device-box:not(.no-data)"),function(i,o){var c=t(o);if(c.data("mac-address").toString()===r){var u=c.parents(".account-section"),l=u.data("id");return d=!0,u.hasClass("active")?a.ui.highlight(s.find('.device-box[data-mac-address="'+r+'"]')):n.slideAccountSection(e,{accountId:l,macAddress:r}),!1}}),d||n.requestGetDeviceAccounId(r,function(e){var t=s.find('.account-section[data-id="'+e+'"]');t.length?t.hasClass("active")?a.ui.highlight(s.find('.device-box[data-mac-address="'+r+'"]')):o(t,e,r):a.request({resource:"provisioner.devices.get",data:{accountId:e,macAddress:r},success:function(t,n){a.pub("common.accountAncestors.render",{accountId:e,entity:{type:"macAddress",data:t.data}})}})},function(){i.info(a.template(n,"!"+n.i18n.active().toastr.info.unknownMacAddress,{macAddress:r}))})}}),s.on("click",".restart-devices:not(.disabled)",function(e){e.stopPropagation();var a=t(this).parents(".device-box"),s=a.parents(".account-section").data("id"),o=a.data("kazooid");n.callApi({resource:"device.restart",data:{accountId:s,deviceId:o},success:function(e){i.success(n.i18n.active().restart.success)}})}),s.on("click",".delete-devices",function(e){e.stopPropagation();var i,s=t(this).parents(".device-box"),o=s.parents(".account-section"),c=s.data("mac-address"),r=o.data("id");a.ui.confirm(n.i18n.active().confirmDelete,function(){n.requestDeleteDevice(r,c,function(){s.fadeOut(function(){t(this).remove(),i=o.find(".devices-wrapper"),i.is(":empty")&&i.empty().append(t(a.template(n,"noDevice")))})})})}),s.find(".add-device").on("click",function(i){i.stopPropagation();var s=t(this).parents(".account-section").data("id");a.pub("common.chooseModel.render",{callback:function(t,a){a&&a();var i={accountId:s,brand:t.provision.endpoint_brand,family:t.provision.endpoint_family,model:t.provision.endpoint_model,deviceData:{brand:t.provision.endpoint_brand,family:t.provision.endpoint_family,model:t.provision.endpoint_model,mac_address:t.mac_address.replace(/:/g,"").toLowerCase(),name:t.name,settings:{}},requests:["modelDefaults","resellerData","accountData"]};n.aggregateData(i,function(t){n.renderSettingsView(e,t)})}})}),s.on("click",".provision-devices",function(a){a.stopPropagation();var i=t(this),s=i.parents(".device-box"),o=i.parents(".account-section").data("id");macAddress=s.data("mac-address"),family=s.data("family"),brand=s.data("brand"),model=s.data("model"),dataToAggregate={accountId:o,macAddress:macAddress,family:family,brand:brand,model:model,requests:["modelDefaults","resellerData","accountData","deviceData"]},n.aggregateData(dataToAggregate,function(t){n.renderSettingsView(e,t)})}),s.on("click",".unlock-devices",function(e){e.preventDefault();var a=t(this).parents(".device-box"),s=a.parents(".account-section").data("id"),o=a.data("mac-address");n.requestUnlockDevice({accountId:s,macAddress:o},function(){i.success(n.i18n.active().toastr.success.unlock)})}),s.find(".update-account").on("click",function(a){a.stopPropagation();var i=t(this).parents(".account-section").data("id"),s={accountId:i,requests:["globalDefaults","resellerData","accountData"]};n.aggregateData(s,function(t){n.renderSettingsView(e,t)})}),s.find("#update_provider").on("click",function(){var t={requests:["globalDefaults","resellerData"]};n.aggregateData(t,function(t){n.renderSettingsView(e,t)})})},renderSettingsView:function(e,i){var s=this,o=t(a.template(s,"settingsContent",{loadingMessage:s.i18n.active().loadingMessage.get[i.action.level],viewType:s.i18n.active().viewType[i.action.level],sections:i.template}));e.empty().append(o),s.forEachProperty(i.template,function(o){var c=t.extend(!0,{},o.data,{path:o.path}),r=c.type,d=o.hasOwnProperty("index")?'.sub-content[data-key="'+o.index+'"] ':"",u="field".concat(r.charAt(0).toUpperCase(),r.slice(1)),l='.container .content[data-key="'+o.section+'"] ',f=l.concat(d,".",o.option);if(o=s.mergeLevelValues(o,i),"select"===r&&c.options.forEach(function(e){"boolean"==typeof e.value&&(e.value=e.value.toString())}),n.isEmpty(o))c.value="";else{for(var v in o)"boolean"==typeof o[v].value&&(o[v].value=o[v].value.toString());if(o.hasOwnProperty("field")&&(c.value=o.field.value),o.hasOwnProperty("inherit"))if(t.extend(!0,c,{inherit:o.hasOwnProperty("field")?!1:!0,inheritData:t.extend(!0,{},o.inherit,{level:s.i18n.active()[o.inherit.level]})}),"select"===r){c.value=c.inherit?"inherit":c.value,c.options.unshift({text:s.i18n.active().inherit,value:"inherit"});for(var p=0,g=c.options.length;g>p;p++)if(c.options[p].value===o.inherit.value){c.inheritData.text=c.options[p].text;break}}else("text"===r||"password"===r)&&(c.value=c.inherit?"":o.field.value)}e.find(f).append(t(a.template(s,u,c)))}),e.find("#nav-bar-horizontal > .switch-link:first-child").addClass("active"),e.find(".settings-content .container > .content:first-child").addClass("active"),a.ui.tooltips(e),e.find(".switch-sublink").each(function(){t(this).text(parseInt(t(this).text(),10)+1)}),s.toggleLoadingAnimation(e),s.bindSettingsViewEvents(e,i)},bindSettingsViewEvents:function(e,n){var i=this,s=e.find("#provisioner-container");s.find(".switch-link").on("click",function(){var e=t(this);e.hasClass("active")||(s.find(".switch-link.active").removeClass("active"),e.addClass("active"),s.find(".container").fadeOut(200,function(){s.find(".settings-content .content.active").removeClass("active"),s.find('.settings-content .content[data-key="'+e.data("key")+'"]').addClass("active"),t(this).fadeIn(200)}))}),s.find(".switch-sublink").on("click",function(){var e=t(this),n=s.find('.content[data-key="'+e.parents(".content").data("key")+'"]');e.hasClass("active")||(n.find(".switch-sublink.active").removeClass("active"),e.addClass("active"),n.find(".sub-content.active").fadeOut(200,function(){t(this).removeClass("active"),n.find('.sub-content[data-key="'+e.data("key")+'"]').fadeIn(200,function(){t(this).addClass("active")})}))}),s.find(".settings-content select").on("change",function(){var e=t(this),n=e.parents(".control-group");"inherit"===e.val()?n.hasClass("warning")||n.addClass("warning"):n.hasClass("warning")&&n.removeClass("warning")}),s.find(".settings-content input").on("keyup",function(e){var n=t(this),a=n.parents(".controls").find("div:last-child").hasClass("help-inline"),i=n.parents(".control-group");a&&(""===n.val()?i.hasClass("warning")||i.addClass("warning"):i.hasClass("warning")&&i.removeClass("warning"))}),s.find(".cancel").on("click",function(){i.toggleLoadingAnimation(e,i.i18n.active().loadingMessage.list.accounts,function(){i.render(e)})}),s.find("#save").on("click",function(){var t=n.action.method,s=n.action.level,o={data:n.results[s.concat("Data")]};i.toggleLoadingAnimation(e,i.i18n.active().loadingMessage[t][s],function(){var c=t.charAt(0).toUpperCase().concat(t.slice(1)),r=s.charAt(0).toUpperCase().concat(s.slice(1)),d=function(){i["request".concat(c,r)](o,function(){delete o.data,delete o.generate,i.render(e,o)},function(){i.render(e)})};if(o.data.settings=i.formatSettingsToApi(e,a.ui.getFormData("form2object")),"reseller"!==s&&(o.accountId=n.accountId),"device"===s)o.macAddress="create"===t?n.results.deviceData.mac_address:n.macAddress,d();else{var u=a.ui.confirm(i.i18n.active().alert.confirm.generateFiles,function(){o.generate=!0,d()},function(){o.generate=!1,d()});u.find("#cancel_button").text(i.i18n.active().no),u.find("#confirm_button").text(i.i18n.active().yes)}})})},formatDevicesToTemplate:function(e,t,a){var i={},s={};return n.each(a,function(e){e.hasOwnProperty("device_id")&&e.registered&&(s[e.device_id]=!0)}),n.each(t,function(e){e.hasOwnProperty("mac_address")&&(i[e.mac_address.toLowerCase()]={id:e.id,isRegistered:s.hasOwnProperty(e.id)})}),n.each(e,function(e){e.mac_address_formatted=e.mac_address.match(/[0-9a-f]{2}/gi).join(":"),e.isRegistered=!1,e.showRestart=!1,i.hasOwnProperty(e.mac_address_formatted)&&(e.kazoo_id=i[e.mac_address_formatted].id,e.isRegistered=i[e.mac_address_formatted].isRegistered,e.showRestart=e.kazoo_id&&e.isRegistered),e.status=e.isRegistered?"registered":"unregistered"}),e.sort(function(e,t){return e.name.toLowerCase()>t.name.toLowerCase()?1:-1}),e},aggregateData:function(e,i){var s=this,o={globalDefaults:function(e){s.requestGetGlobalDefaults(function(t){e(null,t)})},modelDefaults:function(t){s.requestGetModelDefaults(e.brand,e.family,e.model,function(e){t(null,e)})},resellerData:function(e){s.requestGetReseller(function(t){e(null,t)})},accountData:function(t){s.requestGetAccount(e.accountId,function(e){t(null,e)})},deviceData:function(t){s.requestGetDevice(e.accountId,e.macAddress,function(e){t(null,e)})}},c={};e.requests.forEach(function(e){c[e]=o[e]}),delete e.requests,a.parallel(c,function(a,s){var o,c={},r={},d=function(e){return n.each(e,function(e,t,n){if(e.hasOwnProperty("iterate"))if(0===e.iterate)delete n[t];else{var a=e.iterate,i=e.data;e.data={};for(var s=0;a>s;s++)e.data[s]=i}}),e};s.hasOwnProperty("globalDefaults")?(o=s.globalDefaults.template,c.settings=s.globalDefaults.settings,delete s.globalDefaults):(o=s.modelDefaults.template,c.settings=s.modelDefaults.settings,delete s.modelDefaults),s.globalData=c,e.hasOwnProperty("deviceData")?(r.method="create",r.level="device",s.deviceData=e.deviceData,delete e.deviceData):(r.method="update",s.hasOwnProperty("deviceData")?r.level="device":s.hasOwnProperty("accountData")?r.level="account":r.level="reseller"),t.extend(!0,e,{action:r,results:s,template:d(o)}),i(e)})},forEachProperty:function(e,t){var n,a,i,s,o,c,r,d=function(e){return Object.keys(e).every(function(e,t){return e===t.toString()})},u=[];for(n in e)if(r=e[n].hasOwnProperty("data")?e[n].data:e[n],d(r))for(s in r){o=r[s],u.push(n.concat("[",s,"]"));for(i in o){a=o[i].hasOwnProperty("data")?o[i].data:o[i],u.push(i);for(c in a)u.push(c),t({path:u.join("."),data:a[c],section:n,option:i,index:s,field:c}),u.splice(-1,1);u.splice(-1,1)}u.splice(-1,1)}else{u.push(n);for(i in r){o=r[i].hasOwnProperty("data")?r[i].data:r[i],u.push(i);for(c in o)u.push(c),t({path:u.join("."),data:o[c],section:n,option:i,field:c}),u.splice(-1,1);u.splice(-1,1)}u.splice(-1,1)}},formatSettingsToApi:function(e,t){var a=this,i=e.find("#form2object"),s=function(e){var a=e.section,i=e.option,s=e.index,o=e.field;s?(delete t[a][s][i][o],n.isEmpty(t[a][s][i])&&(delete t[a][s][i],n.isEmpty(t[a][s])&&(delete t[a][s],n.isEmpty(t[a])&&delete t[a]))):(delete t[a][i][o],n.isEmpty(t[a][i])&&(delete t[a][i],n.isEmpty(t[a])&&delete t[a]))},o=function d(e){for(var t in e)"object"==typeof e[t]?d(e[t]):("true"===e[t]||"false"===e[t])&&(e[t]="true"===e[t])};for(var c in t)if(Array.isArray(t[c])){var r={};t[c].forEach(function(e,t){r[t]=e}),t[c]=r}return o(t),a.forEachProperty(t,function(e){var t=i.find('[name="'+e.path+'"]'),n=t.prop("type");"select-one"===n?"inherit"===e.data&&s(e):("text"===n||"password"===n)&&""===e.data&&s(e)}),t},mergeLevelValues:function(e,t){var a=["device","account","reseller","global"],i=t.results,s=[],o={},c=function r(e,t,n,a){t.hasOwnProperty(e[a])&&("object"==typeof t[e[a]]?r(e,t[e[a]],n,++a):s.push({level:n,value:t[e[a]]}))};return a.forEach(function(t){var a=t.concat("Data");if(i.hasOwnProperty(a)&&i[a].hasOwnProperty("settings")&&!n.isEmpty(i[a].settings)){var s=[e.section,e.option,e.field];e.hasOwnProperty("index")&&s.splice(1,0,"device"===t?e.index:"0"),c(s,i[a].settings,t,0)}}),s.length>0&&(t.action.level===s[0].level?(o.field=s[0],s.length>1&&(o.inherit=s[1])):o.inherit=s[0]),o},slideAccountSection:function(e,n){var i=n.accountId,s=n.hasOwnProperty("macAddress")&&void 0!==n.macAddress?n.macAddress:void 0,o=e.find('.account-section[data-id="'+i+'"]');o.hasClass("active")?o.addClass("animate").find(".devices-wrapper").slideUp(function(){t(this).parent().find(".left-part i").toggleClass("fa-chevron-down monster-white fa-chevron-right").addBack().removeClass("active animate")}):o.addClass("animate").find(".devices-wrapper").slideDown(function(){t(this).parent().addClass("active").removeClass("animate").find(".left-part i").toggleClass("fa-chevron-right monster-white fa-chevron-down"),s&&a.ui.highlight(e.find('.device-box[data-mac-address="'+s+'"]'))})},toggleLoadingAnimation:function(e,t,n){var a=e.find(".loading-div");t&&a.find("span").text(t),a.is(":visible")?a.fadeOut(200,function(){e.find(".container").fadeIn(200,function(){n&&n()})}):e.find(".device-settings").fadeOut(200,function(){a.fadeIn(200,function(){n&&n()})})},requestGetReseller:function(e,t){var n=this;a.request({resource:"provisioner.reseller.get",data:{resellerId:a.apps.auth.currentAccount.is_reseller?n.accountId:a.apps.auth.currentAccount.reseller_id},success:function(t,n){e&&e(t.data)},error:function(n,a){404===a.status?e&&e({}):t&&t()}})},requestUpdateReseller:function(e,t,n){var i=this;a.request({resource:"provisioner.reseller.update",data:{resellerId:a.apps.auth.currentAccount.is_reseller?i.accountId:a.apps.auth.currentAccount.reseller_id,data:e.data,envelopeKeys:{generate:e.generate,create_if_missing:!0}},success:function(e,n){t&&t()},error:function(e,t){n&&n()}})},requestGetKazooAccount:function(e,t){var n=this;n.callApi({resource:"account.get",data:{accountId:n.accountId},success:function(t,n){e&&e(t.data)},error:function(e,n){t&&t()}})},requestListKazooChildren:function(e,t){var n=this;n.callApi({resource:"account.listChildren",data:{accountId:n.accountId},success:function(t,n){e&&e(t.data)},error:function(e,n){t&&t()}})},requestGetAccount:function(e,t,n){a.request({resource:"provisioner.accounts.get",data:{accountId:e},success:function(e,n){t&&t(e.data)},error:function(e,a){404===a.status?t&&t({}):n&&n()}})},requestUpdateAccount:function(e,t,n){a.request({resource:"provisioner.accounts.update",data:{accountId:e.accountId,data:e.data,envelopeKeys:{generate:e.generate,create_if_missing:!0}},success:function(e,n){t&&t()},error:function(e,t){n&&n()}})},requestGetDevice:function(e,t,n,i){a.request({resource:"provisioner.devices.get",data:{accountId:e,macAddress:t},success:function(e,t){n&&n(e.data)},error:function(e,t){i&&i()}})},requestCreateDevice:function(e,t,n){a.request({resource:"provisioner.devices.create",data:{accountId:e.accountId,macAddress:e.macAddress,data:e.data,envelopeKeys:{generate:!0}},success:function(e,n){t&&t()},error:function(e,t){n&&n()}})},requestUpdateDevice:function(e,t,n){a.request({resource:"provisioner.devices.update",data:{accountId:e.accountId,macAddress:e.macAddress,data:e.data,envelopeKeys:{generate:!0}},success:function(e,n){t&&t()},error:function(e,t){n&&n()}})},requestDeleteDevice:function(e,t,n,i){a.request({resource:"provisioner.devices.delete",data:{accountId:e,macAddress:t},success:function(e,t){n&&n()},error:function(e,t){i&&i()}})},requestListDevices:function(e,t,n){a.request({resource:"provisioner.devices.list",data:{accountId:e},success:function(e,n){t&&t(e.data)},error:function(e,t){n&&n()}})},requestGetDeviceAccounId:function(e,t,n){a.request({resource:"provisioner.devices.getAccountId",data:{macAddress:e},success:function(e,n){t&&t(e.data.account_id)},error:function(e,t){n&&n()}})},requestListKazooDevices:function(e,t){var n=this;n.callApi({resource:"device.list",data:{accountId:e,filters:{paginate:!1}},success:function(e,n){t&&t(e.data)}})},requestStatusKazooDevices:function(e,t){var n=this;n.callApi({resource:"device.getStatus",data:{accountId:e,filters:{paginate:!1}},success:function(e,n){t&&t(e.data)}})},requestAllDevices:function(e,t){var n=this;a.parallel({devices:function(t){n.requestListDevices(e,function(e){t(null,e)})},kazooDevices:function(t){n.requestListKazooDevices(e,function(e){t(null,e)})},statusDevices:function(t){n.requestStatusKazooDevices(e,function(e){t(null,e)})}},function(e,a){var i=n.formatDevicesToTemplate(a.devices,a.kazooDevices,a.statusDevices);t&&t(i)})},requestUnlockDevice:function(e,t,n){a.request({resource:"provisioner.devices.unlock",data:{accountId:e.accountId,macAddress:e.macAddress},success:function(e,n){t&&t()},error:function(e,t){n&&n()}})},requestGetGlobalDefaults:function(e,t){a.request({resource:"provisioner.ui.getGlobal",data:{},success:function(t,n){e&&e(t.data)},error:function(e,n){t&&t()}})},requestGetModelDefaults:function(e,t,n,i,s){a.request({resource:"provisioner.ui.getModel",data:{brand:e,family:t,model:n},success:function(e,t){i&&i(e.data)},error:function(e,t){s&&s()}})}};return s});