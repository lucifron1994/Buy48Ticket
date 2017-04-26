// ==UserScript==
// @name         Buy48Ticket
// @namespace    https://github.com/lucifron1994/Buy48Ticket
// @version      1.0
// @description  Buy 48Ticket
// @author       lucifron
// @match        https://shop.48.cn/tickets/item/*
// @grant        none
// ==/UserScript==

$(function() {
    'use strict';

    var _startTime = new Date().getTime();
    console.info('开始脚本时间:' + _startTime);

    var _num = 1;
    var _seattype = 2;  // 2V 3普 4站

    var _addUrl = "/TOrder/add";
    var _id = location.pathname.split('/tickets/item/')[1];

    var _beijingTime = 0;

    function _loop(){
        setTimeout(function(){tickets();},5000);
    }

    function tickets(){

        var __id =_id;
        var __checkUrl = "/TOrder/tickCheck";
        layer.msg(__checkUrl);

        $.ajax({
            url: __checkUrl,
            type: "GET",
            dataType: "json",
            data: { id: __id,r: Math.random() },
            success: function (result) {
                console.info(result.Message);
                
                if (result.HasError) {
                    _loop();
                }
                else
                {
                    switch(result.ErrorCode)
                    {
                        case "success":
                            window.location.href = result.ReturnObject;
                            break;
                        case "fail":
                            layer.msg(result.Message);
                            break;
                        default:
                            _loop();
                    }

                }
            },
            error: function (e) {
                _loop();

            }
        });
    }


    function init(){
        console.info('/TOrder/add');

        $.ajax({
            url: _addUrl,
            type: "post",
            dataType: "json",
            data: { id: _id, num: _num, seattype:_seattype, brand_id:$('body script').text().match(/brand_id:(\d+)/)[1], r: Math.random() },
            success: function (result) {
                if (result.HasError) {
                    console.info('/TOrder/add Failed' + result.Message);
                    layer.msg(result.Message);
                }
                else {
                    if(result.Message =="success")
                    {
                        window.location.href = result.ReturnObject;
                    }else
                    {
                        setTimeout(function(){tickets();},2000);
                    }
                }
            },
            error: function (e) {
                layer.msg("/TOrder/add Error");
            }
        });
    }

    function _timeCheck(){
        var currentTS = new Date().getTime();
        //console.info(currentTS + '  ' + _beijingTime);
        if (currentTS >= _beijingTime) {
            console.info('Current/Predict Time: ' + currentTS + '  ' + _beijingTime);
            init();
        }else{
            setTimeout(function(){_timeCheck();},30);
        }
    }

    function _prepareTime(){
        var tyear = new Date().getFullYear();
        var tmonth = new Date().getMonth() + 1;
        var tday = new Date().getDate();
        var str00 = tyear + '/' + tmonth + '/' + tday;
        var date00 = new Date(str00);
        var dateTime0 = date00.getTime();
        
        var timeofset = 200;
        // Set offset by id
        // if (_id==912){
        //     timeofset = 600;
        // }
        var beijingTime = dateTime0 + 20*3600*1000 - timeofset;
        _beijingTime = beijingTime;
        _timeCheck();
    }

    _prepareTime();

    console.info('Session Info: ' + _id);
});
