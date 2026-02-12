
export type ScreenName = 'HOME' | 'EXPLORE' | 'MANAGEMENT' | 'PROFILE' | 'HISTORY' | 'SETTINGS' | 'LOGIN' | 'BILLS' | 'CONTRACTS' | 'BILL_DETAILS' | 'CONTRACT_DETAILS' | 'TENANT_HOME' | 'CITY_SELECTION' | 'FAVORITES';

export interface Property {
  id: string;
  city: string; // New Field: City Context
  title: string;
  location: string;
  subway: string;
  price: number;
  paymentType: string;
  image: string;
  video?: string;
  matchScore: number;
  tags: string[];
  direction: string;
  floor: string;
  specs: {
    beds: number;
    baths: number;
    area: number;
  };
  features: {
    sunlight: number;
    noise: number;
    commute: number;
  };
  facilities: string[];
}

export type SignStep = 'CONTRACT' | 'FACE_ID' | 'SIGNATURE' | 'SUCCESS' | 'PAYMENT';

// Generative UI Types
export type MessageType = 'TEXT' | 'PROPERTY_CARDS' | 'BILL_CARD' | 'CONTRACT_CARD' | 'LOADING';

export interface Message {
  id: string;
  type: MessageType;
  text?: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  data?: any; // Flexible payload for widgets
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  date: string;
  tags: string[];
  messages?: Message[]; // Added to store session history
}

// Sub-types for Management
export interface BillDetails {
  rent: string;
  deposit?: string; // Added deposit
  total: string;
}

export interface BillItem {
  id: string;
  month: string;
  title: string;
  date: string;
  amount: string;
  status: 'PAID' | 'PENDING';
  contractTitle: string;
  billingCycle: string;
  details: BillDetails;
}

export interface ContractItem {
  id: string;
  title: string;
  propertyTitle: string;
  propertyAddress: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  startDate: string;
  endDate: string;
  rentAmount: string;
  deposit: string;
  depositStatus: 'HOSTED' | 'REFUNDING' | 'REFUNDED';
  signDate: string;
  landlord: string;
  tenant: string;
  timeline: { date: string; event: string; icon: string }[];
  // New fields
  paymentTerms: string; // e.g. 押一付三
  paymentDay: number; // e.g. 15 (15th of month)
  lateFeePolicy: string; // e.g. 0.1% per day
}

// AI Personalization Types
export interface UserPreferences {
  workLocation: string;
  budgetRange: [number, number];
  lifestyleTags: string[];
  commuteMethod: 'SUBWAY' | 'TAXI' | 'WALK';
  dimensions: {
    priceSensitivity: number; // 0-100
    commuteImportance: number;
    comfortRequirement: number;
    amenityPreference: number;
    socialVibe: number;
  };
}
