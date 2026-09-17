
/* =========================================================
   TANDARA — MIGRATION MAP ENGINE

   Zajednički Leaflet engine za:
   - migracije-hr.html
   - migracije-en.html

   Ovaj file NE sadrži:
   - HR / EN tekstove
   - koordinate projekta
   - popup sadržaj
   - podatke tablica

   Svi lokalni podaci ostaju u PUBLIC HTML konfiguraciji.
   ========================================================= */

(() => {
  "use strict";

  const DEFAULT_TILES =
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

  const DEFAULT_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function createMap(mapConfig) {
    if (!window.L || !mapConfig) return null;

    const element = document.getElementById(mapConfig.id);
    if (!element) return null;

    const map = L.map(element).setView(mapConfig.center, mapConfig.zoom);

    L.tileLayer(mapConfig.tiles || DEFAULT_TILES, {
      attribution: mapConfig.attribution || DEFAULT_ATTRIBUTION
    }).addTo(map);

    return map;
  }

  function createMarker(markerConfig) {
    if (!window.L || !markerConfig) return null;

    let coordinates;
    let popup = null;
    let tooltip = null;

    if (Array.isArray(markerConfig)) {
      coordinates = [markerConfig[0], markerConfig[1]];
      popup = markerConfig[2] ?? null;
    } else {
      coordinates = markerConfig.coordinates || markerConfig.coords || null;
      popup = markerConfig.popup ?? null;
      tooltip = markerConfig.tooltip || null;
    }

    if (!Array.isArray(coordinates) || coordinates.length < 2) return null;

    const marker = L.marker(coordinates);

    if (popup !== null && popup !== undefined) {
      marker.bindPopup(popup);
    }

    if (tooltip) {
      if (typeof tooltip === "string") {
        marker.bindTooltip(tooltip);
      } else if (tooltip.content !== undefined) {
        marker.bindTooltip(
          tooltip.content,
          tooltip.options || {}
        );
      }
    }

    return marker;
  }

  function addMarkers(map, markerConfigs) {
    if (!map || !Array.isArray(markerConfigs)) return [];

    const markers = markerConfigs
      .map(createMarker)
      .filter(Boolean);

    markers.forEach((marker) => marker.addTo(map));

    return markers;
  }

  function fitMarkers(map, markers, padding) {
    if (
      !map ||
      !Array.isArray(markers) ||
      markers.length === 0 ||
      padding === undefined ||
      padding === null
    ) {
      return;
    }

    const group = L.featureGroup(markers);

    map.fitBounds(
      group.getBounds().pad(padding)
    );
  }

  function initMap(mapConfig) {
    const map = createMap(mapConfig);

    if (!map) return null;

    const markers =
      addMarkers(
        map,
        mapConfig.markers || []
      );

    fitMarkers(
      map,
      markers,
      mapConfig.fitBoundsPadding
    );

    return map;
  }

  function init(config) {
    if (
      !window.L ||
      !config ||
      !Array.isArray(config.maps)
    ) {
      return {};
    }

    const maps = {};

    config.maps.forEach((mapConfig) => {
      if (!mapConfig || !mapConfig.id) return;

      const map = initMap(mapConfig);

      if (!map) return;

      maps[mapConfig.key || mapConfig.id] = map;
    });

    return maps;
  }

  window.TandaraMigrationMap =
    Object.freeze({
      init
    });

  if (window.TandaraMigrationConfig) {
    init(window.TandaraMigrationConfig);
  }
})();
