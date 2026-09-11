import { LifeBridgeProcessedResult } from './types';

export const JUDGE_DEMO_SCENARIO: LifeBridgeProcessedResult = {
  rawInput:
    'My mother has an appointment in Whitefield. I am currently in Electronic City. Heavy rain and severe traffic may cause delays. Help me plan a safe and timely journey.',
  intent: 'urgent travel planning',
  summary: 'Reach the appointment safely and on time.',
  importantFacts: [
    'Origin: Electronic City, Bengaluru',
    'Destination: Whitefield Medical Clinic',
    'Hard Deadline: 5:30 PM (Doctor Appointment)',
    'Passenger: Mother (comfort and safety priority)',
    'Weather Constraint: Heavy rain (waterlogging hazard)',
    'Traffic Constraint: Severe arterial congestion (+42m delay)',
  ],
  actions_required: [
    'check weather',
    'check traffic',
    'verify departure location',
    'calculate safe route',
    'calculate buffered departure time',
  ],
  structured: {
    origin: 'Electronic City',
    destination: 'Whitefield',
    deadline: '5:30 PM',
    weather: 'Heavy rain (34 mm/hr)',
    traffic: 'Severe congestion (+42 min delay)',
    passenger: 'Mother',
    priority: 'high',
    contextSubject: 'Medical appointment transit with elderly parent under storm conditions',
    customFields: [
      { label: 'Primary Goal', value: 'Reach the appointment safely and on time' },
      { label: 'Weather Impact', value: 'Heavy Rain • Reduced Road Grip' },
      { label: 'Traffic Impact', value: 'Severe Gridlock • +42m Estimated Delay' },
      { label: 'Passenger Care', value: 'Sheltered Porch Drop-off • Smooth Transit' },
    ],
  },
  verifications: [
    {
      id: 'v-weather',
      service: 'Doppler Radar & Storm Telemetry',
      status: 'verified',
      result: 'Heavy rain confirmed (34mm/hr precipitation active across Bellandur/Varthur corridor)',
      sourceLabel: 'Simulated Weather Telemetry Feed',
      isMock: true,
      metricBadge: '34 mm/h Downpour',
    },
    {
      id: 'v-traffic',
      service: 'Road Congestion & Sensor Telemetry',
      status: 'verified',
      result: 'Severe traffic gridlock detected: +42 min delay via Silk Board, 11 km/h average velocity',
      sourceLabel: 'Simulated Urban Traffic Congestion API',
      isMock: true,
      metricBadge: '+42m Delay',
    },
    {
      id: 'v-route',
      service: 'Multi-Modal Route Optimization Engine',
      status: 'verified',
      result: 'Route calculated: NICE Road link to Varthur bypass avoids flood-prone Marathahalli underpass (ETA: 72 mins)',
      sourceLabel: 'Simulated Navigational Routing Service',
      isMock: true,
      metricBadge: '72m Transit Window',
    },
  ],
  act: {
    priorityBadge: 'HIGH PRIORITY',
    priorityLevel: 'high',
    recommendedExecution: 'Recommended departure: 4:00 PM',
    reasonSummary: 'Heavy rain + severe traffic + safety buffer.',
    actionsList: [
      'Leave by 4:00 PM to guarantee arrival before the appointment deadline',
      'Use the Elevated Electronic City Tollway & Varthur road bypass',
      'Avoid low-lying Marathahalli underpass prone to storm waterlogging',
      'Target sheltered patient drop-off canopy at Whitefield clinic',
    ],
    tacticalDetails: {
      primaryRoute: 'Electronic City Phase 1 → Elevated Tollway → Varthur Main Road Bypass',
      durationEst: '72 minutes drive + 18 min safety buffer',
      distance: '31.4 km',
      safetyBufferMinutes: 18,
      avoidNotes: 'Avoid Marathahalli underpass due to heavy waterlogging telemetry alert',
    },
    safetyNotice:
      'Safety Notice: Advisory guidance only based on observable telemetry and user inputs. Not an absolute guarantee of road safety.',
    whyThisRecommendation: [
      {
        inputFactor: 'Appointment Deadline',
        verifiedEvidence: 'Appointment deadline identified (5:30 PM)',
        impactOnPlan: 'Creates a fixed arrival deadline requiring backwards schedule calibration to 4:00 PM',
      },
      {
        inputFactor: 'Traffic Conditions',
        verifiedEvidence: 'Severe traffic (+42 min delay via Silk Board corridor)',
        impactOnPlan: 'Increases estimated travel time and reroutes via Elevated Tollway',
      },
      {
        inputFactor: 'Weather Conditions',
        verifiedEvidence: 'Heavy rain (34 mm/hr precipitation)',
        impactOnPlan: 'Adds an 18-minute weather buffer and avoids flood-prone underpasses',
      },
      {
        inputFactor: 'Passenger Context',
        verifiedEvidence: 'Mother is traveling (mobility and safety consideration)',
        impactOnPlan: 'Prioritizes sheltered hospital porch drop-off and smooth road dynamics',
      },
    ],
  },
};

