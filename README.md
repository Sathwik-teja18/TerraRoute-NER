# TerraRoute-NER
An AI-Powered Smart Logistics and Accessibility Intelligence Platform for the North Eastern Region (NER) of India.

TerraRoute_NER is a dual-portal web application designed to bridge the gap between civilian transport and government disaster management in geographically challenging terrains. It combines real-time GIS mapping, custom hybrid routing algorithms (A* and Dijkstra), and priority-based scheduling to ensure safe, efficient movement of travelers and critical cargo during extreme weather and road disruptions.


Key Features
 Dual-Portal Architecture:
>>- Public Transport Portal: For civilian travelers and cargo operators to plan journeys, track shipments, and report SOS emergencies.
>>- Gov & DMT Operations Dashboard: An executive control room for the Disaster Management Team to monitor active corridors, manage check-posts, and resolve critical incidents.
>>- Hybrid Routing Engine: Utilizes custom implementations of Dijkstra (shortest path) and A* (optimal path via Haversine heuristics) combined with the OSRM (Open Source Routing Machine) API to trace actual road geometries and calculate ETAs based      on live hazard multipliers.
>>- Live Interactive Map: Powered by Leaflet.js and MapTiler, visualizing active vehicles, cargo movements, check-posts, and hazard zones (landslides, floods) in real-time.
>>- Priority-Based Scheduling: Automated queue management that prioritizes emergency response and P1 medical cargo over routine transport using a strict protocol hierarchy.
>>- Live Weather Integration: Pulls real-time environmental data (OpenWeather API) to dynamically adjust route risk levels and feasibility.
>>- Unified Backend: A Node.js/Express.js backend with MongoDB integration to instantly sync SOS reports, trip data, and user accounts across both portals.


Tech Stack
>>- Frontend: HTML5, CSS3 (Custom Glassmorphism UI), Vanilla JavaScript
>>- Mapping & GIS: Leaflet.js, MapTiler API, OSRM Routing API
>>- Backend: Node.js, Express.js, CORS
>>- Database: MongoDB (Mongoose ORM)
>>- External APIs: OpenWeather API

Project Structure
>>- frontend/ - Contains the UI for the Government and DMT portals (index.html, dmt.js, government.js).
>>- Smart_Transport_Final_Live_Map/ - Contains the UI for the civilian and cargo operator portals (live-map.html, travellers.html, cargo.html).
>>- js/api.js - The shared API client handling seamless synchronization between both frontends and the database.
>>- js/route_analysis_algs.js - Custom graph data structure and pathfinding algorithms for the NER corridor.
>>- backend/ - Node.js REST API handling accounts, trips, and emergency alerts.
