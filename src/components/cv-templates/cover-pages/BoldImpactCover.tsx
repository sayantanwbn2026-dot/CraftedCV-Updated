import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const BoldImpactCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-black text-white max-w-[210mm] mx-auto shadow-lg flex flex-col"
      style={{ fontFamily: "'Montserrat', sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Bold black cover */}
      <div className="flex-1 flex flex-col justify-center p-16">
        <h1 className="text-7xl font-black uppercase tracking-wider text-white">
          {formData.firstName}
        </h1>
        <h1 className="text-7xl font-black uppercase tracking-wider text-gray-500">
          {formData.lastName}
        </h1>
        
        <div className="w-32 h-2 bg-white my-12" />
        
        <p className="text-2xl font-bold uppercase tracking-widest text-gray-400">
          Cover Letter
        </p>
      </div>
      
      {/* Contact bar at bottom */}
      <div className="p-8 border-t border-gray-800">
        <div className="flex flex-wrap gap-8 text-sm text-gray-400">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>{formData.phone}</span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
      </div>
    </div>
  );
};

export default BoldImpactCover;
