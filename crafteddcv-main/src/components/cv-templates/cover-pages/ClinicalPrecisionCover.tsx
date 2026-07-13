import { CVFormData } from "../types";
import { Heart } from "lucide-react";

interface CoverPageProps {
  formData: CVFormData;
}

const ClinicalPrecisionCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col"
      style={{ fontFamily: "'Calibri', 'Segoe UI', sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Medical-themed cover */}
      <div className="border-b-4 border-gray-800 p-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-gray-800 flex items-center justify-center">
            <Heart className="w-8 h-8 text-gray-800" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-black">
              {formData.firstName} {formData.lastName}
            </h1>
            <p className="text-gray-600">Healthcare Professional</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          Professional Correspondence
        </p>
        <h2 className="text-3xl font-bold text-black">
          Cover Letter
        </h2>
        
        <div className="w-24 h-1 bg-gray-800 my-8" />
        
        {/* Contact */}
        <div className="space-y-2 text-center text-sm text-gray-500">
          {formData.email && <p>{formData.email}</p>}
          {formData.phone && <p>{formData.phone}</p>}
          {formData.location && <p>{formData.location}</p>}
        </div>
      </div>
    </div>
  );
};

export default ClinicalPrecisionCover;
