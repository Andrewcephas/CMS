import React, { useEffect, useState } from "react";

const projectTypes = {
  "Software Development": ["Planning", "Development", "Testing", "Deployment"],
  "Infrastructure": ["Planning", "Procurement", "Implementation", "Monitoring"],
  "Cybersecurity": ["Assessment", "Mitigation", "Training", "Audit"],
  "Cloud": ["Provisioning", "Migration", "Optimization", "Security"],
  "ERP": ["Requirements", "Customization", "Integration", "Training"],
  "Digital Transformation": ["Analysis", "Tool Selection", "Adoption", "Review"],
  "Legacy Systems": ["Assessment", "Upgrade Plan", "Migration", "Testing"],
  "Graphics Design": ["Concept", "Design", "Feedback", "Finalization"],
  "Data Analytics": ["Data Gathering", "Cleaning", "Analysis", "Reporting"],
};

function CreateProject({ clients, onSave, editingProject, onCancelEdit }) {
  const [project, setProject] = useState({
    name: "",
    client: "",
    description: "",
    type: "",
    deadline: "",
    file: null,
    fileUrl: "",
    progress: {},
  });

  useEffect(() => {
    if (editingProject) {
      setProject({
        ...editingProject,
        file: null,
        fileUrl: editingProject.fileUrl || "",
        progress: editingProject.progress || {},
      });
    } else {
      setProject({
        name: "",
        client: "",
        description: "",
        type: "",
        deadline: "",
        file: null,
        fileUrl: "",
        progress: {},
      });
    }
  }, [editingProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "type" && projectTypes[value]) {
        const newProgress = {};
        projectTypes[value].forEach((step) => {
          newProgress[step] = false;
        });
        updated.progress = newProgress;
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    setProject((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(project, editingProject?.id || null);
    setProject({
      name: "",
      client: "",
      description: "",
      type: "",
      deadline: "",
      file: null,
      fileUrl: "",
      progress: {},
    });
    onCancelEdit();
  };

  const handleProgressChange = (step) => {
    setProject((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [step]: !prev.progress[step],
      },
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingProject ? "Edit Project" : "Create Project"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          className="border p-2 rounded-xl"
          value={project.name}
          onChange={handleChange}
        />
        <select
          name="client"
          className="border p-2 rounded-xl"
          value={project.client}
          onChange={handleChange}
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.name}>
              {client.name}
            </option>
          ))}
        </select>

        <select
          name="type"
          className="border p-2 rounded-xl"
          value={project.type}
          onChange={handleChange}
        >
          <option value="">Select Project Type</option>
          {Object.keys(projectTypes).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="deadline"
          className="border p-2 rounded-xl"
          value={project.deadline}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Project Description"
          className="border p-2 rounded-xl col-span-1 md:col-span-2"
          value={project.description}
          onChange={handleChange}
        />

        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded-xl"
        />
        {project.fileUrl && !project.file && (
          <p className="text-sm text-gray-600">
            Current File:{" "}
            <a
              href={project.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View File
            </a>
          </p>
        )}

        {project.type && Object.keys(project.progress).length > 0 && (
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(project.progress).map(([step, value]) => (
              <label key={step} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleProgressChange(step)}
                />
                {step}
              </label>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-red-700"
        >
          {editingProject ? "Update Project" : "Add Project"}
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
