import { CVFormData } from "../types";

interface CoverPageProps {
  formData: CVFormData;
}

const DataDrivenCover = ({ formData }: CoverPageProps) => {
  return (
    <div
      className="bg-gray-900 text-green-400 max-w-[210mm] mx-auto shadow-lg flex flex-col"
      style={{ fontFamily: "'Roboto Mono', monospace", height: "297mm", pageBreakAfter: "always" }}
    >
      {/* Terminal-style cover */}
      <div className="p-8 flex-1 flex flex-col">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-gray-500 text-sm">cover-letter.md</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-gray-500 mb-2">{"// author"}</p>
          <h1 className="text-5xl font-bold text-white mb-2">
            {formData.firstName} {formData.lastName}
          </h1>
          
          <p className="text-gray-500 mt-8 mb-2">{"// document.type"}</p>
          <p className="text-2xl text-green-400">
            "cover_letter"
          </p>
          
          <div className="mt-16 space-y-2 text-sm text-gray-400">
            <p><span className="text-gray-600">email:</span> "{formData.email}"</p>
            <p><span className="text-gray-600">phone:</span> "{formData.phone}"</p>
            <p><span className="text-gray-600">location:</span> "{formData.location}"</p>
          </div>
        </div>
        
        {/* Blinking cursor */}
        <p className="text-green-400 mt-auto">
          $ <span className="animate-pulse">_</span>
        </p>
      </div>
    </div>
  );
};

export default DataDrivenCover;
