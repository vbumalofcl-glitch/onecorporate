// Dynamic Maintenance Procedures & Checklists Module - One Corporate Building

// Procedures & Checklists Database
const PROCEDURE_DB = {
  genset: {
    id: 'genset',
    title: 'Generator Set Maintenance Procedure',
    code: 'PM-OCT-08',
    system: 'Mechanical',
    purpose: 'Generators are the backbone of power continuity for businesses and various industries. A well-maintained generator ensures uninterrupted operations during outages, minimizing costly downtime. Regular commercial generator maintenance is essential to ensure reliability and longevity, helping businesses avoid emergency failures and unexpected expenses.',
    references: [
      'Quality manual',
      'OEM Cummins KTAA19-G6A Service Manual',
      'NFPA 110: Standard for Emergency and Standby Power Systems'
    ],
    specs: [
      { parameter: 'Engine Model', specification: 'Cummins KTAA19-G6A' },
      { parameter: 'Power Output', specification: 'Prime: 545kW (681kVA) / Standby: 600kW (750kVA)' },
      { parameter: 'Rated Speed', specification: '1800 RPM (60Hz) or 1500 RPM (50Hz)' },
      { parameter: 'Lube Oil Capacity', specification: '50 Liters (13.2 Gallons) SAE 15W-40 (API CH-4 or higher)' },
      { parameter: 'Coolant Capacity', specification: '~116.5 Liters (Engine + Radiator) 50/50 Water/Ethylene Glycol' },
      { parameter: 'Fuel System', specification: 'Cummins PT (Pressure-Time) Fuel System' },
      { parameter: 'Electrical System', specification: '24V DC Starting Batteries (Rest voltage >= 25.2V)' },
      { parameter: 'Aspiration', specification: 'Turbocharged & Air-to-Air Aftercooled' }
    ],
    definitions: [
      { term: 'Generator maintenance', def: 'Planned inspections, servicing, testing, and repairs performed to keep a generator set reliable, safe, and ready to supply power when required.' },
      { term: 'Preventive maintenance', def: 'Scheduled routine tasks (inspections, oil/filter changes, battery checks, test runs) intended to prevent failures before they occur.' },
      { term: 'Automatic transfer switch ATS', def: 'A device that automatically transfers electrical load between utility power and generator power during an outage.' },
      { term: 'Wet Stacking', def: 'Accumulation of unburnt fuel in the exhaust system due to operating the engine at low load (<30%), which damages cylinders and turbochargers.' }
    ],
    instructions: [
      {
        title: 'Daily Pre-Start Procedure (Flight Check)',
        content: '<p>Never start the engine without verifying these fluid levels and physical conditions:</p><ul><li><strong>Lube Oil:</strong> Pull the dipstick and wipe it clean. Re-insert and check that the level is between the "L" (Low) and "H" (High) marks. Use SAE 15W-40.</li><li><strong>Coolant:</strong> Check the radiator sight glass. The mixture must be a 50/50 ratio of water and ethylene glycol.</li><li><strong>Fuel System:</strong> Drain water/sediment from the Fuel-Water Separator. Ensure the day tank is at least 75% full to prevent air from entering the lines.</li><li><strong>Air Cleaner:</strong> Inspect the restriction indicator. If the red flag is visible, the filter is clogged and must be serviced.</li><li><strong>Battery:</strong> Check control panel. At rest, the 24V system should read at least 25.2V.</li></ul>'
      },
      {
        title: 'Operation Guide (Manual Starting Sequence)',
        content: '<ol><li><strong>Isolate Load:</strong> Ensure the main output circuit breaker is in the OFF (Open) position. Never start a generator under load.</li><li><strong>Power On:</strong> Switch the control panel to Manual Mode.</li><li><strong>Crank:</strong> Press the Green (Start) button.</li><li><strong>Warm-up:</strong> Allow the engine to idle for 3–5 minutes. Monitor indicators:<br>• Normal Oil Pressure: 345–483 kPa (50–70 psi).<br>• Idle Speed: 675–775 RPM.</li></ol><p><strong>Loading the Generator:</strong> Once the frequency (60Hz/50Hz) and voltage are stable, close the main circuit breaker. Avoid running at less than 30% load for long periods (prevent wet stacking).</p>'
      },
      {
        title: 'Controlled Shutdown Sequence',
        content: '<ol><li><strong>Remove Load:</strong> Open the main circuit breaker.</li><li><strong>Cool-down:</strong> Let the engine run at no-load for 5 minutes. This allows the turbochargers to cool down gradually. Stopping a hot engine immediately can "cook" the oil inside the turbo bearings.</li><li><strong>Stop:</strong> Press the Red (Stop) button.</li></ol>'
      },
      {
        title: 'Preventive Maintenance Schedule',
        content: '<ul><li><strong>Daily:</strong> Check oil, coolant, and fuel-water separator.</li><li><strong>250 Hours / 6 Months:</strong> Change lube oil & filters; replace fuel and coolant filters.</li><li><strong>1500 Hours / 1 Year:</strong> Full engine clean; adjust overhead set (valves/injectors); check zinc anodes.</li><li><strong>6000 Hours / 2 Years:</strong> Flush cooling system; inspect vibration dampers and turbochargers.</li></ul>'
      }
    ],
    checklist: {
      'Daily': [
        'Inspect oil level and top up if needed',
        'Check coolant level in radiator/expansion tank',
        'Verify fuel level in day tank and main tank',
        'Look for oil, coolant, or fuel leaks around the unit',
        'Ensure battery charger is active and charging',
        'Confirm control panel shows no alarms or faults'
      ],
      'Weekly': [
        'Inspect belts and hoses for wear or tension issues',
        'Check air intake system and clean filters if clogged',
        'Drain fuel/water separator to remove accumulated water',
        'Inspect battery terminals for corrosion or loose cables',
        'Conduct warm up and cool down cycles (5 minutes each)'
      ],
      'Monthly': [
        'Perform an operational test under load (min. 30% load for 30-60 minutes)',
        'Monitor governor performance (frequency stability at 60Hz)',
        'Inspect Exhaust system for soot leaks or damage',
        'Ensure enclosure louvers are clear of debris'
      ],
      'Quarterly': [
        'Replace oil filter and change oil',
        'Replace fuel filters (primary and secondary)',
        'Clean or replace air filters',
        'Inspect alternator connections and tighten if necessary',
        'Test automatic transfer switch (ATS) operation'
      ],
      'Annual': [
        'Flush and replace coolant',
        'Perform battery load test and replace if weak',
        'Inspect and clean generator windings',
        'Check control panel calibration and update firmware if required',
        'Conduct a full system load bank test to verify rated capacity'
      ]
    },
    warnings: 'WARNING: The PT (Pressure-Time) Fuel System operates under extreme pressure. Never loosen or "crack" a fuel line while the engine is running. Stop engine immediately if oil pressure drops below 345 kPa during load.'
  },
  firepump: {
    id: 'firepump',
    title: 'Fire Pump & Jockey Pump Procedure Manual',
    code: 'PM-OCT-09',
    system: 'Fire Protection',
    purpose: 'This manual defines the preventive maintenance program for Fire Pump and Jockey Pump systems to ensure continuous readiness, compliance with NFPA 20 (Standard for the Installation of stationary pumps for Fire Protection) and local fire safety regulations, and protection of life and property.',
    references: [
      'NFPA 20: Standard for the Installation of Stationary Pumps for Fire Protection',
      'Local Fire Code Regulations',
      'Manufacturer’s Operation & Maintenance Manuals'
    ],
    specs: [
      { parameter: 'Fire Pump Model', specification: 'Horizontal Split-Case Centrifugal' },
      { parameter: 'Jockey Pump Model', specification: 'Vertical Multi-stage Centrifugal' },
      { parameter: 'Required System Pressure', specification: 'Jockey Cut-in: 120 PSI, Cut-out: 140 PSI / Fire Pump Cut-in: 100 PSI' },
      { parameter: 'Required Temperature Range', specification: '4.4°C to 49°C room temperature limits' }
    ],
    definitions: [
      { term: 'Fire Pump', def: 'The primary pump that supplies water to the fire protection system during emergency conditions.' },
      { term: 'Jockey Pump', def: 'A small auxiliary pump designed to maintain system pressure and prevent unnecessary operation of the fire pump.' },
      { term: 'LOTO (Lock-out/Tag-out)', def: 'A safety Procedure ensuring equipment is properly shut off and not restarted until maintenance is complete.' }
    ],
    instructions: [
      {
        title: 'Weekly Maintenance checks',
        content: 'Perform weekly checks to ensure pumps are operational and free of defects:<br><ul><li>Inspect pump room cleanliness, ventilation, and temperature (4.4°C–49°C).</li><li>Check casing, seals, and bearings for leaks/wear.</li><li>Verify suction/discharge pressure gauges.</li><li>Test automatic start by simulating pressure drop.</li><li>Inspect jockey pump for leaks, vibration, and noise.</li></ul>'
      },
      {
        title: 'Monthly Maintenance & Testing',
        content: 'Conduct monthly functional tests and lubrication to maintain reliability:<br><ul><li>Perform fire pump churn test (no-flow run for 10 mins).</li><li>Inspect strainers, valves, and relief valves.</li><li>Lubricate pump bearings and couplings.</li><li>Run jockey pump manually to confirm smooth operation.</li><li>Inspect electrical connections and controller insulation.</li><li>Check jockey pump for overheating during operation.</li></ul>'
      },
      {
        title: 'Annual Maintenance & Flow Testing',
        content: 'Carry out full system tests and component overhauls annually:<br><ul><li>Conduct fire pump full flow test (compare performance curves with original design specs).</li><li>Clean strainers, suction screens, and piping.</li><li>Overhaul jockey pump bearings, seals, and motor alignment.</li><li>Inspect impeller and casing for wear/corrosion.</li><li>Test and calibrate pressure switch cut-in values.</li></ul>'
      }
    ],
    checklist: {
      'Weekly': [
        'Pump room clean, ventilated, and temperature w/in limits (4.4°C to 49°C)',
        'Inspect pump casing, seals, bearings for leaks/ wear',
        'Verify suction/ discharge pressure gauges',
        'Test automatic start (simulate pressure drop)',
        'Check controller status lights and alarms',
        'Jockey pump: inspect for leaks, vibration, unusual noise',
        'Jockey pump: verify automatic start/stop operation'
      ],
      'Monthly': [
        'Fire pump churn test (no-flow run)',
        'Inspect strainers, valves, and relief valves',
        'Lubricate bearings and couplings',
        'Jockey pump: run manually to confirm smooth operation',
        'Jockey pump: inspect electrical connections and motor insulation',
        'Jockey pump: check for overheating during operation'
      ],
      'Annual': [
        'Fire pump full flow test (compare with design specs)',
        'Inspect and clean strainers, suction screens, and piping',
        'Jockey pump: overhaul bearings, seals, and motor alignment',
        'Jockey pump: inspect impeller and casing for wear/ corrosion',
        'Jockey pump: test pressure switch calibration',
        'Jockey pump: clean strainers and suction piping'
      ]
    },
    warnings: 'CRITICAL SAFETY: Always de-energize the controller cabinet before opening it or servicing wiring (apply LOTO). Do not stand directly in front of relief valves during operation testing.'
  },
  stp: {
    id: 'stp',
    title: 'Sewage Treatment Plant Procedure Manual',
    code: 'PM-OCT-10',
    system: 'STP',
    purpose: 'To ensure safe, efficient, and compliant operation of the Sewage Treatment Plant (STP), preventing environmental violations, equipment failure, and health hazards. Effluent must remain within LLDA/DENR standards.',
    references: [
      'DENR Administrative Orders on wastewater discharge',
      'Manufacturer manuals for pumps, blowers, dosing systems'
    ],
    specs: [
      { parameter: 'Plant Capacity', specification: '150 cubic meters/day' },
      { parameter: 'Treatment Process', specification: 'Moving Bed Biofilm Reactor (MBBR) + Aerated Clarifier' },
      { parameter: 'Aeration Blowers', specification: '2 Units Rotary Lobe Blowers (Duty/Standby)' },
      { parameter: 'Disinfection Dosing', specification: 'Sodium Hypochlorite liquid dosing system' }
    ],
    definitions: [
      { term: 'STP', def: 'Sewage Treatment Plant - Facility designed to treat wastewater from the building before discharge.' },
      { term: 'Influent / Effluent', def: 'Influent is wastewater entering the STP; Effluent is the treated water discharged.' },
      { term: 'Aeration', def: 'Process of supplying oxygen to wastewater to support microbial activity.' },
      { term: 'BOD / COD / TSS', def: 'Biochemical Oxygen Demand / Chemical Oxygen Demand / Total Suspended Solids - primary water quality compliance metrics.' }
    ],
    instructions: [
      {
        title: 'Preparation & Daily Inspections',
        content: 'Ensure readiness before starting STP tasks:<br><ul><li>Wear proper PPE (chemical-resistant gloves, boots, goggles, mask).</li><li>Perform visual check of tanks, pumps, blowers, and pipelines.</li><li>Record influent/effluent readings (flow rates, pH, odor check). pH should fall between 6.5 and 9.0.</li></ul>'
      },
      {
        title: 'Routine Maintenance & Dosing',
        content: 'Perform routine upkeep to sustain operations:<br><ul><li>Clean inlet bar screens and pump strainers to prevent blockages.</li><li>Refill the sodium hypochlorite chemical dosing system daily. Check dosing pump operation.</li><li>Lubricate pump parts and flush pipelines weekly.</li></ul>'
      },
      {
        title: 'Monitoring, Testing & Sludge',
        content: '<ul><li>Test effluent parameters (pH, turbidity, chlorine residual). Coordinate monthly lab analysis (BOD, COD, TSS).</li><li>Calibrate instruments (pH meters, flow sensors).</li><li>Siphon sludge and scum from clarifier. Coordinate disposal with DENR-accredited third-party haulers.</li></ul>'
      }
    ],
    checklist: {
      'Daily': [
        'Inspect clarifiers for sludge removal and flow balance',
        'Check aeration tank blower operation and dissolved oxygen levels',
        'Clean screens and filters to prevent clogging',
        'Verify chemical dosing (disinfectants/coagulants)',
        'Measure effluent pH, turbidity, and odor',
        'Remove debris from scum and grease traps'
      ],
      'Weekly': [
        'Inspect sludge pumps and lines for blockages',
        'Clean grease traps and scum collectors',
        'Inspect PPE and emergency safety equipment',
        'Inspect electrical panels and sensors'
      ],
      'Monthly': [
        'Inspect tanks and pipelines for cracks, leaks, or corrosion',
        'Test alarms, and control panels',
        'Lubricate pumps and motors; check bearings',
        'Conduct lab analysis (BOD, COD, TSS)'
      ],
      'Annual': [
        'Sludge removal and proper disposal',
        'Calibration of instruments (flow meter, sensor)',
        'Structural inspection of tanks and pipelines',
        'Preventive servicing of motors and gearboxes'
      ]
    },
    warnings: 'ENVIRONMENTAL WARNING: Discharging effluent that exceeds DENR BOD/COD limits can result in daily fines and plant shutdown. Handle chlorine chemicals under ventilation.'
  },
  domestic_water: {
    id: 'domestic_water',
    title: 'Domestic Water System Procedure Manual',
    code: 'PM-OCT-11',
    system: 'Plumbing',
    purpose: 'To ensure continuous, clean, safe, and pressurized potable water supply and distribution throughout One Corporate Building, covering cistern water storage, transfer pumps, constant-pressure VFD booster pumps, pressure tanks, chlorination/UV treatment, and pressure-reducing valve (PRV) stations in compliance with PNSDW and National Plumbing Code standards.',
    references: [
      'Philippine National Standards for Drinking Water (PNSDW / DOH)',
      'Revised National Plumbing Code of the Philippines',
      'OEM Transfer & VFD Booster Pump Operation & Maintenance Manuals'
    ],
    specs: [
      { parameter: 'Transfer Pump Assembly', specification: 'Dual Vertical Multi-stage Centrifugal Pumps (Duty/Standby, 15 HP each)' },
      { parameter: 'Booster Pump Package', specification: 'Triplex Constant Pressure VFD Booster Pump System (45-65 PSI setpoint)' },
      { parameter: 'Cistern Tank Capacity', specification: '200 Cubic Meters (Basement 2 Potable Reservoir)' },
      { parameter: 'Overhead Tank Capacity', specification: '60 Cubic Meters (Roofdeck High & Low Zone Storage)' },
      { parameter: 'Water Disinfection', specification: 'Automatic In-line Sodium Hypochlorite Chemical Dosing System' },
      { parameter: 'Operating Pressure Limits', specification: 'Booster Cut-in: 45 PSI, Cut-out: 65 PSI / Lower Zone PRV: 50 PSI Max' }
    ],
    definitions: [
      { term: 'Domestic Water Transfer Pump', def: 'High-capacity vertical multi-stage pump transferring raw/treated municipal water from the cistern to overhead roofdeck tanks.' },
      { term: 'VFD Booster System', def: 'Variable Frequency Drive controlled pump manifold maintaining constant water line pressure during peak tenant demand.' },
      { term: 'Cistern & Overhead Tanks', def: 'Primary water storage reservoirs for emergency water reserve and gravity/booster feed distribution.' },
      { term: 'PRV (Pressure-Reducing Valve)', def: 'Hydraulic control valve reducing excessive static head pressure on lower building floors to prevent fixture damage.' }
    ],
    instructions: [
      {
        title: 'Daily Flight Check & Water Quality Inspection',
        content: '<ul><li>Inspect basement cistern and overhead roofdeck water levels. Ensure minimum 75% reserve capacity.</li><li>Verify domestic water line pressure on VFD controller (45–65 PSI).</li><li>Inspect transfer pump shaft seals and piping for drenching or drips.</li><li>Test free residual chlorine in drinking water using DPD test kit (0.5 to 1.5 ppm requirement).</li><li>Verify automatic duty-standby pump alternation on the control panel.</li></ul>'
      },
      {
        title: 'Weekly Strainer Cleaning & Pressure Tank Check',
        content: '<ul><li>Clean suction Y-strainers on domestic transfer and booster pump lines.</li><li>Inspect diaphragm pressure tanks and check air pre-charge pressure (30–35 PSI static air charge).</li><li>Check pump motor operating current (Amps) against panel rating.</li><li>Inspect water meter readings and record building daily consumption rate.</li></ul>'
      },
      {
        title: 'Monthly & Quarterly PM Service',
        content: '<ul><li>Lubricate pump motor bearings with high-temperature NLGI Grade 2 lithium grease.</li><li>Inspect and clean chlorination dosing pump injectors and suction tubing.</li><li>Test pressure-reducing valves (PRVs) on lower zones for hunting or pressure creep.</li><li>Check electrical panel contactors, relays, and VFD cooling fans for dust accumulation.</li></ul>'
      },
      {
        title: 'Annual Tank Sanitization & Water Testing',
        content: '<ul><li>Drain, scrub, and sanitize cistern and overhead water tanks using 50 ppm chlorine solution per DOH guidelines.</li><li>Collect water samples from cistern, overhead tank, and tenant taps for DOH-accredited bacteriological and physical-chemical lab testing.</li><li>Overhaul pump mechanical seals, impellers, and shaft sleeves if worn.</li><li>Perform full hydrostatic and piping leak audit across all plumbing risers.</li></ul>'
      }
    ],
    checklist: {
      'Daily': [
        'Inspect cistern (2B) and overhead tank (Roofdeck) water storage levels',
        'Verify domestic water line pressure on booster panel (45 to 65 PSI)',
        'Inspect transfer and booster pumps for water leaks or gland dripping',
        'Measure free residual chlorine level in potable water (0.5 - 1.5 ppm)',
        'Confirm VFD controller shows AUTO mode with no fault alarms',
        'Verify automatic duty/standby transfer switch operation'
      ],
      'Weekly': [
        'Clean suction line Y-strainers and foot valve screens',
        'Check diaphragm pressure tank air pre-charge pressure',
        'Record main water meter reading and log daily consumption rate',
        'Inspect chemical chlorination dosing pump and refill sanitizer tank',
        'Test manual start/stop override switches on transfer pumps'
      ],
      'Monthly': [
        'Lubricate pump motor bearings and check coupling alignment',
        'Inspect control panel contactors, relays, and thermal overloads',
        'Test pressure reducing valve (PRV) stations on lower floors',
        'Inspect overhead tank float valves and overflow piping'
      ],
      'Quarterly': [
        'Inspect pump impellers, wear rings, and mechanical seal faces',
        'Clean chlorination dosing injectors and flush chemical lines',
        'Calibrate digital pressure transducers and VFD feedback loop'
      ],
      'Annual': [
        'Full cistern and overhead water tank cleaning and chlorine disinfection',
        'Submit water samples for DOH bacteriological & physical-chemical analysis',
        'Overhaul transfer pump mechanical seals, bearings, and shaft sleeves',
        'Inspect all domestic water risers, valves, and expansion joints for leaks'
      ]
    },
    warnings: 'SANITATION WARNING: Cross-connections between domestic water lines and non-potable or STP lines are strictly forbidden. De-energize and lock out all pump control panels before entering water storage tanks.'
  },
  submersible_pump: {
    id: 'submersible_pump',
    title: 'Submersible Sump Pump & Drainage Procedure',
    code: 'PM-OCT-12',
    system: 'Plumbing',
    purpose: 'To define standardized preventive maintenance and inspection protocols for all submersible sump pumps, elevator pit drainage pumps, storm water retention pits, and basement de-watering systems across Basement 1, 2, and 3 levels, ensuring continuous flood protection and operational reliability.',
    references: [
      'P.D. 1096: National Building Code of the Philippines',
      'Ebara / Flygt / Grundfos Submersible Drainage Pump Operating Manuals',
      'Building Emergency Flood Response & Heavy Typhoon Protocols'
    ],
    specs: [
      { parameter: 'Pump Type', specification: 'Heavy-Duty Cast Iron Dual Submersible Sump Pumps (Duty/Standby)' },
      { parameter: 'Motor Power / Voltage', specification: '2.2 kW (3.0 HP), 230V/400V 3-Phase IP68 Submersible Motor' },
      { parameter: 'Control System', specification: '4-Bulb Mechanical Float Switch Assembly (OFF, Duty, Standby, High Alarm)' },
      { parameter: 'Max Discharge Head', specification: '18 Meters Head / Flow Rate: 350 Liters/Minute' },
      { parameter: 'Locations Covered', specification: 'Basement 3 Main Sump Pit, B2 Sump Pit, Elevator Pit, Storm Storage Pit' }
    ],
    definitions: [
      { term: 'Submersible Sump Pump', def: 'Waterproof motor-driven pump installed inside a basement sump pit to automatically remove accumulated groundwater, seepage, and wastewater.' },
      { term: 'Float Switch Bulb', def: 'Tilt-activated mercury-free floating sensor that triggers pump cut-in, cut-out, and high water alarm signals.' },
      { term: 'Elevator Sump Pit', def: 'Dedicated drainage pit at the bottom of the elevator shaft designed to capture water seepage and prevent cabin buffer submergence.' },
      { term: 'De-silting', def: 'Removal of accumulated mud, sand, silt, and debris from pit bottoms to prevent pump impeller clogging.' }
    ],
    instructions: [
      {
        title: 'Daily Sump Pit Flight Check & Alarm Inspection',
        content: '<ul><li>Inspect Basement 3 main sump pit, Basement 2 pit, and elevator shaft pits. Ensure water levels are low.</li><li>Check sump pump control panel pilot lights (Power ON, AUTO Mode active, No Overload Tripped).</li><li>Verify high water level alarm horn and visual strobe light functionality.</li><li>Inspect discharge piping and check valves for water hammer or leaks during pump cycling.</li></ul>'
      },
      {
        title: 'Weekly Float Switch & Automatic Start Test',
        content: '<ul><li>Manually lift each float switch bulb using a wooden test rod:</li><li>• Float 1 (OFF): Pump stops.<br>• Float 2 (Duty Start): Duty pump starts immediately.<br>• Float 3 (Standby Start): Standby pump engages automatically.<br>• Float 4 (High Alarm): High water alarm horn sounds and panel alerts.</li><li>Verify automatic pump alternator reverses lead pump on each cycle.</li><li>Clear floating trash, rags, or plastic bags from pit water surfaces.</li></ul>'
      },
      {
        title: 'Monthly Insulation & Electrical Check',
        content: '<ul><li>Inspect submersible power cables for cuts, outer sheath damage, or swelling.</li><li>Test motor winding insulation resistance using a 500V Megger (Minimum 20 M-ohms required).</li><li>Measure motor operating current (Amps) with a clamp meter and compare against nameplate rating.</li><li>Inspect check valve rubber flappers for debris trapped under the seat.</li></ul>'
      },
      {
        title: 'Quarterly & Annual De-silting & Pump Overhaul',
        content: '<ul><li>Pump out pit and remove accumulated sand, silt, and sludge from sump pit floors (De-silting).</li><li>Hoist submersible pumps using lifting chains for physical inspection of suction strainers and impellers.</li><li>Check oil chamber seal oil for water emulsification; replace mechanical seal oil.</li><li>Inspect and clean float switch bulbs of fat/grease build-up.</li><li>Repaint corroded lifting chains and pump housing with anti-corrosive epoxy paint.</li></ul>'
      }
    ],
    checklist: {
      'Daily': [
        'Inspect Basement 3 main sump pit water level (must be below Duty Start level)',
        'Verify Elevator Shaft pit is dry and free of oil/water accumulation',
        'Confirm sump pump control panel switches are set to AUTO position',
        'Check control panel indicators for power ON and zero fault alarms',
        'Inspect check valves and discharge piping for leaks during operation'
      ],
      'Weekly': [
        'Manually test float switches (Duty Start, Standby Start, High Level Alarm)',
        'Verify automatic duty/standby pump alternator reverses lead pump',
        'Remove floating debris, trash, or plastic bags from sump pit surfaces',
        'Test high water level alarm horn and visual beacon light',
        'Check discharge line gate valves to ensure they are fully open'
      ],
      'Monthly': [
        'Inspect submersible power cables for sheath wear, cuts, or swelling',
        'Clean float switch bulbs and remove grease/sludge accumulation',
        'Measure operating current (Amps) of each pump motor with clamp meter',
        'Inspect control panel contactors, relays, and thermal overloads'
      ],
      'Quarterly': [
        'Pump out pit completely and remove accumulated mud, silt, and sand (De-silting)',
        'Inspect check valve rubber flappers and spring return mechanisms',
        'Test motor insulation resistance with 500V Megger (min. 20 M-ohms requirement)'
      ],
      'Annual': [
        'Hoist submersible pumps for full mechanical seal and impeller inspection',
        'Check motor oil chamber for water contamination and replace seal oil',
        'Clean and repaint pump casing and stainless steel lifting chains',
        'Conduct full simulated maximum inflow flood de-watering test'
      ]
    },
    warnings: 'ELECTRICAL & CONFINED SPACE WARNING: Never enter a sump pit without atmospheric testing for toxic gases (H2S, CO). Always isolate, lock out, and tag out electrical breakers before touching pump cables or hoisting units.'
  },
  housekeeping: {
    id: 'housekeeping',
    title: 'Housekeeping & Janitorial Procedure',
    code: 'SOP-HK-01',
    system: 'Architectural',
    purpose: 'To establish standardized housekeeping and janitorial procedures that ensure cleanliness, safety, and operational efficiency across all building areas.',
    references: [
      'ISO 9001: Quality Management Systems',
      'Local sanitation and waste disposal regulations',
      'Building safety and fire codes'
    ],
    specs: [
      { parameter: 'Cleaning Shift', specification: '6:00 AM – 3:00 PM / 2:00 PM – 11:00 PM' },
      { parameter: 'PPE Required', specification: 'Rubber Gloves, Face Mask, Wet Floor Signs, Uniform' },
      { parameter: 'Area Scope', specification: 'Lobbies, corridors, restrooms, elevators, parking levels, reception, and planters' }
    ],
    definitions: [
      { term: 'Housekeeping', def: 'Routine cleaning and tidying of building areas.' },
      { term: 'Janitorial Services', def: 'Comprehensive cleaning, sanitation, and waste management tasks.' }
    ],
    instructions: [
      {
        title: 'Daily Cleaning Procedure',
        content: '<ol><li>Sweep and mop floors in common areas, lobbies, and corridors.</li><li>Empty trash bins and replace liners.</li><li>Clean and disinfect restrooms (toilets, sinks, mirrors, floors).</li><li>Wipe elevator panels, doors, and lobby glass surfaces.</li><li>Dust furniture, fixtures, and reception counters.</li></ol>'
      },
      {
        title: 'Weekly Deep Cleaning',
        content: '<ol><li>Deep clean restrooms (tiles, grout, partitions).</li><li>Polish stainless steel elevator doors and handrails.</li><li>Clean parking area floors, wipe signages, and sweep dirt.</li></ol>'
      },
      {
        title: 'Monthly & Special Cleaning',
        content: '<ul><li>Wash exterior windows and façade glass.</li><li>Pressure wash roofdeck and drainage areas.</li><li>Strip tiled floors in lobbies.</li><li><strong>Spill Response:</strong> Contain, clean, and disinfect immediately. Use warning signs.</li><li><strong>Emergency Cleaning:</strong> Respond to leaks, floods, or accidents.</li></ul>'
      }
    ],
    checklist: {
      'GROUND FLOOR (GF)': [
        'Sweep hallways, lobby, stairs, elevator, window facade and fire exit',
        'Mop the floors using suitable cleaner and disinfectant',
        'Clean edges and corners to remove accumulated dirt',
        'Clean windows, curtain wall frames and glass surfaces',
        'Spot clean walls and remove any smudges or marks',
        'Dust and clean light fixtures and wall decorations',
        'Clean and polish stainless steel elevator trim and railings',
        'Remove cobwebs from corners and high ceiling areas',
        'Clean glass doors and glass partitions',
        'Inspect GF drainage systems and clear blockages',
        'Inspect window frames for rust and corrosion',
        'Inspect and clean GF airwell ventilation',
        'Check GF fire exit routes and ensure exit doors are unlocked',
        'Clear any obstructions in the GF fire exit corridors',
        'Check and dust GF signage and emergency lighting',
        'Clean and disinfect GF elevator buttons and controls',
        'Clean elevator cabin handrails, doors, and frames',
        'Inspect and clean elevator cabin ventilation grilles',
        'Electrical Room: Sweep/mop floor, check for overheating equipment',
        'Water Meter Room: Inspect pipes for leaks, verify water meter readings',
        'MRF: Empty/clean waste bins, check for spills/spill hazards',
        'Janitorial Room: Organize supplies, sanitize mop sink area',
        'Reception: Dust desk and table surfaces, sanitize counter and phone',
        'Planters: Water lobby plants, prune dead leaves, remove debris'
      ],
      'BASEMENT 1 (1B)': [
        'Sweep parking floors to remove dirt and debris',
        'Mop parking floors using suitable cleaner/disinfectant',
        'Spot clean walls, concrete columns, and structural pillars',
        'Verify that parking slot numbers and signs are legible',
        'Inspect concrete slab for new cracks, deflection, or potholes',
        'Inspect and clean basement ventilation grilles',
        'Ensure parking area is well-lit for safety and security',
        'Remove debris and dust from basement exhaust blowers',
        'Check basement corners for signs of pest infestation',
        'Clean and disinfect 1B elevator buttons, handrails, and doors',
        'CCTV Room: Clean glass doors, windows, sweep and mop floors',
        'MDP: Dust MDP panel, ensure door latches, check for hot breakers',
        'Generator Room: Check genset for leaks/corrosion, check fluid levels'
      ],
      'BASEMENT 2 (2B)': [
        'Sweep parking slots and driveways to remove grease and debris',
        'Mop floors and wipe down parking signs',
        'Inspect basement structural columns for cracks or water stains',
        'Clean and inspect basement exhaust blowers and ductwork',
        'Ensure 2B emergency exit routes are clear and well-lit',
        'Clean and disinfect 2B elevator lobby, doors, and controls',
        'Water Pump Room: Check domestic pump bearings, inspect lines for leaks'
      ],
      'BASEMENT 3 (3B)': [
        'Sweep bottom basement floor and check sump pit pumps',
        'Mop floor areas and clear grease traps',
        'Inspect foundation walls for water seepage or structural cracks',
        'Clean and disinfect 3B elevator lobby, controls, and doors',
        'Ensure 3B emergency egress routes are clear and doors operate',
        'Sump Pit Area: Verify automatic float switch on sump pumps'
      ],
      'TYPICAL FLOORS (2F-8F)': [
        'Sweep hallways, elevator lobbies, and stairs',
        'Mop hallways and stairs using disinfectant',
        'Clean windows, frames, and curtain wall glass',
        'Spot clean walls and wipe down lobby handrails',
        'Dust and clean hallway light fixtures and signages',
        'Remove cobwebs from high corners and elevator shafts',
        'Clean glass lobby partitions and doors',
        'Inspect floor drainage systems to prevent blockages',
        'Ensure exit routes and stairwells are clear and doors unlocked',
        'Clean and disinfect elevator buttons, cabin handrails, and frames',
        'Electrical Closet: Sweep closet floor, check for breaker anomalies',
        'Restrooms: Clean toilets/urinals, sanitize sinks, mirrors, and floors'
      ]
    },
    warnings: 'SAFETY PRECAUTION: Always put up "Wet Floor" yellow warning signs before mopping. Wear rubber gloves and eye protection when diluting sanitizing chemicals.'
  }
};

