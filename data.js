/* ═══════════════════════════════════════════
   AeroIntel DB — Data Store
   ═══════════════════════════════════════════ */

// Image upload storage (in-memory, keyed by id)
const imageStore = {};

// Image specs per category
const IMAGE_SPECS = {
  vehicle: { w: 800, h: 450, ratio: '16:9', note: 'Side or 3/4 view preferred, transparent/white bg or environment', format: 'JPG / PNG / WebP' },
  component: { w: 600, h: 600, ratio: '1:1', note: 'Clean product shot, white/dark bg, show part number label if possible', format: 'JPG / PNG' },
  engine: { w: 800, h: 500, ratio: '8:5', note: 'Engine front or 3/4 angle, cutaway OK', format: 'JPG / PNG / WebP' },
  material: { w: 400, h: 400, ratio: '1:1', note: 'Material sample, microstructure or finished part', format: 'JPG / PNG' },
  facility: { w: 1200, h: 630, ratio: '~2:1', note: 'Wide factory/facility shot preferred', format: 'JPG / PNG' },
};

const VEHICLES = [
  {id:'v001',name:'LCA Tejas Mk1A',cat:'Fighter',origin:'India',mfr:'HAL',status:'Production',mtow:'13,500 kg',range:'3,000 km',speed:'Mach 1.8',ops:'IAF'},
  {id:'v002',name:'LCA Tejas Mk2',cat:'Fighter',origin:'India',mfr:'HAL / ADA',status:'Development',mtow:'17,500 kg',range:'3,500 km',speed:'Mach 1.8+',ops:'IAF (planned)'},
  {id:'v003',name:'AMCA (Mk1/Mk2)',cat:'Fighter',origin:'India',mfr:'HAL / ADA',status:'Design',mtow:'25,000 kg',range:'2,700 km',speed:'Mach 1.8 SC',ops:'IAF (future)'},
  {id:'v004',name:'Rafale EH',cat:'Fighter',origin:'France',mfr:'Dassault Aviation',status:'In Service',mtow:'24,500 kg',range:'3,700 km',speed:'Mach 1.8',ops:'IAF, IN'},
  {id:'v005',name:'Su-30MKI',cat:'Fighter',origin:'Russia / India',mfr:'HAL / Sukhoi',status:'In Service',mtow:'38,800 kg',range:'3,000 km',speed:'Mach 2.0',ops:'IAF'},
  {id:'v006',name:'MiG-29K/UPG',cat:'Fighter',origin:'Russia',mfr:'RAC MiG',status:'In Service',mtow:'22,400 kg',range:'3,000 km',speed:'Mach 2.3',ops:'IN'},
  {id:'v007',name:'Mirage 2000-5',cat:'Fighter',origin:'France',mfr:'Dassault Aviation',status:'In Service',mtow:'17,000 kg',range:'1,850 km',speed:'Mach 2.2',ops:'IAF'},
  {id:'v008',name:'TEDBF',cat:'Fighter',origin:'India',mfr:'ADA / HAL',status:'Design',mtow:'26,000 kg',range:'1,500 km',speed:'Mach 1.8',ops:'IN (future)'},
  {id:'v009',name:'HAL HTT-40',cat:'Trainer',origin:'India',mfr:'HAL',status:'Production',mtow:'2,800 kg',range:'900 km',speed:'450 km/h',ops:'IAF'},
  {id:'v010',name:'HAL HJT-36 Sitara',cat:'Trainer',origin:'India',mfr:'HAL',status:'Development',mtow:'5,500 kg',range:'1,400 km',speed:'780 km/h',ops:'IAF'},
  {id:'v011',name:'BAe Hawk 132',cat:'Trainer',origin:'UK',mfr:'BAE Systems → HAL',status:'In Service',mtow:'9,100 kg',range:'2,520 km',speed:'Mach 0.84',ops:'IAF, IN'},
  {id:'v012',name:'Pilatus PC-7 Mk II',cat:'Trainer',origin:'Switzerland',mfr:'Pilatus Aircraft',status:'In Service',mtow:'2,700 kg',range:'1,745 km',speed:'520 km/h',ops:'IAF'},
  {id:'v013',name:'C-130J Super Hercules',cat:'Transport',origin:'USA',mfr:'Lockheed Martin',status:'In Service',mtow:'74,389 kg',range:'6,852 km',speed:'671 km/h',ops:'IAF'},
  {id:'v014',name:'C-17 Globemaster III',cat:'Transport',origin:'USA',mfr:'Boeing',status:'In Service',mtow:'265,350 kg',range:'10,390 km',speed:'833 km/h',ops:'IAF'},
  {id:'v015',name:'Airbus C-295M',cat:'Transport',origin:'Spain',mfr:'Airbus / TASL',status:'Production',mtow:'23,200 kg',range:'1,300 km',speed:'480 km/h',ops:'IAF'},
  {id:'v016',name:'SARAS Mk2',cat:'Transport',origin:'India',mfr:'NAL',status:'Development',mtow:'7,000 kg',range:'1,600 km',speed:'630 km/h',ops:'IAF / Civil'},
  {id:'v017',name:'ALH Dhruv (Mk III/IV)',cat:'Helicopter',origin:'India',mfr:'HAL',status:'In Service',mtow:'5,500 kg',range:'630 km',speed:'290 km/h',ops:'IAF, IA, IN, ICG'},
  {id:'v018',name:'LCH Prachand',cat:'Helicopter',origin:'India',mfr:'HAL',status:'In Service',mtow:'5,800 kg',range:'550 km',speed:'330 km/h',ops:'IAF, IA'},
  {id:'v019',name:'HAL LUH',cat:'Helicopter',origin:'India',mfr:'HAL',status:'Development',mtow:'2,750 kg',range:'350 km',speed:'220 km/h',ops:'IAF, IA'},
  {id:'v020',name:'Mi-17V5',cat:'Helicopter',origin:'Russia',mfr:'Kazan Helicopters',status:'In Service',mtow:'13,000 kg',range:'610 km',speed:'250 km/h',ops:'IAF, IA'},
  {id:'v021',name:'Boeing Apache AH-64E',cat:'Helicopter',origin:'USA',mfr:'Boeing',status:'In Service',mtow:'10,433 kg',range:'476 km',speed:'293 km/h',ops:'IAF, IA'},
  {id:'v022',name:'Boeing Chinook CH-47F',cat:'Helicopter',origin:'USA',mfr:'Boeing',status:'In Service',mtow:'22,680 kg',range:'741 km',speed:'315 km/h',ops:'IAF'},
  {id:'v023',name:'P-8I Poseidon',cat:'Naval Aircraft',origin:'USA',mfr:'Boeing',status:'In Service',mtow:'85,820 kg',range:'9,265 km',speed:'907 km/h',ops:'IN'},
  {id:'v024',name:'Rustom-2 (TAPAS-BH)',cat:'UAV',origin:'India',mfr:'DRDO / HAL / BEL',status:'Development',mtow:'1,800 kg',range:'1,000 km',speed:'225 km/h',ops:'IAF (planned)'},
  {id:'v025',name:'CATS Warrior UCAV',cat:'UAV',origin:'India',mfr:'HAL / NewSpace',status:'Development',mtow:'3,500 kg',range:'900 km',speed:'Mach 0.65',ops:'IAF (future)'},
  {id:'v026',name:'IAI Heron TP',cat:'UAV',origin:'Israel',mfr:'Israel Aerospace Industries',status:'In Service',mtow:'1,100 kg',range:'1,000 km',speed:'220 km/h',ops:'IAF, IA, IN'},
  {id:'v027',name:'ideaForge SWITCH UAV',cat:'UAV',origin:'India',mfr:'ideaForge Technology',status:'In Service',mtow:'3.0 kg',range:'15 km',speed:'72 km/h',ops:'IA, BSF, Police'},
  {id:'v028',name:'Nagastra-1 (LM)',cat:'Loitering Munition',origin:'India',mfr:'Solar Industries / EEL',status:'In Service',mtow:'7 kg',range:'30 km',speed:'100 km/h',ops:'IA'},
  {id:'v029',name:'BrahMos Block III/NG',cat:'Missile',origin:'India / Russia',mfr:'BrahMos Aerospace (BAPL)',status:'In Service',mtow:'2,500 kg',range:'450 km',speed:'Mach 2.8',ops:'IAF, IA, IN'},
  {id:'v030',name:'Astra Mk1 / Mk2',cat:'Missile',origin:'India',mfr:'DRDO / BDL',status:'In Service',mtow:'154 kg',range:'110 km (Mk1)',speed:'Mach 4.5',ops:'IAF'},
  {id:'v031',name:'Akash NG (SAM)',cat:'Missile',origin:'India',mfr:'DRDO / BDL',status:'Production',mtow:'720 kg',range:'70 km',speed:'Mach 3.5',ops:'IAF, IA'},
  {id:'v032',name:'Pralay SRBM',cat:'Missile',origin:'India',mfr:'DRDO / MIDHANI',status:'In Service',mtow:'1,800 kg',range:'500 km',speed:'Mach 6+',ops:'IA'},
  {id:'v033',name:'Nirbhay Cruise Missile',cat:'Missile',origin:'India',mfr:'DRDO / ADE',status:'Development',mtow:'1,500 kg',range:'1,000 km',speed:'0.7 Mach',ops:'IAF, IA, IN'},
  {id:'v034',name:'PSLV-XL (C-60)',cat:'Satellite/Space',origin:'India',mfr:'ISRO',status:'Operational',mtow:'320,000 kg',range:'LEO 3,800 kg',speed:'N/A',ops:'ISRO'},
  {id:'v035',name:'LVM3 (GSLV Mk III)',cat:'Satellite/Space',origin:'India',mfr:'ISRO',status:'Operational',mtow:'640,000 kg',range:'GTO 4,000 kg',speed:'N/A',ops:'ISRO / OneWeb'},
  {id:'v036',name:'NGLV (Next Gen)',cat:'Satellite/Space',origin:'India',mfr:'ISRO',status:'Development',mtow:'~1,050,000 kg',range:'LEO 30,000 kg',speed:'N/A',ops:'ISRO'},
  {id:'v037',name:'Skyroot Vikram-S/1',cat:'Satellite/Space',origin:'India',mfr:'Skyroot Aerospace',status:'Operational',mtow:'545 kg',range:'LEO 315 kg',speed:'N/A',ops:'Skyroot'},
  {id:'v038',name:'Agnikul Agnibaan SOrTeD',cat:'Satellite/Space',origin:'India',mfr:'Agnikul Cosmos',status:'Test',mtow:'~7,000 kg',range:'LEO 100 kg',speed:'N/A',ops:'Agnikul'},
  {id:'v039',name:'Airbus A320neo',cat:'Commercial',origin:'France',mfr:'Airbus',status:'In Service',mtow:'79,000 kg',range:'6,300 km',speed:'833 km/h',ops:'IndiGo, Air India, SpiceJet'},
  {id:'v040',name:'Airbus A350-900',cat:'Commercial',origin:'France',mfr:'Airbus',status:'In Service',mtow:'280,000 kg',range:'15,000 km',speed:'903 km/h',ops:'Air India'},
  {id:'v041',name:'ePlane e200',cat:'eVTOL',origin:'India',mfr:'The ePlane Company (IIT-M)',status:'Development',mtow:'300 kg',range:'200 km',speed:'200 km/h',ops:'N/A'},
  {id:'v042',name:'Sarla Shunya',cat:'eVTOL',origin:'India',mfr:'Sarla Aviation',status:'Development',mtow:'880 kg',range:'80 km',speed:'200 km/h',ops:'N/A'},
];

