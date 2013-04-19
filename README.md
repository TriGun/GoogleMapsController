GoogleMapsController
====================

Simple works with GoogleMapsAPI v3
<pre>
1. 
http://maps.google.com/maps/api/js?sensor=true"

2.
div id="map_canvas"
span id="address-my-marker"

3.
$(function()
{
    var addresses = [
    'Украина Донецк Артема 1',
    'Украина Донецк Артема 5',
    'Украина Донецк Артема 10',
    'Украина Донецк Артема 15'
    ];

    // инициализация карты
    gmap = new googleMapsController('map_canvas', 1000, 400);

    // добавить маркер на карту
    myMarker = gmap.addMarker([48.012, 37.801], true);

    // добавить несколько маркеров
    gmap.addMarkersByAddressArray(addresses, true);

    // получить адресс при перетаскивании маркера
    gmap.addListenerMarkerDrag(myMarker, function(event){ gmap.getAddressByMarker(myMarker, function(result){ $('#address-my-marker').text(result.formatted_address); }); });


});

</pre>