// Equipment Specifications & Meter Database
const EQUIPMENT_METER_DB = {
  genset: [
    { id: 'eq_genset_1', name: 'Genset Cummins KTAA19-G6A Engine', initialHours: 1248.5, hasFuel: true, fuelCap: 500, currentFuel: 425, serviceInterval: 250, lastServiceHours: 1000.0, unit: 'Hrs' }
  ],
  firepump: [
    { id: 'eq_fp_1', name: 'Main Fire Pump Diesel Engine', initialHours: 412.0, hasFuel: true, fuelCap: 250, currentFuel: 220, serviceInterval: 500, lastServiceHours: 0, unit: 'Hrs' },
    { id: 'eq_fp_2', name: 'Jockey Pump Electric Motor', initialHours: 890.2, hasFuel: false, serviceInterval: 1000, lastServiceHours: 0, unit: 'Hrs' }
  ],
  stp: [
    { id: 'eq_stp_1', name: 'Aeration Blower 1 Motor (Duty)', initialHours: 3120.0, hasFuel: false, serviceInterval: 3200, lastServiceHours: 0, unit: 'Hrs' },
    { id: 'eq_stp_2', name: 'Aeration Blower 2 Motor (Standby)', initialHours: 2980.5, hasFuel: false, serviceInterval: 3200, lastServiceHours: 0, unit: 'Hrs' },
    { id: 'eq_stp_3', name: 'Sludge & Effluent Transfer Pump Motor', initialHours: 1450.0, hasFuel: false, serviceInterval: 2000, lastServiceHours: 0, unit: 'Hrs' }
  ],
  domestic_water: [
    { id: 'eq_dw_1', name: 'Domestic Water Transfer Pump 1 (Duty)', initialHours: 1680.0, hasFuel: false, serviceInterval: 2000, lastServiceHours: 0, unit: 'Hrs' },
    { id: 'eq_dw_2', name: 'Domestic Water Transfer Pump 2 (Standby)', initialHours: 1520.5, hasFuel: false, serviceInterval: 2000, lastServiceHours: 0, unit: 'Hrs' },
    { id: 'eq_dw_3', name: 'Triplex VFD Constant Pressure Booster System', initialHours: 4210.0, hasFuel: false, serviceInterval: 3000, lastServiceHours: 0, unit: 'Hrs' }
  ],
  submersible_pump: [
    { id: 'eq_sub_1', name: 'Basement 3 Main Sump Pump 1 (Duty)', initialHours: 890.0, hasFuel: false, serviceInterval: 1500, lastServiceHours: 0, unit: 'Hrs' },
    { id: 'eq_sub_2', name: 'Basement 3 Main Sump Pump 2 (Standby)', initialHours: 760.5, hasFuel: false, serviceInterval: 1500, lastServiceHours: 0, unit: 'Hrs' },
    { id: 'eq_sub_3', name: 'Elevator Shaft Sump Submersible Pump', initialHours: 320.0, hasFuel: false, serviceInterval: 1500, lastServiceHours: 0, unit: 'Hrs' }
  ],
  housekeeping: [
    { id: 'eq_hk_1', name: 'Roofdeck Pressure Washer / Polisher Engine', initialHours: 215.0, hasFuel: false, serviceInterval: 500, lastServiceHours: 0, unit: 'Hrs' }
  ]
};

