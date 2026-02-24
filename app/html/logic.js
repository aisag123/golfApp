const API_KEY = "AIzaSyBFZGBYyxfoOy7RTtfog3jRz6PC4mrkpn8";
      let map;
      let holesData;
      let marker; //var for current location marker
      let dot;
      let green; //var for green marker

      let HN = "hole1"; //global hole number variable to be used in distance funcstions
      // let holemarker; // declare globally so it can be accessed in multiple functions
      let flag; // declare globally so it can be accessed in multiple functions

      var shots = [];

      async function initMap() {
        // Fetch known holes
        const response = await fetch("https://golfapp-fv7m.onrender.com/known-holes");
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

          navigator.geolocation.watchPosition(
            function(position) {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
                // Use lat and lon as needed
                L.marker([lat, lon], {icon: dot}).addTo(map);
                map.setView([lat, lon], 19); //pulls map to current location
                getDistanceFromTee(holesData, lat, lon)
                getDistanceFromGreen(holesData, lat, lon)
              },
            function(error) {
              console.error("Error getting location:", error);
            }
          );



          const customIcon = L.icon({
            iconUrl: 'images/map-marker-circle-32.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40], 
            popupAnchor: [1, -40], 
          });

          const dot = L.icon({
            iconUrl: "/static/images/dot.png", // Replace with the path to your hole marker image
            iconSize: [40, 40],      // size of the icon
            iconAnchor: [20, 40],    // bottom center of the icon
            popupAnchor: [0, -50],   // popup above the marker
          });

          flag = L.icon({
            iconUrl: "images/flag.png",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50],
          });

          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lon = e.latlng.lng;
            // console.log("lat lon click on map: " + lat + ", " + lon);
            
            // if (marker) {
            //     map.removeLayer(marker);
            // }
            
            // marker = L.marker([lat, lon], {icon: customIcon}).addTo(map);
            // getDistanceFromTee(holesData, lat, lon)
            // getDistanceFromGreen(holesData, lat, lon)
          });

          // tee = L.marker([holesData["edgewood"][HN].lat, holesData["edgewood"][HN].lon], {icon: holemarker}).addTo(map);
          // green = L.marker([holesData["edgewood"][HN]["green"].lat, holesData["edgewood"][HN]["green"].lon], {icon: flag}).addTo(map);

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
        HN = holeNumber;
        console.log(HN);
        var hole = holesData["edgewood"][holeNumber];
        if (hole) {
          // if (tee ) {
          //   map.removeLayer(tee);
          // }
          // tee = L.marker([hole.lat, hole.lon], {icon: holemarker}).addTo(map);
          if (green) {
            map.removeLayer(green);
          }
          green = L.marker([hole["green"].lat, hole["green"].lon], {icon: flag}).addTo(map);
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

      function getLatLon(courseData) { //start round button stores local starting points
        course = courseData["courses"][0];

        lat = course["location"]["latitude"];
        lon = course["location"]["longitude"];

        localStorage.setItem('courseLat', lat) //store local use when map is made
        localStorage.setItem('courseLon', lon) //store local use when map is made
        window.location.href = 'map.html';
      }

      function getDistanceFromTee(holesData, latC, lonC) {
        var course = holesData["edgewood"]; //hard coded edgewood here
        var courseHole = course[HN]; //grabs from global
        var startCoordinate = L.latLng(courseHole.lat, courseHole.lon) //test
        var endCoordinate = L.latLng(latC, lonC); //last click
          var distanceMeters = startCoordinate.distanceTo(endCoordinate);
          var distanceyards = (distanceMeters * 1.09361).toFixed(0);
            document.getElementById("distanceFromHole").textContent = distanceyards;
            console.log(distanceyards);
      }

      function getDistanceFromGreen(holesData, latC, lonC) {
        var course = holesData["edgewood"]; //hard coded edgewood here
        var courseGreen = course[HN]["green"]; //grabs from global
        var startCoordinate = L.latLng(latC, lonC);
        var endCoordinate = L.latLng(courseGreen.lat, courseGreen.lon);
          var distanceToHoleMeters = startCoordinate.distanceTo(endCoordinate);
          var distanceToHoleYards = (distanceToHoleMeters * 1.09361).toFixed(0);
            document.getElementById("distanceToHole").textContent = distanceToHoleYards;
            console.log(distanceToHoleYards);
      }

      function storeShotData(distance, club, hole) {
        // Find the number of shots already taken for this hole
        const shotNum = shots.filter(s => s.hole === hole).length + 1;
        shots.push({
          hole,
          shotNum,
          distance,
          club
        });
      }
