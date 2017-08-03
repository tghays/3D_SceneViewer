require([
  "esri/WebScene",
  "esri/Map",
  "esri/views/SceneView",
  "esri/views/MapView",
  "esri/core/watchUtils",
  "esri/Camera",
  "esri/geometry/Point",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/Graphic",
  "esri/layers/FeatureLayer",
  "esri/widgets/ScaleBar",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/WebStyleSymbol",
  "esri/geometry/support/webMercatorUtils",
  "esri/symbols/ObjectSymbol3DLayer",
  "esri/symbols/PointSymbol3D",
  "dojo/dom",
  "dojo/promise/all",
  "dojo/domReady!"
], function(WebScene, Map, SceneView, MapView, watchUtils, Camera, Point, SimpleMarkerSymbol, Graphic, FeatureLayer, ScaleBar, SimpleRenderer, WebStyleSymbol, webMercatorUtils, ObjectSymbol3DLayer, PointSymbol3D, dom, all) {

  var places = {
  1:{"x":-8985160.937021244,"y":4207401.776022396,"z":700,"tilt":81,"heading":275},
  2:{"x":-8986867.353495613,"y":4207604.514404436,"z":220,"tilt":80,"heading":240},
  3:{"x":-8986976.336293917,"y":4207342.564019693,"z":225,"tilt":80.47,"heading":275},
  4:{"x":-8987389.977628019,"y":4207238.728278064,"z":235.29,"tilt":80.47,"heading":265},
  5:{"x":-8987853.941192137,"y":4207155.394862805,"z":238.48,"tilt":79.72,"heading":280},
  6:{"x":-8988244.239736613,"y":4207209.645406181,"z":226.18,"tilt":81.98,"heading":280},
  7:{"x":-8988642.838718537,"y":4207241.737803696,"z":225.22,"tilt":82.17,"heading":285},
  8:{"x":-8988770.933101643,"y":4207407.381117213,"z":297.515,"tilt":72.16,"heading":270},
  9:{"x":-8989431.653813468,"y":4207324.791981454,"z":272.61,"tilt":79.528,"heading":300},
  10:{"x":-8989841.316023264,"y":4207532.811620011,"z":250.66,"tilt":82.579,"heading":340},
  11:{"x":-8989885.613015525,"y":4207772.273333477,"z":269.064,"tilt":78.48,"heading":300},
  12:{"x":-8990709.7764086,"y":4208234.401295501,"z":266.13,"tilt":80.11,"heading":275},
  13:{"x":-8991766.177417649,"y":4208333.128645202,"z":250.624,"tilt":78.281,"heading":265},
  14:{"x":-8992139.70977222,"y":4208152.671462494,"z":257.85,"tilt":83.731,"heading":270},
  15:{"x":-8992568.38593483,"y":4208192.989015136,"z":257.0821,"tilt":79.956,"heading":275},
  16:{"x":-8992761.170656282,"y":4207925.132832274,"z":353.49,"tilt":57.825,"heading":345},
  };

  placesLength = Object.keys(places).length;

  var placesIndex = 0;

  var scene = new WebScene({
    portalItem: { // autocasts as new PortalItem()
      id: "53cabee535c3424f88e1cb3fce3b7abd"
    }
  });

  //create overviewmap object
  var overviewMap = new Map({
     basemap: "topo"
  });

  var mainView = new SceneView({
    map: scene,
    container: "viewDiv",
    padding: {
      top: 40
    }
  });

  //create map view object with overviewmap
  var mapView = new MapView({
    container: "overviewDiv",
    map: overviewMap,
    constraints: {
      rotationEnabled: false
    }
  });

  // Remove the default widgets
  mapView.ui.components = [];

  var pointSymbol = new SimpleMarkerSymbol({
    color: "red",
    size: 12,
    style: "circle",
    outline: { // autocasts as new SimpleLineSymbol()
      color: ["black"],
      width: 1
    }
  });

  var extentDiv = dom.byId("extentDiv");

  mainView.then(function() {
    // when the scene and view resolve, display the scene's
    // title in the DOM
    var title = scene.portalItem.title;
    titleDiv.innerHTML = title;
  });

  place_scene = places[placesIndex];
  var counter = dom.byId("counter");

  var scalebar = new ScaleBar({
    view: mainView
  });

  mainView.ui.add(scalebar, {
    position: "bottom-left"
  });


  var featLayer = new FeatureLayer({
    url: "https://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/Scene_Pictures/FeatureServer/1",
    popupTemplate: {
      title: "Greenway Point {q}",
      content: [{
        type:"media",
        mediaInfos: [{
          type: "image",
          value: {
            sourceURL: "{URL_edit}"
          }
        }]
      }]
    },
    outFields: ["*"]
  });

  var refSymbol = new PointSymbol3D({
    symbolLayers: [new ObjectSymbol3DLayer({
      width: 5,  // diameter of the object from east to west in meters
      height: 20,  // height of the object in meters
      depth: 15,  // diameter of the object from north to south in meters
      resource: { primitive: "inverted-cone" },
      material: { color: "red" }
    })]
  });

  var refRenderer = new SimpleRenderer({
    symbol: refSymbol
  });
  featLayer.renderer = refRenderer;

  scene.add(featLayer);

  mainView.then(function() {
    mainView.popup.dockEnabled = true;
    mainView.popup.dockOptions = {
      buttonEnabled: false,
      breakpoint: {
        width: 1000,
        height: 1000
      }
    };
  });

  $("#forward_button").click(animateRoute_forward);
  function animateRoute_forward() {

    if (placesIndex < placesLength) {
      mainView.popup.close();
      placesIndex++;
      //get the location of interest
      var place_scene = places[placesIndex];
      //create a new map point
      point = new Point({
        x: place_scene.x,
        y: place_scene.y,
        z: place_scene.z,
        spatialReference: 102100
      });

      //create a new camera object
      var camera = new Camera({
        position: point,
        tilt: place_scene.tilt,
        heading: place_scene.heading,
        fov: 100
      });

      //set the view to the location of the new camera
      mainView.goTo(camera, {speedFactor: 0.2, easing: "out-quint"});
      console.log("View Point: " + placesIndex);
      counter_div.innerHTML = "View Point: " + placesIndex;
      console.log("x: " + camera.position.x + ", y: " + camera.position.y + ", z: " + camera.position.z);
    } else {
    console.log("View Point: " + placesIndex);
    }
  }


  $("#back_button").click(animateRoute_back);
  function animateRoute_back() {
    mainView.popup.close();
    if (placesIndex > 1) {
      placesIndex--;
      //get the location of interest
      var place_scene = places[placesIndex];
      //create a new map point
      point = new Point({
        x: place_scene.x,
        y: place_scene.y,
        z: place_scene.z,
        spatialReference: 102100
      });

      //create a new camera object
      var camera = new Camera({
        position: point,
        tilt: place_scene.tilt,
        heading: place_scene.heading,
        fov: 100
      });

      //set the view to the location of the new camera
      mainView.goTo(camera, {speedFactor: 0.2, easing: "out-quint"});
      console.log("View Point: " + placesIndex);
      counter_div.innerHTML = "View Point: " + placesIndex;

    } else {
    console.log("View Point: " + placesIndex);
    }
  }

  // OVERVIEW MAP
  //update location of camera point in mapView
  function updatePoint() {
    mapView.graphics.removeAll();
    //create a new map point
    var mapPoint = new Point({
      x: mainView.center.x,
      y: mainView.center.y,
      z: mainView.center.z,
      spatialReference: 102100
    });

     pointGraphic = new Graphic({
      geometry: mapPoint,
      symbol: pointSymbol,
    });

    mapView.graphics.add(pointGraphic);
  }

  //update overview map function
  mapView.then(function() {
    // Update the overview extent whenever the MapView or SceneView extent changes
    mainView.watch("extent", updateOverviewExtent);
    mapView.watch("extent", updateOverviewExtent);
    mainView.watch("viewpoint", updatePoint);
    mainView.watch("extent", updateOverview);



    // Update the minimap overview when the main view becomes stationary
    //watchUtils.when(mainView, "stationary", updateOverview);

    function updateOverview() {
      // Animate the MapView to a zoomed-out scale so we get a nice overview.
      // We use the "progress" callback of the goTo promise to update
      // the overview extent while animating
      mapView.goTo({
        center: mainView.center,
        scale: mainView.scale * 2 * Math.max(mainView.width /
          mapView.width,
          mainView.height / mapView.height)
      });

      //console.log(webMercatorUtils.canProject(mainView.center));
      console.log("x: " + mainView.camera.position.x + ", y: " + mainView.camera.position.y + ", z: " + mainView.camera.position.z);
      console.log("tilt: " + mainView.camera.tilt, + "heading: " + mainView.camera.heading);
    }

    function updateOverviewExtent() {
      // Update the overview extent by converting the SceneView extent to the
      // MapView screen coordinates and updating the extentDiv position.
      var extent = mainView.extent;

      var bottomLeft = mapView.toScreen(extent.xmin, extent.ymin);
      var topRight = mapView.toScreen(extent.xmax, extent.ymax);

      extentDiv.style.top = topRight.y + "px";
      extentDiv.style.left = bottomLeft.x + "px";

      extentDiv.style.height = (bottomLeft.y - topRight.y) + "px";
      extentDiv.style.width = (topRight.x - bottomLeft.x) + "px";
    }
  });

});