const COMPONENTS = [
  {id:'c001',name:'CFRP Wing Panel (LCA)',pn:'LCA-W-001-HAL',mat:'CFRP T800H/M21',supp:'HAL CSDO, Bengaluru',country:'India',cert:'DO-160G / DGAQA',grade:'Military'},
  {id:'c002',name:'Fly-by-Wire DFCC',pn:'LCA-AV-DFCC-01',mat:'Electronics (PowerPC)',supp:'HAL Avionics / CSIR-NAL',country:'India',cert:'DO-178C DAL-A',grade:'Military'},
  {id:'c003',name:'EJ200 Turbofan Engine',pn:'EJ200-LCA-MK1A',mat:'Ni Superalloy / Ti / CFRP',supp:'Eurojet Turbo GmbH',country:'Germany/UK/Spain/Italy',cert:'DEF-STAN 00-970',grade:'Military'},
  {id:'c004',name:'Kaveri GTX-35VS Engine',pn:'GTRE-GTX35VS',mat:'Ti-6Al-4V / Inconel 718',supp:'GTRE / HAL Engine Div',country:'India',cert:'DGAQA',grade:'Military'},
  {id:'c005',name:'Martin Baker Mk16 Ejection Seat',pn:'MB-MK16A-0G',mat:'Al 7075 / Aramid / Pyro',supp:'Martin Baker Aircraft Co.',country:'UK',cert:'MIL-S-18471H',grade:'Military'},
  {id:'c006',name:'Uttam AESA Radar',pn:'UTTAM-AESA-R01',mat:'GaAs/GaN T/R modules',supp:'LRDE / BEL, Bengaluru',country:'India',cert:'DGAQA qualified',grade:'Military'},
  {id:'c007',name:'Main Landing Gear Assembly',pn:'LCA-LG-MG-01',mat:'300M Ultra-high strength steel',supp:'Safran Landing Systems',country:'France',cert:'EASA CS-25.721',grade:'Military'},
  {id:'c008',name:'BrahMos Ramjet Engine',pn:'BAPL-RJ-BM-01',mat:'Inconel 625 / CMC',supp:'BrahMos Aerospace / NPO Saturn',country:'India / Russia',cert:'DRDO qualification',grade:'Military'},
  {id:'c009',name:'ALH Composite Rotor Blade',pn:'ALH-RB-CFRP-01',mat:'CFRP / GFRP / Titanium LE',supp:'HAL Rotary Wing Div.',country:'India',cert:'DGCA / DGAQA',grade:'Military'},
  {id:'c010',name:'PSLV S139 Motor Case',pn:'ISRO-S1-PSLV-CS',mat:'Maraging Steel 250 grade',supp:'MIDHANI / VSSC',country:'India',cert:'ISRO qual standard',grade:'Space'},
  {id:'c011',name:'LVM3 CFRP Payload Fairing',pn:'LVM3-FH-CFRP-01',mat:'CFRP M55J / Honeycomb',supp:'ISRO VSSC (Thiruvananthapuram)',country:'India',cert:'ISRO qual',grade:'Space'},
  {id:'c012',name:'GaN T/R Module (AESA)',pn:'LRDE-TR-GaN-01',mat:'GaN-on-SiC wafer',supp:'LRDE / BEL Machilipatnam',country:'India',cert:'DGAQA',grade:'Military'},
  {id:'c013',name:'Ring Laser Gyro INS',pn:'HON-LN100G-INS',mat:'Glass ceramic / optics',supp:'Honeywell Aerospace',country:'USA',cert:'DO-160G / MIL-STD-810',grade:'Military'},
  {id:'c014',name:'CFM LEAP-1A Engine',pn:'CFM-LEAP1A26',mat:'CMC / CFRP / Ni superalloy',supp:'CFM International (GE + Safran)',country:'USA / France',cert:'EASA / FAA TC',grade:'Commercial'},
  {id:'c015',name:'Hydraulic Flight Actuator',pn:'PKR-HA-MIL-CS01',mat:'15-5PH Stainless Steel',supp:'Parker Hannifin / Moog Inc.',country:'USA',cert:'MIL-H-5440',grade:'Military'},
  {id:'c016',name:'Integral Wing Fuel Tank',pn:'LCA-FT-IW-01',mat:'CFRP + PRC sealant PR-1440',supp:'HAL Aircraft Division',country:'India',cert:'DGAQA / MIL-T-5578',grade:'Military'},
  {id:'c017',name:'Akash Seeker (RF/IR)',pn:'DRDO-AKNG-SK01',mat:'GaAs MMIC / IRD',supp:'DRDO DRDL / BEL',country:'India',cert:'DRDO qualification',grade:'Military'},
  {id:'c018',name:'CE-20 Cryogenic Engine',pn:'ISRO-CE20-LOX-01',mat:'Titanium / Inconel nozzle',supp:'ISRO LPSC (Valiamala)',country:'India',cert:'ISRO qual',grade:'Space'},
];