// Seed Data for Run Hours & Fuel Logs
const DEFAULT_RUN_HOURS_LOGS = [
  {
    id: 'rh_1',
    procedureId: 'genset',
    equipmentId: 'eq_genset_1',
    equipmentName: 'Genset Cummins KTAA19-G6A Engine',
    dateTime: '2026-08-14 10:00',
    startMeter: 1246.0,
    endMeter: 1248.5,
    runHours: 2.5,
    fuelBefore: 460.0,
    fuelAdded: 0,
    fuelAfter: 425.0,
    fuelConsumed: 35.0,
    burnRate: 14.0,
    technician: 'Martin Naimes',
    notes: 'Regular weekly load test run. Genset operated under 50% building load. Oil pressure 60 PSI, temp 82°C.'
  },
  {
    id: 'rh_2',
    procedureId: 'firepump',
    equipmentId: 'eq_fp_1',
    equipmentName: 'Main Fire Pump Diesel Engine',
    dateTime: '2026-08-12 14:30',
    startMeter: 411.5,
    endMeter: 412.0,
    runHours: 0.5,
    fuelBefore: 224.5,
    fuelAdded: 0,
    fuelAfter: 220.0,
    fuelConsumed: 4.5,
    burnRate: 9.0,
    technician: 'Mr. Crispin de Gracia',
    notes: 'Weekly churn test. Cut-in pressure verified at 100 PSI.'
  },
  {
    id: 'rh_3',
    procedureId: 'stp',
    equipmentId: 'eq_stp_1',
    equipmentName: 'Aeration Blower 1 Motor (Duty)',
    dateTime: '2026-08-15 08:00',
    startMeter: 3096.0,
    endMeter: 3120.0,
    runHours: 24.0,
    fuelBefore: 0,
    fuelAdded: 0,
    fuelAfter: 0,
    fuelConsumed: 0,
    burnRate: 0,
    technician: 'Mr. George Ybañez',
    notes: 'Continuous duty rotation. Dissolved oxygen levels normal at 2.4 mg/L.'
  }
];

