import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const ResearchPaperCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center"
      style={{ fontFamily: "'Computer Modern', 'Latin Modern', Georgia, serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Academic paper style cover */}
      <div className="text-center max-w-lg px-8">
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">
          Cover Letter
        </p>
        
        <h1 className="text-3xl font-bold text-black mb-4">
          {formData.firstName} {formData.lastName}
        </h1>
        
        <div className="w-full h-px bg-black my-8" />
        
        <p className="text-sm text-gray-600 italic mb-4">
          Correspondence regarding employment opportunity
        </p>
        
        {/* Author info - academic style */}
        <div className="mt-16 text-sm text-gray-600 space-y-1">
          <p>{formData.email}</p>
          {formData.phone && <p>{formData.phone}</p>}
          {formData.location && <p>{formData.location}</p>}
        </div>
        
        {/* Date */}
        <p className="mt-12 text-sm text-gray-400">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
};

export default ResearchPaperCover;
