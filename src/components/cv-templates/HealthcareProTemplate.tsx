import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const HealthcareProTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black p-8 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Arial', sans-serif", minHeight: "297mm" }}
    >
      {/* Header - Clean and professional */}
      <header className="mb-6 pb-4 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold text-black">
          {formData.firstName} {formData.lastName}
        </h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-700">
          {formData.email && <ContactIcon Icon={Mail} text={formData.email} />}
          {formData.phone && <ContactIcon Icon={Phone} text={formData.phone} />}
          {formData.location && <ContactIcon Icon={MapPin} text={formData.location} />}
          {formData.linkedin && <ContactIcon Icon={Linkedin} text={formData.linkedin} />}
          {formData.portfolio && <ContactIcon Icon={Globe} text={formData.portfolio} />}
        </div>
      </header>

      {/* Summary */}
      {formData.summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-black uppercase mb-2 bg-gray-100 px-2 py-1">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-800 leading-relaxed">{formData.summary}</p>
        </section>
      )}

      {/* Credentials / Skills */}
      {skillsList.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-black uppercase mb-2 bg-gray-100 px-2 py-1">
            Certifications & Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className="text-sm text-black"
              >
                {skill}{index < skillsList.length - 1 ? " •" : ""}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-black uppercase mb-2 bg-gray-100 px-2 py-1">
            Clinical Experience
          </h2>
          <div className="space-y-4">
            {formData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-black">{exp.position}</h3>
                    <p className="text-sm text-gray-700">{exp.company}{exp.location && `, ${exp.location}`}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : "Present"}
                  </span>
                </div>
                {exp.description && (
                  <ul className="mt-2 text-sm text-gray-800 list-disc list-inside">
                    {exp.description.split("\n").filter(Boolean).map((line, idx) => (
                      <li key={idx}>{line.replace(/^[-•]\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {formData.education.some((e) => e.institution) && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-black uppercase mb-2 bg-gray-100 px-2 py-1">
            Education & Training
          </h2>
          <div className="space-y-3">
            {formData.education
              .filter((edu) => edu.institution)
              .map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-black">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <p className="text-sm text-gray-700">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : "Present"}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Projects / Research */}
      {formData.projects.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-black uppercase mb-2 bg-gray-100 px-2 py-1">
            Research & Special Projects
          </h2>
          <div className="space-y-3">
            {formData.projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-black">{project.name}</h3>
                  {project.link && (
                    <span className="text-sm text-gray-600">{project.link}</span>
                  )}
                </div>
                {project.description && (
                  <p className="text-sm text-gray-800 mt-1">{project.description}</p>
                )}
                {project.technologies && (
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-semibold">Methods/Tools:</span> {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HealthcareProTemplate;
