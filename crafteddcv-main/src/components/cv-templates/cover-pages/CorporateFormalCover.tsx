import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const CorporateFormalCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center"
      style={{ fontFamily: "'Times New Roman', Georgia, serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Formal centered layout */}
      <div className="text-center max-w-md">
        {/* Decorative lines */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-px bg-gray-400" />
          <div className="w-2 h-2 border border-gray-400 transform rotate-45" />
          <div className="w-16 h-px bg-gray-400" />
        </div>
        
        {/* Name */}
        <h1 className="text-3xl font-bold text-black uppercase tracking-widest">
          {formData.firstName}
        </h1>
        <h1 className="text-3xl font-bold text-black uppercase tracking-widest">
          {formData.lastName}
        </h1>
        
        {/* Divider */}
        <div className="w-24 h-0.5 bg-gray-300 mx-auto my-8" />
        
        {/* Cover Letter */}
        <p className="text-lg text-gray-600 italic">
          Cover Letter
        </p>
        
        {/* Contact */}
        <div className="mt-16 space-y-2 text-sm text-gray-500">
          {formData.email && <p>{formData.email}</p>}
          {formData.phone && <p>{formData.phone}</p>}
          {formData.location && <p>{formData.location}</p>}
        </div>
        
        {/* Bottom decoration */}
        <div className="flex items-center justify-center gap-4 mt-16">
          <div className="w-16 h-px bg-gray-400" />
          <div className="w-2 h-2 border border-gray-400 transform rotate-45" />
          <div className="w-16 h-px bg-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default CorporateFormalCover;
