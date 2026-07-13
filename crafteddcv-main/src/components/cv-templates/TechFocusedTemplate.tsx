import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const TechFocusedTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);
  
  // Calculate content density for adaptive sizing
  const contentItems = 
    formData.experience.length + 
    formData.education.filter(e => e.institution).length + 
    formData.projects.length;
  
  const hasLongContent = 
    formData.summary.length > 300 ||
    formData.experience.some(exp => exp.description.length > 200) ||
    contentItems > 6;
  
  // Adaptive sizes
  const spacing = hasLongContent ? "mb-3" : "mb-4";
  const textBase = hasLongContent ? "text-[10px]" : "text-xs";

  return (
    <div
      className="bg-white text-black p-5 max-w-[210mm] mx-auto shadow-lg"
      style={{ 
        fontFamily: "'Consolas', 'Monaco', monospace", 
        height: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header - Terminal style */}
      <header className={`${spacing} p-3 bg-gray-900 text-white rounded`}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <h1 className={`${hasLongContent ? "text-lg" : "text-xl"} font-bold`}>
          <span className="text-gray-500">$</span> whoami
        </h1>
        <p className={`${hasLongContent ? "text-base" : "text-lg"} text-white mt-0.5`}>
          {formData.firstName} {formData.lastName}
        </p>
        <div className={`flex flex-wrap gap-x-3 gap-y-1 mt-2 ${textBase} text-gray-300`}>
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} className="text-gray-300" />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} className="text-gray-300" />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} className="text-gray-300" />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} className="text-gray-300" />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} className="text-gray-300" />}
        </div>
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className={spacing}>
          <h2 className={`${hasLongContent ? "text-xs" : "text-sm"} font-bold text-black mb-1 flex items-center gap-2`}>
            <span className="text-gray-500">//</span> README
          </h2>
          <p className={`${textBase} text-gray-800 leading-snug pl-3 border-l-2 border-gray-300`}>
            {formData.summary}
          </p>
        </section>
      )}

      {/* Skills - Prominent for tech */}
      {skillsList.length > 0 && (
        <section className={spacing}>
          <h2 className={`${hasLongContent ? "text-xs" : "text-sm"} font-bold text-black mb-1 flex items-center gap-2`}>
            <span className="text-gray-500">//</span> TECH_STACK
          </h2>
          <div className="flex flex-wrap gap-1">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className={`px-1.5 py-0.5 bg-gray-100 text-black ${textBase} border border-gray-300 font-mono`}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className={spacing}>
          <h2 className={`${hasLongContent ? "text-xs" : "text-sm"} font-bold text-black mb-1 flex items-center gap-2`}>
            <span className="text-gray-500">//</span> WORK_HISTORY
          </h2>
          <div className="space-y-2">
            {formData.experience.map((exp) => (
              <div key={exp.id} className="pl-3 border-l-2 border-gray-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-black ${textBase}`}>{exp.position}</h3>
                    <p className={`${textBase} text-gray-600`}>@ {exp.company}{exp.location && ` | ${exp.location}`}</p>
                  </div>
                  <code className={`${textBase} text-gray-500 bg-gray-100 px-1 flex-shrink-0`}>
                    {formatDate(exp.startDate)}:{exp.endDate ? formatDate(exp.endDate) : "now"}
                  </code>
                </div>
                {exp.description && (
                  <div className={`mt-1 ${textBase} text-gray-700 whitespace-pre-line leading-snug`}>
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {formData.projects.length > 0 && (
        <section className={spacing}>
          <h2 className={`${hasLongContent ? "text-xs" : "text-sm"} font-bold text-black mb-1 flex items-center gap-2`}>
            <span className="text-gray-500">//</span> PROJECTS
          </h2>
          <div className="space-y-1.5">
            {formData.projects.map((project) => (
              <div key={project.id} className="pl-3 border-l-2 border-gray-300">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-black ${textBase}`}>{project.name}</h3>
                  {project.link && (
                    <code className={`${textBase} text-gray-600`}>{project.link}</code>
                  )}
                </div>
                {project.description && (
                  <p className={`${textBase} text-gray-700 mt-0.5 leading-snug`}>{project.description}</p>
                )}
                {project.technologies && (
                  <p className={`${textBase} text-gray-500 mt-0.5`}>
                    <span className="text-gray-400">stack:</span> {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {formData.education.some((e) => e.institution) && (
        <section className={spacing}>
          <h2 className={`${hasLongContent ? "text-xs" : "text-sm"} font-bold text-black mb-1 flex items-center gap-2`}>
            <span className="text-gray-500">//</span> EDUCATION
          </h2>
          <div className="space-y-1">
            {formData.education
              .filter((edu) => edu.institution)
              .map((edu) => (
                <div key={edu.id} className="pl-3 border-l-2 border-gray-300 flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-black ${textBase}`}>{edu.institution}</h3>
                    <p className={`${textBase} text-gray-600`}>
                      {edu.degree} {edu.field && `// ${edu.field}`}
                    </p>
                  </div>
                  <code className={`${textBase} text-gray-500 bg-gray-100 px-1 flex-shrink-0`}>
                    {formatDate(edu.startDate)}:{edu.endDate ? formatDate(edu.endDate) : "now"}
                  </code>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TechFocusedTemplate;
