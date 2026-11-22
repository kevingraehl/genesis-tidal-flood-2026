# Genesis Tidal Flood 2026 - Marina District analysis

Updated November 22, 2026. This is a terrain-screening and public-information analysis, not a site survey, hydraulic model, evacuation map, or guarantee of safety.

## Prominent answers

**A. How much higher is Beach & Pierce than Marina Boulevard & Scott?**

Beach & Pierce is approximately **3 ft 1 in higher**: 14.04 ft NAVD88 versus 10.95 ft NAVD88.

**B. How much higher or lower is Beach & Pierce than Beach & Scott?**

Beach & Pierce is approximately **1 ft 4 in higher**: 14.04 ft NAVD88 versus 12.70 ft NAVD88.

**C. Is there a continuous low-lying route for tidal water to reach the Beach & Pierce block?**

Not at the Wednesday NWS still-water forecast of 8.66 ft NAVD88 in this connected-terrain screen. The first DEM-only shoreline connection to the Beach & Pierce reference point appears near 14.01 ft NAVD88. This is not proof that the block cannot flood: the screen does not model waves, rainfall, catch-basin capacity, sewer backup, groundwater, temporary openings, or the hydraulics of pipes and culverts. Bare-earth interpolation also cannot be treated as a complete inventory of buildings, walls, gates, and seawalls.

**D. Could the November 23-26 event reach Beach Street or nearby garages?**

The forecast still-water surface alone is below the sampled Beach Street road elevations. Beach & Pierce is about 5.38 ft above the Wednesday forecast, and its sampled nearby low is about 4.76 ft above. Beach & Scott is about 4.04 ft above the forecast, with a nearby sampled low about 2.95 ft above.

Garages may nevertheless flood from intense rainfall, blocked inlets, a capacity-limited combined sewer, reverse flow through a building lateral or floor drain, wave overtopping, or a lower threshold that was not surveyed. The exact garage threshold was not measured.

**E. Should neighbors act before Tuesday morning?**

Yes, proportionately. People at known flood-prone buildings should clear visible debris from catch basins without removing grates, report blocked drains to 311, move vulnerable items off garage floors, and stage proper temporary barriers for low thresholds. Nobody should enter moving water or drive around barricades. Adhesive tape or Flex Seal is not a substitute for a barrier or maintained backwater valve.

## Official event levels and datum conversion

NOAA station 9414290 reports MLLW at 5.98 ft and NAVD88 at 5.92 ft above station datum. Therefore:

`elevation in NAVD88 feet = tide height in MLLW feet + 0.06 ft`

| Date and local high tide | NOAA astronomical prediction (MLLW) | Astronomical prediction (NAVD88) | NWS forecast including surge (MLLW) | NWS forecast (NAVD88) |
|---|---:|---:|---:|---:|
| Mon Nov 23, 9:25 AM | 6.716 ft | 6.776 ft | 8.0 ft | 8.06 ft |
| Tue Nov 24, 10:05 AM | 6.939 ft | 6.999 ft | 8.4 ft | 8.46 ft |
| Wed Nov 25, 10:49 AM | 7.029 ft | 7.089 ft | 8.6 ft | 8.66 ft |
| Thu Nov 26, 11:38 AM | 6.952 ft | 7.012 ft | 8.2 ft | 8.26 ft |

The NWS Coastal Flood Warning says up to 2.8 ft of inundation above ground is possible in low-lying areas near shorelines and tidal waterways. It also says the forecast includes up to 1.6 ft of surge. A separate High Surf Warning covers Wednesday, so wave effects may exceed the still-water surface at exposed shoreline locations.

## Measured elevations

Representative road/ground values are medians of nearby native 0.25 m bare-earth DEM pixels. "Nearby low" is the second percentile within 12 m of an intersection or 18 m of a waterfront reference. It is a screening statistic, not a surveyed gutter or garage invert.

| Location | Representative elevation | Nearby sampled low | Margin above 8.66 ft forecast | Estimated local uncertainty |
|---|---:|---:|---:|---:|
| Beach & Pierce | 14.04 ft | 13.42 ft | 5.38 ft | ±0.3 ft |
| Beach & Scott | 12.70 ft | 11.61 ft | 4.04 ft | ±0.3 ft |
| Marina & Scott / Cervantes | 10.95 ft | 10.33 ft | 2.29 ft | ±0.3 ft |
| Beach & Divisadero | 14.68 ft | 13.55 ft | 6.02 ft | ±0.3 ft |
| Beach & Fillmore | 14.70 ft | 14.04 ft | 6.04 ft | ±0.3 ft |
| Marina & Fillmore | 11.26 ft | 10.38 ft | 2.60 ft | ±0.3 ft |
| Pierce property ground reference | 14.43 ft | 14.01 ft | 5.77 ft | ±0.5 ft |
| St. Francis Yacht Club parking reference | 12.52 ft | 11.66 ft | 3.86 ft | ±0.5 ft |
| Palace of Fine Arts west-side reference | 9.82 ft | 9.04 ft | 1.16 ft | ±0.5 ft |
| Crissy Field east parking reference | 13.59 ft | 12.14 ft | 4.93 ft | ±0.5 ft |
| Crissy Marsh | 4.04 ft | 4.04 ft | below forecast | ±0.5 ft |

