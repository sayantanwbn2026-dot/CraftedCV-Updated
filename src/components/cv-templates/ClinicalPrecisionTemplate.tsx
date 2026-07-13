import { Mail, Phone, MapPin, Linkedin, Globe, Heart } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const ClinicalPrecisionTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Calibri', 'Segoe UI', sans-serif", minHeight: "297mm" }}
    >
      {/* Header with medical feel */}
      <header className="border-b-4 border-gray-800 p-8 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-gray-800 flex items-center justify-center">
            <Heart className="w-6 h-6 text-gray-800" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">
              {formData.firstName} {formData.lastName}
            </h1>
            <p className="text-gray-600">Healthcare Professional</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-600">
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-0">
        {/* Left sidebar */}
        <div className="col-span-1 bg-gray-50 p-6 space-y-6">
          {/* Skills/Competencies */}
          {skillsList.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-2 mb-3">
                Clinical Skills
              </h2>
              <div className="space-y-2">
                {skillsList.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-800 rounded-full" />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {formData.education.some((e) => e.institution) && (
            <section>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-2 mb-3">
                Education & Training
              </h2>
              <div className="space-y-3">
                {formData.education
                  .filter((edu) => edu.institution)
                  .map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-semibold text-black text-sm">{edu.degree}</h3>
                      <p className="text-xs text-gray-600">{edu.field}</p>
                      <p className="text-xs text-gray-500">{edu.institution}</p>
                      <p className="text-xs text-gray-400">
                        {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                      </p>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>

        {/* Main content */}
        <div className="col-span-2 p-6 space-y-6">
          {/* Professional Summary */}
          {formData.summary && (
            <section>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-2 mb-3">
                Professional Summary
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{formData.summary}</p>
            </section>
          )}

          {/* Clinical Experience */}
          {formData.experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
                Clinical Experience
              </h2>
              <div className="space-y-5">
                {formData.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-black">{exp.position}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{exp.company}{exp.location && ` | ${exp.location}`}</p>
                    {exp.description && (
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Research/Projects */}
          {formData.projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-2 mb-4">
                Research & Publications
              </h2>
              <div className="space-y-3">
                {formData.projects.map((project) => (
                  <div key={project.id}>
                    <h3 className="font-semibold text-black text-sm">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-gray-700">{project.description}</p>
                    )}
                    {project.technologies && (
                      <p className="text-xs text-gray-500 italic">{project.technologies}</p>
                    )}
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

export default ClinicalPrecisionTemplate;
