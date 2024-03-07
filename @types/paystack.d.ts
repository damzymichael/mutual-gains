interface LogHistory {
  type: string;
  message: string;
  time: number;
}

interface Log {
  start_time: number;
  time_spent: number;
  attempts: number;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: any[];
  history: LogHistory[];
}

interface FeesSplitParams {
  bearer: string;
  transaction_charge: string;
  percentage_charge: string;
}

interface FeesSplit {
  paystack: number;
  integration: number;
  subaccount: number;
  params: FeesSplitParams;
}

interface Authorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: null; // Assuming it's always null based on the provided data
}

interface Customer {
  id: number;
  first_name: null; // Assuming it's always null based on the provided data
  last_name: null; // Assuming it's always null based on the provided data
  email: string;
  customer_code: string;
  phone: null; // Assuming it's always null based on the provided data
  metadata: null; // Assuming it's always null based on the provided data
  risk_action: string;
}

interface Subaccount {
  id: number;
  subaccount_code: string;
  business_name: string;
  description: string;
  primary_contact_name: null; // Assuming it's always null based on the provided data
  primary_contact_email: null; // Assuming it's always null based on the provided data
  primary_contact_phone: null; // Assuming it's always null based on the provided data
  metadata: null; // Assuming it's always null based on the provided data
  percentage_charge: number;
  settlement_bank: string;
  account_number: string;
}

interface Data {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: null; // Assuming it's always null based on the provided data
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: string; // Assuming it's always a string based on the provided data
  log: Log;
  fees: number;
  fees_split: FeesSplit;
  authorization: Authorization;
  customer: Customer;
  plan: null; // Assuming it's always null based on the provided data
  order_id: null; // Assuming it's always null based on the provided data
  paidAt: string; // Assuming it's always same as 'paid_at' based on the provided data
  createdAt: string; // Assuming it's always same as 'created_at' based on the provided data
  requested_amount: number; // Assuming it's always same as 'amount' based on the provided data
  transaction_date: string; // Assuming it's always same as 'created_at' based on the provided data
  plan_object: object; // Assuming it's always an empty object based on the provided data
  subaccount: Subaccount;
}

export interface VerificationResponse {
  status: boolean;
  message: string;
  data: Data;
}
