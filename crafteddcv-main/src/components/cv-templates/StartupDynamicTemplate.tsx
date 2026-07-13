import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const StartupDynamicTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black p-8 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Inter', sans-serif", minHeight: "297mm" }}
    >
      {/* Header - Bold and modern */}
      <header className="mb-8">
        <div className="flex items-end gap-4 mb-4">
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center text-white text-2xl font-bold">
            {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black leading-tight">
              {formData.firstName} {formData.lastName}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700 pl-20">
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>
      </header>

      {/* Two column layout */}
      <div className="flex gap-8">
        {/* Main column */}
        <div className="flex-1">
          {/* Summary */}
          {formData.summary && (
            <section className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                The Pitch
              </h2>
              <p className="text-sm text-gray-800 leading-relaxed">{formData.summary}</p>
            </section>
          )}

          {/* Experience */}
          {formData.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Track Record
              </h2>
              <div className="space-y-4">
                {formData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-black">{exp.position}</h3>
                        <p className="text-sm text-gray-600">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : "Now"}
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

          {/* Projects */}
          {formData.projects.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Shipped Products
              </h2>
              <div className="space-y-3">
                {formData.projects.map((project) => (
                  <div key={project.id} className="p-3 bg-gray-50 rounded-lg">
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
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.split(",").map((tech, idx) => (
                          <span key={idx} className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-48">
          {/* Skills */}
          {skillsList.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Toolkit
              </h2>
              <div className="space-y-1">
                {skillsList.map((skill, index) => (
                  <div
                    key={index}
                    className="text-sm text-black py-1 border-b border-gray-100"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {formData.education.some((e) => e.institution) && (
            <section>
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Background
              </h2>
              <div className="space-y-3">
                {formData.education
                  .filter((edu) => edu.institution)
                  .map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-black text-sm">{edu.degree}</h3>
                      <p className="text-xs text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(edu.endDate) || formatDate(edu.startDate)}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupDynamicTemplate;
