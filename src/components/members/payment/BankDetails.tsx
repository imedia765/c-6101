const BankDetails = () => {
  return (
    <div className="p-6 bg-dashboard-dark/80 rounded-lg border-2 border-dashboard-accent2/30 shadow-lg">
      <h3 className="text-dashboard-accent2 font-semibold text-lg mb-4">Bank Details</h3>
      <div className="space-y-3">
        <p className="text-white font-medium">HSBC Pakistan Welfare Association</p>
        <p className="text-dashboard-accent1">Burton In Trent</p>
        <div className="mt-4 space-y-2">
          <p className="text-dashboard-text flex items-center">
            <span className="text-dashboard-accent2 font-medium w-24">Sort Code:</span>
            <span className="text-white">40-15-31</span>
          </p>
          <p className="text-dashboard-text flex items-center">
            <span className="text-dashboard-accent2 font-medium w-24">Account:</span>
            <span className="text-white">41024892</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;