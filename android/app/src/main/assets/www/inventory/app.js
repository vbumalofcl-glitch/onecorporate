/**
 * One Corporate - Asset & Materials Inventory Management Module
 * Excel-like Table Engine, Resizable Columns, Multi-Classification & Purchase Tracking
 */

// Category Definitions & Themes
const CATEGORIES = [
  'Mechanical',
  'Electrical',
  'Sanitary & Plumbing',
  'Architectural',
  'Electronic',
  'Fire Protection',
  'Tools & Equipment'
];

// High-quality category SVG generator for default thumbnails
function generateCategorySVG(category, label) {
  let color = '#38bdf8';
  let iconSvg = '';

  if (category === 'Mechanical') {
    color = '#fb923c';
    iconSvg = `<path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.93 4.93l2.12 2.12m9.9 9.9l2.12 2.12M4.93 19.07l2.12-2.12m9.9-9.9l2.12-2.12"/><circle cx="12" cy="12" r="4"/>`;
  } else if (category === 'Electrical') {
    color = '#facc15';
    iconSvg = `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`;
  } else if (category === 'Sanitary & Plumbing') {
    color = '#38bdf8';
    iconSvg = `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`;
  } else if (category === 'Architectural') {
    color = '#a78bfa';
    iconSvg = `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>`;
  } else if (category === 'Electronic') {
    color = '#34d399';
    iconSvg = `<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>`;
  } else if (category === 'Fire Protection') {
    color = '#f87171';
    iconSvg = `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`;
  } else {
    color = '#ec4899';
    iconSvg = `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`;
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
    <rect width="100" height="100" fill="#0f172a" rx="10"/>
    <circle cx="50" cy="50" r="36" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-opacity="0.3" stroke-width="2"/>
    <g transform="translate(30, 30) scale(1.65)" stroke="${color}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      ${iconSvg}
    </g>
    <text x="50" y="88" font-family="sans-serif" font-size="8" font-weight="700" fill="${color}" text-anchor="middle">${(label || category).substring(0, 14)}</text>
  </svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Default Seed Inventory Database
const DEFAULT_INVENTORY_ITEMS = [
  // 1. MECHANICAL ITEMS
  {
    id: 'inv_mech_01',
    code: 'MEC-101',
    name: 'Chiller Compressor Heavy-Duty V-Belts',
    category: 'Mechanical',
    brand: 'Gates Hi-Power II B-75 Super Grip',
    dateOfPurchase: '2025-10-18',
    warrantyExpiry: '2026-10-18',
    qty: 24,
    unit: 'pcs',
    minStock: 8,
    unitCost: 1250.00,
    location: 'Basement 1 - Mech Room B-02',
    supplier: 'MechTech Industrial Supplies Corp.',
    supplierContact: '0917-882-9912 / sales@mechtech.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Mechanical', 'V-Belts B75'),
    remarks: 'Standard replacement belts for primary centrifugal chiller water circulation'
  },
  {
    id: 'inv_mech_02',
    code: 'MEC-102',
    name: 'AHU Pleated Air Filter Panels (MERV 8)',
    category: 'Mechanical',
    brand: 'AAF Flanders Pre-Pleat 24"x24"x2"',
    dateOfPurchase: '2026-01-15',
    warrantyExpiry: '2027-01-15',
    qty: 48,
    unit: 'pcs',
    minStock: 20,
    unitCost: 650.00,
    location: 'Rooftop AHU Deck - Storage 4',
    supplier: 'CleanAir Technologies Phils',
    supplierContact: '0922-451-8890 / info@cleanair.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Mechanical', 'Air Filters'),
    remarks: 'High efficiency air filters for tower floors 2 to 14 AHUs'
  },
  {
    id: 'inv_mech_03',
    code: 'MEC-103',
    name: 'Refrigerant Gas Cylinder R-410A',
    category: 'Mechanical',
    brand: 'Honeywell Genetron 11.3 kg Net Weight',
    dateOfPurchase: '2025-11-20',
    warrantyExpiry: '2028-11-20',
    qty: 3,
    unit: 'cylinders',
    minStock: 4,
    unitCost: 8900.00,
    location: 'Basement 2 - Hazardous Chemical Locker',
    supplier: 'Fridgeline Refrigeration Depot',
    supplierContact: '0918-334-1120 / orders@fridgeline.com',
    condition: 'Brand New',
    status: 'Low Stock',
    image: generateCategorySVG('Mechanical', 'R-410A Gas'),
    remarks: 'Reorder required soon for quarterly chiller refrigerant balancing'
  },
  {
    id: 'inv_mech_04',
    code: 'MEC-104',
    name: 'Centrifugal Pump Mechanical Shaft Seal (2.5")',
    category: 'Mechanical',
    brand: 'John Crane Type 21 Carbon/Silicon Carbide',
    dateOfPurchase: '2025-08-14',
    warrantyExpiry: '2026-08-14',
    qty: 6,
    unit: 'sets',
    minStock: 2,
    unitCost: 4500.00,
    location: 'Basement 1 - Spare Parts Cabinet 03',
    supplier: 'Apex Fluid Power Corp.',
    supplierContact: '0917-550-2090 / support@apexfluid.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Mechanical', 'Shaft Seal'),
    remarks: 'For secondary chilled water pumps P-101 and P-102 overhaul'
  },
  {
    id: 'inv_mech_05',
    code: 'MEC-105',
    name: 'Synthetic Chiller Compressor Lubricant Oil (20L)',
    category: 'Mechanical',
    brand: 'Mobil EAL Arctic 68 Synthetic POE',
    dateOfPurchase: '2025-12-05',
    warrantyExpiry: '2028-12-05',
    qty: 5,
    unit: 'pails',
    minStock: 2,
    unitCost: 14200.00,
    location: 'Basement 1 - Lubrication Bay',
    supplier: 'PetroLube Industrial Phils',
    supplierContact: '0920-994-3318 / lubricants@petrolube.com',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Mechanical', 'Synthetic Oil'),
    remarks: 'Required for scheduled semi-annual compressor oil changes'
  },

  // 2. ELECTRICAL ITEMS
  {
    id: 'inv_elec_01',
    code: 'ELE-201',
    name: 'Molded Case Circuit Breaker (MCCB 3P 225A 240V)',
    category: 'Electrical',
    brand: 'Schneider Electric Compact NSX250F',
    dateOfPurchase: '2025-09-12',
    warrantyExpiry: '2028-09-12',
    qty: 4,
    unit: 'units',
    minStock: 2,
    unitCost: 18500.00,
    location: 'Electrical Vault - Riser Cabinet E-1',
    supplier: 'PowerLink Electrical Trading',
    supplierContact: '0917-700-4567 / sales@powerlink.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Electrical', 'MCCB 225A'),
    remarks: 'Main feeder circuit breakers for sub-distribution panels'
  },
  {
    id: 'inv_elec_02',
    code: 'ELE-202',
    name: 'Commercial LED Troffer Panel 600x600 40W 6000K',
    category: 'Electrical',
    brand: 'Philips SmartBright RC091V Daylight',
    dateOfPurchase: '2026-02-02',
    warrantyExpiry: '2028-02-02',
    qty: 60,
    unit: 'pcs',
    minStock: 15,
    unitCost: 1350.00,
    location: 'Storage 2 - Hallway Lighting Bin',
    supplier: 'Lumen Electrical Supply Inc.',
    supplierContact: '0919-445-9012 / info@lumenelec.com',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Electrical', 'LED Troffer'),
    remarks: 'Standard replacement for tenant office hallways and elevator lobbies'
  },
  {
    id: 'inv_elec_03',
    code: 'ELE-203',
    name: 'Magnetic Contactor with Thermal Overload (32A)',
    category: 'Electrical',
    brand: 'Mitsubishi S-T35 with TH-T35 (24-36A)',
    dateOfPurchase: '2025-10-30',
    warrantyExpiry: '2027-10-30',
    qty: 8,
    unit: 'sets',
    minStock: 3,
    unitCost: 3400.00,
    location: 'Basement 1 - Motor Control Center Spares',
    supplier: 'ElectroMech Industrial Trading',
    supplierContact: '0917-662-8819 / electromech@ph.net',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Electrical', 'Contactor 32A'),
    remarks: 'Exhaust fan and booster pump motor starter spares'
  },
  {
    id: 'inv_elec_04',
    code: 'ELE-204',
    name: 'Sealed Lead Acid Emergency Battery (12V 7.2Ah)',
    category: 'Electrical',
    brand: 'Panasonic LC-R127R2PG Flame Retardant',
    dateOfPurchase: '2026-03-01',
    warrantyExpiry: '2028-03-01',
    qty: 2,
    unit: 'pcs',
    minStock: 10,
    unitCost: 950.00,
    location: 'Electrical Riser 3A - Battery Rack',
    supplier: 'BatPower Batteries Phils',
    supplierContact: '0928-112-7789 / support@batpower.ph',
    condition: 'Brand New',
    status: 'Low Stock',
    image: generateCategorySVG('Electrical', '12V Battery'),
    remarks: 'Reorder critical for emergency exit lights and FACP backup sets'
  },
  {
    id: 'inv_elec_05',
    code: 'ELE-205',
    name: 'Automatic Transfer Switch (ATS) Control Relay 220V',
    category: 'Electrical',
    brand: 'Deep Sea Electronics DSE335 ATS Controller',
    dateOfPurchase: '2025-07-22',
    warrantyExpiry: '2027-07-22',
    qty: 2,
    unit: 'units',
    minStock: 1,
    unitCost: 29500.00,
    location: 'Generator Room - Control Panel Vault',
    supplier: 'GenPower Engineering Services',
    supplierContact: '0917-333-8899 / service@genpower.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Electrical', 'ATS Controller'),
    remarks: 'Emergency backup controller for 750 kVA Cummins generator system'
  },

  // 3. SANITARY & PLUMBING ITEMS
  {
    id: 'inv_plumb_01',
    code: 'SAN-301',
    name: 'Commercial Restroom Exposed Flushometer Valve',
    category: 'Sanitary & Plumbing',
    brand: 'Sloan Royal 111-1.28 Low-Consumption (1.28 GPF)',
    dateOfPurchase: '2025-11-10',
    warrantyExpiry: '2028-11-10',
    qty: 12,
    unit: 'sets',
    minStock: 4,
    unitCost: 7800.00,
    location: 'Plumbing Hub - Storage 102',
    supplier: 'Apex Plumbing & Piping Solutions',
    supplierContact: '0917-889-1123 / sales@apexplumbing.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Sanitary & Plumbing', 'Flushometer'),
    remarks: 'Heavy-duty chrome flush valves for common tenant restrooms'
  },
  {
    id: 'inv_plumb_02',
    code: 'SAN-302',
    name: 'Heavy-Duty Submersible Sump Pump (1.5 HP 230V)',
    category: 'Sanitary & Plumbing',
    brand: 'Barnes SE51 Submersible Cast Iron Sump Pump',
    dateOfPurchase: '2025-06-18',
    warrantyExpiry: '2027-06-18',
    qty: 2,
    unit: 'units',
    minStock: 1,
    unitCost: 32000.00,
    location: 'Basement 2 - Sump Pit Storage Riser',
    supplier: 'HydroTech Water Solutions Inc.',
    supplierContact: '0918-990-2211 / info@hydrotech.com.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Sanitary & Plumbing', 'Sump Pump 1.5HP'),
    remarks: 'Standby backup pump for basement flood containment pit'
  },
  {
    id: 'inv_plumb_03',
    code: 'SAN-303',
    name: 'High-Pressure PPR Gate Valve (DN50 2-Inch PN25)',
    category: 'Sanitary & Plumbing',
    brand: 'Vesbo Fusion PPR Brass Gate Valve',
    dateOfPurchase: '2026-01-20',
    warrantyExpiry: '2030-01-20',
    qty: 15,
    unit: 'pcs',
    minStock: 5,
    unitCost: 1850.00,
    location: 'Plumbing Hub - Fittings Shelf B',
    supplier: 'PPR Master Distribution Co.',
    supplierContact: '0922-876-5432 / orders@pprmaster.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Sanitary & Plumbing', 'PPR Valve 2"'),
    remarks: 'Main isolation valves for vertical water supply riser branches'
  },
  {
    id: 'inv_plumb_04',
    code: 'SAN-304',
    name: 'Stainless Steel Float Switch Level Controller',
    category: 'Sanitary & Plumbing',
    brand: 'Omron Dual Level Dual Probe Stainless 304',
    dateOfPurchase: '2025-10-05',
    warrantyExpiry: '2027-10-05',
    qty: 1,
    unit: 'sets',
    minStock: 3,
    unitCost: 2600.00,
    location: 'Overhead Water Tank Room - Penthouse',
    supplier: 'Sensors & Automation Trading',
    supplierContact: '0917-440-1290 / support@sensorstrade.com',
    condition: 'Brand New',
    status: 'Low Stock',
    image: generateCategorySVG('Sanitary & Plumbing', 'Float Switch'),
    remarks: 'Only 1 unit remaining. Needed for overhead cistern level monitoring'
  },
  {
    id: 'inv_plumb_05',
    code: 'SAN-305',
    name: 'Flexible Braided Stainless Supply Hose 1/2" x 1/2"',
    category: 'Sanitary & Plumbing',
    brand: 'Cotto Premium Braided SS304 40cm',
    dateOfPurchase: '2026-02-14',
    warrantyExpiry: '2028-02-14',
    qty: 40,
    unit: 'pcs',
    minStock: 12,
    unitCost: 280.00,
    location: 'Plumbing Hub - Bin 08',
    supplier: 'Apex Plumbing & Piping Solutions',
    supplierContact: '0917-889-1123 / sales@apexplumbing.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Sanitary & Plumbing', 'SS Hose 1/2"'),
    remarks: 'For lavatory faucet and bidet spray connections'
  },

  // 4. ARCHITECTURAL ITEMS
  {
    id: 'inv_arch_01',
    code: 'ARC-401',
    name: 'Acoustic Mineral Fiber Ceiling Tiles (600x600x15mm)',
    category: 'Architectural',
    brand: 'Armstrong Dune Tegular Edge MicroLook',
    dateOfPurchase: '2025-11-28',
    warrantyExpiry: '2030-11-28',
    qty: 120,
    unit: 'pcs',
    minStock: 30,
    unitCost: 240.00,
    location: 'Storage 3 - Architectural Materials Bay',
    supplier: 'Architechnical Systems Int.',
    supplierContact: '0917-221-9988 / orders@archsystems.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Architectural', 'Ceiling Tiles'),
    remarks: 'Replacement tiles for tenant corridors and management offices'
  },
  {
    id: 'inv_arch_02',
    code: 'ARC-402',
    name: 'Heavy-Duty Overhead Door Closer (Size 2-6 Adjustable)',
    category: 'Architectural',
    brand: 'DORMA TS-73V Rack & Pinion Door Closer',
    dateOfPurchase: '2025-09-08',
    warrantyExpiry: '2028-09-08',
    qty: 10,
    unit: 'sets',
    minStock: 3,
    unitCost: 6200.00,
    location: 'Storage 3 - Hardware Cabinet H-01',
    supplier: 'Dorma-Kaba Hardware Philippines',
    supplierContact: '0918-332-9011 / sales.ph@dormakaba.com',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Architectural', 'Door Closer'),
    remarks: 'Fire-rated fire exit door self-closing hardware'
  },
  {
    id: 'inv_arch_03',
    code: 'ARC-403',
    name: 'Heavy-Duty Panic Exit Push Bar Rim Device',
    category: 'Architectural',
    brand: 'Von Duprin 98 Series Fire Exit Hardware',
    dateOfPurchase: '2025-05-19',
    warrantyExpiry: '2028-05-19',
    qty: 4,
    unit: 'sets',
    minStock: 2,
    unitCost: 16500.00,
    location: 'Storage 3 - Hardware Cabinet H-02',
    supplier: 'Dorma-Kaba Hardware Philippines',
    supplierContact: '0918-332-9011 / sales.ph@dormakaba.com',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Architectural', 'Panic Push Bar'),
    remarks: 'UL listed emergency exit device for fire stairwells'
  },
  {
    id: 'inv_arch_04',
    code: 'ARC-404',
    name: 'Pure Silicone Weatherproof Structural Sealant (Clear)',
    category: 'Architectural',
    brand: 'Dow Corning DOWSIL 791 Weatherproofing',
    dateOfPurchase: '2026-01-10',
    warrantyExpiry: '2027-01-10',
    qty: 24,
    unit: 'cartridges',
    minStock: 6,
    unitCost: 420.00,
    location: 'Storage 3 - Chemical & Sealants Rack',
    supplier: 'GlassTech Glazing Supplies Inc.',
    supplierContact: '0920-551-7890 / glasstech@pacific.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Architectural', 'Silicone 791'),
    remarks: 'Used for curtain wall, glass canopy, and window joint waterproofing'
  },
  {
    id: 'inv_arch_05',
    code: 'ARC-405',
    name: 'Two-Part Epoxy Floor Coating Paint (Battleship Grey, 4L)',
    category: 'Architectural',
    brand: 'Boysen Epoxy Enamel with Catalyst Hardener',
    dateOfPurchase: '2025-10-12',
    warrantyExpiry: '2027-10-12',
    qty: 8,
    unit: 'sets',
    minStock: 2,
    unitCost: 2850.00,
    location: 'Basement 1 - Paint Storage Locker',
    supplier: 'Pacific Paint & Hardware Center',
    supplierContact: '0917-888-3412 / orders@pacificpaint.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Architectural', 'Epoxy Paint 4L'),
    remarks: 'For basement floor marking touch-ups and machine room seal coating'
  },

  // 5. ELECTRONIC ITEMS
  {
    id: 'inv_elec_sys_01',
    code: 'ELC-501',
    name: '4MP Outdoor DarkFighter IR IP Dome Camera',
    category: 'Electronic',
    brand: 'Hikvision DS-2CD2146G2-IS (2.8mm Lens)',
    dateOfPurchase: '2025-08-25',
    warrantyExpiry: '2028-08-25',
    qty: 6,
    unit: 'units',
    minStock: 2,
    unitCost: 7400.00,
    location: 'CCTV Control Room - Equipment Rack 1',
    supplier: 'SecureNet Surveillance Systems',
    supplierContact: '0917-559-0012 / support@securenet.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Electronic', 'IP Dome CCTV'),
    remarks: 'Spares for perimeter and parking lot high-definition CCTV cameras'
  },
  {
    id: 'inv_elec_sys_02',
    code: 'ELC-502',
    name: 'Addressable Optical Smoke Detector Sensor Head',
    category: 'Electronic',
    brand: 'Notifier FSP-951 Intelligent Photoelectric',
    dateOfPurchase: '2025-12-01',
    warrantyExpiry: '2028-12-01',
    qty: 15,
    unit: 'pcs',
    minStock: 5,
    unitCost: 3800.00,
    location: 'Fire Command Center - Spare Parts Locker',
    supplier: 'Total Fire Safety Systems Inc.',
    supplierContact: '0917-900-3344 / totalfire@pacific.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Electronic', 'Smoke Detector'),
    remarks: 'Compatible with building central Notifier NFS-320 Fire Alarm Panel'
  },
  {
    id: 'inv_elec_sys_03',
    code: 'ELC-503',
    name: 'RFID Proximity Access Card Reader (Mifare 13.56MHz)',
    category: 'Electronic',
    brand: 'HID Signo 20 Smart Card Reader (Wiegand/OSDP)',
    dateOfPurchase: '2026-02-18',
    warrantyExpiry: '2029-02-18',
    qty: 4,
    unit: 'units',
    minStock: 2,
    unitCost: 9200.00,
    location: 'Security Office - Access Control Rack',
    supplier: 'Biometrix Security Technologies',
    supplierContact: '0922-334-1188 / info@biometrix.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Electronic', 'RFID HID Reader'),
    remarks: 'Turnstile gate and elevator access control reader unit'
  },
  {
    id: 'inv_elec_sys_04',
    code: 'ELC-504',
    name: 'PA System 100V Ceiling Mount Speaker (6W / 3W)',
    category: 'Electronic',
    brand: 'TOA PC-648R Flush Mount Ceiling Speaker',
    dateOfPurchase: '2025-07-15',
    warrantyExpiry: '2028-07-15',
    qty: 18,
    unit: 'pcs',
    minStock: 4,
    unitCost: 850.00,
    location: 'CCTV Control Room - Audio Cabinet',
    supplier: 'Acoustic Sound & Vision Inc.',
    supplierContact: '0917-224-8800 / sound@acoustics.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Electronic', 'TOA PA Speaker'),
    remarks: 'Emergency voice evacuation & background music announcement speaker'
  },

  // 6. FIRE PROTECTION ITEMS
  {
    id: 'inv_fire_01',
    code: 'FIR-601',
    name: 'ABC Dry Chemical Fire Extinguisher (10 lbs UL Listed)',
    category: 'Fire Protection',
    brand: 'Amerex B402 Multi-Purpose Dry Chemical',
    dateOfPurchase: '2025-11-04',
    warrantyExpiry: '2031-11-04',
    qty: 16,
    unit: 'cylinders',
    minStock: 5,
    unitCost: 4600.00,
    location: 'Fire Command Center - Extinguisher Depot',
    supplier: 'SafetyFirst Protection Corp.',
    supplierContact: '0918-771-4455 / safety@safetyfirst.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Fire Protection', 'Extinguisher 10lb'),
    remarks: 'Hydrostatic testing certified valid until November 2031'
  },
  {
    id: 'inv_fire_02',
    code: 'FIR-602',
    name: 'Pendant Brass Fire Sprinkler Head (68°C / 155°F 1/2" NPT)',
    category: 'Fire Protection',
    brand: 'Tyco TY-B Standard Response K5.6 Glass Bulb',
    dateOfPurchase: '2026-01-28',
    warrantyExpiry: '2036-01-28',
    qty: 50,
    unit: 'pcs',
    minStock: 15,
    unitCost: 480.00,
    location: 'Fire Pump Room - Racks Bay 1',
    supplier: 'Total Fire Safety Systems Inc.',
    supplierContact: '0917-900-3344 / totalfire@pacific.ph',
    condition: 'Brand New',
    status: 'In Stock',
    image: generateCategorySVG('Fire Protection', 'Sprinkler 68C'),
    remarks: 'For tenant fit-out modifications and quarterly head replacements'
  },

  // 7. TOOLS & MAINTENANCE EQUIPMENT
  {
    id: 'inv_tools_01',
    code: 'TLS-701',
    name: 'True-RMS Digital Multimeter with Temperature',
    category: 'Tools & Equipment',
    brand: 'Fluke 117 Electrician\'s Multimeter',
    dateOfPurchase: '2025-04-10',
    warrantyExpiry: '2028-04-10',
    qty: 3,
    unit: 'units',
    minStock: 2,
    unitCost: 16800.00,
    location: 'Maintenance Workshop - Tool Chest A',
    supplier: 'Precision Instruments Trade',
    supplierContact: '0917-882-6611 / info@precisioninst.ph',
    condition: 'Good',
    status: 'In Stock',
    image: generateCategorySVG('Tools & Equipment', 'Fluke 117 DMM'),
    remarks: 'Calibrated instrumentation for electrical troubleshooting and voltage logs'
  },
  {
    id: 'inv_tools_02',
    code: 'TLS-702',
    name: 'Heavy Duty 1000V Insulation Tester (Megger)',
    category: 'Tools & Equipment',
    brand: 'Fluke 1507 Digital Megohmmeter',
    dateOfPurchase: '2025-03-22',
    warrantyExpiry: '2028-03-22',
    qty: 2,
    unit: 'units',
    minStock: 1,
    unitCost: 38500.00,
    location: 'Maintenance Workshop - Tool Chest A',
    supplier: 'Precision Instruments Trade',
    supplierContact: '0917-882-6611 / info@precisioninst.ph',
    condition: 'Good',
    status: 'In Stock',
    image: generateCategorySVG('Tools & Equipment', 'Megger 1000V'),
    remarks: 'Used for motor windings insulation test and switchboard insulation audits'
  }
];

