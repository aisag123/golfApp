      const API_KEY = "AIzaSyBFZGBYyxfoOy7RTtfog3jRz6PC4mrkpn8";
      let map;
      let holesData;
      let marker;
      ip = "192.168.4.185"

      async function initMap() {
        // Fetch known holes
        const response = await fetch("http://" + ip + ":8000/known-holes");
        holesData = await response.json();
        // const holeLocation = holesData["edgewood"]; //hard code edgewood for now, will need to be dynamic later

        const searchLat = localStorage.getItem('courseLat');
        const searchLon = localStorage.getItem('courseLon');

        const lat = searchLat ? parseFloat(searchLat) : 46.92346068794036;
        const lon = searchLon ? parseFloat(searchLon) : -96.78736246872069;

        map = L.map("map").setView([lat, lon], 19);

        // Initialize tiles
        try {
          const tileResponse = await fetch(
            `https://tile.googleapis.com/v1/createSession?key=${API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mapType: "satellite",
                language: "en-US",
                region: "US",
              }),
            },
          );

          const data = await tileResponse.json();
          const session = data.session;

          L.tileLayer(
            `https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${session}&key=${API_KEY}`,
            {
              attribution: "&copy; Google",
              maxZoom: 22,
            },
          ).addTo(map);

          const customIcon = L.icon({
            iconUrl: 'images/map-marker-circle-32.png',
            iconSize: [40, 40],      // size of the icon
            iconAnchor: [20, 40],    // point of the icon which corresponds to marker's location
            popupAnchor: [1, -34],   // point from which the popup should open relative to the iconAnchor
        });

          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lon = e.latlng.lng;
            // console.log("lat lon click on map: " + lat + ", " + lon);
            
            // if (marker) {
            //     map.removeLayer(marker);
            // }
            
            marker = L.marker([lat, lon], {icon: customIcon}).addTo(map);

            startCoordinate = L.latLng(46.92850874321839, -96.76737036168598); //default for testing
            endCoordinate = L.latLng(lat, lon); //last click

            var distanceyards = startCoordinate.distanceTo(endCoordinate);
                console.log(distanceyards * 1.09361+ "yards"); // distance from 1 tee yards

            startcoord2 = L.latLng(lat, lon);
            const hole1 = holesData["edgewood"]["hole1"]; //need to add the green on this 
            endcoord2 = L.latLng(hole1["green"].lat, hole1["green"].lon);

            var distanceToHole = startcoord2.distanceTo(endcoord2);
                console.log("distance to hole 1: " + distanceToHole * 1.09361); //yards
            });

        } catch (error) {
          console.error("Error creating session:", error);
          // Fallback to basic Google tiles
          L.tileLayer("https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
            attribution: "&copy; Google",
            maxZoom: 22,
          }).addTo(map);
        }
      }

      function moveToHole(holeNumber) {
        if (!holesData || !map) return;
        const hole = holesData["edgewood"][`hole${holeNumber}`];
        if (hole) {
          map.setView([hole.lat, hole.lon], 19);
        }
      }

      async function searchCourse(courseName) { //used for start round button
        const apiKey = "7N4KAYZLE5FZBSAEMPYUJJCWDI";

        const response = await fetch(
          `https://api.golfcourseapi.com/v1/search?search_query=${courseName}`,
          {
            headers: {
              Authorization: `Key ${apiKey}`,
            },
          },
        );

        const data = await response.json();
        getLatLon(data);
        console.log(data);
        return data;
      }

      function getLatLon(courseData) {
        course = courseData["courses"][0];

        lat = course["location"]["latitude"];
        lon = course["location"]["longitude"];

        localStorage.setItem('courseLat', lat) //store local use when map is made
        localStorage.setItem('courseLon', lon) //store local use when map is made
        window.location.href = 'map.html';
      }
