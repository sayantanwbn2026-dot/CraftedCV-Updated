import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const HealthcareProCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Clean top bar */}
      <div className="h-2 bg-gray-200" />
      
      <div className="flex-1 flex flex-col justify-center items-center p-16">
        {/* Medical cross symbol stylized */}
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full bg-gray-200" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-4 bg-gray-200" />
        </div>
        
        {/* Name */}
        <h1 className="text-4xl font-semibold text-black text-center mb-2">
          {formData.firstName} {formData.lastName}
        </h1>
        
        {/* Credentials/title hint */}
        {formData.education[0]?.degree && (
          <p className="text-sm text-gray-500 mb-8">
            {formData.education[0].degree}
          </p>
        )}
        
        {/* Clean separator */}
        <div className="flex items-center gap-4 my-8">
          <div className="w-8 h-px bg-gray-300" />
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          <div className="w-8 h-px bg-gray-300" />
        </div>
        
        <p className="text-lg text-gray-500 uppercase tracking-widest mb-4">
          Cover Letter
        </p>
        
        <p className="text-sm text-gray-400 text-center max-w-md mt-4">
          Healthcare Professional Application
        </p>
        
        {/* Contact in clean format */}
        <div className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>{formData.phone}</span>}
        </div>
        {formData.location && (
          <p className="text-sm text-gray-500 mt-2">{formData.location}</p>
        )}
      </div>
      
      {/* Clean bottom bar */}
      <div className="h-2 bg-gray-200" />
    </div>
  );
};

export default HealthcareProCover;