const MATERIALS = [
  {id:'m001',name:'Al 7075-T6',type:'Metal',grade:'7075-T6',uts:'572 MPa',dens:'2.81 g/cc',temp:'-80 to 120°C',app:'Wing ribs, spars, frames, fittings',supp:'Arconic, Novelis, Hindalco Novelis'},
  {id:'m002',name:'Al 2024-T3',type:'Metal',grade:'2024-T3',uts:'483 MPa',dens:'2.78 g/cc',temp:'-80 to 120°C',app:'Fuselage skin, stringers, pressure bulkheads',supp:'Arconic, NALCO'},
  {id:'m003',name:'Al-Li 2099-T83',type:'Metal',grade:'2099-T83',uts:'564 MPa',dens:'2.63 g/cc',temp:'-80 to 120°C',app:'Fuselage frames, stringers (weight saving)',supp:'Arconic'},
  {id:'m004',name:'Ti-6Al-4V (Grade 5 ELI)',type:'Metal',grade:'AMS 4928',uts:'950 MPa',dens:'4.43 g/cc',temp:'-200 to 315°C',app:'Engine brackets, landing gear, fasteners, hydraulic manifolds',supp:'VSMPO-AVISMA, ATI, TIMET, MIDHANI'},
  {id:'m005',name:'Ti-3Al-2.5V',type:'Metal',grade:'AMS 4943',uts:'690 MPa',dens:'4.48 g/cc',temp:'-200 to 260°C',app:'Hydraulic tubing, aerospace plumbing',supp:'ATI, VSMPO'},
  {id:'m006',name:'Inconel 718',type:'Metal',grade:'AMS 5662',uts:'1,380 MPa',dens:'8.19 g/cc',temp:'up to 650°C',app:'Turbine discs, combustors, exhaust nozzles, BrahMos ramjet',supp:'Special Metals, Haynes Intl, MIDHANI'},
  {id:'m007',name:'Inconel 625',type:'Metal',grade:'AMS 5581',uts:'930 MPa',dens:'8.44 g/cc',temp:'up to 980°C',app:'Missile exhaust, rocket motor parts, marine gas turbines',supp:'Special Metals, VDM Metals, MIDHANI'},
  {id:'m008',name:'300M Ultra-HY Steel',type:'Metal',grade:'AMS 6257',uts:'1,930 MPa',dens:'7.87 g/cc',temp:'-55 to 200°C',app:'Aircraft landing gear, main struts',supp:'Carpenter Technology, Ellwood City Forge'},
  {id:'m009',name:'Maraging Steel 250',type:'Metal',grade:'AMS 6521',uts:'1,795 MPa',dens:'8.00 g/cc',temp:'-55 to 200°C',app:'PSLV/GSLV rocket motor casings, pressure vessels, missile airframes',supp:'Carpenter Tech, MIDHANI (India)'},
  {id:'m010',name:'CFRP T800H/M21',type:'Composite',grade:'Toray T800H/M21',uts:'2,800 MPa (fibre)',dens:'1.58 g/cc',temp:'-55 to 120°C',app:'LCA wing skins, AMCA fuselage, control surfaces, spars',supp:'Toray (Japan), Hexcel, Solvay'},
  {id:'m011',name:'CFRP M55J/EX-1515',type:'Composite',grade:'Toray M55J',uts:'3,800 MPa (fibre)',dens:'1.68 g/cc',temp:'-55 to 130°C',app:'PSLV/LVM3 fairings, satellite structures, precision boom',supp:'Toray, Mitsubishi Chemical'},
  {id:'m012',name:'GFRP E-glass/Epoxy',type:'Composite',grade:'Aero-grade',uts:'1,500 MPa (fibre)',dens:'2.54 g/cc',temp:'-60 to 150°C',app:'Radomes, radar fairings, secondary structures',supp:'Owens Corning, Jushi Group'},
  {id:'m013',name:'Kevlar 49/Epoxy',type:'Composite',grade:'DuPont Kevlar 49',uts:'3,620 MPa (fibre)',dens:'1.44 g/cc',temp:'-55 to 160°C',app:'Ballistic armour, floor panels, tail fairings',supp:'DuPont, Teijin Aramid'},
  {id:'m014',name:'Nomex Honeycomb HRH-10',type:'Composite',grade:'Hexcel HRH-10',uts:'N/A (shear)',dens:'0.05 g/cc',temp:'up to 180°C',app:'Floor panels, spoilers, control surface cores, radomes',supp:'Hexcel, Euro-Composites'},
  {id:'m015',name:'CMC SiC/SiC',type:'Ceramic',grade:'Aero-grade Melt Inf.',uts:'450 MPa',dens:'2.70 g/cc',temp:'up to 1,400°C',app:'LEAP engine hot section, turbine shrouds, exhaust nozzles',supp:'GE Aerospace (in-house), COI Ceramics, Safran'},
  {id:'m016',name:'PEEK 450G',type:'Polymer',grade:'Victrex 450G',uts:'100 MPa',dens:'1.32 g/cc',temp:'-60 to 260°C',app:'Brackets, clips, fluid fittings, fastener washers',supp:'Victrex, Solvay Specialty Polymers'},
];

