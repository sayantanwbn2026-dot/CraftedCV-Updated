import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const LeadershipSuiteCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center items-center"
      style={{ fontFamily: "'Playfair Display', Georgia, serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Sophisticated executive cover */}
      <div className="text-center">
        <p className="text-sm text-gray-400 tracking-[0.5em] uppercase">
          Executive
        </p>
        
        <h1 className="text-5xl font-bold text-black tracking-wide mt-4">
          {formData.firstName.toUpperCase()}
        </h1>
        <h1 className="text-5xl font-bold text-black tracking-wide">
          {formData.lastName.toUpperCase()}
        </h1>
        
        <div className="w-32 h-1 bg-black mx-auto my-12" />
        
        <p className="text-2xl text-gray-600 font-light italic">
          Cover Letter
        </p>
        
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mt-16">
          <div className="flex-1 max-w-16 h-px bg-gray-200" />
          <div className="w-3 h-3 bg-black transform rotate-45" />
          <div className="flex-1 max-w-16 h-px bg-gray-200" />
        </div>
        
        {/* Contact info */}
        <div className="mt-16 space-y-2 text-sm text-gray-500">
          {formData.email && <p>{formData.email}</p>}
          {formData.phone && <p>{formData.phone}</p>}
          {formData.location && <p>{formData.location}</p>}
        </div>
      </div>
    </div>
  );
};

export default LeadershipSuiteCover;
