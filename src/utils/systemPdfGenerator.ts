import { jsPDF } from 'jspdf';
import { SystemCheck } from '@/types/system';

export const generateSystemCheckPDF = (checks: SystemCheck[], title: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  let yPos = 40;
  
  checks.forEach((check, index) => {
    doc.text(`${index + 1}. ${check.check_type}`, 20, yPos);
    yPos += 10;
    doc.text(`Status: ${check.status}`, 30, yPos);
    yPos += 10;
    doc.text(`Details: ${JSON.stringify(check.details)}`, 30, yPos);
    yPos += 20;
    
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  return doc;
};