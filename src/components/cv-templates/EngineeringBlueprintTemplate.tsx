import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const EngineeringBlueprintTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  const contentItems =
    formData.experience.length +
    formData.education.filter(e => e.institution).length +
    formData.projects.length;

  const hasLongContent =
    formData.summary.length > 300 ||
    formData.experience.some(exp => exp.description.length > 200) ||
    contentItems > 6;

  const fs = hasLongContent
    ? { name: "text-2xl", section: "text-base", body: "text-xs", small: "text-[10px]" }
    : { name: "text-3xl", section: "text-lg", body: "text-sm", small: "text-xs" };

  return (
    <div
      className="bg-white text-black p-6 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Courier New', monospace", height: "297mm", maxHeight: "297mm", overflow: "hidden", boxSizing: "border-box" }}
    >
      {/* Header - Technical schematic style */}
      <header className="border-2 border-black p-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`${fs.name} font-bold text-black`}>{formData.firstName} {formData.lastName}</h1>
          </div>
          <div className="text-right" style={{ fontSize: hasLongContent ? "9px" : "10px" }}>
            {formData.email && <div>{formData.email}</div>}
            {formData.phone && <div>{formData.phone}</div>}
            {formData.location && <div>{formData.location}</div>}
            {formData.linkedin && <div>{formData.linkedin}</div>}
            {formData.portfolio && <div>{formData.portfolio}</div>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black mb-1`}>
            {"// OBJECTIVE"}
          </h2>
          <p className={`${fs.body} text-gray-800 leading-snug border-l-2 border-gray-400 pl-3`}>{formData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black mb-2`}>{"// EXPERIENCE"}</h2>
          <div className="space-y-2">
            {formData.experience.map((exp, idx) => (
              <div key={exp.id} className="border-l-2 border-gray-400 pl-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`${fs.small} text-gray-400`}>[{String(idx + 1).padStart(2, "0")}]</span>
                    <h3 className={`font-bold text-black ${fs.body} inline ml-1`}>{exp.position}</h3>
                    <p className={`${fs.small} text-gray-600`}>{exp.company}{exp.location && ` | ${exp.location}`}</p>
                  </div>
                  <span className={`${fs.small} text-gray-500 flex-shrink-0`}>
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                {exp.description && (
                  <div className={`mt-1 ${fs.body} text-gray-700 whitespace-pre-line leading-snug`}>{exp.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {formData.education.some((e) => e.institution) && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black mb-2`}>{"// EDUCATION"}</h2>
          <div className="space-y-1 border-l-2 border-gray-400 pl-3">
            {formData.education.filter((edu) => edu.institution).map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className={`font-bold text-black ${fs.body}`}>{edu.degree} {edu.field && `— ${edu.field}`}</h3>
                  <p className={`${fs.small} text-gray-600`}>{edu.institution}</p>
                </div>
                <span className={`${fs.small} text-gray-500 flex-shrink-0`}>
                  {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {formData.projects.length > 0 && (
        <section className="mb-3">
          <h2 className={`${fs.section} font-bold text-black mb-2`}>{"// PROJECTS"}</h2>
          <div className="space-y-1 border-l-2 border-gray-400 pl-3">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-black ${fs.body}`}>{project.name}</h3>
                  {project.link && <span className={`${fs.small} text-gray-500`}>{project.link}</span>}
                </div>
                {project.description && <p className={`${fs.body} text-gray-700 mt-0.5 leading-snug`}>{project.description}</p>}
                {project.technologies && <p className={`${fs.small} text-gray-500 mt-0.5`}>Stack: {project.technologies}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className={`${fs.section} font-bold text-black mb-2`}>{"// SKILLS"}</h2>
          <div className="flex flex-wrap gap-1">
            {skillsList.map((skill, index) => (
              <span key={index} className={`px-2 py-0.5 border border-gray-400 ${fs.small} text-gray-800`}>
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EngineeringBlueprintTemplate;
