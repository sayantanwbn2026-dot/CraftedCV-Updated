import { CVTemplateProps, formatDate } from "./types";

const MinimalistProTemplate = ({ formData }: CVTemplateProps) => {
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
      className="bg-white text-black p-6 max-w-[210mm] mx-auto shadow-lg"
      style={{ 
        fontFamily: "'SF Pro Display', -apple-system, sans-serif", 
        height: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header - Left aligned, ultra clean */}
      <header className={hasLongContent ? "mb-6" : "mb-8"}>
        <h1 className={`${hasLongContent ? "text-4xl" : "text-5xl"} font-extralight text-black tracking-tight leading-none`}>
          {formData.firstName} {formData.lastName}
        </h1>
        <div className={`mt-3 flex flex-wrap gap-3 ${textSmall} text-gray-500`}>
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>{formData.phone}</span>}
          {formData.location && <span>{formData.location}</span>}
          {formData.linkedin && <span>{formData.linkedin}</span>}
          {formData.portfolio && <span>{formData.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className={spacing}>
          <p className={`${textBody} text-gray-600 leading-snug max-w-2xl`}>{formData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className={spacing}>
          <h2 className={`${textSmall} font-medium text-gray-400 uppercase tracking-[0.2em] mb-3`}>
            Experience
          </h2>
          <div className="space-y-3">
            {formData.experience.map((exp) => (
              <div key={exp.id} className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <p className={`${textSmall} text-gray-400`}>
                    {formatDate(exp.startDate)}
                  </p>
                  <p className={`${textSmall} text-gray-400`}>
                    {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </p>
                </div>
                <div className="col-span-3">
                  <h3 className={`font-medium text-black ${textBody}`}>{exp.position}</h3>
                  <p className={`${textSmall} text-gray-500`}>{exp.company}{exp.location && ` · ${exp.location}`}</p>
                  {exp.description && (
                    <p className={`mt-1 ${textBody} text-gray-600 whitespace-pre-line leading-snug`}>{exp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {formData.education.some((e) => e.institution) && (
        <section className={spacing}>
          <h2 className={`${textSmall} font-medium text-gray-400 uppercase tracking-[0.2em] mb-3`}>
            Education
          </h2>
          <div className="space-y-2">
            {formData.education
              .filter((edu) => edu.institution)
              .map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <p className={`${textSmall} text-gray-400`}>
                      {formatDate(edu.startDate)}
                    </p>
                    <p className={`${textSmall} text-gray-400`}>
                      {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <h3 className={`font-medium text-black ${textBody}`}>{edu.institution}</h3>
                    <p className={`${textSmall} text-gray-500`}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {formData.projects.length > 0 && (
        <section className={spacing}>
          <h2 className={`${textSmall} font-medium text-gray-400 uppercase tracking-[0.2em] mb-3`}>
            Projects
          </h2>
          <div className="space-y-2">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <h3 className={`font-medium text-black ${textBody}`}>{project.name}</h3>
                {project.description && (
                  <p className={`${textBody} text-gray-600 mt-0.5 leading-snug`}>{project.description}</p>
                )}
                {project.technologies && (
                  <p className={`${textSmall} text-gray-400 mt-0.5`}>{project.technologies}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className={`${textSmall} font-medium text-gray-400 uppercase tracking-[0.2em] mb-3`}>
            Skills
          </h2>
          <p className={`${textBody} text-gray-600`}>{skillsList.join(" · ")}</p>
        </section>
      )}
    </div>
  );
};

export default MinimalistProTemplate;