// Seed Data for Procurement of Spare Parts / Items
const DEFAULT_PROCUREMENT_LOGS = [
  {
    id: 'proc_1',
    itemName: 'Cummins Lube Oil Filter LF9009',
    system: 'Genset',
    partNo: 'PN-LF9009',
    quantity: 2,
    unit: 'Pcs',
    unitCost: 2450.00,
    totalCost: 4900.00,
    date: '2026-08-05',
    supplier: 'Cummins Sales & Service Phils.',
    poNo: 'PO-2026-0891',
    status: 'In Stock',
    notes: 'Primary oil filter for 250-hour engine maintenance.'
  },
  {
    id: 'proc_2',
    itemName: 'Diesel Fuel-Water Separator Filter FS1000',
    system: 'Genset',
    partNo: 'PN-FS1000',
    quantity: 2,
    unit: 'Pcs',
    unitCost: 1850.00,
    totalCost: 3700.00,
    date: '2026-08-05',
    supplier: 'Cummins Sales & Service Phils.',
    poNo: 'PO-2026-0891',
    status: 'In Stock',
    notes: 'Fuel system primary filter replacement.'
  },
  {
    id: 'proc_3',
    itemName: 'SAE 15W-40 Lube Oil (15L Pail)',
    system: 'Genset',
    partNo: 'SAE15W40-15L',
    quantity: 4,
    unit: 'Pails',
    unitCost: 4200.00,
    totalCost: 16800.00,
    date: '2026-08-01',
    supplier: 'Shell Commercial Lubricants',
    poNo: 'PO-2026-0842',
    status: 'Installed',
    notes: 'Engine oil top-up and change out stock.'
  },
  {
    id: 'proc_4',
    itemName: 'Fire Pump Mechanical Packing Seal Set',
    system: 'FirePump',
    partNo: 'FPS-MECH-02',
    quantity: 1,
    unit: 'Set',
    unitCost: 5600.00,
    totalCost: 5600.00,
    date: '2026-07-28',
    supplier: 'Safety Fire Equipment Corp',
    poNo: 'PO-2026-0799',
    status: 'In Stock',
    notes: 'Replacement gland packing for horizontal split-case pump.'
  },
  {
    id: 'proc_5',
    itemName: 'Jockey Pump Pressure Switch (120-140 PSI)',
    system: 'FirePump',
    partNo: 'SQ-9012-GNG1',
    quantity: 1,
    unit: 'Pc',
    unitCost: 3800.00,
    totalCost: 3800.00,
    date: '2026-07-20',
    supplier: 'Schneider Electric Phils.',
    poNo: 'PO-2026-0745',
    status: 'Installed',
    notes: 'Replaced faulty pressure switch controlling jockey pump start/stop.'
  },
  {
    id: 'proc_6',
    itemName: 'Sodium Hypochlorite Solution (50L Carboy)',
    system: 'STP',
    partNo: 'CHEM-HYPO-50L',
    quantity: 5,
    unit: 'Carboys',
    unitCost: 2100.00,
    totalCost: 10500.00,
    date: '2026-08-10',
    supplier: 'Allied Chemical Supplies',
    poNo: 'PO-2026-0912',
    status: 'In Stock',
    notes: 'STP effluent liquid chemical disinfection.'
  },
  {
    id: 'proc_7',
    itemName: 'Rotary Blower Heavy Duty Drive Belt B-52',
    system: 'STP',
    partNo: 'BELT-B52',
    quantity: 4,
    unit: 'Pcs',
    unitCost: 950.00,
    totalCost: 3800.00,
    date: '2026-08-02',
    supplier: 'Bando Belts Industrial Supply',
    poNo: 'PO-2026-0850',
    status: 'In Stock',
    notes: 'Spare drive belts for STP aeration blowers 1 & 2.'
  },
  {
    id: 'proc_8',
    itemName: 'Triplex Booster Pump Digital Pressure Sensor 0-100 PSI',
    system: 'DomesticWater',
    partNo: 'PN-TRANSDUCER-100',
    quantity: 1,
    unit: 'Pc',
    unitCost: 4500.00,
    totalCost: 4500.00,
    date: '2026-08-08',
    supplier: 'Danfoss Industrial Controls',
    poNo: 'PO-2026-0902',
    status: 'In Stock',
    notes: 'Replacement VFD feedback loop 4-20mA pressure transducer.'
  },
  {
    id: 'proc_9',
    itemName: 'Basement Submersible Sump Pump IP68 Mechanical Seal Kit',
    system: 'SubmersiblePump',
    partNo: 'EBARA-MECH-SEAL-50',
    quantity: 2,
    unit: 'Sets',
    unitCost: 3200.00,
    totalCost: 6400.00,
    date: '2026-07-30',
    supplier: 'Ebara Pumps Philippines',
    poNo: 'PO-2026-0810',
    status: 'In Stock',
    notes: 'Silicon carbide mechanical shaft seal for 3.0 HP sump pumps.'
  },
  {
    id: 'proc_10',
    itemName: 'Submersible Float Switch Bulb Assembly (10m Neoprene Cable)',
    system: 'SubmersiblePump',
    partNo: 'MAC3-FLOAT-10M',
    quantity: 3,
    unit: 'Pcs',
    unitCost: 1850.00,
    totalCost: 5550.00,
    date: '2026-08-03',
    supplier: 'Automation & Controls Inc.',
    poNo: 'PO-2026-0855',
    status: 'Installed',
    notes: 'Heavy duty tilt float switch for B3 main sump pit high alarm.'
  }
];

// Application State for Procedures module
let activeProcedureId = 'genset';
let activeTab = 'manual';
let historyLogs = [];
let runHoursLogs = [];
let procurementLogs = [];
let previewLogId = null; // Tracks if we are viewing a past log details
let activeChecklistImages = []; // Stores attached photos for compliance checklist

// Theme Management System (Light / Dark Mode)
window.initTheme = function() {
  const savedTheme = localStorage.getItem('onecorp_app_theme') || 'dark';
  applyTheme(savedTheme);
};

window.toggleTheme = function() {
  const isLight = document.body.classList.contains('light-theme');
  const newTheme = isLight ? 'dark' : 'light';
  applyTheme(newTheme);
};

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }
  try {
    localStorage.setItem('onecorp_app_theme', theme);
  } catch (e) {}

  const icon = document.getElementById('theme-toggle-icon');
  const label = document.getElementById('theme-toggle-label');
  if (icon) icon.innerText = theme === 'light' ? '🌙' : '☀️';
  if (label) label.innerText = theme === 'light' ? 'Dark Mode' : 'Light Mode';
}

// Immediate theme execution on script load to prevent flicker
(function() {
  try {
    const savedTheme = localStorage.getItem('onecorp_app_theme');
    if (savedTheme === 'light' && document.body) {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  } catch (e) {}
})();

// Dom Content Loaded Entry point
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  // Set date picker default to today
  const today = new Date().toISOString().split('T')[0];
  if (document.getElementById('form-date')) document.getElementById('form-date').value = today;
  if (document.getElementById('proc-date')) document.getElementById('proc-date').value = today;

  const nowLocal = new Date().toISOString().slice(0, 16);
  if (document.getElementById('rh-date')) document.getElementById('rh-date').value = nowLocal;

  // Load state from local storage
  loadHistoryFromStorage();
  loadRunHoursFromStorage();
  loadProcurementFromStorage();
  
  // Set first procedure
  switchProcedure('genset');
  
  // Update sidebar dates
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  if (document.getElementById('current-date-text')) {
    document.getElementById('current-date-text').innerText = new Date().toLocaleDateString('en-US', options);
  }
});

