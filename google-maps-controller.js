/**
 * User: trigalex
 */

/*Object.prototype.log = function()
{
    console.log(this);
}*/

var googleMapsController = (function()
{

    /* DOM */
    var _container;
    var _width;
    var _height;

    /* Google Map API */
    var _options;
    var _map;
    var _geocoder;
    var _geolocation;

    /* help */
    var _mapPositionByAddress;
    var _markers;

    /* constructor */
    function googleMapsController(container, width, height)
    {
        this._container = container;
        this._width = width || 600;
        this._height = height || 300;

        this._markers = [];

        this._options =
        {
            zoom: 12,
            center: new google.maps.LatLng(48.015883, 37.802850),
            panControl: false,
            zoomControl: false,
            zoomControlOptions: {style: google.maps.ZoomControlStyle.LARGE},
            mapTypeControl: true,
            scaleControl: false,
            streetViewControl: false,
            overviewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.init();
    };

    /* init */
    googleMapsController.prototype.init = function()
    {
        $('#' + this._container).css('width', this._width);
        $('#' + this._container).css('height', this._height);

        this._map =  new google.maps.Map(document.getElementById(this._container), this._options);

        if(this._markers.length > 0)
            for(var i in this._markers)
                this.addMarker(this._markers[i]);
    }

    /* addMarkerByMapPosition */
    googleMapsController.prototype.addMarkerByMapPosition = function(position, draggable)
    {

        var marker = new google.maps.Marker({
            position: position,
            draggable: draggable || false,
            map: this._map,
            title: "",
            animation: google.maps.Animation.DROP
        });

        this._markers.push(marker);
        return marker;
    }

    /* addMarker */
    googleMapsController.prototype.addMarker = function(marker)
    {
        return marker.setMap(this._map);
    }

    /* addMarkerByPoint */
    googleMapsController.prototype.addMarkerByPoint = function(point, draggable)
    {
        var position =  new google.maps.LatLng(point[0], point[1]);
        return this.addMarkerByMapPosition(position, draggable || false);
    }

    /* addMarkerByAddress */
    googleMapsController.prototype.addMarkerByAddress = function(address, draggable)
    {
        this.getMapPositionByAddress(address, function(position){ this.addMarkerByMapPosition(position, draggable || false); }, this);
    }

    /* addMarkersByAddressArray */
    googleMapsController.prototype.addMarkersByAddressArray = function(addresses, draggable)
    {
        for(var i in addresses)
            this.addMarkerByAddress(addresses[i], draggable || false);
    }

    /* getMapPositionByAddress */
    googleMapsController.prototype.getMapPositionByAddress = function(address, callback, obj)
    {
        obj = obj || this;

        if(this._geocoder == undefined) this._geocoder = new google.maps.Geocoder();

        this._geocoder.geocode(
            {'address' : address},
            function(results, status)
            {
                if (status == google.maps.GeocoderStatus.OK)
                {
                    callback.call(obj, results[0].geometry.location);
                }
                else
                {
                    console.log('googleMapsController [error] '  + status);
                    setTimeout(this.getMapPositionByAddress(results[0].formatted_address), 1000);
                }
            });
    }

    /* getAddressByMapPosition */
    googleMapsController.prototype.getAddressByMapPosition = function(position, callback, obj)
    {

        if(this._geocoder == undefined) this._geocoder = new google.maps.Geocoder();

        this._geocoder.geocode(
            {'latLng' : position},
            function(results, status){
                if (status == google.maps.GeocoderStatus.OK)
                {
                    callback.call(obj, results[0]);
                }
                else
                {
                    console.log('googleMapsController [error] '  + status);
                }
            });
    }

    /* getAddressByMarker */
    googleMapsController.prototype.getAddressByMarker = function(marker, callback)
    {
        this.getAddressByMapPosition(marker.position, callback, this);
    }

    /* addListenerMarkerDrag */
    googleMapsController.prototype.addListenerMarkerDrag = function(marker, callback)
    {
        //google.maps.event.addListener(marker, 'dragend', callback);
        this.addMarkerEvent(marker, 'dragend', callback);
    }

    /* addListenerMarkerDragAndGetAddress */
    googleMapsController.prototype.addListenerMarkerDragAndGetAddress = function(marker, callback)
    {
        this.addListenerMarkerDrag(marker, function(event){ this.getAddressByMarker(marker, callback) });
    }

    /* deleteMarker */
    googleMapsController.prototype.deleteMarker = function(marker)
    {
        marker.setMap(null);
        marker.visible(false);
    }

    /* getLastMarker */
    googleMapsController.prototype.getLastMarker = function()
    {
        return this._markers[this._markers.length - 1];
    }

    /* centerToMarker */
    googleMapsController.prototype.centerToMarker = function(marker)
    {
        return this._map.panTo(marker.position);
    }

    /* addMapEvent */
    googleMapsController.prototype.addMapEvent = function(event, callback)
    {
        google.maps.event.addListener(this._map, event, callback);
    }

    /* addMarkerEvent */
    googleMapsController.prototype.addMarkerEvent = function(marker, event, callback)
    {
        google.maps.event.addListener(marker, event, callback);
    }

    return googleMapsController;

})();
