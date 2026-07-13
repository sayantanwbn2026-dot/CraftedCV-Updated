import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const CreativeBoldTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Inter', sans-serif", minHeight: "297mm" }}
    >
      {/* Header with sidebar effect */}
      <div className="flex">
        {/* Left sidebar */}
        <div className="w-2 bg-black" style={{ minHeight: "297mm" }} />
        
        <div className="flex-1 p-8">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-black text-black mb-1">
              {formData.firstName}
            </h1>
            <h1 className="text-4xl font-light text-gray-600 mb-4">
              {formData.lastName}
            </h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
              {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
              {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
              {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
              {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
              {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
            </div>
          </header>

          {/* Summary */}
          {formData.summary && (
            <section className="mb-6">
              <h2 className="text-sm font-black text-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-black" />
                About Me
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{formData.summary}</p>
            </section>
          )}

          {/* Experience */}
          {formData.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-black text-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-black" />
                Experience
              </h2>
              <div className="space-y-4">
                {formData.experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute left-[-5px] top-1 w-2 h-2 bg-black rounded-full" />
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-black">{exp.position}</h3>
                        <p className="text-sm text-gray-600">{exp.company}{exp.location && ` | ${exp.location}`}</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {formData.education.some((e) => e.institution) && (
            <section className="mb-6">
              <h2 className="text-sm font-black text-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-black" />
                Education
              </h2>
              <div className="space-y-3">
                {formData.education
                  .filter((edu) => edu.institution)
                  .map((edu) => (
                    <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200">
                      <div className="absolute left-[-5px] top-1 w-2 h-2 bg-black rounded-full" />
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-black">{edu.institution}</h3>
                          <p className="text-sm text-gray-600">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : "Present"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {formData.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-black text-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-black" />
                Projects
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {formData.projects.map((project) => (
                  <div key={project.id} className="p-3 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-black">{project.name}</h3>
                      {project.link && (
                        <span className="text-xs text-gray-600">{project.link}</span>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                    )}
                    {project.technologies && (
                      <p className="text-xs text-gray-500 mt-2">
                        {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skillsList.length > 0 && (
            <section>
              <h2 className="text-sm font-black text-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-black" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-black text-white text-sm rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeBoldTemplate;
