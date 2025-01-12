const MembershipExpectations = () => {
  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">What we expect</h2>
      <ul className="list-disc marker:text-dashboard-accent1 space-y-4 pl-5">
        <li className="pl-2">
          <span className="block leading-relaxed">All members have been given membership numbers. Please contact your collector to find this out.</span>
        </li>
        <li className="pl-2">
          <span className="block leading-relaxed">Please login individually and fill in required data.</span>
        </li>
        <li className="pl-2">
          <span className="block leading-relaxed">We expect timely payments that are up to date.</span>
        </li>
        <li className="pl-2">
          <span className="block leading-relaxed">Collectors who are timely and up to date, thank you, and please continue with your efforts.</span>
        </li>
        <li className="pl-2">
          <span className="block leading-relaxed">Those not up to date, please find out your membership number from your collector, then please login online and make payment as soon as possible.</span>
        </li>
        <li className="pl-2">
          <span className="block leading-relaxed">If payments are not up to date then you will not be covered.</span>
        </li>
      </ul>
    </div>
  );
};

export default MembershipExpectations;