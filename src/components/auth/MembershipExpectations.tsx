const MembershipExpectations = () => {
  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">What we expect</h2>
      <ul className="list-disc list-inside text-dashboard-text space-y-3">
        <li>All members have been given membership numbers. Please contact your collector to find this out.</li>
        <li>Please login individually and fill in required data.</li>
        <li>We expect timely payments that are up to date.</li>
        <li>Collectors who are timely and up to date, thank you, and please continue with your efforts.</li>
        <li>Those not up to date, please find out your membership number from your collector, then please login online and make payment as soon as possible.</li>
        <li>If payments are not up to date then you will not be covered.</li>
      </ul>
    </div>
  );
};

export default MembershipExpectations;