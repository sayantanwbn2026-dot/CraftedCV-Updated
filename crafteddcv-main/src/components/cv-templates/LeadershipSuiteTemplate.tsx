import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { CVTemplateProps, formatDate } from "./types";
import ContactIcon from "./ContactIcon";

const LeadershipSuiteTemplate = ({ formData }: CVTemplateProps) => {
  const skillsList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div
      className="bg-white text-black p-10 max-w-[210mm] mx-auto shadow-lg"
      style={{ fontFamily: "'Playfair Display', Georgia, serif", minHeight: "297mm" }}
    >
      {/* Header - Sophisticated executive style */}
      <header className="text-center pb-8 mb-8">
        <h1 className="text-4xl font-bold text-black tracking-wide">
          {formData.firstName.toUpperCase()} {formData.lastName.toUpperCase()}
        </h1>
        <div className="w-24 h-1 bg-black mx-auto my-4" />
        <p className="text-gray-600 text-lg font-light italic">Executive Leadership</p>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          {formData.email && <span>{formData.email}</span>}
          {formData.phone && <span>|</span>}
          {formData.phone && <span>{formData.phone}</span>}
          {formData.location && <span>|</span>}
          {formData.location && <span>{formData.location}</span>}
        </div>
        {(formData.linkedin || formData.portfolio) && (
          <div className="mt-2 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {formData.linkedin && <span>{formData.linkedin}</span>}
            {formData.portfolio && <span>|</span>}
            {formData.portfolio && <span>{formData.portfolio}</span>}
          </div>
        )}
      </header>

      {/* Executive Summary */}
      {formData.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-black text-center mb-4">
            EXECUTIVE PROFILE
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto">{formData.summary}</p>
        </section>
      )}

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-2 h-2 bg-black transform rotate-45" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Leadership Experience */}
      {formData.experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-black text-center mb-6">
            LEADERSHIP EXPERIENCE
          </h2>
          <div className="space-y-6">
            {formData.experience.map((exp) => (
              <div key={exp.id} className="text-center">
                <h3 className="text-xl font-semibold text-black">{exp.position}</h3>
                <p className="text-gray-600 italic">{exp.company}{exp.location && ` · ${exp.location}`}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {formatDate(exp.startDate)} — {exp.endDate ? formatDate(exp.endDate) : "Present"}
                </p>
                {exp.description && (
                  <p className="mt-3 text-gray-700 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two column for Education and Expertise */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        {/* Education */}
        {formData.education.some((e) => e.institution) && (
          <section>
            <h2 className="text-sm font-semibold text-black uppercase tracking-widest text-center mb-4 border-b border-gray-200 pb-2">
              Education
            </h2>
            <div className="space-y-3 text-center">
              {formData.education
                .filter((edu) => edu.institution)
                .map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-medium text-black">{edu.institution}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "Present"}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Core Competencies */}
        {skillsList.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-black uppercase tracking-widest text-center mb-4 border-b border-gray-200 pb-2">
              Core Competencies
            </h2>
            <div className="space-y-2 text-center">
              {skillsList.map((skill, index) => (
                <p key={index} className="text-sm text-gray-700">{skill}</p>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Key Initiatives/Projects */}
      {formData.projects.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold text-black uppercase tracking-widest text-center mb-4 border-b border-gray-200 pb-2">
            Strategic Initiatives
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {formData.projects.map((project) => (
              <div key={project.id} className="text-center">
                <h3 className="font-medium text-black">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default LeadershipSuiteTemplate;