// App State
let inventoryItems = [];
let activeCategoryFilter = 'All';
let currentSearchQuery = '';
let currentStockFilter = 'All';
let currentPurchaseDateFrom = '';
let currentPurchaseDateTo = '';
let currentLocationFilter = 'All';
let currentConditionFilter = 'All';
let currentSortColumn = 'code';
let currentSortDirection = 'asc';
let selectedItemIds = new Set();
let editingItemId = null;
let currentUploadedImageBase64 = null;

// Default column width specifications (in pixels)
const DEFAULT_COLUMN_WIDTHS = {
  checkbox: 40,
  image: 64,
  code: 105,
  name: 240,
  category: 155,
  purchaseDate: 125,
  stockQty: 120,
  minLevel: 85,
  unitCost: 115,
  totalValue: 125,
  location: 175,
  supplier: 165,
  condition: 105,
  status: 110,
  actions: 95
};

let columnWidths = { ...DEFAULT_COLUMN_WIDTHS };

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

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadInventoryData();
  loadColumnWidths();
  initColumnResizing();
  populateLocationFilterOptions();
  renderApp();
  initEventListeners();
});

// Load from LocalStorage or seed defaults
function loadInventoryData() {
  try {
    const saved = localStorage.getItem('onecorporate_inventory_data');
    if (saved) {
      inventoryItems = JSON.parse(saved);
    } else {
      inventoryItems = JSON.parse(JSON.stringify(DEFAULT_INVENTORY_ITEMS));
      saveInventoryData();
    }
  } catch (err) {
    console.error('Error loading inventory data:', err);
    inventoryItems = JSON.parse(JSON.stringify(DEFAULT_INVENTORY_ITEMS));
  }
}

