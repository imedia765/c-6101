import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { jsPDF } from "https://esm.sh/jspdf@2.5.1"
import autoTable from 'https://esm.sh/jspdf-autotable@3.8.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const doc = new jsPDF();
    
    // Title Page
    doc.setFontSize(24);
    doc.text("Pakistan Welfare Association", 20, 30);
    doc.setFontSize(16);
    doc.text("User Manual", 20, 45);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60);

    // Table of Contents
    doc.addPage();
    doc.setFontSize(20);
    doc.text("Table of Contents", 20, 30);
    
    const sections = [
      { title: "1. Getting Started", page: 3 },
      { title: "2. Member Features", page: 8 },
      { title: "3. Collector Features", page: 13 },
      { title: "4. Admin Features", page: 18 },
      { title: "5. System Tools", page: 23 },
      { title: "6. Payments & Financial Management", page: 28 },
      { title: "7. Family Members Management", page: 33 },
      { title: "8. Troubleshooting", page: 38 }
    ];

    let yPos = 50;
    sections.forEach(section => {
      doc.text(section.title, 20, yPos);
      doc.text(section.page.toString(), 180, yPos);
      yPos += 10;
    });

    // 1. Getting Started
    doc.addPage();
    doc.setFontSize(20);
    doc.text("1. Getting Started", 20, 30);
    doc.setFontSize(12);
    
    const gettingStartedContent = [
      { title: "Logging In:", content: [
        "1. Navigate to the login page",
        "2. Enter your member number",
        "3. Click 'Login' to proceed",
        "4. First-time users will need to verify their identity"
      ]},
      { title: "Dashboard Overview:", content: [
        "• Quick access to your profile information",
        "• View payment history and upcoming payments",
        "• Access family member information",
        "• Check system announcements",
        "• View collector assignments"
      ]},
      { title: "Profile Setup:", content: [
        "• Update personal information",
        "• Verify contact details",
        "• Set communication preferences",
        "• Upload profile picture (if applicable)"
      ]}
    ];

    let currentY = 50;
    gettingStartedContent.forEach(section => {
      doc.setFontSize(14);
      doc.text(section.title, 20, currentY);
      currentY += 10;
      doc.setFontSize(12);
      section.content.forEach(line => {
        doc.text(line, 30, currentY);
        currentY += 8;
      });
      currentY += 5;
    });

    // 2. Member Features
    doc.addPage();
    doc.setFontSize(20);
    doc.text("2. Member Features", 20, 30);
    
    const memberFeatures = [
      { title: "Profile Management", content: [
        "• View and edit personal information",
        "• Update contact details",
        "• Change address information",
        "• Manage notification preferences"
      ]},
      { title: "Payment Management", content: [
        "• View payment history",
        "• Check upcoming payments",
        "• Track yearly contributions",
        "• Monitor emergency collections",
        "• Download payment receipts"
      ]},
      { title: "Family Members", content: [
        "• Add new family members",
        "• Update family member information",
        "• View family member status",
        "• Manage relationships"
      ]}
    ];

    currentY = 50;
    memberFeatures.forEach(feature => {
      doc.setFontSize(14);
      doc.text(feature.title, 20, currentY);
      currentY += 10;
      doc.setFontSize(12);
      feature.content.forEach(line => {
        doc.text(line, 30, currentY);
        currentY += 8;
      });
      currentY += 5;
    });

    // 3. Collector Features
    doc.addPage();
    doc.setFontSize(20);
    doc.text("3. Collector Features", 20, 30);

    const collectorFeatures = [
      { title: "Member Management", content: [
        "• View assigned members",
        "• Track member payment status",
        "• Update member information",
        "• Generate member reports"
      ]},
      { title: "Collection Management", content: [
        "• Record new payments",
        "• Track collection progress",
        "• Generate collection reports",
        "• Monitor payment deadlines",
        "• Handle emergency collections"
      ]},
      { title: "Reporting Tools", content: [
        "• Generate collection summaries",
        "• Export member lists",
        "• Create payment reports",
        "• Track collection efficiency"
      ]}
    ];

    currentY = 50;
    collectorFeatures.forEach(feature => {
      doc.setFontSize(14);
      doc.text(feature.title, 20, currentY);
      currentY += 10;
      doc.setFontSize(12);
      feature.content.forEach(line => {
        doc.text(line, 30, currentY);
        currentY += 8;
      });
      currentY += 5;
    });

    // 4. Admin Features
    doc.addPage();
    doc.setFontSize(20);
    doc.text("4. Admin Features", 20, 30);

    const adminFeatures = [
      { title: "System Management", content: [
        "• Configure system settings",
        "• Manage user roles and permissions",
        "• Monitor system health",
        "• Backup and restore data",
        "• Handle system announcements"
      ]},
      { title: "User Administration", content: [
        "• Create new user accounts",
        "• Manage collector assignments",
        "• Reset user credentials",
        "• Monitor user activity",
        "• Handle role assignments"
      ]},
      { title: "Financial Administration", content: [
        "• Set payment schedules",
        "• Configure payment types",
        "• Manage emergency collections",
        "• Generate financial reports",
        "• Track overall financial health"
      ]}
    ];

    currentY = 50;
    adminFeatures.forEach(feature => {
      doc.setFontSize(14);
      doc.text(feature.title, 20, currentY);
      currentY += 10;
      doc.setFontSize(12);
      feature.content.forEach(line => {
        doc.text(line, 30, currentY);
        currentY += 8;
      });
      currentY += 5;
    });

    // 5. System Tools
    doc.addPage();
    doc.setFontSize(20);
    doc.text("5. System Tools", 20, 30);

    const systemTools = [
      { title: "Health Monitoring", content: [
        "• System performance metrics",
        "• Database health checks",
        "• API response monitoring",
        "• Error rate tracking",
        "• Resource usage monitoring"
      ]},
      { title: "Git Operations", content: [
        "• Code version control",
        "• Deployment management",
        "• Repository synchronization",
        "• Backup management"
      ]},
      { title: "Role Management", content: [
        "• Role assignment",
        "• Permission configuration",
        "• Access control",
        "• User role auditing"
      ]}
    ];

    currentY = 50;
    systemTools.forEach(tool => {
      doc.setFontSize(14);
      doc.text(tool.title, 20, currentY);
      currentY += 10;
      doc.setFontSize(12);
      tool.content.forEach(line => {
        doc.text(line, 30, currentY);
        currentY += 8;
      });
      currentY += 5;
    });

    // 6. Payments & Financial Management
    doc.addPage();
    doc.setFontSize(20);
    doc.text("6. Payments & Financial Management", 20, 30);

    const financialManagement = [
      { title: "Payment Types", content: [
        "• Yearly contributions",
        "• Emergency collections",
        "• Special payments",
        "• Payment schedules"
      ]},
      { title: "Payment Processing", content: [
        "• Recording payments",
        "• Payment verification",
        "• Receipt generation",
        "• Payment history tracking"
      ]},
      { title: "Financial Reporting", content: [
        "• Collection summaries",
        "• Payment analytics",
        "• Financial forecasting",
        "• Audit trails"
      ]}
    ];

    currentY = 50;
    financialManagement.forEach(section => {
      doc.setFontSize(14);
      doc.text(section.title, 20, currentY);
      currentY += 10;
      doc.setFontSize(12);
      section.content.forEach(line => {
        doc.text(line, 30, currentY);
        currentY += 8;
      });
      currentY += 5;
    });

    // 7. Family Members Management
    doc.addPage();
    doc.setFontSize(20);
    doc.text("7. Family Members Management", 20, 30);

    const familyManagement = [
      { title: "Adding Family Members", content: [
        "• Registration process",
        "• Required information",
        "• Relationship types",
        "• Document requirements"
      ]},
      { title: "Managing Family Information", content: [
        "• Updating details",
        "• Status changes",
        "• Relationship updates",
        "• Document management"
      ]},
      { title: "Family Member Benefits", content: [
        "• Coverage details",
        "• Eligibility criteria",
        "• Benefit claims",
        "• Support services"
      ]}
    ];

    currentY = 50;
    familyManagement.forEach(section => {
      doc.setFontSize(14);
      doc.text(section.title, 20, currentY);
      currentY += 10;
      doc.setFontSize(12);
      section.content.forEach(line => {
        doc.text(line, 30, currentY);
        currentY += 8;
      });
      currentY += 5;
    });

    // 8. Troubleshooting
    doc.addPage();
    doc.setFontSize(20);
    doc.text("8. Troubleshooting", 20, 30);

    const troubleshooting = [
      { title: "Common Issues", content: [
        "• Login problems",
        "• Payment verification issues",
        "• Data synchronization errors",
        "• System access problems"
      ]},
      { title: "Support Channels", content: [
        "• Contact information",
        "• Support hours",
        "• Emergency contacts",
        "• Feedback submission"
      ]},
      { title: "FAQ", content: [
        "• Frequently asked questions",
        "• Quick solutions",
        "• Best practices",
        "• System requirements"
      ]}
    ];

    currentY = 50;
    troubleshooting.forEach(section => {
      doc.setFontSize(14);
      doc.text(section.title, 20, currentY);
      currentY += 10;
      doc.setFontSize(12);
      section.content.forEach(line => {
        doc.text(line, 30, currentY);
        currentY += 8;
      });
      currentY += 5;
    });

    // Save to Supabase Storage
    const pdfBytes = doc.output('arraybuffer');
    const fileName = `manual_${new Date().toISOString().slice(0, 10)}.pdf`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documentation')
      .upload(fileName, pdfBytes, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Create documentation entry
    const { error: dbError } = await supabase
      .from('documentation')
      .insert({
        title: 'PWA User Manual',
        version: '2.0',
        file_path: fileName,
        is_current: true,
        metadata: {
          sections: sections,
          pageCount: doc.getNumberOfPages()
        }
      });

    if (dbError) {
      throw dbError;
    }

    // Get public URL
    const { data: { publicUrl }, error: urlError } = await supabase.storage
      .from('documentation')
      .getPublicUrl(fileName);

    if (urlError) {
      throw urlError;
    }

    return new Response(
      JSON.stringify({ 
        message: 'Manual generated successfully',
        url: publicUrl
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error generating manual:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
})