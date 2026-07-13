import { CVTemplateProps, formatDate } from "./types";

const ResearchPaperTemplate = ({ formData }: CVTemplateProps) => {
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
  
  // Adaptive styles
  const spacing = hasLongContent ? "mb-4" : "mb-6";
  const textBody = hasLongContent ? "text-xs" : "text-sm";
  const textSmall = hasLongContent ? "text-[10px]" : "text-xs";

  return (
    <div
      className="bg-white text-black p-8 max-w-[210mm] mx-auto shadow-lg"
      style={{ 
        fontFamily: "'Computer Modern', 'Latin Modern', Georgia, serif", 
        height: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header - Academic paper style */}
      <header className="text-center mb-4">
        <h1 className={`${hasLongContent ? "text-xl" : "text-2xl"} font-bold text-black mb-1`}>
          {formData.firstName} {formData.lastName}
        </h1>
        <div className={`${textSmall} text-gray-600 space-y-0.5`}>
          <p>
            {formData.email && <span>{formData.email}</span>}
            {formData.phone && <span className="mx-2">·</span>}
            {formData.phone && <span>{formData.phone}</span>}
          </p>
          <p>
            {formData.location && <span>{formData.location}</span>}
            {formData.linkedin && <span className="mx-2">·</span>}
            {formData.linkedin && <span>{formData.linkedin}</span>}
          </p>
          {formData.portfolio && <p>{formData.portfolio}</p>}
        </div>
        <div className="mt-2 w-full h-px bg-black" />
      </header>

      {/* Abstract */}
      {formData.summary && (
        <section className={spacing}>
          <h2 className={`${textSmall} font-bold text-center uppercase tracking-wider mb-2`}>Abstract</h2>
          <p className={`${textBody} text-gray-800 leading-snug text-justify italic`}>{formData.summary}</p>
          <div className="mt-2 w-16 h-px bg-gray-300 mx-auto" />
        </section>
      )}

      {/* Education - Academic style emphasizes this */}
      {formData.education.some((e) => e.institution) && (
        <section className={spacing}>
          <h2 className={`${textSmall} font-bold uppercase tracking-wider mb-2`}>1. Education</h2>
          <div className="space-y-1 pl-3">
            {formData.education
              .filter((edu) => edu.institution)
              .map((edu) => (
                <div key={edu.id}>
                  <p className={textBody}>
                    <span className="font-semibold">{edu.degree}</span>
                    {edu.field && <span> in {edu.field}</span>}
                  </p>
                  <p className={`${textSmall} text-gray-600 italic`}>
                    {edu.institution}, {formatDate(edu.startDate)}–{edu.endDate ? formatDate(edu.endDate) : "Present"}
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className={spacing}>
          <h2 className={`${textSmall} font-bold uppercase tracking-wider mb-2`}>2. Professional Experience</h2>
          <div className="space-y-2 pl-3">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <p className={textBody}>
                  <span className="font-semibold">{exp.position}</span>
                  <span className="text-gray-600">, {exp.company}</span>
                  {exp.location && <span className="text-gray-600">, {exp.location}</span>}
                </p>
                <p className={`${textSmall} text-gray-500 italic`}>
                  {formatDate(exp.startDate)}–{exp.endDate ? formatDate(exp.endDate) : "Present"}
                </p>
                {exp.description && (
                  <p className={`mt-0.5 ${textBody} text-gray-700 text-justify whitespace-pre-line leading-snug`}>{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects/Publications */}
      {formData.projects.length > 0 && (
        <section className={spacing}>
          <h2 className={`${textSmall} font-bold uppercase tracking-wider mb-2`}>3. Research & Projects</h2>
          <div className="space-y-1 pl-3">
            {formData.projects.map((project, idx) => (
              <div key={project.id}>
                <p className={textBody}>
                  <span className="text-gray-500">[{idx + 1}]</span>{" "}
                  <span className="font-semibold">{project.name}</span>
                  {project.technologies && (
                    <span className="text-gray-600 italic"> ({project.technologies})</span>
                  )}
                </p>
                {project.description && (
                  <p className={`${textBody} text-gray-700 pl-4 text-justify leading-snug`}>{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className={`${textSmall} font-bold uppercase tracking-wider mb-2`}>4. Technical Expertise</h2>
          <p className={`${textBody} text-gray-700 pl-3`}>{skillsList.join("; ")}</p>
        </section>
      )}
    </div>
  );
};

export default ResearchPaperTemplate;
