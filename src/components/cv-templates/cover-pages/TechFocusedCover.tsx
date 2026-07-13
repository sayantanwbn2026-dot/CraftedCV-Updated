import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const TechFocusedCover = ({ formData }: CoverPageProps) => {
  const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`;
  
  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg relative overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', monospace", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Code-like background pattern */}
      <div className="absolute top-0 right-0 text-gray-100 text-xs font-mono p-8 opacity-50" style={{ width: '60%' }}>
        <pre>{`
function createCareer() {
  const skills = [];
  const experience = [];
  const passion = "∞";
  
  return {
    name: "${formData.firstName}",
    ready: true
  };
}
        `}</pre>
      </div>
      
      <div className="relative z-10 h-full flex flex-col justify-center p-16">
        {/* Terminal-style header */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-8 max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <div className="w-3 h-3 rounded-full bg-gray-400" />
          </div>
          <p className="text-sm text-gray-600 font-mono">
            <span className="text-gray-400">$</span> whoami
          </p>
          <p className="text-lg text-black font-bold mt-1">
            {formData.firstName.toLowerCase()}_{formData.lastName.toLowerCase()}
          </p>
        </div>
        
        {/* Main name */}
        <h1 className="text-5xl font-bold text-black mb-2">
          {`<${formData.firstName}`}
        </h1>
        <h1 className="text-5xl font-bold text-gray-400 mb-8">
          {`${formData.lastName} />`}
        </h1>
        
        {/* Cover letter label */}
        <div className="inline-block bg-black text-white px-4 py-2 font-mono text-sm mb-8">
          // COVER_LETTER
        </div>
        
        {/* Contact as key-value pairs */}
        <div className="font-mono text-sm text-gray-600 space-y-1">
          {formData.email && <p><span className="text-gray-400">email:</span> "{formData.email}"</p>}
          {formData.phone && <p><span className="text-gray-400">phone:</span> "{formData.phone}"</p>}
          {formData.location && <p><span className="text-gray-400">location:</span> "{formData.location}"</p>}
          {formData.portfolio && <p><span className="text-gray-400">portfolio:</span> "{formData.portfolio}"</p>}
        </div>
      </div>
      
      {/* Bottom code comment */}
      <div className="absolute bottom-8 left-16 text-gray-300 font-mono text-xs">
        /* Ready to compile your next team member */
      </div>
    </div>
  );
};

export default TechFocusedCover;
