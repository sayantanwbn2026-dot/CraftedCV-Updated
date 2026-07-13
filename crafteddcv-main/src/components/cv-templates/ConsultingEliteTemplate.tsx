import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const ConsultingEliteTemplate = ({ formData }: CVTemplateProps) => {
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
      className="bg-white text-black p-7 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Garamond', 'Georgia', serif", height: "297mm", maxHeight: "297mm", overflow: "hidden", boxSizing: "border-box" }}
    >
      {/* Header - Premium consulting style */}
      <header className="text-center mb-5">
        <h1 className={`${fs.name} font-normal text-black tracking-[0.15em] uppercase`}>
          {formData.firstName} {formData.lastName}
        </h1>
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className="h-px bg-gray-400 w-12" />
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
          <div className="h-px bg-gray-400 w-12" />
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-gray-600" style={{ fontSize: hasLongContent ? "10px" : "11px" }}>
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className="mb-4">
          <h2 className={`${fs.section} text-black tracking-[0.1em] uppercase text-center mb-2`} style={{ fontWeight: 400 }}>Executive Summary</h2>
          <div className="h-px bg-gray-300 mb-2" />
          <p className={`${fs.body} text-gray-800 leading-snug text-center italic`}>{formData.summary}</p>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-4">
          <h2 className={`${fs.section} text-black tracking-[0.1em] uppercase text-center mb-2`} style={{ fontWeight: 400 }}>Professional Experience</h2>
          <div className="h-px bg-gray-300 mb-2" />
          <div className="space-y-3">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-semibold text-black ${fs.body} tracking-wide uppercase`}>{exp.position}</h3>
                  <span className={`${fs.small} text-gray-500 flex-shrink-0 italic`}>
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                <p className={`${fs.small} text-gray-600 italic`}>{exp.company}{exp.location && ` | ${exp.location}`}</p>
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
        <section className="mb-4">
          <h2 className={`${fs.section} text-black tracking-[0.1em] uppercase text-center mb-2`} style={{ fontWeight: 400 }}>Education</h2>
          <div className="h-px bg-gray-300 mb-2" />
          <div className="space-y-1">
            {formData.education.filter((edu) => edu.institution).map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className={`font-semibold text-black ${fs.body}`}>{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className={`${fs.small} text-gray-600 italic`}>{edu.institution}</p>
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
        <section className="mb-4">
          <h2 className={`${fs.section} text-black tracking-[0.1em] uppercase text-center mb-2`} style={{ fontWeight: 400 }}>Select Engagements</h2>
          <div className="h-px bg-gray-300 mb-2" />
          <div className="space-y-1">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <h3 className={`font-semibold text-black ${fs.body}`}>{project.name}</h3>
                {project.description && <p className={`${fs.body} text-gray-700 mt-0.5 leading-snug`}>{project.description}</p>}
                {project.technologies && <p className={`${fs.small} text-gray-500 mt-0.5`}>{project.technologies}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillsList.length > 0 && (
        <section>
          <h2 className={`${fs.section} text-black tracking-[0.1em] uppercase text-center mb-2`} style={{ fontWeight: 400 }}>Core Competencies</h2>
          <div className="h-px bg-gray-300 mb-2" />
          <p className={`${fs.body} text-gray-800 text-center`}>{skillsList.join("  ·  ")}</p>
        </section>
      )}
    </div>
  );
};

export default ConsultingEliteTemplate;