const PROPULSION = [
  {id:'e001',name:'EJ200',mfr:'Eurojet (MTU/Rolls-Royce/ITP/Avio)',type:'Turbofan (FADEC)',thrust:'90 kN AB / 60 kN dry',sfc:'0.81 kg/daN·h',wt:'1,045 kg',tbo:'4,000 hrs',apps:'Eurofighter Typhoon, LCA Tejas Mk2',status:'Production'},
  {id:'e002',name:'Kaveri GTX-35VS',mfr:'GTRE, Bengaluru (India)',type:'Turbofan',thrust:'73.5 kN AB / 49 kN dry',sfc:'0.90 kg/daN·h',wt:'1,250 kg',tbo:'750 hrs',apps:'LCA Tejas (future), combat UAVs',status:'Development'},
  {id:'e003',name:'AL-31FP',mfr:'Saturn / Lyulka (Russia)',type:'Turbofan',thrust:'123 kN AB (TVC)',sfc:'0.79 kg/daN·h',wt:'1,570 kg',tbo:'1,500 hrs',apps:'Su-30MKI',status:'In Service'},
  {id:'e004',name:'M88-2 Rev 3',mfr:'Safran Aircraft Engines (France)',type:'Turbofan (FADEC)',thrust:'75 kN AB / 50 kN dry',sfc:'0.80 kg/daN·h',wt:'897 kg',tbo:'6,000+ hrs',apps:'Rafale EH',status:'Production'},
  {id:'e005',name:'CFM LEAP-1A',mfr:'CFM International (GE+Safran)',type:'Turbofan (3D printed parts)',thrust:'120–146 kN',sfc:'0.52 kg/kN·h',wt:'2,990 kg',tbo:'25,000 hrs',apps:'A320neo (IndiGo, Air India)',status:'Production'},
  {id:'e006',name:'Rolls-Royce Trent XWB-97',mfr:'Rolls-Royce (UK)',type:'Turbofan',thrust:'430 kN',sfc:'0.478 kg/kN·h',wt:'7,277 kg',tbo:'20,000+ hrs',apps:'A350-900XWB (Air India)',status:'Production'},
  {id:'e007',name:'Shakti (TM333-2C2)',mfr:'Safran Helicopter → HAL licence',type:'Turboshaft',thrust:'1,067 shp',sfc:'—',wt:'188 kg',tbo:'3,500 hrs',apps:'ALH Dhruv (Mk III/IV), LCH Prachand',status:'In Service'},
  {id:'e008',name:'GE T700-701D',mfr:'GE Aerospace (USA)',type:'Turboshaft',thrust:'1,940 shp',sfc:'—',wt:'198 kg',tbo:'5,000 hrs',apps:'Apache AH-64E, UH-60M',status:'Production'},
  {id:'e009',name:'HTSE-1200',mfr:'HAL Engine Research & Dev (India)',type:'Turboshaft',thrust:'1,200 shp (target)',sfc:'—',wt:'~230 kg',tbo:'TBD',apps:'HAL LUH, future India helicopters',status:'Development'},
  {id:'e010',name:'PS-15 Vikas (L-110)',mfr:'ISRO / HAL Engine Division',type:'Liquid bipropellant (UDMH/N2O4)',thrust:'800 kN (vacuum)',sfc:'—',wt:'900 kg',tbo:'N/A',apps:'PSLV 2nd stage, GSLV Mk2 core strap-ons',status:'Operational'},
  {id:'e011',name:'CE-20 Cryogenic',mfr:'ISRO LPSC, Valiamala',type:'Cryogenic (LOX/LH₂)',thrust:'200 kN (vacuum)',sfc:'—',wt:'588 kg',tbo:'N/A',apps:'LVM3 upper stage (C-25)',status:'Operational'},
  {id:'e012',name:'SCE-200 Semi-Cryo',mfr:'ISRO LPSC (India)',type:'Semi-cryogenic (LOX/Kerosene)',thrust:'2,000 kN',sfc:'—',wt:'~2,000 kg',tbo:'N/A',apps:'NGLV first stage',status:'Development'},
  {id:'e013',name:'BrahMos Solid Booster',mfr:'DRDO DRDL / SFC India',type:'Solid rocket motor',thrust:'~1,200 kN (launch boost)',sfc:'—',wt:'~200 kg',tbo:'Single use',apps:'BrahMos cruise missile launch boost',status:'In Service'},
  {id:'e014',name:'PTAE-7 Turbojet',mfr:'DRDO / HAL Engine Division',type:'Turbojet',thrust:'3.43 kN',sfc:'1.10 kg/kN·h',wt:'55 kg',tbo:'Single use',apps:'Lakshya PTA, Nirbhay booster stage',status:'In Service'},
];

