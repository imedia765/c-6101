-- Comprehensive role and permission analysis query
-- Replace 'mt05030' with the specific member number you want to check

-- Check user_roles
SELECT 'user_roles' as table_name, 
       role as permission_type,
       created_at as recorded_at
FROM user_roles
WHERE user_id IN (
    SELECT auth_user_id 
    FROM members 
    WHERE member_number = 'mt05030'
)

UNION ALL

-- Check members_collectors
SELECT 'members_collectors' as table_name,
       CASE 
           WHEN active THEN 'active_collector'
           ELSE 'inactive_collector'
       END as permission_type,
       created_at as recorded_at
FROM members_collectors
WHERE member_number = 'mt05030'

UNION ALL

-- Check members table permissions
SELECT 'members' as table_name,
       CONCAT_WS(':', 
           CASE WHEN verified THEN 'verified' ELSE 'unverified' END,
           status,
           membership_type,
           CASE WHEN cors_enabled THEN 'cors_enabled' ELSE 'cors_disabled' END
       ) as permission_type,
       updated_at as recorded_at
FROM members
WHERE member_number = 'mt05030'

UNION ALL

-- Check audit_logs for role changes
SELECT 'audit_logs' as table_name,
       operation || ':' || table_name as permission_type,
       timestamp as recorded_at
FROM audit_logs
WHERE record_id IN (
    SELECT id 
    FROM members 
    WHERE member_number = 'mt05030'
)
AND (
    table_name = 'user_roles'
    OR new_values::text LIKE '%role%'
    OR old_values::text LIKE '%role%'
)

UNION ALL

-- Check monitoring_logs for role-related events
SELECT 'monitoring_logs' as table_name,
       event_type || ':' || metric_name as permission_type,
       timestamp as recorded_at
FROM monitoring_logs
WHERE details::text LIKE '%mt05030%'
AND (
    event_type = 'user_activity'
    OR metric_name LIKE '%role%'
    OR metric_name LIKE '%permission%'
)

UNION ALL

-- Check documentation for role-related policies
SELECT 'documentation' as table_name,
       'policy_document:' || title as permission_type,
       updated_at as recorded_at
FROM documentation
WHERE is_current = true
AND (
    title LIKE '%role%'
    OR title LIKE '%permission%'
    OR metadata::text LIKE '%mt05030%'
)

ORDER BY recorded_at DESC;