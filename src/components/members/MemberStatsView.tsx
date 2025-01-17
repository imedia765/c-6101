import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MetricCard from '../MetricCard';
import { Card } from '../ui/card';

const MemberStatsView = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['memberStats'],
    queryFn: async () => {
      // Get all members
      const { data: members } = await supabase
        .from('members')
        .select('id, gender, date_of_birth');

      // Get all family members
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select('id, gender, date_of_birth');

      const allMembers = members || [];
      const allFamilyMembers = familyMembers || [];
      
      // Calculate age groups
      const calculateAge = (dob: string) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      const getAgeGroup = (age: number) => {
        if (age < 18) return '0-17';
        if (age < 30) return '18-29';
        if (age < 50) return '30-49';
        if (age < 70) return '50-69';
        return '70+';
      };

      // Process members
      const memberStats = {
        total: allMembers.length,
        men: allMembers.filter(m => m.gender === 'male').length,
        women: allMembers.filter(m => m.gender === 'female').length,
        ageGroups: {} as Record<string, number>
      };

      // Process family members
      const familyStats = {
        total: allFamilyMembers.length,
        men: allFamilyMembers.filter(m => m.gender === 'male').length,
        women: allFamilyMembers.filter(m => m.gender === 'female').length,
        ageGroups: {} as Record<string, number>
      };

      // Calculate age groups for members
      allMembers.forEach(member => {
        if (member.date_of_birth) {
          const age = calculateAge(member.date_of_birth);
          const group = getAgeGroup(age);
          memberStats.ageGroups[group] = (memberStats.ageGroups[group] || 0) + 1;
        }
      });

      // Calculate age groups for family members
      allFamilyMembers.forEach(member => {
        if (member.date_of_birth) {
          const age = calculateAge(member.date_of_birth);
          const group = getAgeGroup(age);
          familyStats.ageGroups[group] = (familyStats.ageGroups[group] || 0) + 1;
        }
      });

      return {
        members: memberStats,
        family: familyStats,
        total: memberStats.total + familyStats.total,
        totalMen: memberStats.men + familyStats.men,
        totalWomen: memberStats.women + familyStats.women,
      };
    }
  });

  if (isLoading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white mb-6">Member Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Members"
          value={stats?.total || 0}
          color="#22c55e"
          details={`£${(stats?.total || 0) * 40} total yearly contributions`}
        />
        <MetricCard
          title="Direct Members"
          value={stats?.members.total || 0}
          color="#3b82f6"
          details={`£${(stats?.members.total || 0) * 40} yearly contributions`}
        />
        <MetricCard
          title="Family Members"
          value={stats?.family.total || 0}
          color="#8b5cf6"
          details={`£${(stats?.family.total || 0) * 40} yearly contributions`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 bg-dashboard-card/50 border-dashboard-cardBorder">
          <h3 className="text-lg font-medium text-white mb-4">Gender Distribution</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-blue-400 text-sm">Men</p>
              <p className="text-2xl font-bold text-blue-500">{stats?.totalMen || 0}</p>
              <p className="text-sm text-blue-400/80">£{(stats?.totalMen || 0) * 40} yearly</p>
            </div>
            <div className="text-center p-4 bg-pink-500/10 rounded-lg">
              <p className="text-pink-400 text-sm">Women</p>
              <p className="text-2xl font-bold text-pink-500">{stats?.totalWomen || 0}</p>
              <p className="text-sm text-pink-400/80">£{(stats?.totalWomen || 0) * 40} yearly</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-dashboard-card/50 border-dashboard-cardBorder">
          <h3 className="text-lg font-medium text-white mb-4">Age Distribution</h3>
          <div className="grid grid-cols-5 gap-2">
            {['0-17', '18-29', '30-49', '50-69', '70+'].map(group => {
              const count = ((stats?.members.ageGroups[group] || 0) + (stats?.family.ageGroups[group] || 0));
              return (
                <div key={group} className="text-center p-2 bg-purple-500/10 rounded-lg">
                  <p className="text-purple-400 text-xs">{group}</p>
                  <p className="text-lg font-bold text-purple-500">{count}</p>
                  <p className="text-xs text-purple-400/80">£{count * 40}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MemberStatsView;