const INDIA_COMPANIES = [
  {name:'HAL (Hindustan Aeronautics Ltd)',type:'DPSU',loc:'Bengaluru (HQ), 20 divisions',rev:'₹28,162 Cr (FY24)',emp:'30,000+',cap:'Aircraft mfr (LCA, ALH, LCH, HTT-40), aeroengines, MRO, helicopters, UAVs',cust:'IAF, IA, IN, ICG, export',cert:'AS9100D, NADCAP, DGAQA'},
  {name:'BEL (Bharat Electronics Ltd)',type:'DPSU',loc:'Bengaluru (HQ), 9 units',rev:'₹19,000 Cr (FY24)',emp:'11,000+',cap:'Radar, EW, avionics, AESA T/R, communications, electro-optics, satcom',cust:'MoD, DRDO, paramilitary',cert:'AS9100D, ISO 9001:2015'},
  {name:'BDL (Bharat Dynamics Ltd)',type:'DPSU',loc:'Hyderabad (HQ), Vizag',rev:'₹4,700 Cr (FY24)',emp:'3,000+',cap:'Missiles: Akash, Astra, Konkurs; torpedoes; countermeasures',cust:'IAF, IA, IN, exports',cert:'DGAQA, ISO 9001'},
  {name:'MIDHANI (Mishra Dhatu Nigam)',type:'DPSU',loc:'Hyderabad',rev:'₹900 Cr',emp:'2,000+',cap:'Ti alloys, Ni superalloys, maraging steel, CFRP sheets, special metals',cust:'ISRO, DRDO, HAL, Navy',cert:'DGAQA, ISRO qual, NADCAP'},
  {name:'ISRO',type:'Govt / OEM',loc:'Bengaluru (DOS/HQ), 14 centres',rev:'N/A (Govt)',emp:'17,000+',cap:'PSLV, LVM3, NGLV, satellites, spacecraft, propulsion R&D, IN-SPACe',cust:'India Govt, commercial launches',cert:'ISRO standards, ITU'},
  {name:'DRDO (50+ labs)',type:'Govt R&D',loc:'Pan-India, DRDL Hyderabad',rev:'₹23,855 Cr (FY24 budget)',emp:'30,000+',cap:'LCA sub-systems, missiles (Astra/Akash/BrahMos), UAVs, armour, EW',cust:'IAF, IA, IN',cert:'Classified / DGAQA'},
  {name:'Tata Advanced Systems (TASL)',type:'Private OEM',loc:'Hyderabad',rev:'₹3,200 Cr',emp:'5,000+',cap:'C-295 aerostructures, UAVs, missile systems, electronics integration',cust:'HAL, IAF, Lockheed, Bell Helicopter',cert:'AS9100D, NADCAP'},
  {name:'L&T Defence',type:'Private OEM',loc:'Mumbai, Coimbatore, Talegaon',rev:'₹15,000+ Cr (group defence)',emp:'10,000+ (defence div)',cap:'Submarine systems, artillery, radar systems, aerospace structures, marine',cust:'IAF, IN, IA, export',cert:'AS9100D, ISO 9001'},
  {name:'Mahindra Defence Systems',type:'Private',loc:'Mumbai, Bengaluru',rev:'₹800 Cr',emp:'2,000+',cap:'Armoured vehicles, aerostructures, UAV systems, AeroGCS',cust:'IA, HAL, Boeing India',cert:'AS9100D'},
  {name:'Bharat Forge Ltd',type:'Private',loc:'Pune',rev:'₹14,000 Cr (group)',emp:'16,000+',cap:'Forgings: LG components, engine parts, gun barrels, rings, shafts',cust:'HAL, ISRO, Boeing, Safran, GE',cert:'NADCAP, AS9100D, IATF 16949'},
  {name:'Dynamatic Technologies',type:'Private',loc:'Bengaluru, Mysuru',rev:'₹1,800 Cr',emp:'4,000+',cap:'CH-47 ramp door assy, aerostructures, hydraulics, precision castings',cust:'Boeing, Airbus, HAL, Safran',cert:'AS9100D, NADCAP, FAA PMA'},
  {name:'Aequs Aerospace',type:'Private (SEZ)',loc:'Belgaum (Karnataka)',rev:'₹1,200 Cr',emp:'3,500+',cap:'Precision machining, complex aerostructures, composites, castings, SEZ eco',cust:'Airbus, GE Aerospace, Safran, Boeing, Honeywell',cert:'NADCAP, AS9100D'},
  {name:'Alpha Design Technologies',type:'Private',loc:'Bengaluru',rev:'₹600 Cr',emp:'1,500+',cap:'EW systems, loitering munitions (SkyStriker), radars, comms equipment',cust:'DRDO, IA, IAF, Elbit Systems (JV)',cert:'AS9100D'},
  {name:'ideaForge Technology',type:'Startup (NSE listed)',loc:'Mumbai',rev:'₹270 Cr',emp:'400+',cap:'SWITCH Mark 2 UAV, Q-series VTOL, GCS, surveillance drones',cust:'IA, CRPF, State Police, iDEX',cert:'DGCA, MIL-STD-810G'},
  {name:'Skyroot Aerospace',type:'NewSpace Startup',loc:'Hyderabad',rev:'Private (raised $68M+)',emp:'350+',cap:'Vikram SLV, Dhawan-1 cryogenic engine, carbon composite tanks',cust:'Commercial small sat customers',cert:'IN-SPACe authorised'},
  {name:'Agnikul Cosmos',type:'NewSpace Startup',loc:'Chennai (IIT-M incubated)',rev:'Private (raised $31M)',emp:'200+',cap:'Agnibaan SOrTeD, Agnilet (world's first 3D-printed semi-cryo engine)',cust:'Commercial',cert:'IN-SPACe authorised'},
  {name:'Centum Electronics',type:'Private EMS',loc:'Bengaluru',rev:'₹700 Cr',emp:'2,000+',cap:'RF/microwave modules, SATCOM equipment, PCB assemblies, avionics assy',cust:'ISRO, DRDO, BEL, Honeywell India',cert:'AS9100D, IPC-A-610E'},
  {name:'Paras Defence & Space Technologies',type:'Private (BSE listed)',loc:'Mumbai, Bengaluru',rev:'₹600 Cr',emp:'1,200+',cap:'EO/IR systems, space optics, heavy structures, defence electronics',cust:'DRDO, ISRO, Navy, DGQA',cert:'AS9100D, ISRO qual'},
];

