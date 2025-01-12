const CommitteeUpdate = () => {
  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">What we've been doing</h2>
      <p className="text-dashboard-text mb-6 leading-relaxed pl-2">
        Brother Sajid has resigned and a new Committee was formally created. We would like to thank brother Sajid for his previous efforts, and he will continue helping the Committee where possible in an informal capacity.
      </p>

      <h3 className="text-xl font-bold text-white mb-4">New Committee as of December 2023</h3>
      <ul className="list-disc marker:text-dashboard-accent1 space-y-4 pl-5">
        <li className="pl-2">
          <span className="block leading-relaxed">Chairperson: Anjum Riaz & Habib Mushtaq</span>
        </li>
        <li className="pl-2">
          <span className="block leading-relaxed">Secretary: Tariq Majid</span>
        </li>
        <li className="pl-2">
          <span className="block leading-relaxed">Treasurer: Faizan Qadiri</span>
        </li>
      </ul>
    </div>
  );
};

export default CommitteeUpdate;