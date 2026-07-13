import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const CreativeBoldCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex"
      style={{ fontFamily: "'Inter', sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Bold left sidebar */}
      <div className="w-1/3 bg-black flex flex-col justify-center items-center p-8">
        <div className="text-white text-center">
          <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center mx-auto mb-8">
            <span className="text-5xl font-black">
              {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-300">
            {formData.email && <p>{formData.email}</p>}
            {formData.phone && <p>{formData.phone}</p>}
            {formData.location && <p>{formData.location}</p>}
          </div>
        </div>
      </div>
      
      {/* Right content area */}
      <div className="flex-1 flex flex-col justify-center p-16">
        <h1 className="text-6xl font-black text-black mb-2">
          {formData.firstName}
        </h1>
        <h1 className="text-6xl font-light text-gray-400 mb-8">
          {formData.lastName}
        </h1>
        
        {/* Bold accent line */}
        <div className="w-24 h-2 bg-black mb-8" />
        
        <p className="text-2xl font-black uppercase tracking-[0.3em] text-gray-500">
          Cover Letter
        </p>
        
        {formData.linkedin && (
          <p className="mt-12 text-sm text-gray-400">{formData.linkedin}</p>
        )}
        {formData.portfolio && (
          <p className="text-sm text-gray-400">{formData.portfolio}</p>
        )}
      </div>
    </div>
  );
};

export default CreativeBoldCover;
