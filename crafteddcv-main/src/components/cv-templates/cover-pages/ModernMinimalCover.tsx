import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const ModernMinimalCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center"
      style={{ fontFamily: "'Inter', sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Simple border frame */}
      <div className="border-2 border-black p-16 text-center max-w-md">
        {/* Name */}
        <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">
          {formData.firstName}
          <br />
          {formData.lastName}
        </h1>
        
        {/* Minimal line */}
        <div className="w-24 h-0.5 bg-black mx-auto my-8" />
        
        {/* Title/Summary tagline */}
        <p className="text-lg text-gray-600 font-light">
          Cover Letter
        </p>
        
        {/* Contact info */}
        <div className="mt-12 space-y-2 text-sm text-gray-500">
          {formData.email && <p>{formData.email}</p>}
          {formData.phone && <p>{formData.phone}</p>}
          {formData.location && <p>{formData.location}</p>}
        </div>
      </div>
    </div>
  );
};

export default ModernMinimalCover;