const WBS_DATA = {
  'LCA Tejas Mk1A': {
    'Airframe & Structures': {icon:'ti-box', items:['Nose Section & Radar Bay','Cockpit Pressure Structure','Forward Fuselage (CFRP)','Centre Fuselage (CFRP/Al)','Aft Fuselage','Tailless Delta Wing (64° LE, CFRP)','LEX — Leading Edge Extension','Vertical Stabiliser (CFRP)','Rudder (CFRP)','Elevons × 4 (CFRP)','Air Brake','Titanium Carry-Through Frame','Canopy (Polycarbonate / Acrylic)']},
    'Propulsion': {icon:'ti-flame', items:['EJ200 Turbofan (Eurojet)','DSI — Diverterless Supersonic Intake','Variable Geometry Nozzle','FADEC Full Authority Digital Engine Control','Integral Fuel Tanks (CFRP bladder)','External Fuel Tanks (3× 800 L)','Bleed Air / Environmental Control Feed','Oil System & Monitoring']},
    'Landing Gear': {icon:'ti-circle-arrow-down', items:['Retractable Main Landing Gear (300M steel)','Nose Landing Gear (steerable)','Carbon–Carbon Brakes','Anti-skid Brake System','Emergency Hydraulic Extension','Gear Position & Warning System']},
    'Avionics Suite': {icon:'ti-cpu', items:['Uttam AESA Multi-Mode Radar (LRDE)','Mission Computer (MC) — PowerPC','FBW DFCC — Quad-redundant','INS/GPS Ring Laser Gyro','EW Suite — DARE (RWR/MAW/MAWS/Jammer)','Wide-Angle HUD (Elbit/HAL)','HMDS Helmet-Mounted Display System','Link 16 / MIDS-LVT Tactical Datalink','OBOGS On-Board Oxygen Gen System','Data Link & Voice Comms (VHF/UHF/V/SATCOM)','IFF Mode 4/5 (ATC+Mil)']},
    'Electrical Power': {icon:'ti-bolt', items:['2× AC Generators (28 kVA each)','APU Auxiliary Power Unit','Primary & Secondary Power Management','28 V DC / 115 V AC Bus Distribution','Emergency Battery / UPS','MIL-STD-1553B Main Data Bus','ARINC 429 Subsystem Bus','Wiring Harness (~8 km total)']},
    'Hydraulics & Actuation': {icon:'ti-settings-automation', items:['Dual Independent Hydraulic Systems (3,000 psi)','Electro-Hydraulic Actuators (EHA) for FCS','Nose Wheel Steering Actuator','Brake Metering Valve','Hydraulic Reservoir & Accumulator','Emergency Ram Air Turbine (RAT)']},
    'Armament': {icon:'ti-target', items:['BVR Missile Pylons × 6 (wingtip + underwing)','Centreline Pylon','23 mm GSh-23 Twin-barrel Gun','Astra Mk1/Mk2 BVR AAM','ASRAAM / Python-5 WVR AAM','BrahMos-NG (future)','Spice 2000 LGB / JDAM-ER','Pod: Litening III Targeting / SAGEM Recce']},
  },
  'AMCA': {
    'Stealth Airframe': {icon:'ti-ghost-2', items:['All-CFRP Multi-spar Fuselage','Compound Delta-Diamond Wing (35°/60° LE)','Internal Weapons Bay × 2 (8 m²)','S-bend Serpentine Air Intake (DSI)','Faceted, Low-RCS Shaping','Radar Absorbent Material (RAM) Coating','Sawtooth Panel Edges (all access panels)','Low-IR Signature Nozzle Design']},
    'Propulsion': {icon:'ti-flame', items:['2× Eurojet EJ200 (interim, Mk1)','2× GTRE-15 / Kaveri Mk2 (Mk2 target)','2D Thrust-Vectoring Nozzles (planned)','Internal Fuel Capacity ~8,000 kg','Conformal Fuel Tanks Option','Infrared-Suppressed Exhaust Nozzle']},
    'Sensor Fusion & Avionics': {icon:'ti-radar', items:['AESA Radar (LRDE — Uttam+)','IRST — Infra-Red Search & Track','DASS 2.0 Electronic Warfare Suite','High Off-Boresight Missile Cueing','JTIDS / MIDS Link 16','EO/IR Targeting Pod (internal bay)','Helmet-Mounted Cueing System (HMCS)','Sensor Data Fusion Architecture (AI-assisted)']},
    'Structural Materials': {icon:'ti-atom-2', items:['~75% CFRP by structural weight','Titanium 3D-Printed (DMLS) Brackets','RAM Panels — Ferrite / Carbon-loaded Coating','Transparent Canopy — Low-RCS ITO Coating','Glass-Ceramic Radome']},
  },
  'ALH Dhruv': {
    'Airframe': {icon:'ti-box', items:['Semi-monocoque Fuselage (CFRP/GFRP hybrid)','Composite Crew & Cabin Section','Tailboom (CFRP)','Stub Wings × 2 (weapons/ESS)','Skid Landing Gear (crashworthy)','Floatation System (Naval variant)','Sliding Cargo Door']},
    'Rotor System': {icon:'ti-windmill', items:['4-blade Bearingless Main Rotor (CFRP)','2-blade Teetering Tail Rotor (CFRP)','Elastomeric Rotor Hub','Swashplate & Scissors Link','Blade Fold Mechanism (Naval)','Vibration Absorber (SARIB)']},
    'Propulsion': {icon:'ti-flame', items:['2× Shakti Turboshaft (1,067 shp each)','Main Gearbox (MGB) — HAL design','Intermediate Gearbox','Tail Rotor Gearbox','Crash-resistant Fuel System (CRFS)','Engine Particle Separator / Filter']},
    'Avionics & Mission': {icon:'ti-radar', items:['Glass Cockpit — VEMD (Vehicle & Engine Mgmt)','4-Axis Autopilot / AFCS','Doppler/GPS Navigation (NVG compatible)','Radar Altimeter','EW Suite (RWR, MWS, Flare/Chaff)','Emergency Flotation System (Naval)','Hoist (400 kg, SAR variant)','Weapon Management System']},
  },
};

