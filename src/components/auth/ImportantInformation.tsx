const ImportantInformation = () => {
  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Important Information</h2>
      <div className="text-dashboard-text space-y-4">
        <p>Trialled so far online payment using Stripe - not enough uptake, sidelined for possible future use.</p>
        <p className="font-bold text-dashboard-warning">Check with your collector if payments up to date, if not up to date YOU ARE NOT COVERED! The responsibility to pay is on the member, not the Collector.</p>
        <p>Unfortunately we are not taking on new members. So if Collectors are in arrears, they will be given deadlines to clear arrears.</p>
      </div>
    </div>
  );
};

export default ImportantInformation;