import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const ProfessionalClassicCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col"
      style={{ fontFamily: "'Times New Roman', serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Top border */}
      <div className="h-4 bg-black" />
      
      <div className="flex-1 flex flex-col justify-center items-center p-16">
        {/* Classic ornament */}
        <div className="text-4xl text-gray-300 mb-8">❖</div>
        
        {/* Name in classic typography */}
        <h1 className="text-5xl font-normal text-black text-center tracking-wide mb-2">
          {formData.firstName} {formData.lastName}
        </h1>
        
        {/* Double line separator */}
        <div className="w-48 my-8">
          <div className="h-px bg-black" />
          <div className="h-1" />
          <div className="h-px bg-black" />
        </div>
        
        <p className="text-xl text-gray-600 tracking-widest uppercase">
          Cover Letter
        </p>
        
        {/* Contact details in classic style */}
        <div className="mt-16 text-center text-sm text-gray-600 space-y-1">
          <div className="flex items-center justify-center gap-4">
            {formData.email && <span>{formData.email}</span>}
            {formData.phone && (
              <>
                <span className="text-gray-400">|</span>
                <span>{formData.phone}</span>
              </>
            )}
          </div>
          {formData.location && <p className="mt-2">{formData.location}</p>}
        </div>
      </div>
      
      {/* Bottom border */}
      <div className="h-4 bg-black" />
    </div>
  );
};

export default ProfessionalClassicCover;
