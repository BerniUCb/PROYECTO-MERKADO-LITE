"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./RouteMap.module.css";

type Point = { lat: number; lng: number };

export type RouteStep = {
  instruction: string;
  distanceKm: number;
};

export type RiderStage = "PENDING_PICKUP" | "ON_THE_WAY";

type Props = {
  stage: RiderStage;

  store: Point;
  customer: Point;

  storeTitle?: string; // ej: "MERKADO LITE"
  customerTitle?: string; // ej: "Carlos Pérez"
  riderTitle?: string; // ej: "Tu ubicación"

  onRoute?: (data: {
    steps: RouteStep[];
    distanceKm: number;
    durationMin: number;
  }) => void;

  // para mostrar "GPS no disponible" en la página si quieres
  onGps?: (available: boolean) => void;
};

/* ============================= */
/* Helpers */
/* ============================= */
function createPin(label: string, title: string) {
  const el = document.createElement("div");
  el.className = styles.pinWrap;

  const halo = document.createElement("div");
  halo.className = styles.halo;

  const ring = document.createElement("div");
  ring.className = styles.ring;

  const dot = document.createElement("div");
  dot.className = styles.dot;
  ring.appendChild(dot);

  const bubble = document.createElement("div");
  bubble.className = styles.bubble;

  const iconPill = document.createElement("div");
  iconPill.className = styles.iconPill;

  const iconDot = document.createElement("div");
  iconDot.className = styles.iconDot;
  iconPill.appendChild(iconDot);

  const textWrap = document.createElement("div");
  textWrap.className = styles.textPad;

  const lbl = document.createElement("div");
  lbl.className = styles.label;
  lbl.textContent = label;

  const ttl = document.createElement("div");
  ttl.className = styles.title;
  ttl.textContent = title;

  textWrap.appendChild(lbl);
  textWrap.appendChild(ttl);

  bubble.appendChild(iconPill);
  bubble.appendChild(textWrap);

  el.appendChild(halo);
  el.appendChild(ring);
  el.appendChild(bubble);

  return el;
}

async function waitForStyle(map: mapboxgl.Map) {
  if (map.isStyleLoaded()) return;
  await new Promise<void>((resolve) => map.once("load", () => resolve()));
}

