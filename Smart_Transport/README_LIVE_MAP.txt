SMART TRANSPORT MANAGEMENT SYSTEM — FINAL LIVE MAP VERSION

This package keeps the uploaded website design and portal structure and adds Live Transport Map to both Traveller and Cargo experiences.

CHANGES
1. Traveller sidebar: Live Transport Map added.
2. Traveller dashboard: Live Map action added beside Plan Journey.
3. Cargo sidebar: Live Transport Map added.
4. Cargo dashboard: Live Map action added beside Plan Shipment.
5. live-map.html uses the same Traveller/Cargo portal header/sidebar styling and automatically follows the logged-in role.
6. Existing map visual, alerts, route markers and controls are retained.
7. A root service-worker.js is included because the existing pages register ./service-worker.js.
8. PWA icon folder is normalized to assets/icons to match manifest.json.

USAGE
- Replace the contents of the current website project with these files.
- Deploy normally to Netlify.
- Log in as Traveller or Cargo.
- Click Live Transport Map from the sidebar or dashboard.
- The Live Map page keeps the role-specific navigation.

No API key was added; the existing map is the current visual/demo map and can later be connected to the live map API.
