import { apiClient } from "../clientApi";
import { AxiosResponse } from "axios";

export interface PaymentMethods {
  data: BusCard[];
  balance: number;
  price?: number;
}

export interface BusCard {
  id: number;
  type: string;
  card_number: string;
  main: boolean;
}

export interface PaymentPreview {
  cost: number;
  currency: string;
  days_left: number;
  total_cost: number;
}

export const getAllCards = async (course_id?: string | number) => {
  const { data } = await apiClient.get<PaymentMethods, AxiosResponse<PaymentMethods>>(
    `/payments/payment-methods?course_id=${course_id}`
  );

  return data as PaymentMethods;
};