The Palace west-side sampled low is only about 0.38 ft above the forecast still-water level, so small-scale elevation errors, wave/runup pathways, rain, or drainage effects matter there. Crissy Marsh is tidally connected and well below the forecast water surface, but the DEM screen does not show an 8.66 ft overland connection from the marsh across the higher ground to Beach Street.

## Can a valve stop storm-drain backflow?

There is no single neighborhood valve identified in the reviewed public sources that a resident can ask to have closed for the Marina District. Most of San Francisco uses a combined sewer: street catch basins and building wastewater enter the same system. In severe storms, water can pond at blocked catch basins, the system can reach capacity, and combined water can emerge from drains or manholes in low areas.

At the building level, SFPUC says a **backwater valve** can automatically close when flow reverses toward a property. That can protect low fixtures, a floor drain, or a vulnerable lateral when properly designed, installed, and maintained. It does not keep surface water out of a garage, and closing it temporarily prevents normal drainage from the building through that pipe.

Some coastal outfalls use backflow-prevention structures or tide-flex devices, but the reviewed sources do not confirm the exact outfall configuration serving this block. The NPS documents a separate Crissy Field storm drain that historically clogged with sand during high tides and backed water onto Mason Street; that demonstrates the mechanism but is not evidence that the same pipe drains Beach & Pierce.

## Data and method

- Dataset: 2023 USGS Lidar DEM: San Francisco, CA, work unit 300449.
- Collection date: April 20, 2023. USGS publication date: August 21, 2024.
- Product: 0.25 m hydro-flattened raster DEM made from class 2 ground LiDAR and hydro breaklines.
- Horizontal CRS: EPSG:7131, NAD83(2011) / San Francisco CS13, metres.
- Vertical datum: NAVD88 (Geoid18), metres.
- Project accuracy: DEM tested NVA RMSEz 1.63 cm; tested NVA 3.19 cm at 95% confidence; tested VVA 11.05 cm at the 95th percentile.
- Geocoding: requested intersections and the property reference were matched by the ArcGIS World Geocoder. The Crissy Marsh centroid came from OpenStreetMap/Nominatim.
- Sampling: robust median within 6 m for intersections, 4 m for the property reference, and 10 m for waterfront/wetland references; nearby-low screens use a larger radius.
- Connectivity: one-metre working grid derived from the 0.25 m DEM; eight-neighbor connected components seeded at valid low terrain adjoining northern open-water NoData. This is a static bathtub connectivity test, not hydrodynamics.

## Limitations

- A bare-earth DEM removes or interpolates through many buildings and objects. It cannot prove that water crosses a seawall, building, door, curb, flood barrier, or other structure.
- Hydro-flattened water surfaces are not ground elevations and were excluded from ground conclusions.
- Road crowns and some curbs are visible, but this analysis does not claim survey-grade gutter or threshold elevations.
- The 2023 surface may differ from November 2026 after construction, settlement, resurfacing, or temporary works.
- Tide-gauge values do not include local wave runup at a specific shoreline point. The NWS surge forecast is an operational forecast and can change.
- Sewer maps, pipe inverts, pump operations, outfall gates, and the private building lateral were not available in sufficient detail for a hydraulic conclusion.

## Sources

- USGS/NOAA LiDAR metadata and downloads: https://www.fisheries.noaa.gov/inport/item/73506
- USGS project report: https://prd-tnm.s3.amazonaws.com/StagedProducts/Elevation/metadata/CA_SanFrancisco_B23/USGS_CA_SanFrancisco_B23_Project_Report.pdf
- NOAA tide predictions API: https://api.tidesandcurrents.noaa.gov/api/prod/
- NOAA station 9414290 datums: https://tidesandcurrents.noaa.gov/datums.html?datum=NAVD88&epoch=0&id=9414290&name=San+Francisco&state=CA&units=0
- NWS active alerts: https://api.weather.gov/alerts/active?point=37.803,-122.442
- SFPUC wastewater collection system: https://www.sfpuc.gov/about-us/our-systems/sewer-system/wastewater-collection-system
- SFPUC sewer laterals and backwater valves: https://www.sfpuc.gov/learning/emergency-preparedness/sewer-laterals
- SFPUC storms and combined-sewer behavior: https://www.sfpuc.gov/about-us/news/our-sewer-system-and-storms
- SFPUC Floodwater Grant Program: https://www.sfpuc.gov/programs/grants/floodwater-grant-program
- NPS Crissy Field IJKL stormwater outfall: https://parkplanning.nps.gov/projectHome.cfm?projectId=46130
- NPS Crissy Marsh: https://www.nps.gov/places/000/crissy-marsh.htm
