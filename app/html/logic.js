      const API_KEY = "AIzaSyBFZGBYyxfoOy7RTtfog3jRz6PC4mrkpn8";
      let map;
      let holesData;
      let marker;
      ip = "192.168.4.185"
      let HN;
      

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
            getDistanceFromTee(holesData, lat, lon)
            getDistanceFromGreen(holesData, lat, lon)
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
        HN = holeNumber;
        var hole = holesData["edgewood"][holeNumber];
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
