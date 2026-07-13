import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const MinimalistProCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex flex-col justify-center"
      style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Ultra minimal layout */}
      <div className="px-16">
        <h1 className="text-7xl font-extralight text-black tracking-tight leading-none">
          {formData.firstName}
        </h1>
        <h1 className="text-7xl font-extralight text-black tracking-tight leading-none">
          {formData.lastName}
        </h1>
        
        <p className="text-xl text-gray-400 font-light mt-8">
          Cover Letter
        </p>
        
        {/* Contact info - minimal */}
        <div className="mt-24 flex gap-8 text-sm text-gray-400">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>{formData.phone}</span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
      </div>
    </div>
  );
};

export default MinimalistProCover;
