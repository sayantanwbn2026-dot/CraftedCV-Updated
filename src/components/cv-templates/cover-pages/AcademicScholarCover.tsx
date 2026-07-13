import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const AcademicScholarCover = ({ formData }: CoverPageProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col"
      style={{ fontFamily: "'Times New Roman', serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Academic header bar */}
      <div className="bg-gray-100 border-b border-gray-300 py-4 px-8">
        <p className="text-xs text-gray-500 text-center uppercase tracking-widest">
          Curriculum Vitae • Application Materials
        </p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center items-center p-16">
        {/* Academic seal/monogram */}
        <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-8">
          <span className="text-2xl font-serif">
            {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
          </span>
        </div>
        
        {/* Name */}
        <h1 className="text-4xl font-normal text-black text-center mb-2">
          {formData.firstName} {formData.lastName}
        </h1>
        
        {/* Academic credentials hint */}
        {formData.education[0]?.degree && (
          <p className="text-sm text-gray-500 italic mb-8">
            {formData.education[0].degree}{formData.education[0].field ? `, ${formData.education[0].field}` : ''}
          </p>
        )}
        
        {/* Simple line */}
        <div className="w-32 h-px bg-gray-400 my-8" />
        
        <p className="text-lg text-gray-600 tracking-wider uppercase">
          Cover Letter
        </p>
        
        <p className="text-sm text-gray-400 mt-2">
          {currentYear}
        </p>
        
        {/* Contact information */}
        <div className="mt-16 text-center text-sm text-gray-600 space-y-1">
          {formData.email && <p>{formData.email}</p>}
          {formData.location && <p>{formData.location}</p>}
          {formData.linkedin && <p>{formData.linkedin}</p>}
        </div>
      </div>
      
      {/* Academic footer */}
      <div className="bg-gray-100 border-t border-gray-300 py-4 px-8">
        <p className="text-xs text-gray-400 text-center">
          Confidential Application Material
        </p>
      </div>
    </div>
  );
};

export default AcademicScholarCover;