// Switch Active Procedure
window.switchProcedure = function(id) {
  activeProcedureId = id;
  previewLogId = null;
  
  // Toggle sidebar items active
  document.querySelectorAll('.sidebar-menu a').forEach(el => {
    el.classList.remove('active');
  });
  
  // Map ID to index in elements
  const procedureOrder = ['genset', 'firepump', 'stp', 'domestic_water', 'submersible_pump', 'housekeeping'];
  const index = procedureOrder.indexOf(id);
  
  const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
  if (index !== -1 && menuItems[index]) {
    menuItems[index].classList.add('active');
  }

  // Get active procedure data
  const data = PROCEDURE_DB[id];
  
  // 1. Populate top header
  document.getElementById('active-procedure-title').innerText = data.title;
  
  // 2. Populate manual tab contents
  document.getElementById('manual-code-tag').innerText = data.code;
  document.getElementById('manual-purpose').innerText = data.purpose;
  
  // Specs
  const specsCard = document.getElementById('manual-specs-card');
  const specsTable = document.getElementById('manual-specs-table');
  if (data.specs && data.specs.length > 0) {
    specsCard.style.display = 'block';
    specsTable.innerHTML = data.specs.map(s => `
      <tr>
        <th>${s.parameter}</th>
        <td>${s.specification}</td>
      </tr>
    `).join('');
  } else {
    specsCard.style.display = 'none';
  }
  
  // References & Definitions
  let defsHTML = '';
  if (data.references && data.references.length > 0) {
    defsHTML += '<h4>Reference Standard Documents</h4><ul>';
    defsHTML += data.references.map(r => `<li>${r}</li>`).join('');
    defsHTML += '</ul><br>';
  }
  if (data.definitions && data.definitions.length > 0) {
    defsHTML += '<h4>Terminology Definitions</h4><ul>';
    defsHTML += data.definitions.map(d => `<li><strong>${d.term}:</strong> ${d.def}</li>`).join('');
    defsHTML += '</ul>';
  }
  document.getElementById('manual-definitions').innerHTML = defsHTML;
  
  // Accordion instructions
  const accordionContainer = document.getElementById('manual-instructions-accordion');
  accordionContainer.innerHTML = data.instructions.map((inst, idx) => `
    <div class="accordion-item ${idx === 0 ? 'open' : ''}">
      <div class="accordion-header" onclick="toggleAccordion(this)">
        <span>${inst.title}</span>
        <span class="accordion-arrow">▼</span>
      </div>
      <div class="accordion-content">
        ${inst.content}
      </div>
    </div>
  `).join('');

  // 3. Populate Checklist filter selector
  const selectField = document.getElementById('checklist-selector-field');
  const selectLabel = document.getElementById('checklist-selector-label');
  
  const subCategories = Object.keys(data.checklist);
  selectField.innerHTML = subCategories.map(sub => `<option value="${sub}">${sub}</option>`).join('');
  
  if (id === 'housekeeping') {
    selectLabel.innerText = "Select Building Floor:";
  } else {
    selectLabel.innerText = "Select Test Interval:";
  }

  // Load warnings
  const warningBox = document.getElementById('checklist-warning-box');
  if (data.warnings) {
    warningBox.style.display = 'block';
    warningBox.innerText = data.warnings;
  } else {
    warningBox.style.display = 'none';
  }

  // Reset checklist view
  resetChecklistForm();

  // Update active subtab data if currently on runhours or procurement
  if (activeTab === 'runhours') {
    renderRunHoursTab();
  } else if (activeTab === 'procurement') {
    renderProcurementTab();
  } else {
    switchSubTab('manual');
  }
};

// Switch sub tabs
window.switchSubTab = function(tab) {
  activeTab = tab;
  
  // Toggle tab buttons active
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  if (document.getElementById(`btn-tab-${tab}`)) {
    document.getElementById(`btn-tab-${tab}`).classList.add('active');
  }
  
  // Toggle panels visible
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  if (document.getElementById(`panel-${tab}`)) {
    document.getElementById(`panel-${tab}`).classList.add('active');
  }
  
  // Render specific tab contents
  if (tab === 'logs') {
    renderLogsHistory();
  } else if (tab === 'runhours') {
    renderRunHoursTab();
  } else if (tab === 'procurement') {
    renderProcurementTab();
  }
};

// Toggle accordion item
window.toggleAccordion = function(headerElement) {
  const item = headerElement.closest('.accordion-item');
  const isOpen = item.classList.contains('open');
  
  // Close all
  document.querySelectorAll('.accordion-item').forEach(el => {
    el.classList.remove('open');
  });
  
  // Open target
  if (!isOpen) {
    item.classList.add('open');
  }
};

