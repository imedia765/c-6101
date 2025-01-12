import { Member } from "@/types/member";

export const formatMemberData = (members: Member[]) => {
  // Get all possible keys from members
  const allKeys = Array.from(
    new Set(members.flatMap(member => Object.keys(member)))
  );

  // Format each member's data, excluding empty/null values
  const formattedMembers = members.map(member => {
    const formattedMember: Record<string, string> = {};
    
    allKeys.forEach(key => {
      const value = member[key as keyof Member];
      if (value !== null && value !== undefined && value !== '') {
        formattedMember[key] = typeof value === 'object' 
          ? JSON.stringify(value) 
          : String(value);
      }
    });
    
    return formattedMember;
  });

  return {
    headers: allKeys,
    rows: formattedMembers
  };
};

export const generateCSVContent = (members: Member[]) => {
  const { headers, rows } = formatMemberData(members);
  const csvRows = rows.map(row => 
    headers.map(header => row[header] || '').join(',')
  );
  
  return [headers.join(','), ...csvRows].join('\n');
};

export const generateTSVContent = (members: Member[]) => {
  const { headers, rows } = formatMemberData(members);
  const tsvRows = rows.map(row => 
    headers.map(header => row[header] || '').join('\t')
  );
  
  return [headers.join('\t'), ...tsvRows].join('\n');
};

export const downloadExcel = (members: Member[], collectorName?: string) => {
  const content = generateTSVContent(members);
  const blob = new Blob([content], { type: 'text/tab-separated-values' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `members_${collectorName || 'all'}_${new Date().toISOString().split('T')[0]}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const downloadCSV = (members: Member[], collectorName?: string) => {
  const content = generateCSVContent(members);
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `members_${collectorName || 'all'}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};