export const MAIN_TRAVEL_DEMO_RESULT: LifeBridgeProcessedResult = {
  rawInput:
    "I'm driving from Electronic City to Whitefield. It's raining heavily, traffic looks terrible, and my mother has a doctor's appointment at 5:30 PM. What should I do?",
  intent: 'urgent travel planning',
  summary:
    'Time-sensitive inter-city transit requiring immediate departure to safeguard an essential medical consultation under adverse weather conditions.',
  importantFacts: [
    'Origin: Electronic City, Bengaluru',
    'Destination: Whitefield Medical Clinic',
    'Hard Deadline: 5:30 PM (Doctor Appointment)',
    'Passenger: Elderly Mother (Mobility Consideration)',
    'Current Environmental Hazards: Severe Downpour & Waterlogging',
    'Current Corridor Status: Extreme Rush-Hour Congestion',
  ],
  actions_required: [
    'check weather',
    'check traffic',
    'calculate route',
    'calculate departure time',
  ],
  structured: {
    origin: 'Electronic City',
    destination: 'Whitefield',
    deadline: '5:30 PM',
    weather: 'heavy rain',
    traffic: 'severe',
    passenger: 'mother',
    priority: 'high',
    contextSubject: 'Medical Consultation Transit',
    customFields: [
      { label: 'Vehicle Mode', value: 'Private Automobile' },
      { label: 'Calculated Buffer', value: '+18 mins (Rain & Waterlogging)' },
    ],
  },
  verifications: [
    {
      id: 'v-weather',
      service: 'Doppler Radar & Storm Telemetry',
      status: 'verified',
      result: 'Heavy rain confirmed (34mm/hr precipitation active across Bellandur/Varthur corridor)',
      sourceLabel: 'Simulated Weather Telemetry Feed',
      isMock: true,
      metricBadge: '34 mm/h Downpour',
    },
    {
      id: 'v-traffic',
      service: 'Road Congestion & Sensor Telemetry',
      status: 'verified',
      result: 'Severe traffic gridlock detected: +42 min delay via Silk Board, 11 km/h average velocity',
      sourceLabel: 'Simulated Urban Traffic Congestion API',
      isMock: true,
      metricBadge: '+42m Delay',
    },
    {
      id: 'v-route',
      service: 'Multi-Modal Route Optimization Engine',
      status: 'verified',
      result: 'Route calculated: NICE Road link to Varthur bypass avoids flood-prone Marathahalli underpass (ETA: 72 mins)',
      sourceLabel: 'Simulated Navigational Routing Service',
      isMock: true,
      metricBadge: '72m Transit Window',
    },
  ],
  act: {
    priorityBadge: 'HIGH PRIORITY',
    priorityLevel: 'high',
    recommendedExecution: 'Recommended departure: 4:00 PM',
    reasonSummary: 'Heavy rain + severe traffic + safety buffer.',
    actionsList: [
      'Leave by 4:00 PM',
      'Use the recommended route (Elevated Tollway via Varthur bypass)',
      'Allow extra time because of rain',
    ],
    tacticalDetails: {
      primaryRoute: 'Electronic City Phase 1 → Varthur Main Road Bypass',
      durationEst: '72 minutes drive + 18 min safety buffer',
      distance: '31.4 km',
      safetyBufferMinutes: 18,
      avoidNotes: 'Avoid Marathahalli Underpass (water accumulation reported)',
    },
    whyThisRecommendation: [
      {
        inputFactor: 'Appointment Hard Deadline: 5:30 PM',
        verifiedEvidence: 'Doctor intake protocol requires check-in 10 minutes prior (5:20 PM target arrival).',
        impactOnPlan: 'Fixes the absolute arrival milestone at 5:20 PM.',
      },
      {
        inputFactor: 'Severe Traffic Telemetry (+42m)',
        verifiedEvidence: 'Average corridor travel time is currently inflated from 38m to 72m due to Friday rush.',
        impactOnPlan: 'Expands baseline drive time to 72 minutes.',
      },
      {
        inputFactor: 'Adverse Weather & Vulnerable Passenger',
        verifiedEvidence: 'Heavy rain increases braking distance and slows boarding for passenger (mother).',
        impactOnPlan: 'Adds a non-negotiable 18-minute weather & parking buffer, requiring 4:00 PM prompt wheels-up.',
      },
    ],
  },
};

