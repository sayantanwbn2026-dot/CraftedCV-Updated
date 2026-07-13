import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useState } from "react";
import { toast } from "sonner";

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async (elementId: string, filename: string = "my-cv.pdf") => {
    const element = document.getElementById(elementId);
    
    if (!element) {
      toast.error("Could not find the CV to export");
      return false;
    }

    setIsExporting(true);

    try {
      // Capture the element as a canvas with high quality settings
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
      });

      // Calculate dimensions for A4 format
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      
      // Handle multi-page documents
      let heightLeft = imgHeight;
      let position = 0;
      const margin = 0; // No margin for full-page CV

      // Add first page
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(filename);
      
      toast.success("CV exported successfully!");
      return true;
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF. Please try again.");
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPDF, isExporting };
}