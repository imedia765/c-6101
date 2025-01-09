const CommitteeUpdate = () => {
  return (
    <div className="bg-dashboard-card rounded-lg shadow-lg p-8 mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">What we've been doing</h2>
      <p className="text-dashboard-text mb-6">
        Brother Sajid has resigned and a new Committee was formally created. We would like to thank brother Sajid for his previous efforts, and he will continue helping the Committee where possible in an informal capacity.
      </p>

      <h3 className="text-xl font-bold text-white mb-4">New Committee as of December 2023</h3>
      <ul className="list-disc list-inside text-dashboard-text space-y-2 mb-6">
        <li>Chairperson: Anjum Riaz & Habib Mushtaq</li>
        <li>Secretary: Tariq Majid</li>
        <li>Treasurer: Faizan Qadiri</li>
      </ul>
    </div>
  );
};

export default CommitteeUpdate;