export const EMERGENCY_DEMO_RESULT: LifeBridgeProcessedResult = {
  rawInput:
    'My 68-year-old father suddenly feels sharp chest pressure and numbness in his left arm while we are stuck in an apartment elevator that stopped between floors.',
  intent: 'medical & physical entrapment emergency',
  summary:
    'Potential cardiovascular emergency concurrent with mechanical entrapment. Demands immediate dispatch coordination and first-responder escalation.',
  importantFacts: [
    'Patient: 68-year-old male',
    'Symptoms: Sharp chest pressure, radiating numbness in left arm',
    'Physical Hazard: Entrapped inside stopped elevator between building floors',
    'Risk Level: Immediate Life-Safety Critical',
  ],
  actions_required: [
    'alert emergency medical services',
    'notify building facilities / fire rescue',
    'provide immediate patient stabilization posture',
  ],
  structured: {
    origin: 'Apartment Elevator (Between Floors)',
    destination: 'Emergency Cardiac Care Facility',
    deadline: 'Immediate Dispatch (< 5 mins)',
    weather: 'N/A (Indoor Elevator)',
    traffic: 'Emergency Sirens Routing Required',
    passenger: 'Father (68 yo, acute symptoms)',
    priority: 'critical',
    contextSubject: 'Cardiovascular & Entrapment Emergency',
    customFields: [
      { label: 'Patient Age', value: '68 Years' },
      { label: 'Current State', value: 'Conscious, experiencing acute discomfort' },
    ],
  },
  verifications: [
    {
      id: 'v-ems',
      service: 'Emergency Dispatch Coordination',
      status: 'verified',
      result: 'Local Paramedic & Fire Engine Dispatch coordinates mapped to GPS building coordinates',
      sourceLabel: 'Simulated 911/112 CAD Integration',
      isMock: true,
      metricBadge: 'Nearest EMS: 4 mins away',
    },
    {
      id: 'v-building',
      service: 'Building Elevator Override Protocol',
      status: 'verified',
      result: 'Manual emergency brake release procedure flagged for facility engineer on-site',
      sourceLabel: 'Simulated Building Management System',
      isMock: true,
      metricBadge: 'Security Alert Sent',
    },
  ],
  act: {
    priorityBadge: 'CRITICAL EMERGENCY',
    priorityLevel: 'critical',
    recommendedExecution: 'Immediate Action: Call 112 / 911 & Press Yellow Bell',
    reasonSummary: 'Potential acute cardiac event + mechanical elevator entrapment.',
    actionsList: [
      'Call Emergency Dispatch (112/911) immediately — request Advanced Life Support (ALS) & Fire Rescue.',
      'Press and hold the yellow Elevator Alarm Bell to signal building security.',
      'Seat father upright on elevator floor with back against wall to minimize cardiac strain.',
      'Loosen any tight clothing around collar or chest; keep ventilation airflow open.',
    ],
    safetyNotice:
      'SAFETY NOTICE: Potential emergency situation. Seek professional medical assistance immediately. Do not attempt to force elevator doors or climb out through ceiling panels.',
    whyThisRecommendation: [
      {
        inputFactor: 'Symptom Cluster (Chest Pressure + Arm Numbness)',
        verifiedEvidence: 'Clinical triage standards classify this as a potential acute coronary syndrome.',
        impactOnPlan: 'Prioritizes paramedic dispatch above all secondary logistical actions.',
      },
      {
        inputFactor: 'Elevator Entrapment',
        verifiedEvidence: 'Fire department elevator extraction keys are mandatory for safe egress.',
        impactOnPlan: 'Triggers simultaneous alert to building engineer and local fire department.',
      },
    ],
  },
};

