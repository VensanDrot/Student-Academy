export const transactionType = (t: (key: string) => string, type: string) => {
  switch (true) {
    case type === "admin_balance_refill": {
      return t("admin_clients.admin_refil");
    }
    case type.includes("refil"): {
      return t("admin_clients.balance_refil");
    }
    case type.includes("subsc"): {
      return t("admin_clients.payment_course");
    }
    default: {
      return t("admin_clients.payment_for");
    }
  }
};