const IMPORT_DATA = [
  {platform:'LCA Tejas Mk1A',comp:'EJ200 Turbofan Engine',country:'Germany/UK/Spain/Italy',supplier:'Eurojet Turbo GmbH',gap:'Hot-section turbine blade AM, single-crystal casting',status:'20% indigenous parts; Kaveri in dev',path:'Kaveri Mk2 / GTRE-15',pct:20},
  {platform:'LCA Tejas Mk1A',comp:'Martin Baker Mk16 Ejection Seat',country:'UK',supplier:'Martin Baker Aircraft',gap:'Zero-zero seat pyrotechnics, certification',status:'0% indigenous',path:'DRDO lightweight ejection seat (research)',pct:0},
  {platform:'LCA Tejas Mk1A',comp:'Main Landing Gear (Safran)',country:'France',supplier:'Safran Landing Systems',gap:'300M steel forging, fatigue/life testing',status:'5% indigenous (HAL machining only)',path:'Bharat Forge + HAL partnership',pct:5},
  {platform:'Su-30MKI',comp:'AL-31FP Turbofan Engine',country:'Russia',supplier:'Saturn / UAC',gap:'Complete turbofan core design capability',status:'HAL licence assembly ~50%',path:'Import risk post-2022; accelerating Kaveri',pct:50},
  {platform:'ALH Dhruv',comp:'Shakti Engine (TM333 licence)',country:'France (licence)',supplier:'Safran Helicopter Engines',gap:'Hot section IP, FADEC source code',status:'70% indigenous (HAL licence mfr)',path:'HTSE-1200 (HAL indigenous dev)',pct:70},
  {platform:'All Aircraft',comp:'MIL-STD-1553B Bus Controllers',country:'USA',supplier:'DDC / Abaco Systems',gap:'MIL-spec ASIC/IC design',status:'BEL developing alternate chipset',path:'BEL 1553B chipset (prototype stage)',pct:15},
  {platform:'PSLV / LVM3',comp:'CE-20 Cryogenic Engine',country:'Fully India now',supplier:'ISRO LPSC (indigenous)',gap:'Cryogenic turbopump — was imported; now solved',status:'100% indigenous (2017 onwards)',path:'Achieved — model for Make in India',pct:100},
  {platform:'BrahMos',comp:'NPO Saturn Sustainer Engine',country:'Russia',supplier:'NPO Saturn (Russia)',gap:'Ramjet integration IP, turbofan hot section',status:'~60% indigenous; NG targets full India engine',path:'DR-12 Indian ramjet engine under dev',pct:60},
  {platform:'All IAF',comp:'Airborne EW/Jammer Pods',country:'Israel / USA',supplier:'Elbit, Raytheon',gap:'High-power wideband jamming MMIC',status:'10–20% indigenous (DARE)',path:'iDEX / DARE advanced EW programme',pct:15},
  {platform:'UAV (TAPAS/Rustom)',comp:'Heavy Fuel Engine (HFE)',country:'USA / Europe',supplier:'Williams, Austro Engine',gap:'Military-grade diesel/kerosene UAV engine',status:'0% indigenous for MALE class HFE',path:'HAL/GTRE HFE development programme',pct:0},
];

const QUICK_CHIPS = [
  'List all Indian fighter aircraft with status',
  'What engines power the LCA Tejas Mk1A?',
  'Compare AMCA vs Rafale specifications',
  'DRDO UAVs currently operational',
  'WBS breakdown for ALH Dhruv helicopter',
  'Composites used in Indian aerospace',
  'ISRO launch vehicles and payload capacity',
  'India defence import dependency by platform',
  'Akash missile vs S-400 comparison',
  'Skyroot vs Agnikul comparison',
];
