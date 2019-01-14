// 视频控件
export default {
    data() {
        return {
            oWebControl: null, // 插件对象
            bIE: (!!window.ActiveXObject || 'ActiveXObject' in window), // 是否为IE浏览器
            pubKey: '112',
            iLastCoverLeft: 0,
            iLastCoverTop: 0,
            iLastCoverRight: 0,
            iLastCoverBottom: 0,
            initCount: 0,

            appkey: '1212',
            secret: '1222',
            ip: '192.168.0.1',
            playMode: 0,
            port: '80',
            snapDir: 'd',
            layout: '2*2',
            encryptedFields: 'secret'
        }
    },
    methods: {
        // 设置窗口遮挡
        setWndCover() {
debugger
            this.oWebControl.JS_Resize(600, 400); this.oWebControl.JS_Resize(600, 400);
            var iWidth = window.innerWidth;
            var iHeight = window.innerHeight;
            var oDivRect = this.$refs.video_div.getBoundingClientRect();

            var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left): 0;
            var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top): 0;
            var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
            var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

            iCoverLeft = (iCoverLeft > 600) ? 600 : iCoverLeft;
            iCoverTop = (iCoverTop > 400) ? 400 : iCoverTop;
            iCoverRight = (iCoverRight > 600) ? 600 : iCoverRight;
            iCoverBottom = (iCoverBottom > 400) ? 400 : iCoverBottom;

            if (this.iLastCoverLeft !== iCoverLeft) {
                console.log("iCoverLeft: " + iCoverLeft);
                this.iLastCoverLeft = iCoverLeft;
                this.oWebControl.JS_SetWndCover("left", iCoverLeft);
            }
            if (this.iLastCoverTop !== iCoverTop) {
                console.log("iCoverTop: " + iCoverTop);
                this.iLastCoverTop = iCoverTop;
                this.oWebControl.JS_SetWndCover("top", iCoverTop);
            }
            if (this.iLastCoverRight !== iCoverRight) {
                console.log("iCoverRight: " + iCoverRight);
                this.iLastCoverRight = iCoverRight;
                this.oWebControl.JS_SetWndCover("right", iCoverRight);
            }
            if (this.iLastCoverBottom !== iCoverBottom) {
                console.log("iCoverBottom: " + iCoverBottom);
                this.iLastCoverBottom = iCoverBottom;
                this.oWebControl.JS_SetWndCover("bottom", iCoverBottom);
            }
        },
        // 初始化插件
        initPlugin() {

            this.oWebControl = new WebControl({
                szPluginContainer: "video_div",
                iServicePortStart: 15900,
                iServicePortEnd: 15909,
                cbConnectSuccess: () => {
                    this.setCallbacks();
                    this.oWebControl.JS_StartService("window", {
                        dllPath: "./VideoPluginConnect.dll"
                        //dllPath: "./DllForTest-Win32.dll"
                    }).then(() => {
                        this.oWebControl.JS_CreateWnd("video_div", 600, 400).then(() => {
                            console.log("JS_CreateWnd success");
                            this.init();

                            // this.setWndCover();
                        });
                    }, function () {

                    });
                },
                cbConnectError: () => {
                    console.log("cbConnectError");
                    this.oWebControl = null;
                    console.log("插件未启动，正在尝试启动，请稍候...");
                    WebControl.JS_WakeUp("VideoWebPlugin://");
                    this.initCount ++;
                    if (this.initCount < 3) {
                        setTimeout(() => {
                            this.initPlugin();
                        }, 3000)
                    } else {
                        console.log("插件启动失败，请检查插件是否安装！");
                    }
                },
                cbConnectClose: () => {
                    console.log("cbConnectClose");
                    this.oWebControl = null;
                }
            });
        },

        init() {
            this.getPubKey(
                () => {
                    this.oWebControl.JS_RequestInterface({
                        funcName: "init",
                        argument: JSON.stringify({
                            appkey: this.appkey,
                            secret: this.setEncrypt(this.secret),
                            ip: this.ip,
                            playMode: 0, // 预览
                            port: this.port,
                            snapDir: this.snapDir,
                            layout: this.layout,
                            encryptedFields: this.encryptedFields
                        })
                    }).then((oData) => {
                        this.showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
                    }).catch((e) => {

                    })
                }
            );
        },

        // 获取公钥
        getPubKey (callback) {
            this.oWebControl.JS_RequestInterface({
                funcName: "getRSAPubKey",
                argument: JSON.stringify({
                    keyLength: 1024
                })
            }).then((oData) => {
                console.log(oData)
                if (oData.responseMsg.data) {
                    this.pubKey = oData.responseMsg.data;
                    callback();
                }
            })
        },

        // 设置窗口控制回调
        setCallbacks() {
            this.oWebControl.JS_SetWindowControlCallback({
                cbIntegrationCallBack: this.cbIntegrationCallBack
            });
        },
        // 推送消息
        cbIntegrationCallBack(oData) {
            this.showCBInfo(JSON.stringify(oData.responseMsg));
        },
        // RSA加密
        setEncrypt (value) {
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(this.pubKey);
            return encrypt.encrypt(value);
        },
        // 显示回调信息
        showCBInfo(szInfo, type) {
            if (type === 'error') {
                szInfo = "<div style='color: red;'>" + this.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
            } else {
                szInfo = "<div>" + this.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
            }
            console.log(szInfo);
        },
        // 格式化时间
        dateFormat(oDate, fmt) {
            var o = {
                "M+": oDate.getMonth() + 1, //月份
                "d+": oDate.getDate(), //日
                "h+": oDate.getHours(), //小时
                "m+": oDate.getMinutes(), //分
                "s+": oDate.getSeconds(), //秒
                "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
                "S": oDate.getMilliseconds()//毫秒
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        },

        destroyWnd() {
            this.initCount = 0;
            this.oWebControl.JS_RequestInterface({
                funcName: "destroyWnd"
            }).then(function (oData) {
                this.showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
            });
        }
    }
}
