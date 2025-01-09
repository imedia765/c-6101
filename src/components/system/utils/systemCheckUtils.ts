export const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'critical':
      return 'XCircle';
    case 'warning':
      return 'AlertTriangle';
    case 'success':
      return 'CheckCircle2';
    default:
      return 'Info';
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'critical':
      return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'warning':
      return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'success':
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    default:
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  }
};