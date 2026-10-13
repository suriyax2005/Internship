export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatRole = (role) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'LANDLORD':
      return 'Landlord';
    case 'TENANT':
      return 'Tenant';
    default:
      return role || 'User';
  }
};
