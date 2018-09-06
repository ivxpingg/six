
let setMap = (domId) => {
    let map = new BMap.Map(domId, {enableMapClick:false, minZoom:8,maxZoom:18});    // 创建Map实例,关闭底图可点功能
    map.centerAndZoom(new BMap.Point(116.50629,31.722534), 12);  // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

    setMapStyle(map);
    return map;
};
/**
 * 设置百度地图样式
 * @param Map
 */
let setMapStyle = (Map) => {
    var styleJson = [{
        "featureType": "water",
        "elementType": "all",
        "stylers": {
            "color": "#021019"
        }
    },
        {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#147a92"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#0b3d51"
            }
        },
        {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": "#08304b"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#08304b"
            }
        },
        {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "lightness": -70
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#857f7f"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#000000"
            }
        },
        {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "color": "#022338"
            }
        },
        {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "color": "#062032"
            }
        },
        {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": "#1e1c1c"
            }
        },
        {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#022338"
            }
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        },
        {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#2da0c6",
                "visibility": "on"
            }
        }
    ];
    Map.setMapStyle({
        styleJson: styleJson
    });
};

let mapLoadedCompleted = () => {
    return new Promise(resolve => {
        if (typeof BMap !== 'undefined') { resolve(1); }
        else {
            let timer = setInterval(function () {
                if (typeof BMap !== 'undefined') {
                    clearInterval(timer);
                    resolve(1);
                }
            }, 50);
        }
    });
}

/**
 * 初始化百度地图，返回百度地图对象
 * @param domId [String] 百度地图元素的ID
 * @return Object  map
 */
let initMap = (domId) => {
    return mapLoadedCompleted().then(function () {
        return setMap(domId);
    });
};

export default initMap;