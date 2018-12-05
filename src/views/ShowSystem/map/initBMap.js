
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
        "featureType": "land",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#071a3aff"
        }
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#1b181be6"
        }
    }, {
        "featureType": "green",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#0e1b30ff"
        }
    }, {
        "featureType": "building",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "building",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#0f264cb3"
        }
    }, {
        "featureType": "building",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#377bb2b3"
        }
    }, {
        "featureType": "subwaystation",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "color": "#b15454B2"
        }
    }, {
        "featureType": "education",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "color": "#e4f1f1ff"
        }
    }, {
        "featureType": "medical",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#f0dedeff"
        }
    }, {
        "featureType": "scenicspots",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "color": "#12223dff"
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "weight": 4
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#f7c54dff"
        }
    }, {
        "featureType": "highway",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#fed669ff"
        }
    }, {
        "featureType": "highway",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "highway",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#8f5a33ff"
        }
    }, {
        "featureType": "highway",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "highway",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "arterial",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "weight": 2
        }
    }, {
        "featureType": "arterial",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#d8d8d8ff"
        }
    }, {
        "featureType": "arterial",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#ffeebbff"
        }
    }, {
        "featureType": "arterial",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "arterial",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#525355ff"
        }
    }, {
        "featureType": "arterial",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "local",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "weight": 1
        }
    }, {
        "featureType": "local",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#d8d8d8ff"
        }
    }, {
        "featureType": "local",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "local",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "local",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#979c9aff"
        }
    }, {
        "featureType": "local",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "railway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "weight": 1
        }
    }, {
        "featureType": "railway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#123c52ff"
        }
    }, {
        "featureType": "railway",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#12223dff"
        }
    }, {
        "featureType": "subway",
        "elementType": "geometry",
        "stylers": {
            "visibility": "off",
            "weight": 1
        }
    }, {
        "featureType": "subway",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#d8d8d8ff"
        }
    }, {
        "featureType": "subway",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#ffffff00"
        }
    }, {
        "featureType": "subway",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "subway",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#979c9aff"
        }
    }, {
        "featureType": "subway",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "continent",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "continent",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "continent",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#333333ff"
        }
    }, {
        "featureType": "continent",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "city",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "city",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "city",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#454d50ff"
        }
    }, {
        "featureType": "city",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "town",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "town",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "town",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#454d50ff"
        }
    }, {
        "featureType": "town",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": {
            "color": "#044590ff"
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "districtlabel",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": {
            "visibility": "on",
            "weight": 2
        }
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": {
            "color": "#044590ff"
        }
    }, {
        "featureType": "district",
        "elementType": "labels",
        "stylers": {
            "visibility": "on"
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#158ad7ff"
        }
    }, {
        "featureType": "poilabel",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffff00"
        }
    }, {
        "featureType": "manmade",
        "elementType": "geometry",
        "stylers": {
            "color": "#0f264cff"
        }
    }, {
        "featureType": "districtlabel",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "entertainment",
        "elementType": "geometry",
        "stylers": {
            "color": "#12223dff"
        }
    }, {
        "featureType": "shopping",
        "elementType": "geometry",
        "stylers": {
            "color": "#12223dff"
        }
    }, {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "districtlabel",
        "elementType": "labels.icon",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "districtlabel",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#ffffffff"
        }
    }, {
        "featureType": "country",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "village",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }, {
        "featureType": "estate",
        "elementType": "geometry",
        "stylers": {
            "color": "#12223dff"
        }
    }];
    Map.setMapStyleV2({
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