export const DOCUMENT_PHOTO_DEMO_RESULT: LifeBridgeProcessedResult = {
  rawInput:
    'Urgent Hospital Admission Slip: Pre-authorization required within 24 hours for scheduled surgery, otherwise insurance denies coverage and procedure cancels.',
  intent: 'critical clinical pre-authorization execution',
  summary:
    'Time-sensitive medical administration form requiring digital submission to third-party payor before authorization cut-off.',
  importantFacts: [
    'Document Type: Surgical Pre-Authorization Request',
    'Deadline: 24 Hours from Admission Intake',
    'Primary Risk: Denial of coverage & cancellation of surgical suite',
    'Action Subject: Patient & Hospital Billing Coordination',
  ],
  actions_required: [
    'extract ICD-10 and CPT procedure codes',
    'verify insurer portal submission API',
    'generate urgent submission packet',
  ],
  structured: {
    origin: 'Patient Portal Intake',
    destination: 'Payer Pre-Authorization Clearinghouse',
    deadline: 'Tomorrow, 11:00 AM (24h limit)',
    weather: 'Normal Conditions',
    traffic: 'Electronic Transmission',
    priority: 'high',
    contextSubject: 'Health Insurance Pre-Authorization',
    customFields: [
      { label: 'Procedure Code', value: 'CPT-47562 (Laparoscopic)' },
      { label: 'Authorization Window', value: '18 hours remaining' },
    ],
  },
  verifications: [
    {
      id: 'v-codes',
      service: 'Clinical Document OCR & Code Verification',
      status: 'verified',
      result: 'Extracted CPT-47562 matches hospital clinical encounter summary and primary surgeon NPI',
      sourceLabel: 'Simulated Medical Record OCR Verification',
      isMock: true,
      metricBadge: 'Valid CPT Code',
    },
    {
      id: 'v-payer',
      service: 'Payer Portal Clearance Gateway',
      status: 'verified',
      result: 'Electronic prior authorization (ePA) endpoint online with 4-hour expedited turnaround for surgical cases',
      sourceLabel: 'Simulated Insurance Gateway Telemetry',
      isMock: true,
      metricBadge: 'ePA Endpoint Active',
    },
  ],
  act: {
    priorityBadge: 'HIGH PRIORITY',
    priorityLevel: 'high',
    recommendedExecution: 'Submit Electronic Prior Authorization Packet by 2:00 PM',
    reasonSummary: '24-hour insurer cut-off rule + surgeon schedule lock.',
    actionsList: [
      'Submit Form ePA-702 to insurance clearinghouse with attached surgeon encounter notes',
      'Call hospital financial counselor to confirm receipt and secure verification code',
      'Retain timestamped digital confirmation receipt to prevent retroactive claim clawback',
    ],
    whyThisRecommendation: [
      {
        inputFactor: '24-Hour Strict Underwriting Deadline',
        verifiedEvidence: 'Insurance policy Section 8.3 explicitly disallows retrospective authorization.',
        impactOnPlan: 'Requires packet submission today before 2:00 PM to ensure same-day review.',
      },
      {
        inputFactor: 'Verified Electronic Clearinghouse Gateway',
        verifiedEvidence: 'Clearinghouse is active and accepts direct API transmission.',
        impactOnPlan: 'Avoids multi-day fax delays and provides instant reference tracking ID.',
      },
    ],
  },
};