// Load items in the active checklist form
window.loadChecklistFormItems = function() {
  const data = PROCEDURE_DB[activeProcedureId];
  const selectedSub = document.getElementById('checklist-selector-field').value;
  const tbody = document.getElementById('checklist-form-tbody');
  tbody.innerHTML = '';
  
  if (!data || !selectedSub || !data.checklist[selectedSub]) return;

  const items = data.checklist[selectedSub];
  items.forEach((itemText, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-num">${idx + 1}</td>
      <td class="col-desc" style="font-weight: 500;">${itemText}</td>
      <td class="col-choices">
        <div class="radio-group">
          <label class="radio-choice">
            <input type="radio" name="status_${idx}" value="YES" required onchange="calculateScore()" ${previewLogId !== null ? 'disabled' : ''}>
            <span>YES</span>
          </label>
          <label class="radio-choice">
            <input type="radio" name="status_${idx}" value="NO" onchange="calculateScore()" ${previewLogId !== null ? 'disabled' : ''}>
            <span>NO</span>
          </label>
          <label class="radio-choice">
            <input type="radio" name="status_${idx}" value="NA" onchange="calculateScore()" ${previewLogId !== null ? 'disabled' : ''}>
            <span>N/A</span>
          </label>
        </div>
      </td>
      <td class="col-remarks">
        <input type="text" class="input-remarks" name="remarks_${idx}" placeholder="Add observation details..." ${previewLogId !== null ? 'disabled' : ''}>
      </td>
      <td class="col-initials">
        <input type="text" class="input-initials" name="initials_${idx}" maxlength="3" placeholder="Init" ${previewLogId !== null ? 'disabled' : ''}>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  calculateScore();
};

// Calculate Score Percentage based on yes/no choices
window.calculateScore = function() {
  const tbody = document.getElementById('checklist-form-tbody');
  const rows = tbody.querySelectorAll('tr');
  let totalCount = 0;
  let yesCount = 0;
  
  rows.forEach((row, idx) => {
    const radios = document.getElementsByName(`status_${idx}`);
    let val = '';
    radios.forEach(r => {
      if (r.checked) val = r.value;
    });
    
    if (val === 'YES') {
      yesCount++;
      totalCount++;
    } else if (val === 'NO') {
      totalCount++;
    }
  });

  const pct = totalCount > 0 ? Math.round((yesCount / totalCount) * 100) : 0;
  document.getElementById('score-percentage').innerText = `${pct}% (${yesCount} / ${totalCount} OK)`;
  return pct;
};

// ==================== COMPLIANCE CHECKLIST IMAGE UPLOAD & EVIDENCE ====================

// Helper to compress and convert file to data URL
function processImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG with 0.82 quality to optimize storage while maintaining crisp clarity
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          dataUrl: compressedDataUrl,
          name: file.name,
          size: file.size,
          caption: '',
          category: 'General Inspection',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      };
      img.onerror = () => {
        resolve({
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          dataUrl: e.target.result,
          name: file.name,
          size: file.size,
          caption: '',
          category: 'General Inspection',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      };
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

window.handleChecklistImageUpload = async function(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (validFiles.length === 0) {
    alert("Please select valid image files (PNG, JPG, JPEG, WEBP).");
    return;
  }

  for (const file of validFiles) {
    try {
      const processed = await processImageFile(file);
      activeChecklistImages.push(processed);
    } catch (err) {
      console.error("Error processing image file:", err);
    }
  }

  // Clear file input so same files can be re-selected if desired
  event.target.value = '';
  renderChecklistImages(false);
};

window.handleImageDragOver = function(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropzone = document.getElementById('checklist-dropzone');
  if (dropzone) dropzone.classList.add('dragover');
};

window.handleImageDragLeave = function(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropzone = document.getElementById('checklist-dropzone');
  if (dropzone) dropzone.classList.remove('dragover');
};

window.handleImageDrop = async function(event) {
  event.preventDefault();
  event.stopPropagation();
  const dropzone = document.getElementById('checklist-dropzone');
  if (dropzone) dropzone.classList.remove('dragover');

  if (previewLogId !== null) return; // read only mode

  const dt = event.dataTransfer;
  const files = dt ? dt.files : null;
  if (!files || files.length === 0) return;

  const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (validFiles.length === 0) {
    alert("Please drop valid image files (PNG, JPG, JPEG, WEBP).");
    return;
  }

  for (const file of validFiles) {
    try {
      const processed = await processImageFile(file);
      activeChecklistImages.push(processed);
    } catch (err) {
      console.error("Error processing dropped image:", err);
    }
  }

  renderChecklistImages(false);
};

window.renderChecklistImages = function(isReadOnly = false) {
  const previewContainer = document.getElementById('checklist-images-preview-container');
  const dropzone = document.getElementById('checklist-dropzone');
  const countBadge = document.getElementById('chk-images-count-badge');
  const btnGroup = document.getElementById('chk-image-btn-group');

  if (!previewContainer) return;

  const total = activeChecklistImages.length;
  if (countBadge) {
    countBadge.innerText = `${total} Attached`;
  }

  if (btnGroup) {
    btnGroup.style.display = isReadOnly ? 'none' : 'flex';
  }

  if (dropzone) {
    if (isReadOnly) {
      dropzone.style.display = 'none';
    } else {
      dropzone.style.display = total === 0 ? 'flex' : 'none';
    }
  }

  if (total === 0) {
    previewContainer.style.display = 'none';
    previewContainer.innerHTML = '';
    return;
  }

  previewContainer.style.display = 'grid';
  previewContainer.innerHTML = activeChecklistImages.map((img, idx) => {
    let badgeClass = 'badge-general';
    if (img.category === 'Defect / Issue') badgeClass = 'badge-defect';
    else if (img.category === 'Rectified Condition') badgeClass = 'badge-rectified';
    else if (img.category === 'Meter / Gauge Reading') badgeClass = 'badge-meter';

    const safeCaption = (img.caption || '').replace(/"/g, '&quot;');

    return `
      <div class="image-preview-card">
        ${!isReadOnly ? `
          <button type="button" class="image-btn-delete" title="Remove image" onclick="removeChecklistImage('${img.id}')">&times;</button>
        ` : ''}
        <div class="image-thumb-wrapper" onclick="openImageLightbox('${img.dataUrl}', '${safeCaption || img.name}')">
          <img src="${img.dataUrl}" alt="${safeCaption || 'Inspection photo'}">
          <div class="image-thumb-zoom-overlay">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            <span>Click to Enlarge</span>
          </div>
        </div>
        <div class="image-card-body">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
            <span style="font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase;">Photo ${idx + 1}</span>
            ${isReadOnly ? `
              <span class="image-category-badge ${badgeClass}">${img.category || 'General Inspection'}</span>
            ` : `
              <select class="image-category-select" style="width: auto; padding: 2px 6px; font-size: 10px;" onchange="updateImageCategory('${img.id}', this.value)">
                <option value="General Inspection" ${img.category === 'General Inspection' ? 'selected' : ''}>General</option>
                <option value="Defect / Issue" ${img.category === 'Defect / Issue' ? 'selected' : ''}>Defect / Issue</option>
                <option value="Rectified Condition" ${img.category === 'Rectified Condition' ? 'selected' : ''}>Rectified</option>
                <option value="Meter / Gauge Reading" ${img.category === 'Meter / Gauge Reading' ? 'selected' : ''}>Meter / Gauge</option>
              </select>
            `}
          </div>
          ${isReadOnly ? `
            <div style="font-size: 11px; color: #cbd5e1; font-style: italic; min-height: 18px;">
              ${img.caption ? `"${img.caption}"` : '<span style="color:var(--text-muted);">(No caption provided)</span>'}
            </div>
          ` : `
            <input type="text" class="image-caption-input" placeholder="Add caption/observation..." value="${safeCaption}" oninput="updateImageCaption('${img.id}', this.value)">
          `}
          <div style="display: flex; justify-content: space-between; font-size: 9.5px; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4px; margin-top: auto;">
            <span style="max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${img.name || 'photo.jpg'}</span>
            <span>${img.timestamp || ''}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

window.removeChecklistImage = function(imgId) {
  activeChecklistImages = activeChecklistImages.filter(img => img.id !== imgId);
  renderChecklistImages(false);
};

window.updateImageCaption = function(imgId, newCaption) {
  const target = activeChecklistImages.find(img => img.id === imgId);
  if (target) {
    target.caption = newCaption;
  }
};

window.updateImageCategory = function(imgId, newCategory) {
  const target = activeChecklistImages.find(img => img.id === imgId);
  if (target) {
    target.category = newCategory;
  }
};

window.openImageLightbox = function(src, caption) {
  const modal = document.getElementById('image-lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  if (!modal || !img) return;

  img.src = src;
  if (cap) {
    cap.innerText = caption || 'Inspection Photographic Evidence';
    cap.style.display = caption ? 'block' : 'none';
  }
  modal.style.display = 'flex';
};

window.closeImageLightbox = function(event) {
  if (event && event.target && event.target.id !== 'image-lightbox-modal' && !event.target.classList.contains('lightbox-close')) {
    return;
  }
  const modal = document.getElementById('image-lightbox-modal');
  if (modal) modal.style.display = 'none';
};

// Reset Form Inputs
window.resetChecklistForm = function() {
  previewLogId = null;
  activeChecklistImages = [];
  document.getElementById('checklist-form').reset();
  
  // Re-enable submit button
  const submitBtn = document.getElementById('btn-submit-checklist');
  submitBtn.innerText = "Submit Inspection Checklist";
  submitBtn.style.display = 'inline-flex';
  
  // Re-enable form fields
  document.getElementById('form-date').disabled = false;
  document.getElementById('form-prepared').disabled = false;
  document.getElementById('form-inspected').disabled = false;
  document.getElementById('checklist-selector-field').disabled = false;
  if (document.getElementById('form-chk-runhours')) document.getElementById('form-chk-runhours').disabled = false;
  if (document.getElementById('form-chk-fuel')) document.getElementById('form-chk-fuel').disabled = false;
  if (document.getElementById('form-chk-part')) document.getElementById('form-chk-part').disabled = false;
  
  const insertBtn = document.getElementById('btn-insert-images');
  if (insertBtn) insertBtn.disabled = false;
  const fileInput = document.getElementById('form-chk-images-input');
  if (fileInput) fileInput.disabled = false;

  // Render empty images state
  renderChecklistImages(false);

  // Load items
  loadChecklistFormItems();
};

// Submit Checklist Form Handler
window.handleChecklistSubmit = function(event) {
  event.preventDefault();
  
  if (previewLogId !== null) {
    alert("Cannot submit: You are currently viewing a saved log preview.");
    return;
  }

  const data = PROCEDURE_DB[activeProcedureId];
  const subCategory = document.getElementById('checklist-selector-field').value;
  const dateVal = document.getElementById('form-date').value;
  const preparedBy = document.getElementById('form-prepared').value;
  const inspectedBy = document.getElementById('form-inspected').value;
  
  const chkRunHours = document.getElementById('form-chk-runhours') ? document.getElementById('form-chk-runhours').value : '';
  const chkFuel = document.getElementById('form-chk-fuel') ? document.getElementById('form-chk-fuel').value : '';
  const chkPart = document.getElementById('form-chk-part') ? document.getElementById('form-chk-part').value : '';

  // Gather item results
  const items = data.checklist[subCategory];
  const responses = [];
  
  let allAnswered = true;
  items.forEach((itemText, idx) => {
    const radios = document.getElementsByName(`status_${idx}`);
    let val = '';
    radios.forEach(r => {
      if (r.checked) val = r.value;
    });
    
    if (!val) {
      allAnswered = false;
    }
    
    const remarks = document.getElementsByName(`remarks_${idx}`)[0].value;
    const initials = document.getElementsByName(`initials_${idx}`)[0].value;
    
    responses.push({
      itemNum: idx + 1,
      description: itemText,
      status: val,
      remarks,
      initials
    });
  });

  if (!allAnswered) {
    alert("Please fill out status options (YES/NO/NA) for all inspection items.");
    return;
  }

  const score = calculateScore();

  // Create new Log object
  const newLog = {
    id: 'log_' + Date.now(),
    procedureId: activeProcedureId,
    procedureTitle: data.title,
    procedureCode: data.code,
    subCategory,
    date: dateVal,
    preparedBy,
    inspectedBy,
    score,
    items: responses,
    images: [...activeChecklistImages], // Persist all uploaded inspection photos & evidence
    chkRunHours,
    chkFuel,
    chkPart
  };

  historyLogs.unshift(newLog);
  saveHistoryToStorage();
  
  alert("Compliance checklist with photographic evidence submitted and saved to history logs successfully!");
  
  // Switch to Logs Tab
  switchSubTab('logs');
};

// Storage local save/load for Inspection History
function saveHistoryToStorage() {
  localStorage.setItem('onecorporate_maintenance_procedures_history', JSON.stringify(historyLogs));
}

function loadHistoryFromStorage() {
  const saved = localStorage.getItem('onecorporate_maintenance_procedures_history');
  if (saved) {
    try {
      historyLogs = JSON.parse(saved);
    } catch(e) {
      console.error(e);
      historyLogs = [];
    }
  } else {
    historyLogs = [];
  }
}

// Storage local save/load for Run Hours & Fuel Logs
function saveRunHoursToStorage() {
  localStorage.setItem('onecorporate_run_hours_logs', JSON.stringify(runHoursLogs));
}

function loadRunHoursFromStorage() {
  const saved = localStorage.getItem('onecorporate_run_hours_logs');
  if (saved) {
    try {
      runHoursLogs = JSON.parse(saved);
    } catch(e) {
      console.error(e);
      runHoursLogs = [...DEFAULT_RUN_HOURS_LOGS];
    }
  } else {
    runHoursLogs = [...DEFAULT_RUN_HOURS_LOGS];
  }
}

// Storage local save/load for Procurement Logs
function saveProcurementToStorage() {
  localStorage.setItem('onecorporate_procurement_logs', JSON.stringify(procurementLogs));
}

function loadProcurementFromStorage() {
  const saved = localStorage.getItem('onecorporate_procurement_logs');
  if (saved) {
    try {
      procurementLogs = JSON.parse(saved);
    } catch(e) {
      console.error(e);
      procurementLogs = [...DEFAULT_PROCUREMENT_LOGS];
    }
  } else {
    procurementLogs = [...DEFAULT_PROCUREMENT_LOGS];
  }
}

// ==================== RUN HOURS & FUEL TRACKING MODULE ====================

window.renderRunHoursTab = function() {
  const cardsContainer = document.getElementById('runhours-summary-cards');
  const selectDropdown = document.getElementById('rh-equipment-select');
  const tbody = document.getElementById('runhours-table-tbody');

  if (!cardsContainer || !selectDropdown || !tbody) return;

  // Get equipment list for active system
  const equipmentList = EQUIPMENT_METER_DB[activeProcedureId] || EQUIPMENT_METER_DB['genset'];

  // Populate equipment select dropdown
  selectDropdown.innerHTML = equipmentList.map(eq => `<option value="${eq.id}">${eq.name}</option>`).join('');

  // 1. Render Equipment Cards
  cardsContainer.innerHTML = '';
  equipmentList.forEach(eq => {
    // Find latest log for this equipment
    const eqLogs = runHoursLogs.filter(l => l.equipmentId === eq.id || l.equipmentName === eq.name);
    const latestLog = eqLogs.length > 0 ? eqLogs[0] : null;
    const currentMeter = latestLog ? latestLog.endMeter : eq.initialHours;
    const currentFuelLiters = latestLog && latestLog.fuelAfter ? latestLog.fuelAfter : (eq.currentFuel || 0);

    const hoursSinceService = currentMeter - (eq.lastServiceHours || 0);
    const hoursToNextService = Math.max(0, (eq.serviceInterval || 250) - hoursSinceService);

    let statusPillClass = 'score-high';
    let statusText = `NORMAL (${hoursToNextService.toFixed(1)} Hrs to PM)`;
    if (hoursToNextService <= 10) {
      statusPillClass = 'score-low';
      statusText = `SERVICE DUE SOON (${hoursToNextService.toFixed(1)} Hrs)`;
    }

    const card = document.createElement('div');
    card.style.cssText = 'background: var(--bg-card); padding: 18px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 10px;';
    
    let fuelGaugeHtml = '';
    if (eq.hasFuel) {
      const fuelPct = eq.fuelCap ? Math.round((currentFuelLiters / eq.fuelCap) * 100) : 0;
      fuelGaugeHtml = `
        <div style="margin-top: 6px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #fbbf24; font-weight: 700;">
            <span>FUEL TANK LEVEL</span>
            <span>${currentFuelLiters} L / ${eq.fuelCap} L (${fuelPct}%)</span>
          </div>
          <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.4); border-radius: 4px; margin-top: 6px; overflow: hidden;">
            <div style="width: ${fuelPct}%; height: 100%; background: linear-gradient(90deg, #f59e0b 0%, #10b981 100%);"></div>
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Equipment Motor Reading</div>
          <div style="font-size: 14px; font-weight: 800; color: #fff; margin-top: 2px;">${eq.name}</div>
        </div>
        <span class="score-badge ${statusPillClass}">${statusText}</span>
      </div>
      <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 4px;">
        <span style="font-size: 28px; font-weight: 800; color: #38bdf8; font-family: monospace;">${currentMeter.toFixed(1)}</span>
        <span style="font-size: 13px; font-weight: 700; color: #94a3b8;">Operating Hours</span>
      </div>
      ${fuelGaugeHtml}
    `;
    cardsContainer.appendChild(card);
  });

  // Update defaults on form
  updateRunHoursFormDefaults();

  // 2. Render Run Hours Logs Table
  tbody.innerHTML = '';
  const filteredLogs = runHoursLogs.filter(l => l.procedureId === activeProcedureId || equipmentList.some(e => e.id === l.equipmentId));
  
  if (filteredLogs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px; color: var(--text-muted);">No operational run hour or fuel entries logged for this procedure yet.</td></tr>';
    return;
  }

  filteredLogs.forEach(log => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${log.dateTime}</strong></td>
      <td style="font-weight: 600; color: #fff;">${log.equipmentName}</td>
      <td style="font-family: monospace;">${log.startMeter.toFixed(1)} Hrs</td>
      <td style="font-family: monospace;">${log.endMeter.toFixed(1)} Hrs</td>
      <td style="font-weight: 700; color: #38bdf8;">+${log.runHours.toFixed(1)} Hrs</td>
      <td>${log.fuelAdded > 0 ? `<span style="color:#34d399; font-weight:700;">+${log.fuelAdded} L</span>` : '<span style="color:#64748b;">—</span>'}</td>
      <td>${log.fuelConsumed > 0 ? `<span style="color:#fbbf24; font-weight:700;">${log.fuelConsumed} L</span>` : '<span style="color:#64748b;">—</span>'}</td>
      <td>${log.burnRate > 0 ? `<span style="color:#fbbf24; font-family:monospace;">${log.burnRate.toFixed(1)} L/Hr</span>` : '<span style="color:#64748b;">N/A</span>'}</td>
      <td>${log.technician}</td>
      <td>
        <button class="btn btn-secondary" style="font-size:11px; padding:3px 8px; color:#ef4444; border-color:rgba(239,68,68,0.4);" onclick="deleteRunHourLog('${log.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.updateRunHoursFormDefaults = function() {
  const eqId = document.getElementById('rh-equipment-select')?.value;
  if (!eqId) return;

  const equipmentList = Object.values(EQUIPMENT_METER_DB).flat();
  const eq = equipmentList.find(e => e.id === eqId);
  if (!eq) return;

  // Find latest log for this equipment to preset start meter
  const eqLogs = runHoursLogs.filter(l => l.equipmentId === eq.id || l.equipmentName === eq.name);
  const latestLog = eqLogs.length > 0 ? eqLogs[0] : null;
  const currentMeter = latestLog ? latestLog.endMeter : eq.initialHours;

  document.getElementById('rh-meter-start').value = currentMeter.toFixed(1);
  document.getElementById('rh-meter-end').value = (currentMeter + 1.0).toFixed(1);
  calculateRunHoursDiff();

  // Show/Hide fuel section
  const fuelSection = document.getElementById('rh-fuel-section');
  if (eq.hasFuel) {
    fuelSection.style.display = 'grid';
    const currentFuel = latestLog && latestLog.fuelAfter ? latestLog.fuelAfter : (eq.currentFuel || 400);
    document.getElementById('rh-fuel-before').value = currentFuel;
    document.getElementById('rh-fuel-added').value = 0;
    document.getElementById('rh-fuel-after').value = Math.max(0, currentFuel - 15);
    calculateFuelConsumed();
  } else {
    fuelSection.style.display = 'none';
    document.getElementById('rh-fuel-before').value = 0;
    document.getElementById('rh-fuel-added').value = 0;
    document.getElementById('rh-fuel-after').value = 0;
    document.getElementById('rh-fuel-consumed').value = '0.0 L';
    document.getElementById('rh-burn-rate').value = 'N/A';
  }
};

window.calculateRunHoursDiff = function() {
  const start = parseFloat(document.getElementById('rh-meter-start').value) || 0;
  const end = parseFloat(document.getElementById('rh-meter-end').value) || 0;
  const diff = Math.max(0, end - start);
  document.getElementById('rh-hours-diff').value = `${diff.toFixed(1)} Hrs`;
  calculateFuelConsumed();
};

window.calculateFuelConsumed = function() {
  const before = parseFloat(document.getElementById('rh-fuel-before').value) || 0;
  const added = parseFloat(document.getElementById('rh-fuel-added').value) || 0;
  const after = parseFloat(document.getElementById('rh-fuel-after').value) || 0;
  
  const consumed = Math.max(0, (before + added) - after);
  document.getElementById('rh-fuel-consumed').value = `${consumed.toFixed(1)} L`;

  const start = parseFloat(document.getElementById('rh-meter-start').value) || 0;
  const end = parseFloat(document.getElementById('rh-meter-end').value) || 0;
  const runHours = Math.max(0, end - start);

  const burnRate = runHours > 0 ? (consumed / runHours) : 0;
  document.getElementById('rh-burn-rate').value = burnRate > 0 ? `${burnRate.toFixed(1)} L/Hr` : '0.0 L/Hr';
};

window.resetRunHoursForm = function() {
  document.getElementById('runhours-form').reset();
  const nowLocal = new Date().toISOString().slice(0, 16);
  document.getElementById('rh-date').value = nowLocal;
  updateRunHoursFormDefaults();
};

window.handleRunHoursSubmit = function(event) {
  event.preventDefault();

  const eqId = document.getElementById('rh-equipment-select').value;
  const equipmentList = Object.values(EQUIPMENT_METER_DB).flat();
  const eq = equipmentList.find(e => e.id === eqId);
  const eqName = eq ? eq.name : 'Equipment Engine';

  const dateTime = document.getElementById('rh-date').value.replace('T', ' ');
  const technician = document.getElementById('rh-technician').value.trim();

  const startMeter = parseFloat(document.getElementById('rh-meter-start').value) || 0;
  const endMeter = parseFloat(document.getElementById('rh-meter-end').value) || 0;

  if (endMeter < startMeter) {
    alert("End hour meter reading cannot be less than start hour meter reading.");
    return;
  }

  const runHours = endMeter - startMeter;
  const fuelBefore = parseFloat(document.getElementById('rh-fuel-before').value) || 0;
  const fuelAdded = parseFloat(document.getElementById('rh-fuel-added').value) || 0;
  const fuelAfter = parseFloat(document.getElementById('rh-fuel-after').value) || 0;
  const fuelConsumed = Math.max(0, (fuelBefore + fuelAdded) - fuelAfter);
  const burnRate = runHours > 0 ? (fuelConsumed / runHours) : 0;
  const notes = document.getElementById('rh-notes').value.trim();

  const newLog = {
    id: 'rh_' + Date.now(),
    procedureId: activeProcedureId,
    equipmentId: eqId,
    equipmentName: eqName,
    dateTime,
    startMeter,
    endMeter,
    runHours,
    fuelBefore,
    fuelAdded,
    fuelAfter,
    fuelConsumed,
    burnRate,
    technician,
    notes
  };

  runHoursLogs.unshift(newLog);
  saveRunHoursToStorage();
  renderRunHoursTab();
  alert("Run Hours & Fuel reading successfully logged!");
};

window.deleteRunHourLog = function(id) {
  if (confirm("Are you sure you want to delete this run hour log entry?")) {
    runHoursLogs = runHoursLogs.filter(l => l.id !== id);
    saveRunHoursToStorage();
    renderRunHoursTab();
  }
};

window.clearRunHoursLogs = function() {
  if (confirm("Are you sure you want to clear all run hour logs?")) {
    runHoursLogs = [];
    saveRunHoursToStorage();
    renderRunHoursTab();
  }
};

// ==================== PARTS & PROCUREMENT LOG MODULE ====================

window.renderProcurementTab = function() {
  const totalCostEl = document.getElementById('proc-metric-total-cost');
  const inStockEl = document.getElementById('proc-metric-in-stock');
  const installedEl = document.getElementById('proc-metric-installed');
  const pendingEl = document.getElementById('proc-metric-pending');
  const tbody = document.getElementById('procurement-table-tbody');
  const filterDropdown = document.getElementById('proc-system-filter');
  const badgeEl = document.getElementById('proc-filtered-count-badge');

  if (!tbody) return;

  const selectedSystemFilter = filterDropdown ? filterDropdown.value : 'All';

  let totalSpend = 0;
  let inStockCount = 0;
  let installedCount = 0;
  let pendingCount = 0;

  procurementLogs.forEach(item => {
    totalSpend += (item.totalCost || 0);
    if (item.status === 'In Stock') inStockCount += item.quantity;
    else if (item.status === 'Installed') installedCount += item.quantity;
    else pendingCount += item.quantity;
  });

  if (totalCostEl) totalCostEl.innerText = `₱${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (inStockEl) inStockEl.innerText = `${inStockCount} Units`;
  if (installedEl) installedEl.innerText = `${installedCount} Units`;
  if (pendingEl) pendingEl.innerText = `${pendingCount} Units`;

  // Filter logs by system
  const filteredLogs = procurementLogs.filter(item => {
    if (selectedSystemFilter === 'All') return true;
    return item.system === selectedSystemFilter;
  });

  if (badgeEl) {
    if (selectedSystemFilter === 'All') badgeEl.innerText = `All Systems (${filteredLogs.length})`;
    else badgeEl.innerText = `${selectedSystemFilter} (${filteredLogs.length})`;
  }

  // Update active pill button state
  document.querySelectorAll('.proc-filter-pill').forEach(pill => {
    if (pill.getAttribute('data-system') === selectedSystemFilter) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  tbody.innerHTML = '';
  if (filteredLogs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--text-muted);">No procurement items found matching system filter "${selectedSystemFilter}".</td></tr>`;
    return;
  }

  filteredLogs.forEach(item => {
    const tr = document.createElement('tr');
    let statusClass = 'score-high';
    if (item.status === 'Scheduled') statusClass = 'score-mid';
    else if (item.status === 'Installed') statusClass = 'score-mid';

    tr.innerHTML = `
      <td><strong>${item.date}</strong></td>
      <td>
        <span style="font-weight: 700; color: #fff;">${item.itemName}</span>
        ${item.partNo ? `<br><span style="font-size: 10px; color: #94a3b8; font-family: monospace;">P/N: ${item.partNo}</span>` : ''}
      </td>
      <td><span class="system-tag" style="background: rgba(59, 130, 246, 0.12); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.25);">${item.system}</span></td>
      <td style="font-weight: 600;">${item.quantity} ${item.unit}</td>
      <td style="font-family: monospace;">₱${item.unitCost.toFixed(2)}</td>
      <td style="font-weight: 700; color: #38bdf8; font-family: monospace;">₱${item.totalCost.toFixed(2)}</td>
      <td>${item.supplier || '—'}</td>
      <td style="font-family: monospace; font-size: 11px;">${item.poNo || '—'}</td>
      <td><span class="score-badge ${statusClass}">${item.status}</span></td>
      <td>
        <div style="display: flex; gap: 6px;">
          <button class="btn btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="togglePartInstalled('${item.id}')" title="Toggle status">
            ${item.status === 'Installed' ? 'Mark Stock' : 'Mark Installed'}
          </button>
          <button class="btn btn-secondary" style="font-size:11px; padding:3px 8px; color:#ef4444; border-color:rgba(239,68,68,0.4);" onclick="deleteProcurementLog('${item.id}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

window.setProcurementSystemFilter = function(sys) {
  const filterDropdown = document.getElementById('proc-system-filter');
  if (filterDropdown) {
    filterDropdown.value = sys;
  }
  renderProcurementTab();
};

window.calculateProcurementTotal = function() {
  const qty = parseFloat(document.getElementById('proc-quantity').value) || 0;
  const unitCost = parseFloat(document.getElementById('proc-unit-cost').value) || 0;
  const total = qty * unitCost;
  document.getElementById('proc-total-cost').value = `₱${total.toFixed(2)}`;
};

window.resetProcurementForm = function() {
  document.getElementById('procurement-form').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('proc-date').value = today;
  calculateProcurementTotal();
};

window.handleProcurementSubmit = function(event) {
  event.preventDefault();

  const itemName = document.getElementById('proc-item-name').value.trim();
  const system = document.getElementById('proc-system').value;
  const partNo = document.getElementById('proc-part-no').value.trim();
  const quantity = parseInt(document.getElementById('proc-quantity').value) || 1;
  const unit = document.getElementById('proc-unit').value.trim();
  const unitCost = parseFloat(document.getElementById('proc-unit-cost').value) || 0;
  const totalCost = quantity * unitCost;
  const date = document.getElementById('proc-date').value;
  const supplier = document.getElementById('proc-supplier').value.trim();
  const poNo = document.getElementById('proc-po').value.trim();
  const status = document.getElementById('proc-status').value;

  const newItem = {
    id: 'proc_' + Date.now(),
    itemName,
    system,
    partNo,
    quantity,
    unit,
    unitCost,
    totalCost,
    date,
    supplier,
    poNo,
    status
  };

  procurementLogs.unshift(newItem);
  saveProcurementToStorage();
  renderProcurementTab();
  resetProcurementForm();
  alert("Procurement item successfully recorded!");
};

window.togglePartInstalled = function(id) {
  const item = procurementLogs.find(p => p.id === id);
  if (!item) return;

  if (item.status === 'Installed') {
    item.status = 'In Stock';
  } else {
    item.status = 'Installed';
  }
  saveProcurementToStorage();
  renderProcurementTab();
};

window.deleteProcurementLog = function(id) {
  if (confirm("Are you sure you want to delete this procurement record?")) {
    procurementLogs = procurementLogs.filter(p => p.id !== id);
    saveProcurementToStorage();
    renderProcurementTab();
  }
};

window.clearProcurementLogs = function() {
  if (confirm("Are you sure you want to clear all procurement records?")) {
    procurementLogs = [];
    saveProcurementToStorage();
    renderProcurementTab();
  }
};

// Render Logs History tab
function renderLogsHistory() {
  const tbody = document.getElementById('logs-table-tbody');
  tbody.innerHTML = '';
  
  if (historyLogs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 24px; color: var(--text-muted);">No compliance inspection runs recorded yet.</td></tr>';
    return;
  }

  historyLogs.forEach(log => {
    const tr = document.createElement('tr');
    
    let scoreClass = 'score-high';
    if (log.score < 70) scoreClass = 'score-low';
    else if (log.score < 90) scoreClass = 'score-mid';

    tr.innerHTML = `
      <td><strong>${log.date}</strong></td>
      <td>
        <span style="font-weight: 600;">${log.procedureTitle}</span>
        <br><span style="font-size:10px; color:var(--text-muted);">${log.procedureCode}</span>
      </td>
      <td>${log.subCategory}</td>
      <td><span class="score-badge ${scoreClass}">${log.score}% OK</span></td>
      <td>${log.preparedBy}</td>
      <td>${log.inspectedBy}</td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary" style="font-size:11px; padding:4px 10px;" onclick="viewSavedLog('${log.id}')">View Details</button>
          <button class="btn btn-primary" style="font-size:11px; padding:4px 10px;" onclick="printComplianceReport('${log.id}')">Print Report</button>
          <button class="btn btn-secondary" style="font-size:11px; padding:4px 10px; border:1px solid #ef4444; color:#ef4444; background:none;" onclick="deleteSavedLog('${log.id}')">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Clear all history
window.clearLogsHistory = function() {
  if (confirm("Are you sure you want to permanently clear all inspection history logs?")) {
    historyLogs = [];
    saveHistoryToStorage();
    renderLogsHistory();
  }
};

// Delete single log
window.deleteSavedLog = function(logId) {
  if (confirm("Are you sure you want to permanently delete this inspection log?")) {
    historyLogs = historyLogs.filter(l => l.id !== logId);
    saveHistoryToStorage();
    renderLogsHistory();
  }
};

// View Saved Log (load back to checklist panel in read-only mode)
window.viewSavedLog = function(logId) {
  const log = historyLogs.find(l => l.id === logId);
  if (!log) return;
  
  // Set active procedure & filter subcategory
  activeProcedureId = log.procedureId;
  previewLogId = log.id;
  
  // Load active procedure sidebar item
  switchProcedure(log.procedureId);
  
  // Set target select value
  document.getElementById('checklist-selector-field').value = log.subCategory;
  
  // Load inputs
  document.getElementById('form-date').value = log.date;
  document.getElementById('form-prepared').value = log.preparedBy;
  document.getElementById('form-inspected').value = log.inspectedBy;
  
  if (document.getElementById('form-chk-runhours')) document.getElementById('form-chk-runhours').value = log.chkRunHours || '';
  if (document.getElementById('form-chk-fuel')) document.getElementById('form-chk-fuel').value = log.chkFuel || '';
  if (document.getElementById('form-chk-part')) document.getElementById('form-chk-part').value = log.chkPart || '';

  // Disable form elements
  document.getElementById('form-date').disabled = true;
  document.getElementById('form-prepared').disabled = true;
  document.getElementById('form-inspected').disabled = true;
  document.getElementById('checklist-selector-field').disabled = true;
  if (document.getElementById('form-chk-runhours')) document.getElementById('form-chk-runhours').disabled = true;
  if (document.getElementById('form-chk-fuel')) document.getElementById('form-chk-fuel').disabled = true;
  if (document.getElementById('form-chk-part')) document.getElementById('form-chk-part').disabled = true;
  
  const insertBtn = document.getElementById('btn-insert-images');
  if (insertBtn) insertBtn.disabled = true;
  const fileInput = document.getElementById('form-chk-images-input');
  if (fileInput) fileInput.disabled = true;

  // Disable submit button
  const submitBtn = document.getElementById('btn-submit-checklist');
  submitBtn.innerText = "Viewing Saved Details (Read-only)";
  submitBtn.style.display = 'none';

  // Load the detailed checklist rows
  const tbody = document.getElementById('checklist-form-tbody');
  tbody.innerHTML = '';
  
  log.items.forEach((item, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-num">${idx + 1}</td>
      <td class="col-desc" style="font-weight: 500;">${item.description}</td>
      <td class="col-choices">
        <div class="radio-group">
          <label class="radio-choice">
            <input type="radio" name="status_${idx}" value="YES" disabled ${item.status === 'YES' ? 'checked' : ''}>
            <span>YES</span>
          </label>
          <label class="radio-choice">
            <input type="radio" name="status_${idx}" value="NO" disabled ${item.status === 'NO' ? 'checked' : ''}>
            <span>NO</span>
          </label>
          <label class="radio-choice">
            <input type="radio" name="status_${idx}" value="NA" disabled ${item.status === 'NA' ? 'checked' : ''}>
            <span>N/A</span>
          </label>
        </div>
      </td>
      <td class="col-remarks">
        <input type="text" class="input-remarks" value="${item.remarks || ''}" disabled>
      </td>
      <td class="col-initials">
        <input type="text" class="input-initials" value="${item.initials || ''}" disabled>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Render attached photographic evidence in read-only mode
  activeChecklistImages = (log.images && Array.isArray(log.images)) ? [...log.images] : [];
  renderChecklistImages(true);

  // Update Score
  document.getElementById('score-percentage').innerText = `${log.score}% OK`;
  
  // Move to Checklist Tab
  switchSubTab('checklist');
};

// Print/Export Compliance Report
window.printComplianceReport = function(logId) {
  const log = historyLogs.find(l => l.id === logId);
  if (!log) return;
  
  const container = document.getElementById('printable-compliance-report');
  
  // Format items rows
  const tableRows = log.items.map(item => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${item.itemNum}</td>
      <td style="width: 50%; font-weight: 500;">${item.description}</td>
      <td style="text-align: center; font-weight: bold; font-family: sans-serif;">
        ${item.status === 'YES' ? '✓ [YES]' : item.status === 'NO' ? '✗ [NO]' : '— [N/A]'}
      </td>
      <td>${item.remarks || '—'}</td>
      <td style="text-align: center; font-weight: bold; text-transform: uppercase;">${item.initials || '—'}</td>
    </tr>
  `).join('');

  let opReadingsHtml = '';
  if (log.chkRunHours || log.chkFuel || log.chkPart) {
    opReadingsHtml = `
      <div style="margin-bottom: 20px; border: 1px solid #000; padding: 10px; background: #f9f9f9;">
        <h4 style="margin-bottom: 6px; text-transform: uppercase; font-size: 11px;">Operational Meters & Spare Parts Log</h4>
        <div style="display: flex; gap: 20px; font-size: 11px;">
          ${log.chkRunHours ? `<div><strong>Current Engine Run Hours:</strong> ${log.chkRunHours} Hrs</div>` : ''}
          ${log.chkFuel ? `<div><strong>Fuel Level:</strong> ${log.chkFuel}</div>` : ''}
          ${log.chkPart ? `<div><strong>Parts Used/Replaced:</strong> ${log.chkPart}</div>` : ''}
        </div>
      </div>
    `;
  }

  // Format Photographic Evidence for print
  let photographicEvidenceHtml = '';
  if (log.images && Array.isArray(log.images) && log.images.length > 0) {
    const photoCards = log.images.map((img, idx) => {
      const cap = img.caption ? img.caption : 'Compliance inspection verification photograph';
      const cat = img.category || 'General Inspection';
      return `
        <div class="print-photo-card">
          <div class="print-photo-img-wrap">
            <img src="${img.dataUrl}" alt="Photo ${idx + 1}">
          </div>
          <div class="print-photo-info">
            <div class="print-photo-title">Photo ${idx + 1}: [${cat}]</div>
            <div class="print-photo-desc">${cap}</div>
            <div style="font-size: 8.5px; color: #666; margin-top: 2px;">Captured: ${img.timestamp || log.date} • ${img.name || ''}</div>
          </div>
        </div>
      `;
    }).join('');

    photographicEvidenceHtml = `
      <div style="margin-top: 20px; margin-bottom: 24px; page-break-inside: avoid;">
        <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 10px;">
          Photographic Evidence & Inspection Documentation (${log.images.length} ${log.images.length === 1 ? 'Image' : 'Images'} Attached)
        </h3>
        <div class="print-photos-grid">
          ${photoCards}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="print-header">
      <h1>ONE CORPORATE MAINTENANCE PRO</h1>
      <p>#45 North Drive, Engineer's Hill, Baguio City, Philippines</p>
      <h2 style="font-size:14px; text-transform: uppercase; margin-top:10px; font-weight:bold; text-decoration: underline;">
        COMPLIANCE COMPREHENSIVE INSPECTION RECORD
      </h2>
    </div>

    <div class="print-meta-grid">
      <div class="print-meta-item"><strong>Procedure Code:</strong> ${log.procedureCode}</div>
      <div class="print-meta-item"><strong>Date of Record:</strong> ${log.date}</div>
      <div class="print-meta-item"><strong>Procedure Name:</strong> ${log.procedureTitle}</div>
      <div class="print-meta-item"><strong>Compliance Score:</strong> ${log.score}% OK</div>
      <div class="print-meta-item"><strong>Subcategory/Floor:</strong> ${log.subCategory}</div>
      <div class="print-meta-item"><strong>Log ID Reference:</strong> ${log.id}</div>
    </div>

    ${opReadingsHtml}

    <table class="print-table">
      <thead>
        <tr>
          <th style="width: 40px; text-align: center;">Item</th>
          <th style="width: 50%;">Inspection Item Description</th>
          <th style="width: 100px; text-align: center;">Status</th>
          <th>Inspector Notes / Remarks</th>
          <th style="width: 60px; text-align: center;">Initials</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>

    ${photographicEvidenceHtml}

    <div class="print-signatures">
      <div class="print-sig-col">
        <div class="print-sig-line"></div>
        <div class="print-sig-name">${log.preparedBy}</div>
        <div class="print-sig-title">Prepared by: BM Technician</div>
      </div>
      <div class="print-sig-col">
        <div class="print-sig-line"></div>
        <div class="print-sig-name">${log.inspectedBy}</div>
        <div class="print-sig-title">Verified by: Building Maintenance Manager</div>
      </div>
    </div>
  `;

  // Trigger print dialog
  window.print();
};

// Navigation Exit Control to Prevent Nested Iframe Dashboards
window.exitToMainDashboard = function(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // 1. If embedded within the parent One Corporate app iframe
  try {
    if (window.parent && window.parent !== window && typeof window.parent.switchTab === 'function') {
      window.parent.switchTab('dashboard');
      return false;
    }
  } catch (err) {
    console.warn("Parent switchTab communication error:", err);
  }

  // 2. If top window has switchTab
  try {
    if (window.top && window.top !== window && typeof window.top.switchTab === 'function') {
      window.top.switchTab('dashboard');
      return false;
    }
  } catch (err) {}

  // 3. Fallback for standalone tab/browser window (replace entire top window)
  window.top.location.href = '../index.html';
  return false;
};

