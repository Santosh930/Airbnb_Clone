

  
  mapboxgl.accessToken = mapToken;

     const map = new mapboxgl.Map({
         container: 'map', // container ID
         center: coordinates, // starting position Delhi [lng, lat]
         zoom: 9 // starting zoom
     });
    //  console.log(coordinates);
 

     // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color:'red'})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<h3>Welcome to Airbnb!</h3>"))
    .addTo(map);
