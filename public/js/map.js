
 
  
  mapboxgl.accessToken = mapToken;

     const map = new mapboxgl.Map({
         container: 'map', // container ID
         center: [77.1025, 28.7041], // starting position [lng, lat]
         zoom: 9 // starting zoom
     });
    //  console.log(coordinates);
 

     // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker()
    .setLngLat([12.554729, 55.70651])
    .addTo(map);
