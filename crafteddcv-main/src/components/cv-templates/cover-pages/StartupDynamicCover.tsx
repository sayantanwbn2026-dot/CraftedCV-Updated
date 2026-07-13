import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const StartupDynamicCover = ({ formData }: CoverPageProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
  
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Dynamic diagonal stripe */}
      <div 
        className="absolute top-0 right-0 w-2/3 h-full bg-black"
        style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}
      />
      
      <div className="relative z-10 h-full flex">
        {/* Left content */}
        <div className="w-1/2 flex flex-col justify-center p-12">
          <div className="mb-8">
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
              Cover Letter
            </span>
          </div>
          
          <h1 className="text-5xl font-black text-black leading-tight mb-4">
            {formData.firstName}
            <br />
            {formData.lastName}
          </h1>
          
          <div className="w-16 h-1 bg-black mb-8" />
          
          {/* Skills as tags */}
          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Right content (on black) */}
        <div className="w-1/2 flex flex-col justify-center items-end p-12 text-white text-right">
          <div className="max-w-xs">
            <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center mb-8 ml-auto">
              <span className="text-2xl font-black">
                {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
              </span>
            </div>
            
            <p className="text-sm text-gray-400 mb-8">
              {formData.summary ? formData.summary.slice(0, 100) + '...' : 'Ready to make an impact'}
            </p>
            
            <div className="space-y-2 text-sm text-gray-300">
              {formData.email && <p>{formData.email}</p>}
              {formData.phone && <p>{formData.phone}</p>}
              {formData.location && <p>{formData.location}</p>}
              {formData.portfolio && <p>{formData.portfolio}</p>}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-black via-gray-600 to-black" />
    </div>
  );
};

export default StartupDynamicCover;
