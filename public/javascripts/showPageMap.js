// https://docs.mapbox.com/mapbox-gl-js/guides/install/

mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: store.geometry.coordinates, // starting position [lng, lat]
    zoom: 14, // starting zoom
})

// https://docs.mapbox.com/mapbox-gl-js/example/navigation/
map.addControl(new mapboxgl.NavigationControl())

// https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/
const marker1 = new mapboxgl.Marker()
    .setLngLat(store.geometry.coordinates)
    // https://docs.mapbox.com/mapbox-gl-js/api/markers/#popup
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${store.title}</h3><p>${store.location}</p>`
        )
    )
    .addTo(map)