/* ============================= */
/* Component */
/* ============================= */
export default function RouteMap({
  stage,
  store,
  customer,
  storeTitle = "MERKADO LITE",
  customerTitle = "Cliente",
  riderTitle = "Tu ubicación",
  onRoute,
  onGps,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<mapboxgl.Map | null>(null);

  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // callbacks estables
  const onRouteRef = useRef<Props["onRoute"]>(onRoute);
  useEffect(() => {
    onRouteRef.current = onRoute;
  }, [onRoute]);

  const onGpsRef = useRef<Props["onGps"]>(onGps);
  useEffect(() => {
    onGpsRef.current = onGps;
  }, [onGps]);

  // GPS del rider (solo se usa en PENDING_PICKUP)
  const [riderPos, setRiderPos] = useState<Point | null>(null);
  const [gpsAvailable, setGpsAvailable] = useState(true);

  /* ============================= */
  /* GPS watch (solo etapa 1) */
  /* ============================= */
  useEffect(() => {
    if (stage !== "PENDING_PICKUP") return;

    if (!("geolocation" in navigator)) {
      setGpsAvailable(false);
      onGpsRef.current?.(false);
      return;
    }

    let cancelled = false;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (cancelled) return;

        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setRiderPos(next);

        // marcar gps ok si estaba en falso
        setGpsAvailable((prev) => {
          if (!prev) onGpsRef.current?.(true);
          return true;
        });
      },
      () => {
        if (cancelled) return;
        setGpsAvailable(false);
        onGpsRef.current?.(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5_000,
        timeout: 12_000,
      }
    );

    return () => {
      cancelled = true;
      navigator.geolocation.clearWatch(watchId);
    };
  }, [stage]);

  /* ============================= */
  /* Derivar origin/destination + labels */
  /* ============================= */
  const derived = useMemo(() => {
    if (stage === "PENDING_PICKUP") {
      const origin = riderPos ?? store; // fallback = tienda
      return {
        origin,
        destination: store,
        originLabel: "Rider",
        destinationLabel: "Tienda",
        originTitle: riderTitle,
        destinationTitle: storeTitle,
      };
    }

    return {
      origin: store,
      destination: customer,
      originLabel: "Tienda",
      destinationLabel: "Cliente",
      originTitle: storeTitle,
      destinationTitle: customerTitle,
    };
  }, [stage, riderPos, store, customer, riderTitle, storeTitle, customerTitle]);

  const { origin, destination, originLabel, destinationLabel, originTitle, destinationTitle } = derived;

  /* ============================= */
  /* Init map (ONCE) */
  /* ============================= */
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const container = mapContainerRef.current;
    if (!token || !container) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [store.lng, store.lat],
      zoom: 13,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    // markers iniciales
    originMarkerRef.current = new mapboxgl.Marker({
      element: createPin(originLabel, originTitle),
      anchor: "bottom",
    })
      .setLngLat([origin.lng, origin.lat])
      .addTo(map);

    destMarkerRef.current = new mapboxgl.Marker({
      element: createPin(destinationLabel, destinationTitle),
      anchor: "bottom",
    })
      .setLngLat([destination.lng, destination.lat])
      .addTo(map);

    map.once("load", () => setTimeout(() => map.resize(), 60));

    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      originMarkerRef.current?.remove();
      destMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      originMarkerRef.current = null;
      destMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============================= */
  /* Update markers positions only */
  /* ============================= */
  useEffect(() => {
    originMarkerRef.current?.setLngLat([origin.lng, origin.lat]);
    destMarkerRef.current?.setLngLat([destination.lng, destination.lat]);
  }, [origin.lat, origin.lng, destination.lat, destination.lng]);

  /* ============================= */
  /* Recreate markers when labels/titles change (sin hacks) */
  /* ============================= */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Guardar coords actuales para no perder posición al recrear
    const originLngLat: [number, number] = [origin.lng, origin.lat];
    const destLngLat: [number, number] = [destination.lng, destination.lat];

    originMarkerRef.current?.remove();
    originMarkerRef.current = new mapboxgl.Marker({
      element: createPin(originLabel, originTitle),
      anchor: "bottom",
    })
      .setLngLat(originLngLat)
      .addTo(map);

    destMarkerRef.current?.remove();
    destMarkerRef.current = new mapboxgl.Marker({
      element: createPin(destinationLabel, destinationTitle),
      anchor: "bottom",
    })
      .setLngLat(destLngLat)
      .addTo(map);
  }, [originLabel, destinationLabel, originTitle, destinationTitle]);

  /* ============================= */
  /* Route update */
  /* ============================= */
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const map = mapRef.current;
    if (!token || !map) return;

    let cancelled = false;

    async function updateRoute(currentMap: mapboxgl.Map) {
      try {
        const url =
          `https://api.mapbox.com/directions/v5/mapbox/driving/` +
          `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
          `?geometries=geojson&overview=full&steps=true&access_token=${token}`;

        const res = await fetch(url);
        const data = await res.json();
        if (cancelled) return;

        const route = data?.routes?.[0];
        const coords: [number, number][] | undefined = route?.geometry?.coordinates;
        if (!coords || coords.length < 2) return;

        // Steps + meta
        const leg = route?.legs?.[0];
        const stepsRaw = leg?.steps ?? [];

        const steps: RouteStep[] = stepsRaw.map((s: any) => ({
          instruction: String(s?.maneuver?.instruction ?? "Continuar"),
          distanceKm: Number(s?.distance ?? 0) / 1000,
        }));

        const distanceKm = Number(route?.distance ?? 0) / 1000;
        const durationMin = Number(route?.duration ?? 0) / 60;

        onRouteRef.current?.({ steps, distanceKm, durationMin });

        await waitForStyle(currentMap);
        if (cancelled) return;

        const feature = {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: coords },
        } as const;

        // source (reusar)
        const src = currentMap.getSource("route");
        if (!src) {
          currentMap.addSource("route", { type: "geojson", data: feature });
        } else {
          (src as mapboxgl.GeoJSONSource).setData(feature);
        }

        // layers (asegurar solo 1 set)
        ["route-outline", "route-glow", "route-neon"].forEach((id) => {
          if (currentMap.getLayer(id)) currentMap.removeLayer(id);
        });

        currentMap.addLayer({
          id: "route-outline",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#450a0a", "line-width": 9, "line-opacity": 0.8 },
        });

        currentMap.addLayer({
          id: "route-glow",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#ff1744", "line-width": 10, "line-opacity": 0.22, "line-blur": 7 },
        });

        currentMap.addLayer({
          id: "route-neon",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#ff1744", "line-width": 4, "line-opacity": 1, "line-blur": 1.2 },
        });

        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([origin.lng, origin.lat]);
        bounds.extend([destination.lng, destination.lat]);
        currentMap.fitBounds(bounds, { padding: 90, duration: 600 });

        setTimeout(() => currentMap.resize(), 40);
      } catch (e) {
        if (!cancelled) console.error("RouteMap error:", e);
      }
    }

    updateRoute(map);

    return () => {
      cancelled = true;
    };
  }, [origin.lat, origin.lng, destination.lat, destination.lng]);

  const tokenExists = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {!gpsAvailable && stage === "PENDING_PICKUP" ? (
        <div className={styles.gpsBanner}>GPS no disponible</div>
      ) : null}

      {tokenExists ? (
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            background: "#f3f4f6",
            border: "1px dashed #cbd5e1",
            color: "#64748b",
            fontWeight: 800,
          }}
        >
          Falta NEXT_PUBLIC_MAPBOX_TOKEN en .env.local
        </div>
      )}
    </div>
  );
}
