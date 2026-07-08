import { API_ENDPOINTS } from '../endpoints';
import { apiClient } from '../client';
import type { BillingPlan, BillingSubscriptionResponse } from '@/types/api';

export const billingApi = {
  listPlans: () => apiClient.get<BillingPlan[]>(API_ENDPOINTS.billing.plans, { skipAuth: true }),
  getSubscription: () => apiClient.get<BillingSubscriptionResponse>(API_ENDPOINTS.billing.subscription),
  listInvoices: <TInvoice = Record<string, unknown>>() => apiClient.get<TInvoice[]>(API_ENDPOINTS.billing.invoices),
  listPaymentMethods: <TPaymentMethod = Record<string, unknown>>() => apiClient.get<TPaymentMethod[]>(API_ENDPOINTS.billing.paymentMethods),
};