function saveInventoryData() {
  try {
    localStorage.setItem('onecorporate_inventory_data', JSON.stringify(inventoryItems));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
}

// Reset to standard initial catalog
window.resetToDefaultCatalog = function() {
  if (confirm("Are you sure you want to reset the inventory to the standard One Corporate facility catalog? Any custom added items will be replaced.")) {
    inventoryItems = JSON.parse(JSON.stringify(DEFAULT_INVENTORY_ITEMS));
    saveInventoryData();
    renderApp();
  }
};

// COLUMN WIDTHS & EXCEL RESIZING ENGINE
function loadColumnWidths() {
  try {
    const saved = localStorage.getItem('onecorporate_inv_col_widths');
    if (saved) {
      columnWidths = Object.assign({}, DEFAULT_COLUMN_WIDTHS, JSON.parse(saved));
    }
  } catch (err) {
    columnWidths = { ...DEFAULT_COLUMN_WIDTHS };
  }
  applyColumnWidths();
}

function saveColumnWidths() {
  try {
    localStorage.setItem('onecorporate_inv_col_widths', JSON.stringify(columnWidths));
  } catch (err) {
    console.warn('Error saving column widths:', err);
  }
}

function applyColumnWidths() {
  Object.keys(columnWidths).forEach(colKey => {
    const th = document.querySelector(`th[data-col="${colKey}"]`);
    if (th) {
      th.style.width = columnWidths[colKey] + 'px';
      th.style.minWidth = columnWidths[colKey] + 'px';
      th.style.maxWidth = columnWidths[colKey] + 'px';
    }
  });
}

function initColumnResizing() {
  const table = document.getElementById('excel-inventory-table');
  if (!table) return;

  const resizers = table.querySelectorAll('.resizer');

  resizers.forEach(resizer => {
    resizer.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const th = resizer.parentElement;
      const colKey = th.getAttribute('data-col');
      const startX = e.pageX;
      const startWidth = th.offsetWidth;

      resizer.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      function onMouseMove(e) {
        const newWidth = Math.max(45, startWidth + (e.pageX - startX));
        columnWidths[colKey] = newWidth;
        th.style.width = newWidth + 'px';
        th.style.minWidth = newWidth + 'px';
        th.style.maxWidth = newWidth + 'px';
      }

      function onMouseUp() {
        resizer.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        saveColumnWidths();
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
}

// Reset Column Widths to Defaults
window.resetColumnWidths = function() {
  columnWidths = { ...DEFAULT_COLUMN_WIDTHS };
  saveColumnWidths();
  applyColumnWidths();
};

// LOCATION FILTER OPTIONS POPULATION
function populateLocationFilterOptions() {
  const locationSelect = document.getElementById('filter-location-select');
  if (!locationSelect) return;

  const locations = Array.from(new Set(inventoryItems.map(item => item.location || 'General Storage'))).sort();
  
  let html = '<option value="All">All Locations & Floors</option>';
  locations.forEach(loc => {
    html += `<option value="${escapeHTML(loc)}">${escapeHTML(loc)}</option>`;
  });
  locationSelect.innerHTML = html;
}

// FILTER & SEARCH LOGIC
function getFilteredItems() {
  return inventoryItems.filter(item => {
    // 1. Category filter
    if (activeCategoryFilter !== 'All' && item.category !== activeCategoryFilter) {
      return false;
    }

    // 2. Search query filter
    if (currentSearchQuery) {
      const q = currentSearchQuery.toLowerCase();
      const match = (item.code && item.code.toLowerCase().includes(q)) ||
                    (item.name && item.name.toLowerCase().includes(q)) ||
                    (item.brand && item.brand.toLowerCase().includes(q)) ||
                    (item.category && item.category.toLowerCase().includes(q)) ||
                    (item.location && item.location.toLowerCase().includes(q)) ||
                    (item.supplier && item.supplier.toLowerCase().includes(q)) ||
                    (item.remarks && item.remarks.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 3. Stock Status filter
    if (currentStockFilter !== 'All') {
      if (currentStockFilter === 'Low Stock' && item.qty > (item.minStock || 5)) return false;
      if (currentStockFilter === 'Out of Stock' && item.qty > 0) return false;
      if (currentStockFilter === 'In Stock' && (item.qty === 0 || item.qty <= (item.minStock || 0))) return false;
      if (currentStockFilter === 'Installed' && item.status !== 'In Service / Installed') return false;
    }

    // 4. Date of Purchase range filter
    if (currentPurchaseDateFrom) {
      if (!item.dateOfPurchase || item.dateOfPurchase < currentPurchaseDateFrom) return false;
    }
    if (currentPurchaseDateTo) {
      if (!item.dateOfPurchase || item.dateOfPurchase > currentPurchaseDateTo) return false;
    }

    // 5. Location filter
    if (currentLocationFilter !== 'All' && item.location !== currentLocationFilter) {
      return false;
    }

    // 6. Condition filter
    if (currentConditionFilter !== 'All' && item.condition !== currentConditionFilter) {
      return false;
    }

    return true;
  });
}

// SORTING ENGINE
function getSortedFilteredItems() {
  const items = getFilteredItems();

  items.sort((a, b) => {
    let valA = a[currentSortColumn];
    let valB = b[currentSortColumn];

    if (currentSortColumn === 'totalValue') {
      valA = (a.qty || 0) * (a.unitCost || 0);
      valB = (b.qty || 0) * (b.unitCost || 0);
    }

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA === undefined || valA === null) valA = '';
    if (valB === undefined || valB === null) valB = '';

    if (valA < valB) return currentSortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return currentSortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return items;
}

window.sortTable = function(columnKey) {
  if (currentSortColumn === columnKey) {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortColumn = columnKey;
    currentSortDirection = 'asc';
  }

  // Update header sort classes
  document.querySelectorAll('.th-sort-btn').forEach(btn => {
    btn.classList.remove('sorted-asc', 'sorted-desc');
    const sortIcon = btn.querySelector('.sort-icon');
    if (sortIcon) sortIcon.textContent = '⇅';
  });

  const activeTh = document.querySelector(`th[data-col="${columnKey}"] .th-sort-btn`);
  if (activeTh) {
    activeTh.classList.add(currentSortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
    const sortIcon = activeTh.querySelector('.sort-icon');
    if (sortIcon) sortIcon.textContent = currentSortDirection === 'asc' ? '▲' : '▼';
  }

  renderTableBody();
};

// FORMATTERS & HELPERS
function formatCurrency(amount) {
  return '₱ ' + (amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCategoryBadgeClass(category) {
  switch (category) {
    case 'Mechanical': return 'cat-mech-badge';
    case 'Electrical': return 'cat-elec-badge';
    case 'Sanitary & Plumbing': return 'cat-plumb-badge';
    case 'Architectural': return 'cat-arch-badge';
    case 'Electronic': return 'cat-elec-sys-badge';
    case 'Fire Protection': return 'cat-fire-badge';
    case 'Tools & Equipment': return 'cat-tools-badge';
    default: return 'cat-mech-badge';
  }
}

function getStockStatusPill(item) {
  const qty = item.qty || 0;
  const minStock = item.minStock || 0;

  if (item.status === 'In Service / Installed') {
    return `<span class="status-pill status-installed">● Installed</span>`;
  }
  if (qty <= 0) {
    return `<span class="status-pill status-outstock">✕ Out of Stock</span>`;
  }
  if (qty <= minStock) {
    return `<span class="status-pill status-lowstock">⚠ Low Stock (${qty})</span>`;
  }
  return `<span class="status-pill status-instock">✓ In Stock</span>`;
}

// RENDERING
function renderApp() {
  renderKPIs();
  renderCategoryPills();
  renderTableBody();
  applyColumnWidths();
}

function renderKPIs() {
  const items = inventoryItems;
  const totalItems = items.length;
  
  let totalValuation = 0;
  let lowStockCount = 0;
  let categoriesSet = new Set();
  let currentYearPurchasesCount = 0;
  const currentYear = new Date().getFullYear().toString();

  items.forEach(item => {
    const qty = item.qty || 0;
    const unitCost = item.unitCost || 0;
    totalValuation += qty * unitCost;

    if (qty <= (item.minStock || 0)) {
      lowStockCount++;
    }

    if (item.category) categoriesSet.add(item.category);
    if (item.dateOfPurchase && item.dateOfPurchase.startsWith(currentYear)) {
      currentYearPurchasesCount++;
    }
  });

  const filteredItems = getFilteredItems();
  let filteredValuation = 0;
  filteredItems.forEach(item => {
    filteredValuation += (item.qty || 0) * (item.unitCost || 0);
  });

  document.getElementById('kpi-total-items').textContent = totalItems.toString();
  document.getElementById('kpi-total-valuation').textContent = formatCurrency(totalValuation);
  document.getElementById('kpi-low-stock').textContent = lowStockCount.toString();
  document.getElementById('kpi-total-categories').textContent = categoriesSet.size.toString() + ' Categories';
  
  const statsText = document.getElementById('table-stats-count');
  if (statsText) {
    statsText.innerHTML = `Showing <strong>${filteredItems.length}</strong> of <strong>${totalItems}</strong> items | Filtered Asset Value: <strong>${formatCurrency(filteredValuation)}</strong>`;
  }
}

function renderCategoryPills() {
  const container = document.getElementById('category-pills-container');
  if (!container) return;

  const categoryCounts = {};
  CATEGORIES.forEach(c => categoryCounts[c] = 0);
  
  inventoryItems.forEach(item => {
    if (categoryCounts[item.category] !== undefined) {
      categoryCounts[item.category]++;
    } else {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    }
  });

  let html = `
    <button class="cat-pill ${activeCategoryFilter === 'All' ? 'active' : ''}" onclick="setCategoryFilter('All')">
      <span>All Assets</span>
      <span class="pill-badge">${inventoryItems.length}</span>
    </button>
  `;

  CATEGORIES.forEach(cat => {
    const count = categoryCounts[cat] || 0;
    const icon = getCategoryIcon(cat);
    html += `
      <button class="cat-pill ${activeCategoryFilter === cat ? 'active' : ''}" onclick="setCategoryFilter('${cat}')">
        <span>${icon} ${cat}</span>
        <span class="pill-badge">${count}</span>
      </button>
    `;
  });

  container.innerHTML = html;
}

function getCategoryIcon(category) {
  switch (category) {
    case 'Mechanical': return '⚙️';
    case 'Electrical': return '⚡';
    case 'Sanitary & Plumbing': return '🚰';
    case 'Architectural': return '🏢';
    case 'Electronic': return '📡';
    case 'Fire Protection': return '🧯';
    case 'Tools & Equipment': return '🛠️';
    default: return '📦';
  }
}

function renderTableBody() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  const items = getSortedFilteredItems();

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="15">
          <div class="table-empty-placeholder">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#64748b" stroke-width="1.5" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h4 style="font-size: 15px; color: #cbd5e1; font-weight: 700;">No Inventory Items Found</h4>
            <p style="font-size: 12px; color: #94a3b8; max-width: 380px;">No inventory items matched your active search query, category filter, or purchase date parameters.</p>
            <button class="btn btn-primary" onclick="clearAllFilters()" style="margin-top: 6px;">Clear Filters</button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  items.forEach(item => {
    const isSelected = selectedItemIds.has(item.id);
    const totalVal = (item.qty || 0) * (item.unitCost || 0);
    const catClass = getCategoryBadgeClass(item.category);
    const statusPill = getStockStatusPill(item);

    html += `
      <tr class="${isSelected ? 'row-selected' : ''}" data-id="${item.id}">
        <!-- 1. Checkbox -->
        <td class="cell-checkbox">
          <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="toggleItemSelect('${item.id}', this.checked)">
        </td>

        <!-- 2. Image Thumbnail -->
        <td>
          <div class="item-img-thumbnail-wrapper" onclick="openImageZoomModal('${item.id}')" title="Click to enlarge photo">
            <img src="${item.image || generateCategorySVG(item.category, item.name)}" class="item-img-thumbnail" alt="${escapeHTML(item.name)}">
          </div>
        </td>

        <!-- 3. Item Code -->
        <td>
          <span class="item-code-badge">${escapeHTML(item.code || 'N/A')}</span>
        </td>

        <!-- 4. Description & Brand -->
        <td>
          <div class="item-name-cell" title="${escapeHTML(item.name)}">
            <span class="item-name-title">${escapeHTML(item.name)}</span>
            <span class="item-name-brand">${escapeHTML(item.brand || 'Standard Spec')}</span>
          </div>
        </td>

        <!-- 5. Category -->
        <td>
          <span class="category-badge ${catClass}">
            ${getCategoryIcon(item.category)} ${escapeHTML(item.category)}
          </span>
        </td>

        <!-- 6. Date of Purchase -->
        <td style="font-family: monospace; font-size: 11.5px; color: #cbd5e1;">
          ${formatDate(item.dateOfPurchase)}
        </td>

        <!-- 7. Quantity with Stepper -->
        <td>
          <div class="qty-stepper">
            <button class="qty-btn" onclick="adjustItemQty('${item.id}', -1)" title="Reduce stock count">-</button>
            <span class="qty-text">${item.qty || 0}</span>
            <button class="qty-btn" onclick="adjustItemQty('${item.id}', 1)" title="Add stock count">+</button>
            <span class="qty-unit">${escapeHTML(item.unit || 'pcs')}</span>
          </div>
        </td>

        <!-- 8. Min Level -->
        <td style="text-align: center; color: var(--text-muted); font-size: 11.5px;">
          ${item.minStock || 0} ${escapeHTML(item.unit || 'pcs')}
        </td>

        <!-- 9. Unit Cost (PHP) -->
        <td style="font-weight: 600; color: #cbd5e1;">
          ${formatCurrency(item.unitCost)}
        </td>

        <!-- 10. Total Value (PHP) -->
        <td style="font-weight: 700; color: #38bdf8;">
          ${formatCurrency(totalVal)}
        </td>

        <!-- 11. Storage Location -->
        <td title="${escapeHTML(item.location || '')}">
          <span style="font-size: 11.5px; color: #e2e8f0;">${escapeHTML(item.location || 'General Storage')}</span>
        </td>

        <!-- 12. Supplier Info -->
        <td title="${escapeHTML(item.supplier || '')}">
          <span style="font-size: 11.5px; color: #cbd5e1;">${escapeHTML(item.supplier || 'N/A')}</span>
        </td>

        <!-- 13. Condition -->
        <td>
          <span style="font-size: 11.5px; font-weight: 600; color: ${item.condition === 'Brand New' ? '#4ade80' : '#cbd5e1'};">
            ${escapeHTML(item.condition || 'Good')}
          </span>
        </td>

        <!-- 14. Status -->
        <td>
          ${statusPill}
        </td>

        <!-- 15. Action Buttons -->
        <td>
          <div class="action-buttons">
            <button class="btn-table-action" onclick="openEditItemModal('${item.id}')" title="Edit Item Details">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#38bdf8" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path></svg>
            </button>
            <button class="btn-table-action" onclick="openItemDetailsModal('${item.id}')" title="View Full Technical Details">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#34d399" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="btn-table-action btn-del" onclick="deleteItem('${item.id}')" title="Delete Item">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="#ef4444" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// QUICK STOCK ADJUSTMENT
window.adjustItemQty = function(id, delta) {
  const item = inventoryItems.find(i => i.id === id);
  if (!item) return;

  const newQty = Math.max(0, (item.qty || 0) + delta);
  item.qty = newQty;

  // Update status automatically
  if (item.status !== 'In Service / Installed') {
    if (newQty === 0) item.status = 'Out of Stock';
    else if (newQty <= (item.minStock || 0)) item.status = 'Low Stock';
    else item.status = 'In Stock';
  }

  saveInventoryData();
  renderApp();
};

// FILTER HANDLERS
window.setCategoryFilter = function(category) {
  activeCategoryFilter = category;
  renderApp();
};

window.handleSearchInput = function(e) {
  currentSearchQuery = e.target.value.trim();
  renderTableBody();
  renderKPIs();
};

window.handleStockFilterChange = function(val) {
  currentStockFilter = val;
  renderTableBody();
  renderKPIs();
};

window.handleDateFromChange = function(val) {
  currentPurchaseDateFrom = val;
  renderTableBody();
  renderKPIs();
};

window.handleDateToChange = function(val) {
  currentPurchaseDateTo = val;
  renderTableBody();
  renderKPIs();
};

window.handleLocationFilterChange = function(val) {
  currentLocationFilter = val;
  renderTableBody();
  renderKPIs();
};

window.handleConditionFilterChange = function(val) {
  currentConditionFilter = val;
  renderTableBody();
  renderKPIs();
};

window.clearAllFilters = function() {
  activeCategoryFilter = 'All';
  currentSearchQuery = '';
  currentStockFilter = 'All';
  currentPurchaseDateFrom = '';
  currentPurchaseDateTo = '';
  currentLocationFilter = 'All';
  currentConditionFilter = 'All';

  const searchInput = document.getElementById('search-inventory-input');
  if (searchInput) searchInput.value = '';

  const stockSelect = document.getElementById('filter-stock-select');
  if (stockSelect) stockSelect.value = 'All';

  const locSelect = document.getElementById('filter-location-select');
  if (locSelect) locSelect.value = 'All';

  const condSelect = document.getElementById('filter-condition-select');
  if (condSelect) condSelect.value = 'All';

  const dateFromInput = document.getElementById('filter-date-from');
  if (dateFromInput) dateFromInput.value = '';

  const dateToInput = document.getElementById('filter-date-to');
  if (dateToInput) dateToInput.value = '';

  renderApp();
};

// SELECTION & BULK ACTIONS
window.toggleSelectAll = function(isChecked) {
  const items = getSortedFilteredItems();
  if (isChecked) {
    items.forEach(i => selectedItemIds.add(i.id));
  } else {
    selectedItemIds.clear();
  }
  renderTableBody();
};

window.toggleItemSelect = function(id, isChecked) {
  if (isChecked) {
    selectedItemIds.add(id);
  } else {
    selectedItemIds.delete(id);
  }
  
  // Sync master checkbox
  const selectAllCb = document.getElementById('cb-select-all');
  if (selectAllCb) {
    const items = getSortedFilteredItems();
    selectAllCb.checked = items.length > 0 && selectedItemIds.size === items.length;
  }

  // Toggle row highlight
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  if (tr) {
    tr.classList.toggle('row-selected', isChecked);
  }
};

window.deleteSelectedItems = function() {
  if (selectedItemIds.size === 0) {
    alert("Please select one or more items to delete.");
    return;
  }

  if (confirm(`Are you sure you want to delete ${selectedItemIds.size} selected inventory items?`)) {
    inventoryItems = inventoryItems.filter(item => !selectedItemIds.has(item.id));
    selectedItemIds.clear();
    saveInventoryData();
    populateLocationFilterOptions();
    renderApp();
  }
};

window.deleteItem = function(id) {
  const item = inventoryItems.find(i => i.id === id);
  if (!item) return;

  if (confirm(`Are you sure you want to delete "${item.name}" (${item.code})?`)) {
    inventoryItems = inventoryItems.filter(i => i.id !== id);
    selectedItemIds.delete(id);
    saveInventoryData();
    populateLocationFilterOptions();
    renderApp();
  }
};

// ADD / EDIT ITEM MODAL HANDLERS
window.openAddItemModal = function() {
  editingItemId = null;
  currentUploadedImageBase64 = null;

  document.getElementById('item-modal-title').textContent = 'Add New Asset / Inventory Item';
  document.getElementById('form-item-id').value = '';
  document.getElementById('form-item-code').value = generateNextItemCode('Mechanical');
  document.getElementById('form-item-name').value = '';
  document.getElementById('form-item-category').value = 'Mechanical';
  document.getElementById('form-item-brand').value = '';
  document.getElementById('form-item-purchase-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('form-item-warranty').value = '';
  document.getElementById('form-item-qty').value = '10';
  document.getElementById('form-item-unit').value = 'pcs';
  document.getElementById('form-item-min-stock').value = '5';
  document.getElementById('form-item-cost').value = '0.00';
  document.getElementById('form-item-location').value = 'Basement 1 - Mechanical Room';
  document.getElementById('form-item-supplier').value = '';
  document.getElementById('form-item-contact').value = '';
  document.getElementById('form-item-condition').value = 'Brand New';
  document.getElementById('form-item-status').value = 'In Stock';
  document.getElementById('form-item-remarks').value = '';

  const previewImg = document.getElementById('form-image-preview');
  previewImg.src = generateCategorySVG('Mechanical', 'New Item');

  document.getElementById('item-modal').style.display = 'flex';
};

window.openEditItemModal = function(id) {
  const item = inventoryItems.find(i => i.id === id);
  if (!item) return;

  editingItemId = id;
  currentUploadedImageBase64 = item.image || null;

  document.getElementById('item-modal-title').textContent = `Edit Item: ${item.code}`;
  document.getElementById('form-item-id').value = item.id;
  document.getElementById('form-item-code').value = item.code || '';
  document.getElementById('form-item-name').value = item.name || '';
  document.getElementById('form-item-category').value = item.category || 'Mechanical';
  document.getElementById('form-item-brand').value = item.brand || '';
  document.getElementById('form-item-purchase-date').value = item.dateOfPurchase || '';
  document.getElementById('form-item-warranty').value = item.warrantyExpiry || '';
  document.getElementById('form-item-qty').value = item.qty !== undefined ? item.qty : 1;
  document.getElementById('form-item-unit').value = item.unit || 'pcs';
  document.getElementById('form-item-min-stock').value = item.minStock !== undefined ? item.minStock : 5;
  document.getElementById('form-item-cost').value = item.unitCost !== undefined ? item.unitCost : 0;
  document.getElementById('form-item-location').value = item.location || '';
  document.getElementById('form-item-supplier').value = item.supplier || '';
  document.getElementById('form-item-contact').value = item.supplierContact || '';
  document.getElementById('form-item-condition').value = item.condition || 'Good';
  document.getElementById('form-item-status').value = item.status || 'In Stock';
  document.getElementById('form-item-remarks').value = item.remarks || '';

  const previewImg = document.getElementById('form-image-preview');
  previewImg.src = item.image || generateCategorySVG(item.category, item.name);

  document.getElementById('item-modal').style.display = 'flex';
};

window.closeItemModal = function() {
  document.getElementById('item-modal').style.display = 'none';
  editingItemId = null;
  currentUploadedImageBase64 = null;
};

// Form Category Change: auto-generate prefix if empty
window.onFormCategoryChange = function(category) {
  const codeInput = document.getElementById('form-item-code');
  if (!editingItemId && codeInput) {
    codeInput.value = generateNextItemCode(category);
  }
  
  if (!currentUploadedImageBase64) {
    const previewImg = document.getElementById('form-image-preview');
    if (previewImg) previewImg.src = generateCategorySVG(category, document.getElementById('form-item-name').value || 'New Item');
  }
};

function generateNextItemCode(category) {
  let prefix = 'MEC';
  if (category === 'Electrical') prefix = 'ELE';
  else if (category === 'Sanitary & Plumbing') prefix = 'SAN';
  else if (category === 'Architectural') prefix = 'ARC';
  else if (category === 'Electronic') prefix = 'ELC';
  else if (category === 'Fire Protection') prefix = 'FIR';
  else if (category === 'Tools & Equipment') prefix = 'TLS';

  const count = inventoryItems.filter(i => i.category === category).length + 1;
  const numStr = (count < 10 ? '0' : '') + count;
  return `${prefix}-${numStr}`;
}

// IMAGE UPLOAD HANDLER
window.triggerPhotoUpload = function() {
  const fileInput = document.getElementById('form-item-photo-input');
  if (fileInput) fileInput.click();
};

window.handlePhotoUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    currentUploadedImageBase64 = e.target.result;
    const previewImg = document.getElementById('form-image-preview');
    if (previewImg) previewImg.src = currentUploadedImageBase64;
  };
  reader.readAsDataURL(file);
};

window.removeUploadedPhoto = function() {
  currentUploadedImageBase64 = null;
  const category = document.getElementById('form-item-category').value || 'Mechanical';
  const previewImg = document.getElementById('form-image-preview');
  if (previewImg) previewImg.src = generateCategorySVG(category, 'Default');
  const fileInput = document.getElementById('form-item-photo-input');
  if (fileInput) fileInput.value = '';
};

// SAVE ITEM SUBMIT
window.saveInventoryItem = function(event) {
  event.preventDefault();

  const id = document.getElementById('form-item-id').value;
  const code = document.getElementById('form-item-code').value.trim();
  const name = document.getElementById('form-item-name').value.trim();
  const category = document.getElementById('form-item-category').value;
  const brand = document.getElementById('form-item-brand').value.trim();
  const dateOfPurchase = document.getElementById('form-item-purchase-date').value;
  const warrantyExpiry = document.getElementById('form-item-warranty').value;
  const qty = parseInt(document.getElementById('form-item-qty').value, 10) || 0;
  const unit = document.getElementById('form-item-unit').value.trim() || 'pcs';
  const minStock = parseInt(document.getElementById('form-item-min-stock').value, 10) || 0;
  const unitCost = parseFloat(document.getElementById('form-item-cost').value) || 0;
  const location = document.getElementById('form-item-location').value.trim();
  const supplier = document.getElementById('form-item-supplier').value.trim();
  const supplierContact = document.getElementById('form-item-contact').value.trim();
  const condition = document.getElementById('form-item-condition').value;
  const status = document.getElementById('form-item-status').value;
  const remarks = document.getElementById('form-item-remarks').value.trim();

  const finalImage = currentUploadedImageBase64 || (id ? (inventoryItems.find(i => i.id === id) || {}).image : null) || generateCategorySVG(category, name);

  if (id) {
    // Edit existing
    const item = inventoryItems.find(i => i.id === id);
    if (item) {
      Object.assign(item, {
        code, name, category, brand, dateOfPurchase, warrantyExpiry,
        qty, unit, minStock, unitCost, location, supplier, supplierContact,
        condition, status, remarks, image: finalImage
      });
    }
  } else {
    // Create new
    const newId = 'inv_' + Date.now();
    inventoryItems.unshift({
      id: newId,
      code, name, category, brand, dateOfPurchase, warrantyExpiry,
      qty, unit, minStock, unitCost, location, supplier, supplierContact,
      condition, status, remarks, image: finalImage
    });
  }

  saveInventoryData();
  populateLocationFilterOptions();
  closeItemModal();
  renderApp();
};

// IMAGE ZOOM & VIEW DETAIL MODAL
window.openImageZoomModal = function(id) {
  const item = inventoryItems.find(i => i.id === id);
  if (!item) return;

  document.getElementById('zoom-modal-title').textContent = `${item.code} - ${item.name}`;
  document.getElementById('zoom-modal-img').src = item.image || generateCategorySVG(item.category, item.name);
  
  document.getElementById('zoom-info-code').textContent = item.code || 'N/A';
  document.getElementById('zoom-info-category').textContent = item.category;
  document.getElementById('zoom-info-purchase-date').textContent = formatDate(item.dateOfPurchase);
  document.getElementById('zoom-info-warranty').textContent = formatDate(item.warrantyExpiry);
  document.getElementById('zoom-info-stock').textContent = `${item.qty} ${item.unit} (${item.status})`;
  document.getElementById('zoom-info-cost').textContent = formatCurrency(item.unitCost);
  document.getElementById('zoom-info-location').textContent = item.location || 'General Storage';
  document.getElementById('zoom-info-supplier').textContent = item.supplier || 'N/A';

  document.getElementById('image-zoom-modal').style.display = 'flex';
};

window.closeImageZoomModal = function() {
  document.getElementById('image-zoom-modal').style.display = 'none';
};

window.openItemDetailsModal = function(id) {
  openImageZoomModal(id);
};

// EXCEL CSV EXPORT
window.exportInventoryToCSV = function() {
  const items = getSortedFilteredItems();
  if (items.length === 0) {
    alert("No items to export.");
    return;
  }

  const headers = [
    'Item Code',
    'Item Name',
    'Category',
    'Brand & Specification',
    'Date of Purchase',
    'Warranty Expiry',
    'Stock Qty',
    'Unit',
    'Min Level',
    'Unit Cost (PHP)',
    'Total Valuation (PHP)',
    'Storage Location',
    'Supplier / Vendor',
    'Supplier Contact',
    'Condition',
    'Operational Status',
    'Remarks'
  ];

  let csvContent = '\uFEFF'; // UTF-8 BOM for Excel
  csvContent += headers.map(h => `"${h}"`).join(',') + '\r\n';

  items.forEach(item => {
    const totalVal = (item.qty || 0) * (item.unitCost || 0);
    const row = [
      item.code || '',
      item.name || '',
      item.category || '',
      item.brand || '',
      item.dateOfPurchase || '',
      item.warrantyExpiry || '',
      item.qty || 0,
      item.unit || 'pcs',
      item.minStock || 0,
      (item.unitCost || 0).toFixed(2),
      totalVal.toFixed(2),
      item.location || '',
      item.supplier || '',
      item.supplierContact || '',
      item.condition || 'Good',
      item.status || 'In Stock',
      item.remarks || ''
    ];

    csvContent += row.map(val => {
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(',') + '\r\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `OneCorporate_Inventory_Catalog_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// PRINT REPORT HANDLER
window.printInventoryReport = function() {
  const printHeader = document.getElementById('print-header-details');
  if (printHeader) {
    const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const items = getSortedFilteredItems();
    let totalVal = 0;
    items.forEach(i => totalVal += (i.qty || 0) * (i.unitCost || 0));

    printHeader.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-size: 18px; margin: 0; font-weight: 800; color: #000;">ONE CORPORATE BUILDING MAINTENANCE</h2>
          <h3 style="font-size: 14px; margin: 2px 0 0 0; color: #475569;">OFFICIAL ASSET & MATERIALS INVENTORY INVENTORY AUDIT REPORT</h3>
        </div>
        <div style="text-align: right; font-size: 11px; color: #475569;">
          <div><strong>Date:</strong> ${dateStr}</div>
          <div><strong>Category Scope:</strong> ${activeCategoryFilter}</div>
          <div><strong>Total Valuation:</strong> ${formatCurrency(totalVal)}</div>
        </div>
      </div>
    `;
  }

  window.print();
};

// EVENT LISTENERS INITIALIZATION
function initEventListeners() {
  const searchInput = document.getElementById('search-inventory-input');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });
}

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

