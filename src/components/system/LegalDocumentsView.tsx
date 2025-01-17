import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import { useToast } from "@/components/ui/use-toast";

const LegalDocumentsView = () => {
  const { toast } = useToast();

  const generatePDF = (content: string, title: string) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(title, 20, 20);
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(content, 170);
      doc.text(splitText, 20, 40);
      doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
      
      toast({
        title: "Success",
        description: "Document has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-dashboard-card border-dashboard-cardBorder hover:border-dashboard-cardBorderHover transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-dashboard-accent1" />
            <h3 className="text-xl font-semibold text-white">PWA Collector Member Responsibilities</h3>
          </div>
          <Button 
            onClick={() => generatePDF(
              "A Collector member is a senior member of the PWA who is responsible for a specific number of paying members who are part of the death committee. The Collector will be responsible for: 1. Act as the representative of the death committee for each member on their list. 2. Act as first point of contact for any enquiries. 3. Register new members with the death committee. 4. Communicate announcements from death committee to members. 5. Collect member's fees when due. 6. Keep payment records. 7. Act as conduit between members and SLT. 8. Attend Collectors meetings. 9. Provide guidance to new members. 10. Feedback issues to the PWA SLT.",
              "PWA Collector Member Responsibilities"
            )}
            variant="outline"
            className="gap-2 hover:bg-dashboard-accent1/10"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
        <div className="prose prose-invert max-w-none">
          <p className="text-dashboard-text mb-4">
            A Collector member is a senior member of the PWA who is responsible for a specific number of paying
            members who are part of the death committee.
          </p>
          <p className="font-semibold text-dashboard-accent1 mb-4">The Collector will be responsible for:</p>
          <ol className="list-decimal pl-6 space-y-2 text-dashboard-text">
            <li className="hover:text-dashboard-accent2 transition-colors">Act as the representative of the death committee for each member on their list.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Act as first point of contact for any enquiries from members or prospective members.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Register new members with the death committee.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Communicate announcements from death committee to members.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Collect member's fees whenever a collection is due.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Keep a record of all members' payments made in to PWA bank account.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Act as conduit between the members and death committee Senior Leadership Team (SLT).</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Attending Collectors meetings with other members.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Provide guidance to new members and prospective members.</li>
            <li className="hover:text-dashboard-accent2 transition-colors">Feedback any issues or concerns to the PWA SLT.</li>
          </ol>
        </div>
      </Card>

      <Card className="p-6 bg-dashboard-card border-dashboard-cardBorder hover:border-dashboard-cardBorderHover transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-dashboard-accent1" />
            <h3 className="text-xl font-semibold text-white">Pakistan Welfare Association Membership Terms</h3>
          </div>
          <Button 
            onClick={() => generatePDF(
              "Pakistan Welfare Association\nBurton Upon Trent\nV.4 December 2024\n\n1. Members Eligibility\nOnly Muslims can be members of Pakistan Welfare Association (PWA).\n\n2. Membership Fee\nAny new members must pay a membership fee plus the collection amount for that calendar year. Currently the membership fee is £150 as of January 2024. This may change with inflation and is reviewed periodically to reflect the costs incurred.\n\n3. Dependents Registration\nAll members will be given a membership number and will need to register their dependents so that the PWA Committee can gain an accurate picture of the actual number of people covered. Dependents include stepchildren and adopted children.\n\n4. Health Declaration\nNew members must be in good health, with no known terminal illnesses. Any long-term illnesses must be disclosed to the Committee for consideration during the membership process.\n\n5. Confidentiality\nAll data is confidentially stored under GDPR rules and will not be shared except for necessary processes when death occurs or for use within PWA.\n\n6. Payment Terms\nPayments will need to be made within 28 days from collection date. This will take place annually from 1st January and no later than 29th January. Any non-paying members will have a warning, and have seven days to make payment which is up until 5th February, in this seven day period they are not covered as members and nor are their dependents.\n\nAny further nonpayment will result in cancellation of membership, and will have to re-register as a member, and must pay a new membership fee of £150. All costs are reviewed periodically to reflect inflation, changes will be communicated to members via their Collector Members or directly through a communication mechanism.\n\n7. Registration Requirements\nEvery married man will need to ensure they are registered separately from their parents or guardian.\n\nSpecial Cases\nUnmarried females are not obliged to become members as they will have their membership as part of their parents until they are married following which they will be covered under their husband's membership if he is a member.\n\nAssistance Offered\nIf a head member of family passes away, a £500 payment is offered to the widow, or orphans under the age of 18 only, in this circumstance if death occurs in Pakistan £1,000 is offered.\n\nResidency Requirements\nAny member who must live out of East Staffordshire Borough Council (ESBC) for work will still receive full benefits of the association.",
              "PWA Membership Terms"
            )}
            variant="outline"
            className="gap-2 hover:bg-dashboard-accent1/10"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
        <div className="space-y-6 text-dashboard-text">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white text-center mb-4">Pakistan Welfare Association</h2>
            <h3 className="text-lg text-center text-dashboard-accent2 mb-6">Burton Upon Trent</h3>
            <p className="text-sm text-dashboard-accent3 text-center mb-8">V.4 December 2024</p>

            <div className="space-y-6">
              {[
                {
                  title: "1. Members Eligibility",
                  content: "Only Muslims can be members of Pakistan Welfare Association (PWA)."
                },
                {
                  title: "2. Membership Fee",
                  content: "Any new members must pay a membership fee plus the collection amount for that calendar year. Currently the membership fee is £150 as of January 2024. This may change with inflation and is reviewed periodically to reflect the costs incurred."
                },
                {
                  title: "3. Dependents Registration",
                  content: "All members will be given a membership number and will need to register their dependents so that the PWA Committee can gain an accurate picture of the actual number of people covered. Dependents include stepchildren and adopted children."
                },
                {
                  title: "4. Health Declaration",
                  content: "New members must be in good health, with no known terminal illnesses. Any long-term illnesses must be disclosed to the Committee for consideration during the membership process."
                },
                {
                  title: "5. Confidentiality",
                  content: "All data is confidentially stored under GDPR rules and will not be shared except for necessary processes when death occurs or for use within PWA."
                },
                {
                  title: "6. Payment Terms",
                  content: "Payments will need to be made within 28 days from collection date. This will take place annually from 1st January and no later than 29th January. Any non-paying members will have a warning, and have seven days to make payment which is up until 5th February, in this seven day period they are not covered as members and nor are their dependents.\n\nAny further nonpayment will result in cancellation of membership, and will have to re-register as a member, and must pay a new membership fee of £150. All costs are reviewed periodically to reflect inflation, changes will be communicated to members via their Collector Members or directly through a communication mechanism."
                },
                {
                  title: "7. Registration Requirements",
                  content: "Every married man will need to ensure they are registered separately from their parents or guardian."
                },
                {
                  title: "Special Cases",
                  content: "Unmarried females are not obliged to become members as they will have their membership as part of their parents until they are married following which they will be covered under their husband's membership if he is a member."
                },
                {
                  title: "Assistance Offered",
                  content: "If a head member of family passes away, a £500 payment is offered to the widow, or orphans under the age of 18 only, in this circumstance if death occurs in Pakistan £1,000 is offered."
                },
                {
                  title: "Residency Requirements",
                  content: "Any member who must live out of East Staffordshire Borough Council (ESBC) for work will still receive full benefits of the association."
                }
              ].map((section, index) => (
                <div key={index} className="bg-dashboard-card/50 p-4 rounded-lg hover:bg-dashboard-cardHover transition-colors">
                  <h3 className="font-semibold text-dashboard-accent2 mb-2">{section.title}</h3>
                  <p className="text-dashboard-text whitespace-pre-line">{section.content}</p>
                </div>
              ))}

              <div className="mt-8 pt-4 border-t border-dashboard-cardBorder">
                <p className="text-dashboard-accent3 font-semibold italic">
                  By becoming a member of the Pakistan Welfare Association, you agree to abide by these terms and conditions outlined above.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Card>
    </div>
  );
};

export default LegalDocumentsView;