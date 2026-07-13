import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const MarketingCreativeTemplate = ({ formData }: CVTemplateProps) => {
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
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg flex"
      style={{ fontFamily: "'Helvetica Neue', sans-serif", height: "297mm", maxHeight: "297mm", overflow: "hidden", boxSizing: "border-box" }}
    >
      {/* Left sidebar */}
      <div className="w-[35%] bg-gray-50 p-5 border-r border-gray-200" style={{ overflow: "hidden" }}>
        <h1 className={`${fs.name} font-black text-black leading-tight mb-1`}>
          {formData.firstName}
          <br />
          {formData.lastName}
        </h1>
        <div className="w-12 h-1 bg-black my-3" />

        {/* Contact */}
        <div className="space-y-1.5 mb-4" style={{ fontSize: hasLongContent ? "10px" : "11px" }}>
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>

        {/* Skills */}
        {skillsList.length > 0 && (
          <div className="mb-4">
            <h2 className={`${fs.section} font-bold text-black uppercase tracking-widest mb-2`} style={{ fontSize: hasLongContent ? "10px" : "12px" }}>Skills</h2>
            <div className="space-y-1">
              {skillsList.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                  <span className={`${fs.small} text-gray-700`}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {formData.education.some((e) => e.institution) && (
          <div>
            <h2 className={`font-bold text-black uppercase tracking-widest mb-2`} style={{ fontSize: hasLongContent ? "10px" : "12px" }}>Education</h2>
            <div className="space-y-2">
              {formData.education.filter((edu) => edu.institution).map((edu) => (
                <div key={edu.id}>
                  <h3 className={`font-bold text-black ${fs.small}`}>{edu.degree}</h3>
                  <p className={`${fs.small} text-gray-600`}>{edu.field}</p>
                  <p className={`${fs.small} text-gray-500 italic`}>{edu.institution}</p>
                  <p className={`${fs.small} text-gray-400`}>{formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-5" style={{ overflow: "hidden" }}>
        {/* Summary */}
        {formData.summary && (
          <section className="mb-4">
            <h2 className={`${fs.section} font-bold text-black uppercase tracking-widest mb-2`}>About</h2>
            <p className={`${fs.body} text-gray-800 leading-snug`}>{formData.summary}</p>
          </section>
        )}

        {/* Experience */}
        {formData.experience.length > 0 && (
          <section className="mb-4">
            <h2 className={`${fs.section} font-bold text-black uppercase tracking-widest mb-2`}>Experience</h2>
            <div className="space-y-3">
              {formData.experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-black pl-3">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-black ${fs.body}`}>{exp.position}</h3>
                    <span className={`${fs.small} text-gray-500 flex-shrink-0`}>
                      {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                    </span>
                  </div>
                  <p className={`${fs.small} text-gray-600 font-medium`}>{exp.company}{exp.location && ` • ${exp.location}`}</p>
                  {exp.description && (
                    <div className={`mt-1 ${fs.body} text-gray-700 whitespace-pre-line leading-snug`}>{exp.description}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {formData.projects.length > 0 && (
          <section>
            <h2 className={`${fs.section} font-bold text-black uppercase tracking-widest mb-2`}>Projects</h2>
            <div className="space-y-2">
              {formData.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-black ${fs.body}`}>{project.name}</h3>
                    {project.link && <span className={`${fs.small} text-gray-500`}>{project.link}</span>}
                  </div>
                  {project.description && <p className={`${fs.body} text-gray-700 mt-0.5 leading-snug`}>{project.description}</p>}
                  {project.technologies && <p className={`${fs.small} text-gray-500 mt-0.5`}>{project.technologies}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MarketingCreativeTemplate;
